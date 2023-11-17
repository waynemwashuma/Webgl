export const ATTR_POSITION_NAME = "position"
export const ATTR_NORMAL_NAME = "normal"
export const ATTR_UV_NAME = "uv"
export let ATTR_POSITION_LOC = 0
export let ATTR_NORMAL_LOC = 1
export let ATTR_UV_LOC = 2
export const UNI_PROJ_MAT = "projection"
export const UNI_CAM_MAT = "view"
export const UNI_MODEL_MAT = "model"

export const UniformTypes = {
  BOOL: 0,
  FLOAT: 1,
  //INT : 2,
  VEC2: 3,
  VEC3: 4,
  VEC4: 5,
  MAT2: 6,
  MAT3: 7,
  MAT4: 8,
  TEXTURE: 9
}

export const {
  DrawModes,
  CullFace,
  BlendEquations
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
      AlphaModes: {

      },
      BlendEquations: {
        SRC: gl.SRC_ALPHA,
        DST: gl.DST_ALPHA,
        ONE_MINUS_SRC: gl.ONE_MINUS_SRC_ALPHA,
        ONE_MINUS_DIST: gl.ONE_MINUS_DST_ALPHA
      }
    }
  })()