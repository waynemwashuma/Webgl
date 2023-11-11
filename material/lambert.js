import { Shader } from "./shader.js"
import { Color,Vector3 } from "../Math/index.js"


let vshader =
  `#version 300 es
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
  out mat3 invNormalMat;
  out vec3 lightDirec;
  
  void main(){
    gl_Position = projection * view * model * vec4(position,1.0);
    invNormalMat = mat3(model);
    v_uv = uv;
    v_normal = normal;
  }
`
let fshader =
  `#version 300 es
  precision mediump float;
  uniform sampler2D texture1;
  
  in float brightness;
  in vec2 v_uv;
  in vec3 v_normal;
  in mat3 invNormalMat;
  
  uniform vec3 lightDir;
  uniform float ambient;
  uniform float opacity;
  
  out vec4 FragColor;
 
 //Remember you set the dir to negative because light direction is the opposite direction of dir.
 float calcBrightness(vec3 normal, mat3 normalMatrix, vec3 dir) {
   return max(
     dot(normalize(normalMatrix * normal), -dir),
     0.0
   );
 }
 
 void main(){
    vec4 color = FragColor = vec4(1.0,1.0,0.0,1.0);
    float brightness = calcBrightness(v_normal,invNormalMat,lightDir);
    
    FragColor = color * ambient + 
    (1.0 - ambient) * color * brightness;
    FragColor.a = opacity;
}
`

export class LambertMaterial extends Shader {
  // color = new Color()
  constructor(options) {
    let {
      color = new Color(1, 1, 1),
        mainTexture = null,
        opacity = 1.0,
        ambientIntensity = 0.1,
        lightDir = new Vector3(0,0,1),
        lightPos = new Vector3(0,1,3)
    } = options

    super(vshader, fshader, {
      opacity,
      ambient: ambientIntensity,
      lightDir,
      lightPos
    })
  }
}