import { Camera } from "./camera.js"
import { createUBO } from "./functions.js"

export class Renderer {
  _ubocounter = 0
  _UBOs = {}
  meshes = []
  camera = new Camera()
  domElement = null

  gl = null
  dpr = 0
  culling = true
  constructor(canvas) {
    this.domElement = canvas || document.createElement("canvas")
    this.dpr = devicePixelRatio
    /**
     * @type {WebGL2RenderingContext}
     */
    this.gl = canvas.getContext("webgl2")
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)

    if (this.culling) {
      this.gl.enable(this.gl.CULL_FACE)
      this.gl.cullFace(this.gl.FRONT)
    }
    this.setGlobalUBO("camera", {
      "view": this.camera.view,
      "projection": this.camera.projection
    })
  }
  setGlobalUBO(name, data) {
    this._UBOs[name] = createUBO(
      this.gl, name, this.getUBOpoint(), data
    )
  }
  getUBOpoint() {
    return this._ubocounter++;
  }
  updateUBO(uboName, name, value) {
    let data = new Float32Array(16)
    if (typeof value !== "object")
      data = value
    else
      value.toArray(data)

    if (uboName in this._UBOs) {
      let ubo = this._UBOs[uboName]
      ubo.update(
        this.gl, name, data
      )
    }
  }

  add(mesh) {
    mesh.init(this.gl, this.camera)
    for (var name in this._UBOs) {
      let ubo = this._UBOs[name]

      mesh.material.prepareUBO(this.gl, ubo)
    }

    this.meshes.push(mesh)
  }
  remove(mesh) {
    let id = this.meshes.indexOf(mesh)
    this.meshes.splice(id, 1)
  }
  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }
  update() {
    this.clear()
    if (this.camera) {
      this.camera.updateMatrix()
      this.updateUBO(
        "camera", "view", this.camera.view
      )
      this.updateUBO(
        "camera", "projection", this.camera.projection
      )
    }
    for (var i = 0; i < this.meshes.length; i++) {
      this.meshes[i].update()
      this.meshes[i].renderGL(this.gl, this.camera.view, this.camera.projection)
    }
  }
  setViewport(w, h) {
    let canvas = this.gl.canvas
    canvas.style.width = w + "px"
    canvas.style.height = h + "px"
    canvas.width = w * this.dpr
    canvas.height = h * this.dpr
    this.gl.viewport(0, 0,
      w * this.dpr,
      h * this.dpr
    )
  }
}