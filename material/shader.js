import {
  createProgramFromSrc
} from "../functions.js"
import {
  UNI_CAM_MAT,
  UNI_PROJ_MAT,
  UNI_MODEL_MAT,
  UniformTypes
} from "../constants.js"

export const DrawModes = (
  function() {
    let canvas = document.createElement('canvas')
    let gl = canvas.getContext("webgl2")

    return {
      POINTS: gl.POINTS,
      TRIANGLES: gl.TRIANGLES,
      TRIANGLE_FAN: gl.TRIANGLE_FAN,
      TRIANGLE_STRIP: gl.TRIANGLE_STRIP,
      LINES: gl.LINES,
      LINE_LOOP: gl.LINE_LOOP,
      LINE_STRIP: gl.LINE_STRIP
    }
  })()
export class Shader {
  drawMode = DrawModes.TRIANGLES
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
        this.uniforms[name]
      )
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
  }
    /**
   * @param {WebGL2RenderingContext} gl
   */
  prepareUBO(gl,ubo){
    let index = gl.getUniformBlockIndex(this.program,ubo.name)
    
    console.log("SIZE",gl.getActiveUniformBlockParameter(this.program,index,gl.UNIFORM_BLOCK_DATA_SIZE));
    console.log("no. of uniforms",gl.getActiveUniformBlockParameter(this.program,index,gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS));
    console.log("Indices",gl.getActiveUniformBlockParameter(this.program,index,gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES));
    gl.uniformBlockBinding(this.program,index,ubo.point)
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
      location: null
    }
  }
  updateUniform(name, value) {
    this.uniforms[name].value = value
  }
}

function typeOfUniform(uniform) {
  let name = uniform.value.constructor.name.toLowerCase()
  let type = typeof uniform.value

  if (type == "boolean") {
    return UniformTypes.BOOL
  }
  if (type == "number") {
    if (Number.isInteger(uniform))
      return UniformTypes.INT
    return UniformTypes.FLOAT
  }
  if (type == "object") {
    if (name === "vec2")
      return UniformTypes.VEC2
    if (name === "vec3")
      return UniformTypes.VEC3
    if (name === "vec4" || name === "color")
      return UniformTypes.VEC4
    if (name === "mat2")
      return UniformTypes.MAT2
    if (name === "mat3")
      return UniformTypes.MAT3
    if (name === "mat4" || name === "matrix") return UniformTypes.MAT4
    if (name === "texture")
      return UniformTypes.TEXTURE
  }

  throw "Unsupported type of a uniform value."
}

/**
 * @param {WebGL2RenderingContext} gl
 */
function updateUniform(gl, uniform, texIndex) {
  let val = uniform.value
  let arr = new Float32Array(16)
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
    case UniformTypes.VEC4:
      uniform.value.toArray(arr)
      gl.uniform4fv(uniform.location, arr, 0, 4)
      break
    case UniformTypes.MAT2:
      uniform.value.toArray(arr)
      gl.uniformMatrix2fv(uniform.location, false, 0,4)
      break
    case UniformTypes.MAT3:
      uniform.value.toArray(arr)
      gl.uniformMatrix3fv(uniform.location, arr, false, arr,0,9)
      break
    case UniformTypes.MAT4:
      uniform.value.toArray(arr)
      gl.uniformMatrix4fv(uniform.location, false, arr,0,16)
      break
    case UniformTypes.TEXTURE:
      uniform.value.use(gl, texIndex)
      gl.uniform1i(uniform.location, texIndex)
      break
  }
}