export class FrameBuffer {
  initResize = true
  constructor(width, height) {
    this.width = width
    this.height = height
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  createColorBuffer(gl, attachmentIndex) {
    this.colorBuffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.colorBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Stretch image to X position
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Stretch image to Y position

    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentIndex, gl.TEXTURE_2D, this.colorBuffer, 0);
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  depthBuffer(gl) {
    this.depth = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depth);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.idth, this.height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depth);
    return this;
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  init(gl) {
    this.buffer = createFrameBuffer(gl)
    
    if(this.initResize){
      this.width = gl.canvas.width
      this.height = gl.canvas.height
    }
    
    
    validateFrameBuffer(gl)
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  activate(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  deactivate(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
  readPixels(gl, x, y) {
    var p = new Uint8Array(4);
    gl.bindFramebuffer(gl.FRAMEBUFFER,this.buffer);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return p;
  }
  clear(gl){
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
  dispose(gl) {
    gl.deleteRenderbuffer(this.depth);
    gl.deleteTexture(this.texColor);
    gl.deleteFramebuffer(this.id);
  }
}
/**
 * @param {WebGL2RenderingContext} gl
 */
function createFrameBuffer(gl) {
  let buffer = gl.createFramebuffer()

}
function validateFrameBuffer(gl){
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
}