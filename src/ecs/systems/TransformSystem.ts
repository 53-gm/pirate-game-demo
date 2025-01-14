import { EntityManager } from "../EntityManager";
import { Object3DComponent } from "../components/Object3DComponent";
import { TransformComponent } from "../components/TransformComponent";

export class TransformSystem {
  constructor(private em: EntityManager) {}

  update() {
    const entities = this.em.queryEntities("Transform", "Object3D");
    for (const e of entities) {
      const transform = this.em.getComponent<TransformComponent>(
        e,
        "Transform"
      );
      const objComp = this.em.getComponent<Object3DComponent>(e, "Object3D");
      if (!transform || !objComp) continue;

      objComp.object.position.set(transform.x, transform.y, transform.z);

      objComp.object.rotation.set(
        transform.rotX,
        transform.rotY,
        transform.rotZ
      );
    }
  }
}
