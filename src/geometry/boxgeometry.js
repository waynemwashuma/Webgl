import { Geometry } from "./geometry.js"
import { Attribute } from "../core/index.js"


export class BoxGeometry extends Geometry {
  constructor(w = 1, h = 1, d = 1) {
    super()

    let vertices = [
  // Front face
  -0.5 * w, -0.5 * h, 0.5 * d,
  0.5 * w, -0.5 * h, 0.5 * d,
  0.5 * w, 0.5 * h, 0.5 * d,
  -0.5 * w, 0.5 * h, 0.5 * d,

  // Back face
  -0.5 * w, -0.5 * h, -0.5 * d,
  -0.5 * w, 0.5 * h, -0.5 * d,
  0.5 * w, 0.5 * h, -0.5 * d,
  0.5 * w, -0.5 * h, -0.5 * d,

  // Top face
  -0.5 * w, 0.5 * h, -0.5 * d,
  -0.5 * w, 0.5 * h, 0.5 * d,
  0.5 * w, 0.5 * h, 0.5 * d,
  0.5 * w, 0.5 * h, -0.5 * d,

  // Bottom face
  -0.5 * w, -0.5 * h, -0.5 * d,
  0.5 * w, -0.5 * h, -0.5 * d,
  0.5 * w, -0.5 * h, 0.5 * d,
  -0.5 * w, -0.5 * h, 0.5 * d,

  // Right face
  0.5 * w, -0.5 * h, -0.5 * d,
  0.5 * w, 0.5 * h, -0.5 * d,
  0.5 * w, 0.5 * h, 0.5 * d,
  0.5 * w, -0.5 * h, 0.5 * d,

  // Left face
  -0.5 * w, -0.5 * h, -0.5 * d,
  -0.5 * w, -0.5 * h, 0.5 * d,
  -0.5 * w, 0.5 * h, 0.5 * d,
  -0.5 * w, 0.5 * h, -0.5 * d,
]

    let normals = [
    // Front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
  ];
    let uv = [
        // Front
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Top
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Bottom
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Left
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
      ];

    let indices = []
    for (var i = 0; i < vertices.length / 3; i += 4) {
      indices.push(
        i, i + 2, i + 1,
        i, i + 3, i + 2
      )
    }
    this.setAttribute("indices",
      new Attribute(indices, 1)
    )
    this.setAttribute("position",
      new Attribute(vertices, 3)
    )
    this.setAttribute("normal",
      new Attribute(normals, 3)
    )
    this.setAttribute("uv",
      new Attribute(uv, 2)
    )
  }
}