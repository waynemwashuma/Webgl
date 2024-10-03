import { Geometry } from "./geometry.js"
import { Attribute } from "../core/index.js"


export class PlaneGeometry extends Geometry {
  constructor(width = 1, height = 1, widthSegments = 8, heightSegments = 8) {
    super()

    const vertices = []
    const normals = []
    const uvs = []
    const indices = []

    const widthHalf = width / 2;
    const heightHalf = height / 2;
    const gridX = widthSegments
    const gridY = heightSegments
    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;
    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY

    for (let i = 0; i < gridY1; i++) {
      const dy = i * segmentHeight - heightHalf;
      for (let y = 0; y < gridX1; y++) {
        const dx = y * segmentWidth - widthHalf;

        vertices.push(dx, -dy, 0);
        normals.push(0, 0, 1);
        uvs.push(y / gridX,1 - (i / gridY));
      }
    }

    for (let i = 0; i < gridY; i++) {
      for (let y = 0; y < gridX; y++) {
        const a = y + gridX1 * i;
        const b = y + gridX1 * (i + 1);
        const c = (y + 1) + gridX1 * (i + 1);
        const d = (y + 1) + gridX1 * i;

        indices.push(a, b, d);
        indices.push(b, c, d);

      }
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