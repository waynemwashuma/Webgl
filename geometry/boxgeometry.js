import { Geometry } from "./geometry.js"
import { Attribute } from "../attributes/index.js"


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

    let indices = [
    0, 1, 2,
    0, 2, 3, // front
    4, 5, 6,
    4, 6, 7, // back
    8, 9, 10,
    8, 10, 11, // top
    12, 13, 14,
    12, 14, 15, // bottom
    16, 17, 18,
    16, 18, 19, // right
    20, 21, 22,
    20, 22, 23, // left
  ]
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