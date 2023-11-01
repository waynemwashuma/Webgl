import {
  ATTR_POSITION_LOC,
  ATTR_NORMAL_LOC,
  ATTR_UV_LOC,
  ATTR_POSITION_NAME,
  ATTR_NORMAL_NAME,
  ATTR_UV_NAME
} from "./constants.js"

import { Mesh } from "./meshes/mesh.js"
import { Shader } from "./material/index.js"
import {
  BoxGeometry,
  Geometry,
  QuadGeometry
} from "./geometry/index.js"
import { Matrix } from "/math/Matrix.js"
import { Vector } from "/math/Vector.js"
import { Camera } from "/camera.js"
import { Renderer } from "./renderer.js"

let canvas = document.getElementById("can")
let renderer = new Renderer(canvas)
let camera = renderer.camera

let vshader =
  `precision mediump float;

attribute vec3 position;
attribute vec3 normal;
uniform mat4 uCamera;
uniform mat4 uProjection;
uniform mat4 uModel;
uniform float pointSize;
varying vec3 color;

void main(){
  gl_PointSize = pointSize;
  gl_Position = uProjection *uCamera * uModel * vec4(position,1.0);
  //gl_Position = uModel * vec4(position,1.0);
  color = normal;
}
`
let fshader =
  `precision mediump float;
varying vec3 color;


void main(){
  gl_FragColor = vec4(1.0,1.0,0.0,1.0);
}
`
let origin = new Mesh(new BoxGeometry(0.2), new Shader(vshader, fshader))
let mesh = new Mesh(new BoxGeometry(), new Shader(vshader, fshader))

renderer.add(mesh)
renderer.setViewport(300, 300)
//renderer.setViewport(innerWidth, innerHeight)

camera.makePerspective(120)
//camera.updateProjection()
camera.transform.position.z = 3

mesh.transform.position.x = 3

render()




function render(dt) {
  mesh.transform.rotation.y += Math.PI / 100
  //camera.transform.rotation.z += Math.PI/100
  renderer.update()
  requestAnimationFrame(render)
}