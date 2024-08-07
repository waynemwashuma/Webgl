import { Geometry } from "./geometry.js"
import { Attribute } from "../core/index.js"


export class UVSphereGeometry extends Geometry {
  constructor(radius = 1, numSegments = 20, numRings = 30) {
    super()

    const { indices, vertices, normals, uvs } = createUVSphere(radius, numSegments, numRings);

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

function createUVSphere(radius, numSegments, numRings) {
  const vertices = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= numRings; i++) {
    const phi = Math.PI * (-0.5 + (i / numRings));
    const cosphi = Math.cos(phi)
    const sinphi = Math.sin(phi)

    for (let j = 0; j <= numSegments; j++) {
      const theta = 2 * Math.PI * (j / numSegments);
      const costheta = Math.cos(theta)
      const sintheta = Math.sin(theta)

      const x = radius * costheta * cosphi
      const y = radius * sintheta * cosphi
      const z = radius * sinphi
      const nx = costheta * cosphi
      const ny = sintheta * cosphi;
      const nz = sinphi;
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
      indices.push(p0,p0 + 1, p1, p1,p0 + 1, p1 + 1);
    }
  }

  return { indices, vertices, normals, uvs };
}