import { Transform } from "../math/transform.js"
import {
  UNI_CAM_MAT,
  UNI_PROJ_MAT,
  UNI_MODEL_MAT,
  ATTR_POSITION_NAME
} from "../constants.js"

export class Mesh {
  transform = new Transform()
  constructor(geometry, material) {
    this.geometry = geometry
    this.material = material
  }
  init(gl,camera) {
    this.material.setUniform(UNI_MODEL_MAT,this.transform.matrix)
    this.material.setUniform(UNI_PROJ_MAT,camera.projection)
    this.material.setUniform(UNI_CAM_MAT,camera.transform.matrix)
    this.geometry.init(gl)
    this.material.init(gl)
  }
  update() {
    this.transform.updateMatrix()
  }
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {Matrix} view
   */
  renderGL(gl,  view, projection) {
    let material = this.material
    let geometry = this.geometry
    let attributes = geometry.attributes

    //TODO - make this a prop of material.
    let drawMode = gl.LINE_LOOP

    //preping uniforms and activating program
    material.activate(gl)
    gl.bindVertexArray(this.geometry.VAO)
    
    material.updateUniform(UNI_MODEL_MAT,this.transform.matrix)
    material.updateUniform(UNI_PROJ_MAT,projection)
    material.updateUniform(UNI_CAM_MAT,view)
    
    //drawing
    if (attributes.indices) {
      gl.drawElements(drawMode,
        attributes["indices"].count,
        gl.UNSIGNED_SHORT, 0
      );
    } else {
      gl.drawArrays(drawMode, 0,
        attributes[ATTR_POSITION_NAME].count
      )
    }
    gl.bindVertexArray(null)
    material.deactivate(gl)
  }
}