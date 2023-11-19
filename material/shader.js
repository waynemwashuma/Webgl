import {
  createProgramFromSrc,
  typeOfUniform,
  sizeofUniform
} from "../functions.js"
import {
  UNI_CAM_MAT,
  UNI_PROJ_MAT,
  UNI_MODEL_MAT,
  UniformTypes,
  BlendEquations
} from "../constants.js"

export const {
  DrawModes,
  CullFace
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
      }
    }
  })()
export class Shader {
  drawMode = DrawModes.TRIANGLES
  cullFace = CullFace.FRONT
  distBlendFunc = BlendEquations.ONE_MINUS_SRC
  srcBlendFunc = BlendEquations.SRC
  /**
   * @param {string} vshaderSrc
   * @param {string} fshaderSrc
   */
  constructor(vshaderSrc, fshaderSrc, uniforms = {}) {
    this.vSrc = vshaderSrc
    this.fSrc = fshaderSrc
    this.program = null
    this.uniforms = {}
    for (let name in uniforms) {
      this.setUniform(name, uniforms[name])
    }
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  init(gl) {
    if (this.program) return
    this.program = createProgramFromSrc(gl, this.vSrc, this.fSrc)

    for (let name in this.uniforms) {
      let uniform = this.uniforms[name]
      uniform.type = typeOfUniform(
        uniform.value
      )
      uniform.size = sizeofUniform(uniform)
      if (uniform.type === UniformTypes.TEXTURE)
        uniform.value.init(gl)
      //TODO - warn if location is null.
      uniform.location = gl.getUniformLocation(this.program, name)
    }
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  activate(gl) {
    let texIndex = 0
    gl.useProgram(this.program)
    for (var name in this.uniforms) {
      let u = this.uniforms[name]
      updateUniform(gl, u, texIndex)
      if (u.type === UniformTypes.TEXTURE)
        texIndex++
    }
    gl.cullFace(this.cullFace);
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  prepareUBO(gl, ubo) {
    let index = gl.getUniformBlockIndex(this.program, ubo.name)

    gl.uniformBlockBinding(this.program, index, ubo.point)
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  deactivate(gl) {
    gl.useProgram(null)
  }
  setUniform(name, value, type) {
    if (name in this.uniforms)
      return this.updateUniform(name, value)

    this.uniforms[name] = {
      value,
      type: 0,
      location: null,
      size: 0
    }
  }
  updateUniform(name, value) {
    this.uniforms[name].value = value
  }
}


/**
 * @param {WebGL2RenderingContext} gl
 */
function updateUniform(gl, uniform, offset) {
  const val = uniform.value
  const arr = new Float32Array(uniform.size)
  switch (uniform.type) {
    case UniformTypes.BOOL:
      gl.uniform1f(uniform.location, uniform.value)
      break
    case UniformTypes.INT:
      gl.uniform1i(uniform.location, uniform.value)
      break
    case UniformTypes.FLOAT:
      gl.uniform1f(uniform.location, uniform.value)
      break
    case UniformTypes.VEC2:
      uniform.value.toArray(arr)
      gl.uniform2fv(uniform.location, arr, 0, 2)
      break
    case UniformTypes.VEC3:
      uniform.value.toArray(arr)
      gl.uniform3fv(uniform.location, arr, 0, 3)
      break
    case UniformTypes.ARR_VEC2:
      for (var i = 0; i < val.length; i++) {
        val[i].toArray(arr, i * 2)
      }
      gl.uniform2fv(uniform.location, arr, 0, 2)
      break
    case UniformTypes.ARR_VEC3:
      for (var i = 0; i < val.length; i++) {
        val[i].toArray(arr, i * 3)
      }
      gl.uniform3fv(uniform.location, arr)
      break
    case UniformTypes.ARR_VEC4:
      for (var i = 0; i < val.length; i++) {
        val[i].toArray(arr, i * 4)
      }
      gl.uniform4fv(uniform.location, arr)
      break
    case UniformTypes.ARR_MAT2:
      for (var i = 0; i < val.length; i++) {
        val[i].toArray(arr, i * 4)
      }
      gl.uniformMatrix2fv(uniform.location, false, arr)
      break
    case UniformTypes.ARR_MAT2:
      for (var i = 0; i < val.length; i++) {
        val[i].toArray(arr, i * 4)
      }
      gl.uniformMatrix2fv(uniform.location, false, arr)
      break
    case UniformTypes.ARR_MAT2:
      for (var i = 0; i < val.length; i++) {
        val[i].toArray(arr, i * 4)
      }
      gl.uniformMatrix4fv(uniform.location, false, arr)
      break
    case UniformTypes.VEC4:
      uniform.value.toArray(arr)
      gl.uniform4fv(uniform.location, arr, 0, 4)
      break
    case UniformTypes.MAT2:
      uniform.value.toArray(arr)
      gl.uniformMatrix2fv(uniform.location, false, 0, 4)
      break
    case UniformTypes.MAT3:
      uniform.value.toArray(arr)
      gl.uniformMatrix3fv(uniform.location, arr, false, arr, 0, 9)
      break
    case UniformTypes.MAT4:
      uniform.value.toArray(arr)
      gl.uniformMatrix4fv(uniform.location, false, arr, 0, 16)
      break
    case UniformTypes.TEXTURE:
      gl.activeTexture(gl.TEXTURE0 + offset)
      gl.bindTexture(gl.TEXTURE_2D, val.webglTex)
      gl.uniform1i(uniform.location, offset)
      break
    case UniformTypes.ARR_FLOAT:
    case UniformTypes.ARR_BOOL:



      break
  }
}