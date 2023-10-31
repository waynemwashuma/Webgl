import { Geometry } from "./geometry.js"

export class BoxGeometry extends Geometry {
  constructor(w = 1, h = 1, l = 1) {
    super()
    let vertices = [
		// Top
		-0.5 * w, 0.5 * h, -0.5 * l,
		-0.5 * w, 0.5 * h, 0.5 * l,
		0.5 * w, 0.5 * h, 0.5 * l,
		0.5 * w, 0.5 * h, -0.5 * l,

		// Left
		-0.5 * w, 0.5 * h, 0.5 * l,
		-0.5 * w, -0.5 * h, 0.5 * l,
		-0.5 * w, -0.5 * h, -0.5 * l,
		-0.5 * w, 0.5 * h, -0.5 * l,

		// Right
		0.5 * w, 0.5 * h, 0.5 * l,
		0.5 * w, -0.5 * h, 0.5 * l,
		0.5 * w, -0.5 * h, -0.5 * l,
		0.5 * w, 0.5 * h, -0.5 * l,

		// Front
		0.5 * w, 0.5 * h, 0.5 * l,
		0.5 * w, -0.5 * h, 0.5 * l,
		-0.5 * w, -0.5 * h, 0.5 * l,
		-0.5 * w, 0.5 * h, 0.5 * l,

		// Back
		0.5 * w, 0.5 * h, -0.5 * l,
		0.5 * w, -0.5 * h, -0.5 * l,
		-0.5 * w, -0.5 * h, -0.5 * l,
		-0.5 * w, 0.5 * h, -0.5 * l,

		// Bottom
		-0.5 * w, -0.5 * h, -0.5 * l,
		-0.5 * w, -0.5 * h, 0.5 * l,
		0.5 * w, -0.5 * h, 0.5 * l,
		0.5 * w, -0.5 * h, -0.5 * l,
		];
    let uv = [
	    0, 0,
	    0, 1,
	    1, 1,
	    1, 0,
	    0, 0,
	    1, 0,
	    1, 1,
	    0, 1,
	    1, 1,
	    0, 1,
	    0, 0,
	    1, 0,
	    1, 1,
	    1, 0,
	    0, 0,
	    0, 1,
	    0, 0,
	    0, 1,
	    1, 1,
	    1, 0,
	    1, 1,
	    1, 0,
	    0, 0,
	    0, 1
	  ]

    let indices = [
      // Top
      0, 1, 2,
      0, 2, 3,

      // Left
      5, 4, 6,
      6, 4, 7,
      
      // Right
      8, 9, 10,
      8, 10, 11,
      
      // Front
      13, 12, 14,
      15, 14, 12,
      
      // Back
      16, 17, 18,
      16, 18, 19,
      
      // Bottom
      21, 20, 22,
      22, 20, 23
		]
    this.setAttribute("indices", indices)
    this.setAttribute("position", vertices)
    this.setAttribute("uv", uv)
  }
}