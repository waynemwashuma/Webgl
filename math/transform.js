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
    this.positionOffset = new Vector3()
    this.rotationOffset = new Vector3()
    this.scaleOffset = new Vector3(1,1,1)
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
    //this.matrix.multiply(parent.matrix)
    //return
    _quat.setFromEuler(parent.rotation)
    
    this.scale
      .copy(this.scaleOffset)
      .multiply(parent.scale)
    this.rotation
      .copy(this.rotationOffset)
      .add(parent.rotation)
    this.position
      .copy(this.positionOffset)
      .multiply(parent.scale)
      .applyQuaternion(_quat)
      .add(parent.position)
      
    this.matrix.compose(
      this.position,
      this.rotation,
      this.scale
    )
  }
}