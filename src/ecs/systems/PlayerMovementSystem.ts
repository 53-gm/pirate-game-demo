import { EntityManager } from "../EntityManager";
import { InputComponent } from "../components/InputComponent";
import { TransformComponent } from "../components/TransformComponent";
import { VelocityComponent } from "../components/VelocityComponent";

export class PlayerMovementSystem {
  private speed = 100.0;
  private turnSpeed = 6.0;

  constructor(private em: EntityManager) {}

  update(dt: number) {
    const entities = this.em.queryEntities("Input", "Transform", "Velocity");
    for (const e of entities) {
      const input = this.em.getComponent<InputComponent>(e, "Input");
      const transform = this.em.getComponent<TransformComponent>(
        e,
        "Transform"
      );
      const velocity = this.em.getComponent<VelocityComponent>(e, "Velocity");
      if (!input || !transform || !velocity) continue;

      let vx = 0;
      let vz = 0;
      if (input.forward) {
        vz += 1;
      }
      if (input.backward) {
        vz -= 1;
      }
      if (input.left) {
        vx += 1;
      }
      if (input.right) {
        vx -= 1;
      }

      const len = Math.sqrt(vx * vx + vz * vz);
      if (len > 0) {
        vx = (vx / len) * this.speed;
        vz = (vz / len) * this.speed;
      }

      velocity.vx = vx;
      velocity.vz = vz;

      if (len > 0) {
        const desiredAngle = Math.atan2(vx, vz);
        transform.rotY = this.approachAngle(
          transform.rotY,
          desiredAngle,
          this.turnSpeed,
          dt
        );
      }
    }
  }

  private approachAngle(
    current: number,
    desired: number,
    turnSpeed: number,
    dt: number
  ): number {
    let diff = this.normalizeAngle(desired - current);

    const maxStep = turnSpeed * dt;

    if (Math.abs(diff) <= maxStep) {
      return desired;
    }

    return this.normalizeAngle(current + Math.sign(diff) * maxStep);
  }

  private normalizeAngle(angle: number): number {
    angle = angle % (Math.PI * 2);
    if (angle > Math.PI) {
      angle -= Math.PI * 2;
    } else if (angle <= -Math.PI) {
      angle += Math.PI * 2;
    }
    return angle;
  }
}
