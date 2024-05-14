#version 300 es
precision mediump float;

in vec3 position;
in vec2 uv;
in vec3 normal;

out vec2 v_uv;

void main(){
  gl_Position = vec4(position,1.0);
  v_uv = uv;
}