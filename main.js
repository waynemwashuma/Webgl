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
import { Shader, BasicMaterial } from "./material/index.js"
import {
  BoxGeometry,
  Geometry,
  QuadGeometry
} from "./geometry/index.js"
import { Vec3,Color } from "/math/index.js"
import { Renderer } from "./renderer.js"
import { Texture } from "./textures/index.js"
import { createUBO } from "./functions.js"

let canvas = document.getElementById("can")
let renderer = new Renderer(canvas)
let camera = renderer.camera

let vshader =
  `#version 300 es
  precision mediump float;
  
  /*uniform camera {
    mat4 view;
    mat4 projection;
  };*/
  
  uniform mat4 model;
  uniform mat4 projection;
  uniform mat4 view;
  
  
  in vec3 position;
  in vec2 uv;
  in vec3 normal;
  
  out vec2 v_uv;
  
  void main(){
    gl_Position = projection * view * model * vec4(position,1.0);
    v_uv = uv;
  }
`
let fshader =
  `#version 300 es
  precision mediump float;
  uniform sampler2D texture;
uniform sampler2D texture2;

in vec2 v_uv;
out vec4 FragColor;

void main(){
  //FragColor = vec4(1.0,0.0,0.0,1.0);
  FragColor = vec4(v_uv,0.0,1.0);
  //FragColor = texture2D(texture,v_uv);
  //FragColor = texture2D(texture2,v_uv);
  //FragColor = vec4(color,1.0);
  //FragColor = mix(texture2D(texture,v_uv),texture2D(texture2,v_uv),0.2);
}
`

let tex = new Texture("./UV_Grid_Lrg.jpg")
let tex2 = new Texture("./texture.png")

let origin = new Mesh(
  new BoxGeometry(0.2, 0.2),
  new Shader(vshader, fshader)
)
let mesh = new Mesh(
  new QuadGeometry(2, 2),
  new Shader(vshader, fshader)
)

renderer.setViewport(300, 300)
renderer.setViewport(innerWidth, innerHeight)

camera.makePerspective(120)
//camera.updateProjection()
camera.transform.position.z = 3
mesh.transform.position.x = 0

//renderer.add(origin)
renderer.add(mesh)

function render(dt) {
  mesh.transform.rotation.y += Math.PI / 100
  mesh.transform.rotation.z += Math.PI / 100
  //mesh.transform.rotation.x += Math.PI / 100
  //camera.transform.rotation.z += Math.PI/100
  renderer.update()
  requestAnimationFrame(render)
}
render()