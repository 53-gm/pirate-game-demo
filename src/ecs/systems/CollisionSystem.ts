// src/ecs/systems/CollisionSystem.ts
import { EntityManager } from "../EntityManager";
import { BulletComponent } from "../components/BulletComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { TransformComponent } from "../components/TransformComponent";

export class CollisionSystem {
  constructor(private em: EntityManager) {}

  update() {
    this.checkBulletEnemyCollision();
    this.checkBulletPlayerCollision();
    this.checkPlayerEnemyCollision();
  }

  private checkBulletEnemyCollision() {
    const bullets = this.em.queryEntities("Bullet", "Transform");
    const enemies = this.em.queryEntities("Enemy", "Transform");

    for (const b of bullets) {
      const bulletComp = this.em.getComponent<BulletComponent>(b, "Bullet");
      const bulletTrans = this.em.getComponent<TransformComponent>(
        b,
        "Transform"
      );
      if (!bulletComp || !bulletTrans) continue;
      if (bulletComp.owner !== "player") continue;

      for (const e of enemies) {
        const enemyComp = this.em.getComponent<EnemyComponent>(e, "Enemy");
        const enemyTrans = this.em.getComponent<TransformComponent>(
          e,
          "Transform"
        );
        if (!enemyComp || !enemyTrans) continue;

        const dx = bulletTrans.x - enemyTrans.x;
        const dy = bulletTrans.y - enemyTrans.y;
        const dz = bulletTrans.z - enemyTrans.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        const sumRadius = bulletComp.radius + enemyComp.radius;
        if (distSq <= sumRadius * sumRadius) {
          console.log(`Player bullet ${b} hit Enemy ${e}`);

          enemyComp.hp -= 1;
          console.log(`Enemy ${e} HP = ${enemyComp.hp}`);

          this.em.removeEntity(b);

          if (enemyComp.hp <= 0) {
            console.log(`Enemy ${e} died`);
            this.em.removeEntity(e);
          }

          break;
        }
      }
    }
  }

  private checkBulletPlayerCollision() {
    const bullets = this.em.queryEntities("Bullet", "Transform");
    const players = this.em.queryEntities("Player", "Transform");

    for (const b of bullets) {
      const bulletComp = this.em.getComponent<BulletComponent>(b, "Bullet");
      const bulletTrans = this.em.getComponent<TransformComponent>(
        b,
        "Transform"
      );
      if (!bulletComp || !bulletTrans) continue;
      if (bulletComp.owner !== "enemy") continue;

      for (const p of players) {
        const playerComp = this.em.getComponent<PlayerComponent>(p, "Player");
        const playerTrans = this.em.getComponent<TransformComponent>(
          p,
          "Transform"
        );
        if (!playerComp || !playerTrans) continue;
        const dx = bulletTrans.x - playerTrans.x;
        const dy = bulletTrans.y - playerTrans.y;
        const dz = bulletTrans.z - playerTrans.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        const sumRadius = bulletComp.radius + playerComp.radius;
        if (distSq <= sumRadius * sumRadius) {
          const playerStats = this.em.getComponent<PlayerComponent>(
            p,
            "Player"
          );
          if (playerStats) {
            playerStats.hp -= 1;
            if (playerStats.hp <= 0) {
              console.log(`Player ${p} died`);
              this.em.removeEntity(p);
            }
          }
          this.em.removeEntity(b);
          break;
        }
      }
    }
  }

  private checkPlayerEnemyCollision() {
    const players = this.em.queryEntities("Player", "Transform");
    const enemies = this.em.queryEntities("Enemy", "Transform");

    for (const p of players) {
      const playerComp = this.em.getComponent<PlayerComponent>(p, "Player");
      const playerTrans = this.em.getComponent<TransformComponent>(
        p,
        "Transform"
      );
      if (!playerComp || !playerTrans) continue;

      for (const e of enemies) {
        const enemyComp = this.em.getComponent<EnemyComponent>(e, "Enemy");
        const enemyTrans = this.em.getComponent<TransformComponent>(
          e,
          "Transform"
        );
        if (!enemyComp || !enemyTrans) continue;
        const dx = playerTrans.x - enemyTrans.x;
        const dy = playerTrans.y - enemyTrans.y;
        const dz = playerTrans.z - enemyTrans.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        const sumRadius = playerComp.radius + enemyComp.radius;
        if (distSq <= sumRadius * sumRadius) {
          const playerStats = this.em.getComponent<PlayerComponent>(
            p,
            "Player"
          );
          if (playerStats) {
            playerStats.hp -= 1;
            if (playerStats.hp <= 0) {
              console.log(`Player ${p} died`);
              this.em.removeEntity(p);
            }
          }
        }
      }
    }
  }
}
