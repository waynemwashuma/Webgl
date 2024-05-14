#version 300 es
precision mediump float;

in vec2 v_uv;

uniform sampler2D colorT;
uniform sampler2D normalT;
uniform vec3 lightDir[1];
uniform vec4 lightColor[1];
uniform float diffuseIntensity;

out vec4 color;

float calcBrightness(vec3 normal, vec3 dir) {
  return max(dot(normalize(normal), -dir),0.0);
}

void main(){
  vec3 initialColor = texture(colorT,v_uv).xyz;
  vec3 normal = texture(normalT,v_uv).xyz;

  float diffusebrightness = calcBrightness(normal,lightDir[0]);
  vec3 diffuse = lightColor[0].xyz * diffusebrightness * diffuseIntensity;

  vec3 finalColor = initialColor * (diffuse);
  
  color = vec4(diffuse * initialColor,1.0);
  //color = vec4(finalColor,1.0);
}