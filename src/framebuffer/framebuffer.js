export class FrameBuffer {
  buffer
  colorBuffers = {}
  aryDrawBuf = []
  width = 0
  height = 0
  constructor(width, height) {
    this.width = width
    this.height = height
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  init(gl) {
    this.buffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
    if (this.initResize) {
      this.width = gl.canvas.width
      this.height = gl.canvas.height
    }
    return this
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  finalize(gl) {
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return this
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  texColorBuffer(
    gl,
    name,
    colorIndex,
    format = gl.RGBA,
    type = gl.UNSIGNED_BYTE) {
    var texture = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, format, this.width, this.height, 0, gl.RGBA, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + colorIndex, gl.TEXTURE_2D, texture, 0);

    //Save Attachment to enable on finalize
    this.aryDrawBuf.push(gl.COLOR_ATTACHMENT0 + colorIndex);
    this.colorBuffers[name] = texture;
    return this;
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  depthBuffer(gl) {
    this.depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
      this.width, this.height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    return this;
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  texDepthBuffer(gl) {
    let texture = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT16, this.width, this.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture, 0);

    this.depthBuffer = texture
    return this;
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  activate(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
    gl.drawBuffers(this.aryDrawBuf)
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  deactivate(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.drawBuffers([gl.COLOR_ATTACHMENT0])
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  readPixels(
    gl, x = 0, y = 0,
    w = this.height, h = this.width
  ) {
    var p = new Uint8Array(4 * (w - x) * (h - y));
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return p;
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  clear(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
  update(gl) {

  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  copy(gl, framebuffer) {
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, framebuffer.buffer);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer);

    gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0]);
    gl.blitFramebuffer(
      0, 0, framebuffer.width, framebuffer.height,
      0, 0, this.width, this.height,
      gl.COLOR_BUFFER_BIT, gl.NEAREST
    )

    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  dispose(gl) {
    gl.deleteRenderbuffer(this.depth);
    gl.deleteTexture(this.texColor);
    gl.deleteFramebuffer(this.id);
  }
}

export function validateFrameBuffer(gl,framebuffer) {
  gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer.buffer)
  switch (gl.checkFramebufferStatus(gl.FRAMEBUFFER)) {
    case gl.FRAMEBUFFER_COMPLETE:
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
      console.log("FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
      console.log("FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
      console.log("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
      break;
    case gl.FRAMEBUFFER_UNSUPPORTED:
      console.log("FRAMEBUFFER_UNSUPPORTED");
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
      console.log("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
      break;
    case gl.RENDERBUFFER_SAMPLES:
      console.log("RENDERBUFFER_SAMPLES");
      break;
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER,null)
}