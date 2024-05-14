#version 300 es
precision mediump float;

in vec2 v_uv;
in vec3 v_normal;
in vec4 v_position;

uniform sampler2D mainTexture;
uniform camera {
  mat4 view;
  mat4 projection;
};

layout(location=0) out vec4 color;
layout(location=1) out vec4 position;
layout(location=2) out vec4 normal;
layout(location=3) out vec4 emission;
layout(location=4) out vec4 albedo;
layout(location=5) out vec4 specular;

float calcBrightness(vec3 normal, vec3 dir) {
  return max(dot(normalize(normal), -dir),0.0);
}

void main(){
  normal = vec4(v_normal,1.0);
  color = texture(mainTexture,v_uv);
  position = v_position;
}