export * from "./matrix2.js"
export * from "./matrix3.js"
export * from "./matrix4.js"
export * from "./vector2.js"
export * from "./vector3.js"
export * from "./vector4.js"
export * from "./color.js"
export * from "./quaternion.js"
export * from "./transform.js"

export function map(x, xMin, xMax, zMin, zMax) {
  return (x - xMin) / (xMax - xMin) * (zMax - zMin) + zMin;
}
