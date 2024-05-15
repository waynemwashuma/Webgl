export const ATTR_POSITION_NAME = "position"
export const ATTR_NORMAL_NAME = "normal"
export const ATTR_UV_NAME = "uv"
export const ATTR_POSITION_LOC = 0
export const ATTR_NORMAL_LOC = 1
export const ATTR_UV_LOC = 2
export const UNI_PROJ_MAT = "projection"
export const UNI_CAM_MAT = "view"
export const UNI_MODEL_MAT = "model"

/**
 * @readonly
 * @enum {number}
 */
export const UniformType = {
  BOOL: 0,
  FLOAT: 1,
  INT: 2,
  VEC2: 3,
  VEC3: 4,
  VEC4: 5,
  MAT2: 6,
  MAT3: 7,
  MAT4: 8,
  TEXTURE: 9,
  ARR_FLOAT: 10,
  ARR_INT: 11,
  ARR_VEC2: 12,
  ARR_VEC3: 13,
  ARR_VEC4: 14,
  ARR_MAT2: 15,
  ARR_MAT3: 16,
  ARR_MAT4: 17,
  ARR_BOOL: 18,
  STRUCT: 19
}
/**
 * @readonly
 * @enum {number}
 */
export const GlDataType = {
  FLOAT: 0x1406,
  UNSIGNED_INT: 0x1405,
  INT: 0x1404,
  UNSIGNED_SHORT: 0x1403,
  SHORT: 0x1402,
  UNSIGNED_BYTE: 0x1401,
  BYTE: 0x1400
}
/**
 * @readonly
 * @enum {number}
 */
export const DrawMode = {
  POINTS: 0x0000,
  LINES: 0x0001,
  LINE_LOOP: 0x0002,
  LINE_STRIP: 0x0003,
  TRIANGLES: 0x0004,
  TRIANGLE_STRIP: 0x0005,
  TRIANGLE_FAN: 0x0006
}
/**
 * @readonly
 * @enum {number}
 */
export const DrawUsage = {
  STATIC: 0x88E4,
  DYNAMIC: 0x88E8,
  STREAM: 0x88E0
}
/**
 * @readonly
 * @enum {number}
 */
export const CullFace = {
  FRONT: 0x0404,
  BACK: 0x0405,
  BOTH: 0x0408
}
/**
 * @readonly
 * @enum {number}
 */
export const BlendMode = {
  ZERO: 0x0000,
  ONE: 0x00001,
  SRC_COLOR: 0x0300,
  ONE_MINUS_SRC_COLOR: 0x0301,
  SRC_ALPHA: 0x0302,
  ONE_MINUS_SRC_ALPHA: 0x0303,
  DST_ALPHA: 0x0304,
  ONE_MINUS_DIST_ALPHA: 0x0305,
  DST_COLOR: 0x0306,
  ONE_MINUS_DST_COLOR: 0x0307,
  SRC_ALPHA_SATURATE: 0x0308,
  CONSTANT_COLOR: 0x8001,
  ONE_MINUS_CONSTANT_COLOR: 0x8002,
  CONSTANT_ALPHA: 0x8003,
  ONE_MINUS_CONSTANT_ALPHA: 0x8004
}

export const BlendEquations = {
  ADD: 0x8006,
  SUBTRACT: 0x800A,
  REVERSE_SUBTRACT: 0x800B
}
/**
 * @readonly
 * @enum {number}
 */
export const TextureFormat = {
  DEPTH: 0x1902, //gl.DEPTH_COMPONENT
  RED: 0x1903,
  ALPHA: 0x1906,
  RGB: 0x1907,
  RGBA: 0x1908,
  LUMINANCE: 0x1909,
  LUMINANCE_ALPHA: 0x190A,
  RGB8: 0x8051,
  RGBA8: 0x8058,
  RGBA16F: 0x881A,
  RGB16F: 0x881B,
  RGBA32F: 0x8814,
  RGB32F: 0x8815,
  RGBA32I: 0x8D82,
  RGB32I: 0x8D83,
  RGBA16I: 0x8D88,
  RGB16I: 0x8D89,
  RGBA8I: 0x8D8E,
  RGB8I: 0x8D8F,
}
/**
 * @readonly
 * @enum {number}
 */
export const TextureFilter = {
  NEAREST: 0x2600,
  LINEAR: 0x2601,
  NEAREST_MIPMAP_NEAREST: 0x2700,
  LINEAR_MIPMAP_NEAREST: 0x2701,
  NEAREST_MIPMAP_LINEAR: 0x2702,
  LINEAR_MIPMAP_LINEAR: 0x2703,
}
/**
 * @readonly
 * @enum {number}
 */
export const TextureWrap = {
  REPEAT: 0x2901,
  CLAMP: 0x812F,
  MIRRORREPEAT: 0x8370
}