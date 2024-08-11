import { TextureWrap, TextureFormat, TextureFilter, GlDataType } from '../constant.js';
import { Texture } from '../texture/index.js';
export class TextureLoader {
  /**
   * @private
   * @type {WebGLRenderingContext}
   */
  gl
  /**
   * @type {Map<string,Texture>}
  */
  textures = new Map()
  constructor(renderer) {
    this.gl = renderer.gl
  }
  /**
   * @param {TextureSettings} settings
   */
  load(settings) {
    settings.name = settings.name ?? settings.src
    settings.generateMipmaps = settings.generateMipmaps ?? true
    settings.flipY = settings.flipY ?? true
    settings.wrapS = settings.wrapS ?? TextureWrap.REPEAT
    settings.wrapT = settings.wrapT ?? TextureWrap.REPEAT
    settings.minfilter = settings.minfilter ?? TextureFilter.LINEAR
    settings.magfilter = settings.magfilter ?? TextureFilter.LINEAR
    settings.format = settings.format ?? TextureFormat.RGBA
    settings.internalFormat = settings.internalFormat ?? settings.format
    settings.dataFormat = settings.dataFormat ?? GlDataType.UNSIGNED_BYTE

    const tex = loadTexture(this.gl,settings)
    const texture = new Texture(tex)
    
    this.textures.set(settings.name, texture)
    
    return texture
  }
  /**
   * @param {string} name
   * @returns {Texture}
   */
  get(name){
    return this.textures.get(name)
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
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, settings.wrapS)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, settings.wrapT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, settings.minfilter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, settings.magfilter)
  const image = new Image()
  image.src = settings.src
  image.onload = () => {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, settings.flipY)
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      settings.internalFormat,
      settings.format,
      settings.dataFormat,
      image,
    )
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
 * @property {TextureWrap} [wrapR]
 * @property {TextureFormat} [internalFormat]
 * @property {TextureFormat} [format]
 * @property {TextureFilter} [minfilter]
 * @property {TextureFilter.LINEAR | TextureFilter.NEAREST} [magfilter]
 * @property {GlDataType} [dataformat]
 * @property {boolean} [flipY=true]
 */