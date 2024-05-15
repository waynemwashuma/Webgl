export const ATTR_POSITION_NAME = "position"
export const ATTR_NORMAL_NAME = "normal"
export const ATTR_UV_NAME = "uv"
export let ATTR_POSITION_LOC = 0
export let ATTR_NORMAL_LOC = 1
export let ATTR_UV_LOC = 2
export const UNI_PROJ_MAT = "projection"
export const UNI_CAM_MAT = "view"
export const UNI_MODEL_MAT = "model"

/**
 * @readonly
 * @enum {number}
 */
export const UniformTypes = {
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

export const {
  /**
   * @readonly
   * @enum {number}
   */
  DrawModes,
  /**
   * @readonly
   * @enum {number}
   */
  CullFace,
  /**
   * @readonly
   * @enum {number}
   */
  BlendEquations,
  /**
   * @readonly
   * @enum {number}
   */
  TextureWrap,
  /**
   * @readonly
   * @enum {number}
   */
  TextureFormat,
  /**
   * @readonly
   * @enum {number}
   */
  TextureFilter,
  /**
   * @readonly
   * @enum {number}
   */
  GlDataType,
} = (
  function() {
    let canvas = document.createElement('canvas')
    let gl = canvas.getContext("webgl2")

    return {
      DrawModes: {
        POINTS: gl.POINTS,
        TRIANGLES: gl.TRIANGLES,
        TRIANGLE_FAN: gl.TRIANGLE_FAN,
        TRIANGLE_STRIP: gl.TRIANGLE_STRIP,
        LINES: gl.LINES,
        LINE_LOOP: gl.LINE_LOOP,
        LINE_STRIP: gl.LINE_STRIP
      },
      CullFace: {
        FRONT: gl.FRONT,
        BACK: gl.BACK,
        BOTH: gl.FRONT_AND_BACK,
        NONE: gl.NONE
      },
      AlphaMode: {

      },
      BlendEquations: {
        SRC: gl.SRC_ALPHA,
        DST: gl.DST_ALPHA,
        ONE_MINUS_SRC: gl.ONE_MINUS_SRC_ALPHA,
        ONE_MINUS_DIST: gl.ONE_MINUS_DST_ALPHA
      },
      GlDataType: {
        INT: gl.INT,
        UNSIGNED_INT: gl.UNSIGNED_INT,
        FLOAT: gl.FLOAT,
        UNSIGNED_SHORT: gl.UNSIGNED_SHORT,
        SHORT: gl.SHORT,
        UNSIGNED_BYTE: gl.UNSIGNED_BYTE,
        BYTE: gl.BYTE
      },
      TextureFormat: {
        RGBA: gl.RGBA,
        RGBA16F: gl.RGBA16F,
        RGBA32F: gl.RGBA32F,
        RGBA8I: gl.RGBA8I,
        RGBA16I: gl.RGBA16I,
        RGBA32I: gl.RGBA32I
      },
      TextureWrap: {
        REPEAT: gl.REPEAT,
        CLAMP: gl.CLAMP_TO_EDGE,
        MIRRORREPEAT: gl.MIRRORED_REPEAT
      },
      TextureFilter: {
        NEAREST: gl.NEAREST,
        LINEAR: gl.LINEAR,
        NEAREST_MIPMAP_LINEAR: gl.NEAREST_MIPMAP_LINEAR,
        NEAREST_MIPMAP_NEAREST: gl.NEAREST_MIPMAP_NEAREST,
        NEAREST_MIPMAP_NEAREST: gl.NEAREST_MIPMAP_NEAREST,
        LINEAR_MIPMAP_LINEAR: gl.LINEAR_MIPMAP_LINEAR,
        LINEAR_MIPMAP_NEAREST: gl.LINEAR_MIPMAP_NEAREST,
      }
    }
  })()