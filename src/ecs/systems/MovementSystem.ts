import { EntityManager } from "../EntityManager";
import { TransformComponent } from "../components/TransformComponent";
import { VelocityComponent } from "../components/VelocityComponent";

export class MovementSystem {
  constructor(private em: EntityManager) {}

  update(dt: number) {
    const entities = this.em.queryEntities("Transform", "Velocity");
    for (const e of entities) {
      const transform = this.em.getComponent<TransformComponent>(
        e,
        "Transform"
      );
      const velocity = this.em.getComponent<VelocityComponent>(e, "Velocity");
      if (!transform || !velocity) continue;

      transform.x += velocity.vx * dt;
      transform.y += velocity.vy * dt;
      transform.z += velocity.vz * dt;
    }
  }
}
