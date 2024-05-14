#version 300 es
precision mediump float;

uniform camera {
mat4 view;
mat4 projection;
};

uniform mat4 model;

in vec3 position;
in vec2 uv;
in vec3 normal;

out vec2 v_uv;
out vec3 v_normal;
out vec4 v_position;

void main(){
  gl_Position = projection * view * model * vec4(position,1.0);
  v_uv = uv;

  mat3 invNormalMat = mat3(model);
  v_uv = uv;
  v_normal = normalize(invNormalMat * normal);
  v_position = gl_Position;
}