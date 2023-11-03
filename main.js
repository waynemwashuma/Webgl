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
import { Matrix } from "/math/index.js"
import { Vector } from "/math/Vector.js"
import { Renderer } from "./renderer.js"
import { Texture } from "./textures/index.js"

let canvas = document.getElementById("can")
let renderer = new Renderer(canvas)
let camera = renderer.camera

let vshader =
  `precision mediump float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 uCamera;
uniform mat4 uProjection;
uniform mat4 uModel;

varying vec2 v_uv;

void main(){
  gl_Position = uProjection *uCamera * uModel * vec4(position,1.0);
  v_uv = uv;
}
`
let fshader =
  `precision mediump float;

uniform sampler2D texture;
uniform sampler2D texture2;

varying vec2 v_uv;

void main(){
  //gl_FragColor = vec4(v_uv,0.0,1.0);
  //gl_FragColor = texture2D(texture,v_uv);
  //gl_FragColor = texture2D(texture2,v_uv);
  gl_FragColor = mix(texture2D(texture,v_uv),texture2D(texture2,v_uv),0.2);
}
`

let tex = new Texture("./UV_Grid_Lrg.jpg")
let tex2 = new Texture("./texture.png")

let origin = new Mesh(new BoxGeometry(0.2, 0.2), new Shader(vshader, fshader))
let mesh = new Mesh(new QuadGeometry(2, 2), new Shader(vshader, fshader, {
  "texture": tex,
  "texture2": tex2
}))

//renderer.add(origin)
renderer.add(mesh)
renderer.setViewport(300, 300)
renderer.setViewport(innerWidth, innerHeight)

camera.makePerspective(120)
//camera.updateProjection()
camera.transform.position.z = 3

mesh.transform.position.x = 0

function render(dt) {
  mesh.transform.rotation.y += Math.PI / 100
  //camera.transform.rotation.z += Math.PI/100
  renderer.update()
  requestAnimationFrame(render)
}
render()