export * from "./Matrix.js"
export * from "./transform.js"
export * from "./vec3.js"
export * from "./color.js"

export function map(x, xMin, xMax, zMin, zMax) {
  return (x - xMin) / (xMax - xMin) * (zMax - zMin) + zMin;
}
