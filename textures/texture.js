import { TextureWrap, TextureFormat, TextureFilter, GlDataType } from '../constants.js';

export class Texture {
  /**
   * @type {WebGLTexture}
   */
  webglTex = null
  /**
   * @param {TextureSettings} setting
   */
  constructor(settings = {}) {
    settings.generateMipmaps = settings.generateMipmaps ?? true
    settings.wrapS = settings.wrapS ?? TextureWrap.REPEAT
    settings.wrapT = settings.wrapT ?? TextureWrap.REPEAT
    settings.minfilter = settings.minfilter ?? TextureFilter.LINEAR
    settings.magfilter = settings.magfilter ?? TextureFilter.LINEAR
    settings.format = settings.format ?? TextureFormat.RGBA
    settings.internalFormat = settings.internalFormat ?? TextureFormat.RGBA
    settings.dataFormat = settings.dataFormat ?? GlDataType.UNSIGNED_BYTE
    settings.src = settings.src || ""
    this.settings = settings
  }
  /**
   * @param {WebGLRenderingContext} gl
   */
  init(gl) {
    this.webglTex = loadTexture(gl, this.settings)
  }
  /**
   * @param {WebGLRenderingContext} gl
   */
  use(gl, index = 0) {
    gl.activeTexture(gl.TEXTURE0 + index)
    gl.bindTexture(gl.TEXTURE_2D, this.webglTex)
  }
}
/**
 * @param {WebGLRenderingContext} gl
 * @param {string} url
 * @param {Required<TextureSettings>} settings
 */
function loadTexture(gl, settings) {
  const texture = gl.createTexture()
  const level = 0
  const width = 1
  const height = 1
  const border = 0
  const pixel = new Uint8Array([255, 0, 255, 255])

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    settings.internalFormat,
    width,
    height,
    border,
    settings.format,
    settings.dataFormat,
    pixel,
  );

  const image = new Image();
  image.src = settings.src
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      settings.internalFormat,
      settings.format,
      settings.dataFormat,
      image,
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, settings.wrapS)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, settings.wrapT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, settings.minfilter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, settings.magfilter)
    if (settings.generateMipmap)
      gl.generateMipmap(gl.TEXTURE_2D)
  }
  return texture;
}
/***
 * @typedef TextureSettings
 * @property {string} src
 * @property {boolean} [generatemipmap=true]
 * @property {TextureWrap} [wraps]
 * @property {TextureWrap} [wrapT]
 * @property {TextureFormat} [internalFormat]
 * @property {TextureFormat} [format]
 * @property {TextureFilter} [minfilter]
 * @property {TextureFilter.LINEAR | TextureFilter.NEAREST} [magfilter]
 * @property {GlDataType} dataFormat
 */