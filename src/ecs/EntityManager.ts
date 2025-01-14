type Entity = number;
import * as THREE from "three";
import { Object3DComponent } from "./components/Object3DComponent";

export class EntityManager {
  private nextEntityId = 0;
  private entities: Set<Entity> = new Set();
  private components: Map<Entity, Record<string, unknown>> = new Map();

  constructor(private scene: THREE.Scene) {}

  createEntity(): Entity {
    const eid = this.nextEntityId++;
    this.entities.add(eid);
    this.components.set(eid, {});
    return eid;
  }

  removeEntity(eid: Entity) {
    const compMap = this.components.get(eid);
    if (compMap && compMap["Object3D"]) {
      const obj = compMap["Object3D"] as Object3DComponent;
      if (this.scene) {
        this.scene.remove(obj.object);
      }
    }
    this.entities.delete(eid);
    this.components.delete(eid);
  }

  addComponent<T>(eid: Entity, componentName: string, data: T) {
    const compMap = this.components.get(eid);
    if (compMap) {
      compMap[componentName] = data;
    }
  }

  getComponent<T>(eid: Entity, componentName: string): T | undefined {
    const compMap = this.components.get(eid);
    return compMap ? (compMap[componentName] as T) : undefined;
  }

  queryEntities(...componentNames: string[]): Entity[] {
    const result: Entity[] = [];
    for (const eid of this.entities) {
      const compMap = this.components.get(eid);
      if (!compMap) continue;

      if (componentNames.every((name) => name in compMap)) {
        result.push(eid);
      }
    }
    return result;
  }
}
