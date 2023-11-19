import {
  ATTR_POSITION_LOC,
  ATTR_NORMAL_LOC,
  ATTR_UV_LOC,
  ATTR_POSITION_NAME,
  ATTR_NORMAL_NAME,
  ATTR_UV_NAME,
  UniformTypes
} from "./constants.js"

/**
 * @param {WebGLRenderingContext} gl
 */
export function clear(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}
/**
 * @param {WebGLRenderingContext} gl
 */
export function setViewport(gl, w, h) {
  let canvas = gl.canvas
  canvas.style.width = w + "px"
  canvas.style.height = h + "px"
  canvas.width = w
  canvas.height = h
  gl.viewport(0, 0, w, h)
}

/**
 * @param {WebGLRenderingContext} gl
 */
export function createBuffer(gl, typedarray, isstatic = true) {
  let buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, typedarray,
    isstatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  return buffer
}
/**
 * @param {WebGLRenderingContext} gl
 */
export function createshader(gl, src, type) {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`Shader could not compile: 
    ${src}
    ========================================
    ${gl.getShaderInfoLog(shader)}
    `);
    gl.deleteShader(shader)
    return null
  }
  return shader
}
/**
 * @param {WebGLRenderingContext} gl
 */
export function createTexture(gl, img, flipY) {
  let tex = gl.createTexture()

  if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.bindTexture(gl.TEXTURE_2D, null)

  if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  return tex
}
/**
 * @param {WebGLRenderingContext} gl
 */
export function createProgram(gl, vshader, fshader) {
  let program = gl.createProgram()
  gl.attachShader(program, vshader)
  gl.attachShader(program, fshader)
  gl.bindAttribLocation(program, ATTR_POSITION_LOC, ATTR_POSITION_NAME)
  gl.bindAttribLocation(program, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME)
  gl.bindAttribLocation(program, ATTR_UV_LOC, ATTR_UV_NAME)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(`Program could not be linked: 
    ========================================
    ${gl.getProgramInfoLog(program)}
    `);
    gl.deleteProgram(program)
    return null
  }
  gl.validateProgram(program)
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.log(`Program could not be validated: 
    ========================================
    ${gl.getProgramInfoLog(shader)}
    `);
    gl.deleteProgram(shader)
    return null
  }

  gl.detachShader(program, vshader)
  gl.detachShader(program, fshader)
  gl.deleteShader(vshader)
  gl.deleteShader(fshader)
  return program
}

/**
 * @param {WebGL2RenderingContext} gl
 */
export function createVAO(gl, indices, vertices, normals, uv) {
  let vao = {
    drawMode: gl.TRIANGLES,
    attributes: {

    }
  }
  vao.vao = gl.createVertexArray()
  gl.bindVertexArray(vao.vao)
  if (indices != void 0) {
    let dict = vao.attributes.indices = {}
    let buffer = gl.createBuffer()
    dict.buffer = buffer
    dict.size = 1
    dict.count = indices.length

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
  }
  if (vertices != void 0) {
    let dict = vao.attributes.position = {}
    let buffer = gl.createBuffer()
    dict.buffer = buffer
    dict.size = 3;
    dict.count = vertices.length / dict.size
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(ATTR_POSITION_LOC)
    gl.vertexAttribPointer(ATTR_POSITION_LOC, dict.size, gl.FLOAT, false, 0, 0)
  }
  if (normals != void 0) {
    let dict = vao.attributes.normals = {}
    let buffer = gl.createBuffer()
    dict.buffer = buffer
    dict.size = 3;
    dict.count = normals.length / dict.size
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(ATTR_NORMAL_LOC)
    gl.vertexAttribPointer(ATTR_NORMAL_LOC, dict.size, gl.FLOAT, false, 0, 0)
  }
  if (uv != void 0) {
    let dict = vao.attributes.uv = {}
    let buffer = gl.createBuffer()
    dict.buffer = buffer
    dict.size = 2;
    dict.count = vertices.length / dict.size

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(ATTR_UV_LOC)
    gl.vertexAttribPointer(ATTR_UV_LOC, dict.size, gl.FLOAT, false, 0, 0)
  }
  gl.bindVertexArray(null)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  return vao
}

/**
 * @param {WebGL2RenderingContext} gl
 */
export function createProgramFromSrc(gl, vshader, fshader) {
  let v = createshader(gl, vshader, gl.VERTEX_SHADER)
  let f = createshader(gl, fshader, gl.FRAGMENT_SHADER)
  if (f == null || v == null) {
    gl.deleteShader(v)
    gl.deleteShader(f)
    return null
  }
  let program = createProgram(gl, v, f)
  return program
}

/**
 * @param {WebGL2RenderingContext} gl
 */
export function getAttrLoc(gl, program, name) {
  return gl.getAttribLocation(program, name)
}

/**
 * @param {WebGL2RenderingContext} gl
 */
export function getUniformLoc(gl, program, name) {
  return gl.getUniformLocation(program, name)
}

