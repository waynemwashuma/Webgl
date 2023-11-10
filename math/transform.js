import { Mat4 } from "./Mat4.js"
import { Vector3 } from "./vec3.js"
import { Quaternion } from "./quaternion.js"

let _position = new Vector3()
let _rotation = new Vector3()
let _scale = new Vector3()
let _quat = new Quaternion()
export class Transform3D {
  constructor() {
    this.matrix = new Mat4()
    this.position = new Vector3()
    this.rotation = new Vector3()
    this.scale = new Vector3(1, 1, 1)
    this.worldPosition = new Vector3()
    this.worldRotation = new Vector3()
    this.worldScale = new Vector3(1,1,1)
  }
  updateMatrix(parent) {
    this.worldPosition.copy(this.position)
    this.worldRotation.copy(this.rotation)
    this.worldScale.copy(this.scale)
    if (parent !== void 0) {
      _quat.setFromEuler(parent.worldRotation)
      this.worldScale
        .multiply(parent.worldScale)
      this.worldRotation
       .add(parent.worldRotation)
       
      this.worldPosition
        .multiply(parent.worldScale)
        .applyQuaternion(_quat)
        .add(parent.worldPosition)
    }
    
    this.matrix.compose(
      this.worldPosition,
      this.worldRotation,
      this.worldScale
    )
  }
}