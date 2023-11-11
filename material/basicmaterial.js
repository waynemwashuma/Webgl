import { Shader } from "./shader.js"
import { Color } from "../Math/index.js"

let vshader =
  `#version 300 es
  precision mediump float;

in vec3 position;
in vec2 uv;
in vec3 normal;

uniform mat4 view;
uniform mat4 projection;
uniform mat4 model;

out vec2 v_uv;

void main(){
  gl_Position = projection * view * model * vec4(position,1.0);
  v_uv = uv;
}
`
let fshader =
  `#version 300 es
  precision mediump float;
  
  uniform sampler2D mainTexture;
  uniform vec4 color;
  uniform float opacity;
  
  in vec2 v_uv;
  
  out vec4 finalColor;
  void main(){
    finalColor = texture(mainTexture,v_uv) * color ;
    finalColor.a = opacity;
    if(finalColor.xyz == vec3(0.0,0.0,0.0))
       finalColor = color;
    finalColor.a = opacity;
}
`
let blankOptions = {}
export class BasicMaterial extends Shader {
  constructor(options = blankOptions) {
    let {
      color = new Color(0, 1, 1),
        opacity = 0.99999,
        texture = null,
    } = options

    super(vshader, fshader)

    if (texture)this.setUniform("mainTexture", texture)
    this.setUniform("color", color)
    this.setUniform("opacity", opacity)
  }
}