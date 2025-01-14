import { EntityManager } from "../EntityManager";
import { EnemyComponent } from "../components/EnemyComponent";
import { EnemyShootComponent } from "../components/EnemyShootComponent";
import { GLTFLoadRequestComponent } from "../components/GLTFLoadRequestComponent";
import { TransformComponent } from "../components/TransformComponent";

export class EnemySpawnSystem {
  private spawnInterval = 1.8;
  private currentTime = 0;
  private nextSpawnTime = 0;

  private minSpawnDistance = 300;
  private maxSpawnDistance = 500;

  private minCooltime = 2.0;
  private maxCooltime = 5.0;

  constructor(private em: EntityManager) {}

  update(dt: number) {
    this.currentTime += dt;
    if (this.currentTime >= this.nextSpawnTime) {
      this.spawnEnemy();

      this.nextSpawnTime = this.currentTime + this.spawnInterval;
    }
  }

  private spawnEnemy() {
    const players = this.em.queryEntities("Player", "Transform");
    const playerE = players[0];

    const playerTrans = this.em.getComponent<TransformComponent>(
      playerE,
      "Transform"
    );
    if (!playerTrans) return;

    const angle = Math.random() * Math.PI * 2;
    const distance =
      this.minSpawnDistance +
      Math.random() * (this.maxSpawnDistance - this.minSpawnDistance);

    const spawnX = playerTrans.x + Math.cos(angle) * distance;
    const spawnZ = playerTrans.z + Math.sin(angle) * distance;
    const spawnY = 0;

    const enemyE = this.em.createEntity();

    this.em.addComponent<EnemyComponent>(enemyE, "Enemy", {
      hp: 2,
      radius: 15,
      speed: 16.0,
    });

    const cooltime =
      this.minCooltime + Math.random() * (this.maxCooltime - this.minCooltime);

    this.em.addComponent<EnemyShootComponent>(enemyE, "EnemyShoot", {
      shootCooldown: cooltime,
      lastShootTime: this.currentTime,
    });

    this.em.addComponent<TransformComponent>(enemyE, "Transform", {
      x: spawnX,
      y: spawnY,
      z: spawnZ,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
    });

    this.em.addComponent<GLTFLoadRequestComponent>(enemyE, "GLTFLoadRequest", {
      url: "models/ship-pirate-medium.gltf",
      loaded: "notYet",
    });
  }
}
