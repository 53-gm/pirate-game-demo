import * as THREE from "three";

export class RenderSystem {
  constructor(
    private renderer: THREE.WebGLRenderer,
    private scene: THREE.Scene,
    private camera: THREE.Camera
  ) {}

  update() {
    this.renderer.render(this.scene, this.camera);
  }
}
