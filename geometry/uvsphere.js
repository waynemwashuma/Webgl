import { Geometry } from "./geometry.js"
import { Attribute } from "../attributes/index.js"


export class UVShereGeometry extends Geometry {
  constructor(radius = 1, numSegments = 20, numRings = 30) {
    super()

    const { indices, vertices, normals, uvs } = createUVSphere(radius, numSegments, numRings);
    
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
      new Attribute(uvs, 2)
    )
  }
}

function createUVSphere(radius, numSegments, numRings) {
  const vertices = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= numRings; i++) {
    const phi = Math.PI * (-0.5 + (i / numRings));
    for (let j = 0; j <= numSegments; j++) {
      const theta = 2 * Math.PI * (j / numSegments);
      const x = radius * Math.cos(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.cos(phi);
      const z = radius * Math.sin(phi);
      const nx = x / radius;
      const ny = y / radius;
      const nz = z / radius;
      const u = 1.0 - (j / numSegments);
      const v = 1.0 - (i / numRings);
      
      vertices.push(x, y, z);
      normals.push(nx, ny, nz);
      uvs.push(u, v);
    }
  }

  for (let i = 0; i < numRings; i++) {
    for (let j = 0; j < numSegments; j++) {
      const p0 = i * (numSegments + 1) + j;
      const p1 = p0 + numSegments + 1;
      indices.push(p0, p1, p0 + 1, p1, p1 + 1, p0 + 1);
    }
  }

  return { indices, vertices, normals, uvs };
}