import { createVAO } from "../functions.js"

export class Geometry {
  constructor(positions = [], indices, normals, uv) {
    this._VAO = null
    this._attribute = {}
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  init(gl) {
    this._VAO = createVAO(gl,
      this._attribute["indices"],
      this._attribute["position"],
      this._attribute["normal"],
      this._attribute["uv"]
    )
  }
  setAttribute(name, attribute) {
    this.attribute[name] = attribute
    return this
  }
  get attribute() {
    return this._attribute
  }
  get attr(){
    return this._VAO
  }
}