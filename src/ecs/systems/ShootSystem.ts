import * as THREE from "three";
import { EntityManager } from "../EntityManager";
import { BulletComponent } from "../components/BulletComponent";
import { InputComponent } from "../components/InputComponent";
import { Object3DComponent } from "../components/Object3DComponent";
import { PlayerStatsComponent } from "../components/PlayerStatsComponent";
import { TransformComponent } from "../components/TransformComponent";
import { VelocityComponent } from "../components/VelocityComponent";

export class ShootSystem {
  private bulletSpeed = 200;
  private currentTime = 0;

  constructor(private em: EntityManager, private scene: THREE.Scene) {}

  update(dt: number) {
    this.currentTime += dt;
    const players = this.em.queryEntities("Input", "Transform", "PlayerStats");
    for (const p of players) {
      const input = this.em.getComponent<InputComponent>(p, "Input");
      const transform = this.em.getComponent<TransformComponent>(
        p,
        "Transform"
      );
      const stats = this.em.getComponent<PlayerStatsComponent>(
        p,
        "PlayerStats"
      );
      if (!input || !transform || !stats) continue;

      if (input.shoot && this.currentTime >= stats.nextShootTime) {
        this.spawnBullet(transform);

        stats.nextShootTime = this.currentTime + stats.shootCooldown;
      }
    }
  }

  private spawnBullet(playerTransform: TransformComponent) {
    const bulletE = this.em.createEntity();

    const offsetDist = 1.0;
    const offsetX = Math.sin(playerTransform.rotY) * offsetDist;
    const offsetZ = -Math.cos(playerTransform.rotY) * offsetDist;

    this.em.addComponent<TransformComponent>(bulletE, "Transform", {
      x: playerTransform.x + offsetX,
      y: playerTransform.y + 1.0,
      z: playerTransform.z + offsetZ,
      rotX: 0,
      rotY: playerTransform.rotY,
      rotZ: 0,
    });

    const vx = Math.sin(playerTransform.rotY) * this.bulletSpeed;
    const vz = Math.cos(playerTransform.rotY) * this.bulletSpeed;
    this.em.addComponent<VelocityComponent>(bulletE, "Velocity", {
      vx,
      vy: 0,
      vz,
    });

    const geometry = new THREE.SphereGeometry(4, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const sphere = new THREE.Mesh(geometry, material);

    this.scene.add(sphere);
    this.em.addComponent<Object3DComponent>(bulletE, "Object3D", {
      object: sphere,
    });
    this.em.addComponent<BulletComponent>(bulletE, "Bullet", {
      timeToLive: 3.0,
      radius: 4.0,
      owner: "player",
    });

    console.log("Spawned bullet entity:", bulletE);
  }
}
