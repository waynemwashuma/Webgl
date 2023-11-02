import { Geometry } from "./geometry.js"
import { Attribute } from "../attributes/index.js"



export class QuadGeometry extends Geometry {
  constructor(w, h) {
    super()
    let indices = new Attribute([
      0, 1, 2,
      0, 3, 2
    ], 1)
    let vertices = new Attribute([
      0.5 * w, 0.5 * h, 0,
      0.5 * w, -0.5 * h, 0,
      -0.5 * w, -0.5 * h, 0,
      -0.5 * w, 0.5 * h, 0
    ], 3)
    let uv = new Attribute([
       1, 0,
       1, 1,
       0, 1,
       0, 0
    ], 2)
    let normals = new Attribute([
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0
     ], 3)

    this.setAttribute("indices", indices)
    this.setAttribute("position", vertices)
    this.setAttribute("normal", normals)
    this.setAttribute("uv", uv)
  }
}