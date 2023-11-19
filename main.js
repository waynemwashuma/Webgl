import {
  ATTR_POSITION_LOC,
  ATTR_NORMAL_LOC,
  ATTR_UV_LOC,
  ATTR_POSITION_NAME,
  ATTR_NORMAL_NAME,
  ATTR_UV_NAME,
  UniformTypes,
  CullFace
} from "./constants.js"
import { FrameBuffer } from "./framebuffer/framebuffer.js"
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
  
  in vec3 position;
  in vec2 uv;
  in vec3 normal;
  
  out vec2 v_uv;
  
  void main(){
    gl_Position = vec4(position,1.0);
    v_uv = uv;
  }
`
let fshader =
  `#version 300 es
  precision mediump float;
  
  in vec2 v_uv;
  
  uniform sampler2D colorT;
  uniform sampler2D normalT;
  uniform vec4 diffuseColor;
  
  out vec4 FragColor;
 
 void main(){
    vec4 initialColor = texture(colorT,v_uv);
    vec3 normal = texture(normalT,v_uv).xyz;
    FragColor = texture(colorT,v_uv);
}
`
let vshader2 = `#version 300 es
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
  out vec4 v_position;
  
  void main(){
    gl_Position = projection * view * model * vec4(position,1.0);
    v_uv = uv;
    
    mat3 invNormalMat = mat3(model);
    v_uv = uv;
    v_normal = normalize(invNormalMat * normal);
    v_position = gl_Position;
  }
`
let fshader2 = `#version 300 es
  precision mediump float;
  
  in vec2 v_uv;
  in vec3 v_normal;
  in vec4 v_position;
  
  uniform sampler2D mainTexture;
  
  layout(location=0) out vec4 color;
  layout(location=1) out vec4 position;
  layout(location=2) out vec4 normal;
  layout(location=3) out vec4 emission;
  layout(location=4) out vec4 albedo;

  void main(){
    normal = vec4(v_normal,1.0);
    color = texture(mainTexture,v_uv);
    position = v_position;
  }
`

let tex = new Texture("./UV_Grid_Lrg.jpg")
let tex2 = new Texture("./texture.png")

let origin = new Mesh(
  new BoxGeometry(1, 1, 1),
  new PhongMaterial({
    color: new Color(1, 1, 1),
    opacity: 1,
    lightDir: new Vector3(0, 0, -1),
    mainTexture: tex,

    ambientColor: new Color(1, 1, 1),
    ambientIntensity: 0.15,

    diffuseColor: new Color(1, 1, 1),
    diffuseIntensity: 0.65,

    specularStrength: 0.15,
    specularShininess: 16,
  })
)
let mesh = new Mesh(
  new UVShereGeometry(1, 200, 50),
  new Shader(vshader2, fshader2, {
    mainTexture: tex
  })
)
renderer.setViewport(innerWidth, innerHeight)

camera.makePerspective(120)
camera.transform.position.z = 2

//renderer.add(origin)
renderer.add(mesh)

let quat1 = new Quaternion()
let euler = new Vector3(Math.PI / 100, 0, 0)
quat1.setFromEuler(euler)

let angle = 0



let fb = new FrameBuffer(100, 100).init(gl).multiSampleColorBuffer(gl, "color", 0).depthBuffer(gl, true).finalize(gl)


let fb2 = new FrameBuffer(100, 100).init(gl).texColorBuffer(gl, "color", 0).texColorBuffer(gl, "normal", 1).texColorBuffer(gl, "position", 2).texColorBuffer(gl, "emission", 3).texDepthBuffer(gl, false).finalize(gl)
let colorTex = new Texture()
let normalTex = new Texture()
let positionTex = new Texture()
let emissionTex = new Texture()
let depthTex = new Texture()

let defer = new Mesh(
  new QuadGeometry(2, 2),
  new Shader(vshader, fshader, {
    colorT: colorTex,
    normalT: normalTex,
    positionT: positionTex,
    emissionT: emissionTex,
    depthT:depthTex
  })
)

colorTex.webglTex = fb2.colorBuffers["color"]
normalTex.webglTex = fb2.colorBuffers["normal"]
emissionTex.webglTex = fb2.colorBuffers["emission"]
positionTex.webglTex = fb2.colorBuffers["position"]
depthTex.webglTex = fb2.depthBuffer

defer.init(gl)

function render(dt) {
  origin.transform.orientation.multiply(quat1)
  mesh.transform.orientation.multiply(quat1)
  renderer.clear()

  fb2.activate(gl)
  renderer.update()
  fb2.deactivate(gl)
  //fb2.copy(gl,fb)

  //console.log(gl.getError());
  defer.renderGL(gl)
  requestAnimationFrame(render)
  angle += Math.PI / 1000

}
render()

//console.log(mesh.geometry.attributes);

console.log(mesh)