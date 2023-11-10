import { Mat4 } from "/math/Mat4.js"
import { Vec3 } from "/math/vec3.js"


export class Transform{
  constructor(){
    this.matrix = new Mat4()
    this.position = new Vec3()
    this.rotation = new Vec3()
    this.scale = new Vec3(1,1,1)
    this.offsetPosition = new Vector3()
    this.offsetRotate = new Vector3()
    this.offsetScale = new Vector3(1,1,1)
    this.parent = null
  }
  updateMatrix(){
    this.matrix.compose(this.position,this.rotation,this.scale)
  }
}