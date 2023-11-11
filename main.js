import {
  ATTR_POSITION_LOC,
  ATTR_NORMAL_LOC,
  ATTR_UV_LOC,
  ATTR_POSITION_NAME,
  ATTR_NORMAL_NAME,
  ATTR_UV_NAME,
  UniformTypes
} from "./constants.js"

import { Mesh } from "./meshes/mesh.js"
import {
  Shader,
  BasicMaterial,
  LambertMaterial
} from "./material/index.js"
import {
  BoxGeometry,
  Geometry,
  QuadGeometry,
  UVShereGeometry
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
  };
  
  uniform mat4 model;
  
  in vec3 position;
  in vec2 uv;
  in vec3 normal;
  
  out vec2 v_uv;
  out vec3 v_normal;
  out mat3 invNormalMat;
  out vec3 lightDirec;
  
  void main(){
    gl_Position = projection * view * model * vec4(position,1.0);
    invNormalMat = mat3(model);
    v_uv = uv;
    v_normal = normal;
  }
`
let fshader =
  `#version 300 es
  precision mediump float;
  
  in float brightness;
  in vec2 v_uv;
  in vec3 v_normal;
  in mat3 invNormalMat;
  
  uniform sampler2D mainTexture;
  uniform vec3 lightDir;
  uniform float ambientIntensity;
  uniform vec4 ambientColor;
  uniform float diffuseIntensity;
  uniform float opacity;
  uniform vec4 color;
  uniform vec4 lightColor;
  
  out vec4 FragColor;
 
 //Remember you set the dir to negative because light direction is the opposite direction of dir.
 float calcBrightness(vec3 normal, vec3 dir) {
   return max(
     dot(normalize(normal), -dir),
     0.0
   );
 }
 
 void main(){
    vec3 baseColor = texture(mainTexture,v_uv).xyz * color.xyz;
    if(baseColor == vec3(0.0,0.0,0.0))
      baseColor = color.xyz;
    vec3 ambient = ambientColor.xyz * ambientIntensity;
    
    float brightness = calcBrightness(invNormalMat * v_normal,lightDir);
    
    vec3 diffuse = lightColor.xyz * brightness * diffuseIntensity;
    
    vec3 finalColor = baseColor * (ambient + diffuse);
    FragColor = vec4(finalColor,opacity);
}
`

let tex = new Texture("./UV_Grid_Lrg.jpg")
let tex2 = new Texture("./texture.png")

let origin = new Mesh(
  new BoxGeometry(1, 1, 1),
  new BasicMaterial({
    color: new Color(1, 1, 0),
    texture: tex,
  })
)
let mesh = new Mesh(
  new UVShereGeometry(5),
  new Shader(vshader, fshader, {
    mainTexture: tex,
    color: new Color(1, 1, 1),
    ambientColor:new Color(1,1,1),
    ambientIntensity : 0.15,
    opacity: 1.0,
    lightDir: new Vector3(0, 0, -1),
    lightColor:new Color(1,1,1),
    diffuseIntensity:0.65
  })

)
let mesh2 = new Mesh(
  new UVShereGeometry(3),
  new LambertMaterial({
    mainTexture: tex,
    color: new Color(1, 1, 1),
    tint: 1.0,
    lightDir: new Vector3(0, 0, -1)
  })
)

renderer.setViewport(300, 300)
renderer.setViewport(innerWidth, innerHeight)

camera.makePerspective(120)
camera.transform.position.z = 10
//mesh.transform.position.x = 2
mesh2.transform.position.y = 2

//renderer.add(origin)
renderer.add(mesh)
//renderer.add(mesh2)
//mesh.parent = origin
//mesh2.parent = mesh

let quat1 = new Quaternion()
let euler = new Vector3(Math.PI / 100, Math.PI / 100, 0)
quat1.setFromEuler(euler)

let angle = 0

function render(dt) {
  //origin.transform.position.x = Math.sin(angle)
  //origin.transform.position.y = Math.cos(angle)

  origin.transform.orientation.multiply(quat1)
  //mesh.transform.orientation.x += Math.PI / 100
  //camera.transform.orientation.z += Math.PI/100
  mesh.material.updateUniform("lightDir",
    new Vector3(
      Math.cos(angle),
      Math.sin(angle),
      Math.sin(angle)
    ).normalize()
  )/**/
  renderer.update()
  requestAnimationFrame(render)
  angle += Math.PI / 100
}
render()

console.log(origin);