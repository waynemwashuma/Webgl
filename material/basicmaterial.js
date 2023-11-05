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
  
  in vec2 v_uv;
  
  out vec4 finalColor;
  void main(){
    finalColor = texture(mainTexture,v_uv);
    //finalColor = vec4(v_uv,0.0,1.0);
}
`

export class BasicMaterial extends Shader {
  color = new Color()
  texture = null
  constructor(options) {
    let {
      color = new Color(1, 1, 1),
        texture = null,
    } = options
    
    super(vshader,fshader)
    
    this.color.copy(color)
    this.texture = texture
    console.log(texture);

    if (texture) this.setUniform("mainTexture", texture)
    this.setUniform("color", this.color)
  }
}