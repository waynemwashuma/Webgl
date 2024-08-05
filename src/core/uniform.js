export class Uniform {
  location
  value
  size
  type
  /**
   * @param {WebGLUniformLocation} location
   * @param {*} value
   * @param {number} size
   * @param {UniformType} type
  */
  constructor(location,value,type,size){
    this.location = location
    this.value = value
    this.type = type
    this.size = size
  }
}