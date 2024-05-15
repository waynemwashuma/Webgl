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
const vshader = await fetch("./shaders/deferlighting/vdefer.glsl").then(e => e.text())
const fshader = await fetch("./shaders/deferlighting/fdefer.glsl").then(e => e.text())
const vshader2 = await fetch("./shaders/deferlighting/vdefault.glsl").then(e => e.text())
const fshader2 = await fetch("./shaders/deferlighting/fdefault.glsl").then(e => e.text())

let tex = new Texture({
  src: "./UV_Grid_Lrg.jpg"
})
let origin = new Mesh(
  new BoxGeometry(1, 1, 1),
  new PhongMaterial({
    mainTexture: tex
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

const quat1 = new Quaternion()
const euler = new Vector3(Math.PI / 1000, Math.PI / 1000, 0)
quat1.setFromEuler(euler)

let angle = 0

function render(dt) {
  origin.transform.orientation.multiply(quat1)
  mesh.transform.orientation.multiply(quat1)
  renderer.update()
  requestAnimationFrame(render)
  angle += Math.PI / 1000

}
render()