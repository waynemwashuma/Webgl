import { Geometry } from "./geometry.js"
import { Attribute } from "../core/index.js"


export class CircleGeometry extends Geometry {
  constructor(radius = 1, segments = 15, arcstart = 0, arclength = Math.PI * 2) {
    super()

    const vertices = [0, 0, 0]
    const normals = [0, 0, 1]
    const uvs = [0.5, 0.5]
    const indices = []
    const angleIncrement = arclength / segments
    const epilson = Math.pow(2,-31)
    
    for (let i = arcstart; i < arclength + epilson; i += angleIncrement) {
      const cos = Math.cos(i)
      const sin = Math.sin(i)
      
      vertices.push(
        radius * cos,
        radius * sin,
        0
      )
      normals.push(
        0, 0, 1
      )
      uvs.push(
        (cos + 1) * 0.5, (sin + 1) * 0.5,
      )
    }
    for (let i = 2; i < vertices.length / 3; i++) {
      indices.push(i - 1, i, 0)
    }

    this.setAttribute("indices",
      new Attribute(new Uint16Array(indices), 1)
    )
    this.setAttribute("position",
      new Attribute(new Float32Array(vertices), 3)
    )
    this.setAttribute("normal",
      new Attribute(new Float32Array(normals), 3)
    )
    this.setAttribute("uv",
      new Attribute(new Float32Array(uvs), 2)
    )
  }
}