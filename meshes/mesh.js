import { Transform3D } from "../math/transform.js"
import {
  UNI_CAM_MAT,
  UNI_PROJ_MAT,
  UNI_MODEL_MAT,
  ATTR_POSITION_NAME
} from "../constants.js"

export class Mesh {
  transform = new Transform3D()
  constructor(geometry, material) {
    this.geometry = geometry
    this.material = material
  }
  init(gl,camera) {
    this.material.setUniform(UNI_MODEL_MAT,this.transform.matrix)
    this.material.setUniform(UNI_PROJ_MAT,camera.projection)
    this.material.setUniform(UNI_CAM_MAT,camera.transform.matrix)
    this.material.init(gl)
    this.geometry.init(gl,this.material.program)
    
  }
  update() {
    this.transform.updateMatrix()
  }
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {Mat4} view
   */
  renderGL(gl,  view, projection) {
    let material = this.material
    let geometry = this.geometry
    let attributes = geometry.attributes
    let drawMode = material.drawMode
    
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