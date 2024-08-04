import { Shader } from "./shader.js"
import { Color } from "../Math/index.js"

let vshader =
  `#version 300 es
  precision mediump float;

in vec3 position;
in vec2 uv;
in vec3 normal;

uniform camera {
  mat4 view;
  mat4 projection;
  vec3 camPosition;
};

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
  
  vec3 tint(vec3 texColor, vec3 tint){
  
    if (texColor == vec3(0.0, 0.0, 0.0))
      return tint;
    return texColor * tint;
  }
  void main(){
    vec4 sampleColor = texture(mainTexture,v_uv);
    finalColor.xyz = tint(sampleColor.xyz,color.xyz);
    finalColor.a = opacity;
}
`
let blankOptions = {}
export class BasicMaterial extends Shader {
  constructor(options = blankOptions) {
    let {
      color = new Color(1, 1, 1),
        opacity = 1.0,
        texture = null,
    } = options

    super(vshader, fshader)

    if (texture)this.setUniform("mainTexture", texture)
    this.setUniform("color", color)
    this.setUniform("opacity", opacity)
  }
}