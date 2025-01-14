// src/ecs/systems/EnemyShootSystem.ts
import * as THREE from "three";
import { EntityManager } from "../EntityManager";
import { BulletComponent } from "../components/BulletComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { EnemyShootComponent } from "../components/EnemyShootComponent";
import { Object3DComponent } from "../components/Object3DComponent";
import { TransformComponent } from "../components/TransformComponent";
import { VelocityComponent } from "../components/VelocityComponent";

export class EnemyShootSystem {
  private bulletSpeed = 70.0; // 弾の速度
  private bulletRadius = 4; // 弾の半径

  constructor(private em: EntityManager, private scene: THREE.Scene) {}

  update(currentTime: number) {
    const enemies = this.em.queryEntities("Enemy", "Transform", "EnemyShoot");
    for (const e of enemies) {
      const shootComp = this.em.getComponent<EnemyShootComponent>(
        e,
        "EnemyShoot"
      );
      const enemyComp = this.em.getComponent<EnemyComponent>(e, "Enemy");
      const enemyTrans = this.em.getComponent<TransformComponent>(
        e,
        "Transform"
      );
      if (!shootComp || !enemyComp || !enemyTrans) continue;

      if (currentTime >= shootComp.lastShootTime + shootComp.shootCooldown) {
        this.spawnEnemyBullet(enemyTrans);
        shootComp.lastShootTime = currentTime;
      }
    }
  }

  private spawnEnemyBullet(enemyTrans: TransformComponent) {
    const bulletE = this.em.createEntity();

    this.em.addComponent<BulletComponent>(bulletE, "Bullet", {
      radius: this.bulletRadius,
      timeToLive: 7.0,
      owner: "enemy",
    });

    this.em.addComponent<TransformComponent>(bulletE, "Transform", {
      x: enemyTrans.x,
      y: enemyTrans.y + 1.0,
      z: enemyTrans.z,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
    });

    const geometry = new THREE.SphereGeometry(this.bulletRadius, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(enemyTrans.x, enemyTrans.y + 1.0, enemyTrans.z);
    this.scene.add(mesh);

    this.em.addComponent<Object3DComponent>(bulletE, "Object3D", {
      object: mesh,
    });

    const players = this.em.queryEntities("Player", "Transform");
    if (players.length === 0) {
      console.warn("Player not found. Enemy bullet will not move.");
      return;
    }

    const playerE = players[0];
    const playerTrans = this.em.getComponent<TransformComponent>(
      playerE,
      "Transform"
    );
    if (!playerTrans) return;

    const dx = playerTrans.x - enemyTrans.x;
    const dz = playerTrans.z - enemyTrans.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance === 0) return;

    const vx = (dx / distance) * this.bulletSpeed;
    const vz = (dz / distance) * this.bulletSpeed;

    this.em.addComponent<VelocityComponent>(bulletE, "Velocity", {
      vx,
      vy: 0,
      vz,
    });
  }
}
