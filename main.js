import {
  ATTR_POSITION_LOC,
  ATTR_NORMAL_LOC,
  ATTR_UV_LOC,
  ATTR_POSITION_NAME,
  ATTR_NORMAL_NAME,
  ATTR_UV_NAME,
  UniformTypes
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
  uniform vec4 diffuseColor;
  
  out vec4 FragColor;
 
 void main(){
    //FragColor = vec4(1.0,1.0,1.0,1.0);
    FragColor = texture(colorT,v_uv);
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
  new UVShereGeometry(1, 200, 50),
  new LambertMaterial({
    color: new Color(1, 1, 1),
    opacity: 1.0,
    lightDir: new Vector3(0, 0, -1),
    mainTexture: tex,

    ambientColor: new Color(1, 1, 1),
    ambientIntensity: 0.15,

    diffuseColor: new Color(1, 1, 1),
    diffuseIntensity: 0.65,

    specularStrength: 0.15,
    specularShininess: 32,
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

let defer = new Mesh(
  new QuadGeometry(1, 1),
  new Shader(vshader, fshader, {
    depthT: new Texture(""),
    colorT: new Texture("")
  })
)
defer.init(gl)

let fb = new FrameBuffer(100, 100).init(gl).multiSampleColorBuffer(gl, "bColor", 0).depthBuffer(gl,true).finalize(gl)

let fb2 = new FrameBuffer(100, 100).init(gl).texColorBuffer(gl, "bColor", 0).texDepthBuffer(gl).finalize(gl)

function render(dt) {
  origin.transform.orientation.multiply(quat1)
  mesh.transform.orientation.multiply(quat1)
  renderer.clear()
  fb.activate(gl)
  fb.clear(gl)
  renderer.update()
  fb.deactivate(gl)
  
  fb2.copy(gl,fb)
  defer.material.updateUniform("depthT",{
    webglTex:fb2.depthBuffer
  })
  defer.material.updateUniform("colorT", {
    webglTex: fb2.colorBuffers["bColor"]
  })
  defer.update(gl)
  //defer.renderGL(gl)/**/
  requestAnimationFrame(render)
  angle += Math.PI / 1000
}
render()

//console.log(mesh.geometry.attributes);

console.log(mesh);