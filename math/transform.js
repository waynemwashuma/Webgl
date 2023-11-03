import { Mat4 } from "/math/Mat4.js"
import { Vec3 } from "/math/vec3.js"

export class Transform{
  constructor(){
    this.matrix = new Mat4()
    this.position = new Vec3(0,0,0)
    this.rotation = new Vec3(0,0,0)
    this.scale = new Vec3(1,1,1)
  }
  updateMatrix(){
    this.matrix.compose(this.position,this.rotation,this.scale)
  }
}