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
const vshader = await fetch("./shaders/deferlighting/vdefer.glsl").then(e=>e.text())
const fshader = await fetch("./shaders/deferlighting/fdefer.glsl").then(e=>e.text())
const vshader2 = await fetch("./shaders/deferlighting/vdefault.glsl").then(e=>e.text())
const fshader2 = await fetch("./shaders/deferlighting/fdefault.glsl").then(e=>e.text())

let tex = new Texture("./UV_Grid_Lrg.jpg")
let tex2 = new Texture("./texture.png")

let origin = new Mesh(
  new BoxGeometry(1, 1, 1),
  new PhongMaterial({
    mainTexture:tex,
    specular
  }),
  new Shader(vshader2, fshader2, {
    mainTexture: tex
  })
)
let mesh = new Mesh(
  new UVShereGeometry(1),
  new Shader(vshader2, fshader2, {
    mainTexture: tex
  })
)
renderer.setViewport(innerWidth, innerHeight)

camera.makePerspective(120)
camera.transform.position.z = 2

renderer.add(origin)
//renderer.add(mesh)

let quat1 = new Quaternion()
let euler = new Vector3(Math.PI / 1000, Math.PI / 1000, 0)
quat1.setFromEuler(euler)

let angle = 0




let ext = gl.getExtension("EXT_color_buffer_float")
let fb2 = new FrameBuffer(100, 100).init(gl)
  .texColorBuffer(gl, "color", 0)
  .texColorBuffer(gl, "position", 1, gl.RGBA16F, gl.FLOAT)
  .texColorBuffer(gl, "normal", 2)
  .texColorBuffer(gl, "emission", 3)
  .texColorBuffer(gl, "specular", 4)
  .texDepthBuffer(gl, false).finalize(gl)
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
    depthT: depthTex,
    lightDir: [new Vector3(0, 0.8660, -0.5)],
    lightColor: [new Color(1, 1, 1)],
    diffuseIntensity: 1
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

  //fb2.activate(gl)
  renderer.update()
  //fb2.deactivate(gl)
  //fb2.copy(gl,fb)

  //console.log(gl.getError());
  //defer.renderGL(gl)
  requestAnimationFrame(render)
  angle += Math.PI / 1000

}
render()

//console.log(mesh.geometry.attributes);
//console.log(fb2)