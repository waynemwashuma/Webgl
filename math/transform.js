import { Mat4 } from "/math/Mat4.js"
import { Vec3 as Vector3 } from "/math/vec3.js"

let _position = new Vector3()
let _rotation = new Vector3()
let _scale = new Vector3()

export class Transform {
  constructor() {
    this.matrix = new Mat4()
    this.position = new Vector3()
    this.rotation = new Vector3()
    this.scale = new Vector3(1, 1, 1)
  }
  updateMatrix(parent) {
    if (parent === void 0) {
      this.matrix.compose(
        this.position,
        this.rotation,
        this.scale
      )
      return
    }
    _scale
      .copy(this.scale)
      .multiply(parent.scale)
    _rotation
      .copy(this.rotation)
      .add(parent.rotation)
    _position
      .copy(this.position)
      .multiply(parent.scale)
      .rotate(parent.rotation)
      .add(parent.position)
      .

    this.matrix.compose(
      _position,
      _rotation,
      _scale
    )
  }
}