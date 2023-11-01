import { Transform } from "../math/transform.js"
import {
  UNI_CAM_MAT,
  UNI_PROJ_MAT,
  UNI_MODEL_MAT
} from "../constants.js"

export class Mesh {
  transform = new Transform()
  constructor(geometry, material) {
    this.geometry = geometry
    this.material = material
  }
  init(gl) {
    this.geometry.init(gl)
    this.material.init(gl)
    console.log(this.geometry.attributes)
  }
  update() {
    this.transform.updateMatrix()
  }
  /**
   * @param {WebGL2RenderingContext} gl
   */
  renderGL(gl, camera, projection) {
    let material = this.material
    let geometry = this.geometry
    let attributes = geometry.attributes

    //TODO - make this a prop of material.
    let drawMode = gl.LINE_LOOP

    //preping uniforms and activating program
    material.activate(gl)
    gl.bindVertexArray(this.geometry.VAO)

    gl.uniformMatrix4fv(
      material.uniformLoc[UNI_CAM_MAT], false, camera.raw
    )
    gl.uniformMatrix4fv(
      material.uniformLoc[UNI_PROJ_MAT], false, projection.raw
    )
    gl.uniformMatrix4fv(
      material.uniformLoc[UNI_MODEL_MAT], false, this.transform.matrix.raw
    )

    //drawing
    if (attributes.indices) {
      gl.drawElements(drawMode,
        attributes["indices"].count,
        gl.UNSIGNED_SHORT, 0
      );
    } else {
      gl.drawArrays(drawMode, 0,
        attributes['position'].count
      )
    }
    gl.bindVertexArray(null)
    material.deactivate(gl)
    
  }
}