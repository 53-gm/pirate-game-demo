import { EntityManager } from "../EntityManager";
import { BulletComponent } from "../components/BulletComponent";

export class BulletSystem {
  constructor(private em: EntityManager) {}

  update(dt: number) {
    const bullets = this.em.queryEntities("Bullet");
    for (const b of bullets) {
      const bullet = this.em.getComponent<BulletComponent>(b, "Bullet");
      if (!bullet) continue;

      bullet.timeToLive -= dt;
      if (bullet.timeToLive <= 0) {
        this.em.removeEntity(b);
      }
    }
  }
}
