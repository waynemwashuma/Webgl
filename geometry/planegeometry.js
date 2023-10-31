import { Geometry } from "./geometry.js"

export class PlaneGeometry extends Geometry {
  constructor(w, h) {
    super()
    let indices = [
      0, 1, 2,
      0, 3, 2
      ]
    let vertices = [
      0.5 * w, 0.5 * h, 0,
      0.5 * w, -0.5 * h, 0,
      -0.5 * w, -0.5 * h, 0,
      -0.5 * w, 0.5 * h, 0
     ]
    let uv = [
       1, 0,
       1, 1,
       0, 1,
       0, 0
       ]
    this.setAttribute("indices", indices)
    this.setAttribute("position", vertices)
    this.setAttribute("uv", uv)
  }
}