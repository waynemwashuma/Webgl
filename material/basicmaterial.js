import { Shader } from "./shader.js"
import { Color } from "../Math/index.js"

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
uniform vec4 color;

varying vec2 v_uv;

void main(){
  gl_FragColor = color;
}
`

export class BasicMaterial extends Shader{
  color = new Color()
  texture = null
  constructor(options){
    super()
    this.vSrc = vshader
    this.fSrc = fshader

    let {
      color = new Color(0,0,255),
      texture = null,
    } = options
    this.color.copy(color)
    this.texture = texture
    
    if(texture)this.setUniform("texture",texture)
    this.setUniform("color",this.color)
  }
}