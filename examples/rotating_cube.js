import { Mesh } from "../meshes/mesh.js"
import { Texture } from "../textures/index.js"
import { PhongMaterial } from "../material/index.js"
import { BoxGeometry } from "../geometry/index.js"
import {
  Vector3,
  Quaternion,
  Color
} from "../math/index.js"

export function rotatingCube(renderer) {
  const quat1 = new Quaternion()
  const euler = new Vector3(Math.PI / 1000, Math.PI / 1000, 0)
  const tex = new Texture({
    src: "./assets/uv.jpg"
  })
  const origin = new Mesh(
    new BoxGeometry(1, 1, 1),
    new PhongMaterial({
      mainTexture: tex,
      lightDir: new Vector3(0, -3, -3),
      specularShininess: 4,
      specularStrength: 0.06,
      diffuseIntensity: 0.1
    })
  )
  quat1.setFromEuler(euler)
  tex.init(renderer.gl)
  renderer.setViewport(innerWidth, innerHeight)
  renderer.camera.transform.position.z = 2
  renderer.camera.makePerspective(120)
  renderer.add(origin)
  setInterval(() => {
    origin.transform.orientation.multiply(quat1)
  }, 100 / 6)
}