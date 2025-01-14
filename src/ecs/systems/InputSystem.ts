import { EntityManager } from "../EntityManager";
import { InputComponent } from "../components/InputComponent";

export class InputSystem {
  private keys: Record<string, boolean> = {};

  constructor(private em: EntityManager) {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
  }

  update() {
    const entities = this.em.queryEntities("Input");
    for (const e of entities) {
      const inputComp = this.em.getComponent<InputComponent>(e, "Input");
      if (!inputComp) continue;
      inputComp.forward = !!this.keys["KeyW"];
      inputComp.backward = !!this.keys["KeyS"];
      inputComp.left = !!this.keys["KeyA"];
      inputComp.right = !!this.keys["KeyD"];
      inputComp.shoot = !!this.keys["Space"];
    }
  }
}
