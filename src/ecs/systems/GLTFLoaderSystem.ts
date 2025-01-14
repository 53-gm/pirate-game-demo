// GLTFLoaderSystem.ts
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { EntityManager } from "../EntityManager";
import { GLTFLoadRequestComponent } from "../components/GLTFLoadRequestComponent";
import { Object3DComponent } from "../components/Object3DComponent";

export class GLTFLoaderSystem {
  private loader: GLTFLoader;

  constructor(private em: EntityManager, private scene: THREE.Scene) {
    this.loader = new GLTFLoader();
  }

  update() {
    const entities = this.em.queryEntities("GLTFLoadRequest");
    for (const e of entities) {
      const request = this.em.getComponent<GLTFLoadRequestComponent>(
        e,
        "GLTFLoadRequest"
      );
      if (!request) continue;

      if (request.loaded === "notYet") {
        request.loaded = "loading";
        this.loader.load(
          request.url,
          (gltf) => {
            const root = gltf.scene;
            root.scale.set(0.05, 0.05, 0.05);
            this.scene.add(root);

            this.em.addComponent<Object3DComponent>(e, "Object3D", {
              object: root,
            });

            request.loaded = "done";
          },
          undefined,
          (err) => {
            console.error("Error loading GLTF:", err);
            request.loaded = "error";
          }
        );
      }
    }
  }
}
