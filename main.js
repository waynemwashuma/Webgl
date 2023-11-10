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
  //uniform mat4 projection;
  //uniform mat4 view;
  
  
  in vec3 position;
  in vec2 uv;
  in vec3 normal;
  
  uniform vec3 lightDir;
  uniform vec3 lightPos;
  
  out vec2 v_uv;
  out float brightness;
  
  float calcBrightness(vec3 normal,mat3 normalMatrix,vec3 dir){
    return max(
      dot(normalMatrix * normal,dir),
      0.0
    );
  }
  void main(){
    gl_Position = projection * view * model * vec4(position,1.0);
    v_uv = uv;
    mat3 invNormalMat = mat3(model);
    brightness = calcBrightness(normal,invNormalMat,lightDir);
  }
`
let fshader =
  `#version 300 es
  precision mediump float;
  uniform sampler2D texture;
uniform sampler2D texture2;

in float brightness;
in vec2 v_uv;

uniform float ambient;
out vec4 FragColor;

void main(){
vec4 color = FragColor = vec4(1.0,1.0,0.0,1.0);
  FragColor = color * ambient + 
    (1.0 - ambient) * color * brightness;
  //FragColor = vec4(v_uv,0.0,1.0);
  //FragColor = texture2D(texture,v_uv);
  //FragColor = texture2D(texture2,v_uv);
  //FragColor = vec4(color,1.0);
  //FragColor = mix(texture2D(texture,v_uv),texture2D(texture2,v_uv),0.2);
  //FragColor = vec4(v_uv,0.0,1.0) * brightness;
  FragColor.a = 1.0;
}
`

let tex = new Texture("./UV_Grid_Lrg.jpg")
let tex2 = new Texture("./texture.png")

let origin = new Mesh(
  new BoxGeometry(1, 1, 1),
  new BasicMaterial({
    color: new Color(1, 1, 1),
    texture: tex,
  })
)
let mesh = new Mesh(
  new UVShereGeometry(0.5),
  new BasicMaterial({
    color: new Color(1, 1, 1),
    texture: tex,
  })
)
let mesh2 = new Mesh(
  new UVShereGeometry(0.5),
  new BasicMaterial({
    color: new Color(1, 1, 1),
    texture: tex,
  })
)

renderer.setViewport(300, 300)
renderer.setViewport(innerWidth, innerHeight)

camera.makePerspective(120)
camera.transform.position.z = 10
mesh.transform.position.x = 2
mesh2.transform.position.y = 2

renderer.add(origin)
renderer.add(mesh)
renderer.add(mesh2)
mesh.parent = origin
//mesh2.parent = mesh

let quat1 = new Quaternion()
let euler = new Vector3(Math.PI/1000, Math.PI/1000, 0)
quat1.setFromEuler(euler)
console.log(quat1);

console.log(setEulerFromQuaternion(quat1))
let angle = 0

function render(dt) {
  origin.transform.position.x = Math.sin(angle)

  origin.transform.orientation.multiply(quat1)
  //mesh.transform.orientation.x += Math.PI / 100
  //camera.transform.orientation.z += Math.PI/100
  /*mesh.material.updateUniform("lightDir",
    new Vector3(
      Math.cos(angle),
      Math.sin(angle),
      Math.sin(angle)
    ).normalize()
  )*/
  renderer.update()
  requestAnimationFrame(render)
  angle += Math.PI / 100
}
render()


function setEulerFromQuaternion(quaternion, e = new Vector3()) {
  let matrix = new Matrix4()

  const x = quaternion.x,
    y = quaternion.y,
    z = quaternion.z,
    w = quaternion.w;
  const x2 = x + x,
    y2 = y + y,
    z2 = z + z;
  const xx = x * x2,
    xy = x * y2,
    xz = x * z2;
  const yy = y * y2,
    yz = y * z2,
    zz = z * z2;
  const wx = w * x2,
    wy = w * y2,
    wz = w * z2;

  const m11 = (1 - (yy + zz))
  const m12 = (xy - wz)
  const m13 = (xz + wy)
  const m23 = (yz - wx)
  const m33 = (1 - (xx + yy))
  const m32 = (yz + wx )

  e.y = Math.asin(clamp(m13, -1, 1));

  if (Math.abs(m13) < 0.9999999) {
    e.x = Math.atan2(-m23, m33);
    e.z = Math.atan2(-m12, m11);
  } else {
    e.x = Math.atan2(m32, m22);
    e.z = 0;
  }
  return e
}

function clamp(v, min, max) {
  if (min > v) return min
  if (max < v) return max
  return v
}