export function sizeofUniform(uniform) {
  const type = uniform.type
  switch (type) {
    case UniformTypes.INT:
    case UniformTypes.FLOAT:
    case UniformTypes.BOOL:
    case UniformTypes.TEXTURE:
      return 1
    case UniformTypes.MAT4:
      return 16
    case UniformTypes.MAT3:
      return 9
    case UniformTypes.VEC2:
      return 2
    case UniformTypes.VEC3:
      return 3 //Special Case
    case UniformTypes.VEC4:
    case UniformTypes.MAT2:
      return 4
    case UniformTypes.ARR_FLOAT:
      return uniform.value.length
    case UniformTypes.ARR_FLOAT:
    case UniformTypes.ARR_BOOL:
    case UniformTypes.ARR_INT:
      return uniform.value.length
    case UniformTypes.ARR_VEC2:
      return uniform.value.length * 2
    case UniformTypes.ARR_VEC3:
      return uniform.value.length * 3
    case UniformTypes.ARR_VEC4:
    case UniformTypes.ARR_MAT2:
      return uniform.value.length * 4
    case UniformTypes.ARR_MAT3:
      return uniform.value.length * 9
    case UniformTypes.ARR_MAT4:
      return uniform.value.length * 16
    default:
      return 0
  }
}
export function typeOfUniform(uniform) {
  if (uniform === void 0) return -1
  let name = uniform.constructor.name.toLowerCase()
  let type = typeof uniform

  if (type == "boolean")
    return UniformTypes.BOOL
  if (type == "number")
    return UniformTypes.FLOAT
  if (type == "object") {
    if (name === "vec2")
      return UniformTypes.VEC2
    if (name === "vector3")
      return UniformTypes.VEC3
    if (name === "vec4" || name === "color")
      return UniformTypes.VEC4
    if (name === "mat2")
      return UniformTypes.MAT2
    if (name === "mat3")
      return UniformTypes.MAT3
    if (name === "matrix4")
      return UniformTypes.MAT4
    if (name === "texture")
      return UniformTypes.TEXTURE
    if (name === "array") {
      let eltype = typeOfUniform(uniform[0])
      return convertToArrUniType(eltype)
    }
    return UniformTypes.ARR
    if (name === "object")
      return UniformTypes.STRUCT
    //Todo : add UBO for objects here
  }
  throw "Unsupported type of uniform value  \'" + name + "\'";
}

function convertToArrUniType(type) {
  switch (type) {
    case UniformTypes.INT:
      return UniformTypes.ARR_INT
    case UniformTypes.FLOAT:
      return UniformTypes.ARR_FLOAT
    case UniformTypes.BOOL:
      return UniformTypes.ARR_BOOL
    case UniformTypes.MAT4:
      return UniformTypes.ARR_MAT4
    case UniformTypes.MAT3:
      return UniformTypes.ARR_MAT3
    case UniformTypes.VEC2:
      return UniformTypes.ARR_VEC2
    case UniformTypes.VEC3:
      return UniformTypes.ARR_VEC3
    case UniformTypes.VEC4:
      return UniformTypes.ARR_VEC4
    default:
      return 0
  }
}
/**
 * @param {WebGL2RenderingContext} gl
 */
export class UBO {
  constructor(gl, name, point, bufSize, aryCalc) {
    this.items = {}

    for (var i = 0; i < aryCalc.length; i++) {
      this.items[aryCalc[i].name] = { offset: aryCalc[i].offset, size: aryCalc[i].dataLen / 4 };
    }

    this.name = name;
    this.point = point;
    this.buffer = gl.createBuffer();

    gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer)
    gl.bufferData(gl.UNIFORM_BUFFER, bufSize, gl.DYNAMIC_DRAW)
    gl.bindBuffer(gl.UNIFORM_BUFFER, null)
    gl.bindBufferBase(gl.UNIFORM_BUFFER, point, this.buffer)

  }
  /**
   * @param {string} name
   * @param {Float32Array} data
   */
  update(gl, name, data) {
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
    gl.bufferSubData(gl.UNIFORM_BUFFER,
      this.items[name].offset, data, 0,
      this.items[name].size
    );
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    return this;
  }

  static getSize(type) { //[Alignment,Size]
    switch (type) {
      case UniformTypes.INT:
      case UniformTypes.FLOAT:
      case UniformTypes.BOOL:
        return 4
      case UniformTypes.MAT4:
        return 64 //16*4
      case UniformTypes.MAT3:
        return 48 //16*3
      case UniformTypes.VEC2:
        return 8
      case UniformTypes.VEC3:
        return 16 //Special Case
      case UniformTypes.VEC4:
        return 16
      default:
        return 0
    }
  }

  static calculate(ary) {
    let chunk = 16,
      i = 0,
      tsize = 0,
      offset = 0,
      size,
      data = []
    for (let name in ary) {
      data.push({
        name: "",
        offset: 0,
        dataLen: 0,
        chunkLen: 0,
      })
    }


    for (let name in ary) {
      let type = typeOfUniform(ary[name])
      size = UBO.getSize(type)
      tsize = chunk - size;

      if (tsize < 0 && chunk < 16) {
        offset += chunk;
        if (i > 0) data[i - 1].chunkLen += chunk
        chunk = 16
      } else if (tsize < 0 && chunk == 16) {} else if (tsize == 0) {
        if (type == UniformTypes.VEC3 && chunk == 16) chunk -= 12;
        else chunk = 16;

      } else chunk -= size
      data[i].offset = offset
      data[i].chunkLen = size
      data[i].dataLen = size
      data[i].name = name
      offset += size
      i++
    }
    return [data, offset];
  }

  static debugVisualize(ubo) {
    let str = "",
      chunk = 0,
      tchunk = 0,
      itm = null
    if (ubo !== void 0) console.log(ubo);
    for (let i in ubo.items) {
      itm = ubo.items[i]

      chunk = itm.dataLen / 4;
      for (let x = 0; x < chunk; x++) {
        str += (x == 0 || x == chunk - 1) ? "||." + i + "." : "||...."; //Display the index
        tchunk++;
        if (tchunk % 4 == 0) str += "|\n";
      }
      i++
    }

    if (tchunk % 4 != 0) str += "|";

    console.log(str);
  }
}
export function createUBO(gl, name, point, uniforms) {
  var [data, bufSize] = UBO.calculate(uniforms);
  let ubo = new UBO(gl, name, point, bufSize, data);

  return ubo
}