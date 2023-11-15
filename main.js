import {
  ATTR_POSITION_LOC,
  ATTR_NORMAL_LOC,
  ATTR_UV_LOC,
  ATTR_POSITION_NAME,
  ATTR_NORMAL_NAME,
  ATTR_UV_NAME,
  UniformTypes
} from "./constants.js"
import {FrameBuffer} from "./framebuffer/framebuffer.js"
import { Mesh } from "./meshes/mesh.js"
import {
  Shader,
  BasicMaterial,
  LambertMaterial,
  PhongMaterial
} from "./material/index.js"
import {
  BoxGeometry,
  Geometry,
  QuadGeometry,
  UVShereGeometry,
  CylinderGeometry
} from "./geometry/index.js"
import {
  Vector3,
  Color,
  Quaternion,
  Matrix4
} from "/math/index.js"
import { Renderer } from "./renderer.js"
import { Texture } from "./textures/index.js"
import { createUBO } from "./functions.js"

let canvas = document.getElementById("can")
let renderer = new Renderer(canvas)
let camera = renderer.camera
/**
 * @type {WebGL2RenderingContext}
 */
let gl = renderer.gl
let vshader =
  `#version 300 es
  precision mediump float;
  
  uniform camera {
    mat4 view;
    mat4 projection;
    vec3 camPosition;
  };
  
  uniform mat4 model;
  
  in vec3 position;
  in vec2 uv;
  in vec3 normal;
  
  out vec2 v_uv;
  out vec3 v_normal;
  out vec3 camDirection;
  
  void main(){
    gl_Position = projection * view * model * vec4(position,1.0);
    mat3 invNormalMat = mat3(model);
    v_uv = uv;
    v_normal = normalize(invNormalMat * normal);
    camDirection =  gl_Position.xyz - camPosition;
  }
`
let fshader =
  `#version 300 es
  precision mediump float;
  
  in float brightness;
  in vec2 v_uv;
  in vec3 v_normal;
  in vec3 camDirection;
  
  uniform sampler2D mainTexture;
  uniform vec3 lightDir;
  uniform float ambientIntensity;
  uniform vec4 ambientColor;
  uniform float diffuseIntensity;
  uniform float specularShininess;
  uniform float specularStrength;
  uniform float opacity;
  uniform vec4 color;
  uniform vec4 diffuseColor;
  
  out vec4 FragColor;
 
 //Remember you set the dir to negative because light direction is the opposite direction of dir.
 float calcBrightness(vec3 normal, vec3 dir) {
   return max(
     dot(normal, -dir),
     0.0
   );
 }
 
 void main(){
    vec3 baseColor = texture(mainTexture,v_uv).xyz * color.xyz;
    if(baseColor == vec3(0.0,0.0,0.0))
      baseColor = color.xyz;
    vec3 ambient = ambientColor.xyz * ambientIntensity;
    
    float diffusebrightness = calcBrightness(v_normal,lightDir);
    vec3 diffuse = diffuseColor.xyz * diffusebrightness * diffuseIntensity;
    
    vec3 reflectNorm = reflect(lightDir,v_normal);
    float specularBrightness = calcBrightness(reflectNorm,camDirection);
    vec3 specular = pow(specularBrightness,specularShininess) * diffuseColor.xyz * specularStrength;
    
    vec3 finalColor = baseColor * (ambient + diffuse + specular );
    FragColor = vec4(finalColor,opacity);
}
`

let tex = new Texture("./UV_Grid_Lrg.jpg")
let tex2 = new Texture("./texture.png")

let origin = new Mesh(
  new CylinderGeometry(1, 1),
  new BasicMaterial({
    color: new Color(1, 1, 1),
    texture: tex,
  })
)
let mesh = new Mesh(
  new UVShereGeometry(1,200,50),
  new Shader(vshader,fshader,{
    color : new Color(1, 1, 1),
    opacity : 1.0,
    lightDir : new Vector3(0, 0, -1),
    mainTexture:tex,

    ambientColor : new Color(1, 1, 1),
    ambientIntensity : 0.15,

    diffuseColor : new Color(1, 1, 1),
    diffuseIntensity : 0.65,

    specularStrength :0.15,
    specularShininess : 16,
  })
)
renderer.setViewport(innerWidth, innerHeight)

camera.makePerspective(120)
camera.transform.position.z = 3
origin.transform.position.x = 2

//renderer.add(origin)
renderer.add(mesh)

let quat1 = new Quaternion()
let euler = new Vector3(Math.PI / 100, 0, 0)
quat1.setFromEuler(euler)

let angle = 0
let fb = new FrameBuffer(100,100).init(gl).multiSampleColorBuffer(gl,"bColor",0).texDepthBuffer(gl).finalize(gl)
let defer = new Mesh(
  new QuadGeometry(2,2),
  new Shader(vshader,fshader,{
    depthT:new Texture(""),
    colorT: new Texture("")
  })
  )
  defer.init(gl)
let fb2 = new FrameBuffer(100,100).init(gl).texColorBuffer(gl,"bColor",0).texDepthBuffer(gl).finalize(gl)

function render(dt) {
  origin.transform.orientation.multiply(quat1)
  mesh.transform.orientation.multiply(quat1)
  
  //fb.activate(gl)
  renderer.update()
  /*fb.deactivate(gl)
  renderer.clear()
  defer.material.updateUniform("depthT",{
    webglTex:fb.depthBuffer
  })
  defer.material.updateUniform("colorT", {
    webglTex: fb.colorBuffers["bcolor"]
  })
  defer.update(gl)
  defer.renderGL(gl)/**/
  requestAnimationFrame(render)
  angle += Math.PI / 1000
}
render()

//console.log(mesh.geometry.attributes);

console.log(fb);