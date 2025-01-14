import * as THREE from "three";
import { Sky } from "three/addons/objects/Sky.js";
import { Water } from "three/addons/objects/Water.js";

// 太陽光のパラメータ
const parameters = {
  elevation: 0.3,
  azimuth: 180,
};

export class EnvironmentManager {
  private water?: Water;
  private sun: THREE.Vector3;
  private sky?: Sky;

  constructor(private scene: THREE.Scene) {
    this.sun = new THREE.Vector3();
  }

  init() {
    this.createWater();
    this.createSky();
  }

  private createWater() {
    const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
    this.water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "textures/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
    });

    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = 0;
    this.scene.add(this.water);
  }

  private createSky() {
    this.sky = new Sky();
    this.sky.scale.setScalar(10000);
    this.scene.add(this.sky);

    const skyUniforms = this.sky.material.uniforms;
    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;
  }

  update(deltaTime: number) {
    if (this.water) {
      this.water.material.uniforms["time"].value += deltaTime;
    }

    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);

    this.sun.setFromSphericalCoords(1, phi, theta);

    this.sky?.material.uniforms["sunPosition"].value.copy(this.sun);
    this.water?.material.uniforms["sunDirection"].value
      .copy(this.sun)
      .normalize();
  }
}
