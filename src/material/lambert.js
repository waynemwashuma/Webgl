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
  
  in float brightness;
  in vec2 v_uv;
  in vec3 v_normal;
  in mat3 invNormalMat;
  
  uniform sampler2D mainTexture;
  uniform vec3 lightDir;
  uniform float ambientIntensity;
  uniform vec4 ambientColor;
  uniform float diffuseIntensity;
  uniform float opacity;
  uniform vec4 color;
  uniform vec4 lightColor;
  
  out vec4 FragColor;
 
 //Remember you set the dir to negative because light direction is the opposite direction of dir.
 float calcBrightness(vec3 normal, vec3 dir) {
   return max(
     dot(normalize(normal), -dir),
     0.0
   );
 }
 
 void main(){
    vec3 baseColor = texture(mainTexture,v_uv).xyz * color.xyz;
    if(baseColor == vec3(0.0,0.0,0.0))
      baseColor = color.xyz;
    vec3 ambient = ambientColor.xyz * ambientIntensity;
    
    float brightness = calcBrightness(invNormalMat * v_normal,lightDir);
    
    vec3 diffuse = lightColor.xyz * brightness * diffuseIntensity;
    
    vec3 finalColor = baseColor * (ambient + diffuse);
    FragColor = vec4(finalColor,opacity);
}
`

export class LambertMaterial extends Shader {
  // color = new Color()
  constructor(options) {
    let {
    mainTexture= null,
    color= new Color(1, 1, 1),
    ambientColor=new Color(1,1,1),
    ambientIntensity = 0.15,
    opacity= 1.0,
    lightDir= new Vector3(0, 0, -1),
    lightColor=new Color(1,1,1),
    diffuseIntensity=0.65
  } = options

    super(vshader, fshader, {
      color,
      ambientColor,
      ambientIntensity,
      opacity,
      lightDir,
      lightColor,
      diffuseIntensity
    })
    if(mainTexture)this.setUniform("mainTexture",mainTexture)
  }
}