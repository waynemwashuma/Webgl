export class Texture {
  webglTex = null
  /**
   * @type {string}
   */
  src = null
  /**
   * @param {HTMLImageElement} gl
   */
  constructor(url) {
    this.src = url
  }
  /**
   * @param {WebGLRenderingContext} gl
   */
  init(gl) {
    if(this.webglTex) return
    let texture = loadTexture(gl, this.src)
    this.webglTex = texture
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
 */
function loadTexture(gl, url) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);

  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    1,
    1,
    0,
    srcFormat,
    srcType,
    pixel,
  );

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image,
    )

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  }
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}