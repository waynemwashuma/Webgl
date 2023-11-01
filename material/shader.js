import {
  createProgramFromSrc
} from "../functions.js"
import {
  UNI_CAM_MAT,
  UNI_PROJ_MAT,
  UNI_MODEL_MAT,
  UniformTypes
} from "../constants.js"

export class Shader {
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

    for (var name in this.uniforms) {
      let uniform = this.uniforms[name]
      uniform.type = typeOfUniform(
        this.uniforms[name]
      )
      uniform.location = gl.getUniformLocation(this.program, name)
    }
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  activate(gl) {
    gl.useProgram(this.program)
    for (var name in this.uniforms) {
      let u = this.uniforms[name]
      updateUniform(gl, u)
    }
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
    if (name === "vec4")
      return UniformTypes.VEC4
    if (name === "mat2")
      return UniformTypes.MAT2
    if (name === "mat3")
      return UniformTypes.MAT3
    if (name === "mat4" || name == "matrix") return UniformTypes.MAT4
  }

  throw "Unsupported type of a uniform value."
}

/**
 * @param {WebGL2RenderingContext} gl
 */
function updateUniform(gl, uniform) {
  let val = uniform.value
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
      gl.uniform2f(uniform.location, val.x,val.y)
      break
    case UniformTypes.VEC3:
      gl.uniform3f(uniform.location, val.x, val.y, val.z)
      break
    case UniformTypes.VEC4:
      gl.uniform4f(uniform.location, val.x, val.y, val.z, val.w)
      break
    case UniformTypes.MAT2:
      gl.uniformMatrix2fv(uniform.location, false, uniform.value)
      break
    case UniformTypes.MAT3:
      gl.uniformMatrix3fv(uniform.location, false, uniform.value)
      break
    case UniformTypes.MAT4:
      //TODO - Make matrixmore flexible
      gl.uniformMatrix4fv(uniform.location, false, uniform.value.raw)
      break
  }
}