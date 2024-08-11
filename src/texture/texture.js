export class Texture {
  /**
   * @readonly
   * @type {WebGLTexture}
   */
  webglTex
  /**
   * @param {WebGLTexture} tex
   */
  constructor(tex) {
    this.webglTex = tex
  }
  /**
   * @param {WebGLRenderingContext} gl
   */
  use(gl, index = 0) {
    gl.activeTexture(gl.TEXTURE0 + index)
    gl.bindTexture(gl.TEXTURE_2D, this.webglTex)
  }
}
