import { Mesh } from "../meshes/mesh.js"
import { Texture } from "../textures/index.js"
import { PhongMaterial } from "../material/index.js"
import { QuadGeometry } from "../geometry/index.js"
import {
  Vector3,
  Quaternion,
  Color
} from "../math/index.js"
import { TextureWrap } from "../constants.js"

export function textureWrap(renderer) {
  const tex1 = new Texture({
    src: "./assets/uv.jpg",
    wrapS: TextureWrap.CLAMP,
    wrapT: TextureWrap.CLAMP
  })
  const tex2 = new Texture({
    src: "./assets/uv.jpg",
    wrapS: TextureWrap.REPEAT,
    wrapT: TextureWrap.REPEAT
  })
  const tex3 = new Texture({
    src: "./assets/uv.jpg",
    wrapS: TextureWrap.MIRRORREPEAT,
    wrapT: TextureWrap.MIRRORREPEAT

  })
  
  const geometry = new QuadGeometry(1, 1)

  const uvs = geometry._attributes['uv'].value
  for (let i in uvs) {
    uvs[i] *= 2
  }

  const material1 = new PhongMaterial({
    mainTexture: tex1,
    lightDir: new Vector3(0, -3, -3),
    specularShininess: 4,
    specularStrength: 0.06,
    diffuseIntensity: 0.1
  })
  const material2 = new PhongMaterial({
    mainTexture: tex2,
    lightDir: new Vector3(0, -3, -3),
    specularShininess: 4,
    specularStrength: 0.06,
    diffuseIntensity: 0.1
  })
  const material3 = new PhongMaterial({
    mainTexture: tex3,
    lightDir: new Vector3(0, -3, -3),
    specularShininess: 4,
    specularStrength: 0.06,
    diffuseIntensity: 0.1
  })

  const mesh1 = new Mesh(geometry, material1)
  const mesh2 = new Mesh(geometry, material2)
  const mesh3 = new Mesh(geometry, material3)

  tex1.init(renderer.gl)
  tex2.init(renderer.gl)
  tex3.init(renderer.gl)

  mesh1.transform.position.x = -1.2
  mesh2.transform.position.x = 0
  mesh3.transform.position.x = 1.2

  renderer.camera.transform.position.z = 2
  renderer.camera.makePerspective(120)
  renderer.add(mesh1)
  renderer.add(mesh2)
  renderer.add(mesh3)
}