import { EntityManager } from "../EntityManager";
import { EnemyComponent } from "../components/EnemyComponent";
import { TransformComponent } from "../components/TransformComponent";

export class ApproachPlayerSystem {
  constructor(private em: EntityManager) {}

  update(dt: number) {
    const players = this.em.queryEntities("Player", "Transform");
    if (players.length === 0) return;

    const playerE = players[0];
    const playerTrans = this.em.getComponent<TransformComponent>(
      playerE,
      "Transform"
    );
    if (!playerTrans) return;

    const enemies = this.em.queryEntities("Enemy", "Transform");
    for (const e of enemies) {
      const enemyComp = this.em.getComponent<EnemyComponent>(e, "Enemy");
      const enemyTrans = this.em.getComponent<TransformComponent>(
        e,
        "Transform"
      );
      if (!enemyComp || !enemyTrans) continue;

      const dx = playerTrans.x - enemyTrans.x;
      const dz = playerTrans.z - enemyTrans.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > 0.01) {
        const vx = (dx / dist) * enemyComp.speed;
        const vz = (dz / dist) * enemyComp.speed;

        enemyTrans.x += vx * dt;
        enemyTrans.z += vz * dt;

        enemyTrans.rotY = Math.atan2(dx, dz);
      }
    }
  }
}
