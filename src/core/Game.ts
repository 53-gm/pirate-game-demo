import * as THREE from "three";
import { GLTFLoadRequestComponent } from "../ecs";
import { InputComponent } from "../ecs/components/InputComponent";
import { PlayerComponent } from "../ecs/components/PlayerComponent";
import { PlayerStatsComponent } from "../ecs/components/PlayerStatsComponent";
import { TransformComponent } from "../ecs/components/TransformComponent";
import { VelocityComponent } from "../ecs/components/VelocityComponent";
import { EntityManager } from "../ecs/EntityManager";
import { ApproachPlayerSystem } from "../ecs/systems/ApproachPlayerSystem";
import { BulletSystem } from "../ecs/systems/BulletSystem";
import { CollisionSystem } from "../ecs/systems/CollisionSystem";
import { EnemyShootSystem } from "../ecs/systems/EnemyShootSystem";
import { EnemySpawnSystem } from "../ecs/systems/EnemySpawnSystem";
import { GLTFLoaderSystem } from "../ecs/systems/GLTFLoaderSystem";
import { InputSystem } from "../ecs/systems/InputSystem";
import { MovementSystem } from "../ecs/systems/MovementSystem";
import { PlayerMovementSystem } from "../ecs/systems/PlayerMovementSystem";
import { RenderSystem } from "../ecs/systems/RenderSystem";
import { ShootSystem } from "../ecs/systems/ShootSystem";
import { TransformSystem } from "../ecs/systems/TransformSystem";
import { EnvironmentManager } from "./EnvironmentManager";

export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private em: EntityManager;
  private gltfLoaderSystem: GLTFLoaderSystem;
  private renderSystem: RenderSystem;
  private inputSystem: InputSystem;
  private movementSystem: MovementSystem;
  private playerMovementSystem: PlayerMovementSystem;
  private transformSystem: TransformSystem;
  private shootSystem: ShootSystem;
  private bulletSystem: BulletSystem;
  private enemySpawnSystem: EnemySpawnSystem;
  private approachPlayerSystem: ApproachPlayerSystem;
  private collisionSystem: CollisionSystem;
  private enemyShootSystem: EnemyShootSystem;

  private previousTime = 0;

  private environmentManager?: EnvironmentManager;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);

    this.camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 300, -50);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5.0);
    directionalLight.position.set(100, 200, 10);
    this.scene.add(directionalLight);

    // ECS 初期化
    this.em = new EntityManager(this.scene);

    // システム作成
    this.gltfLoaderSystem = new GLTFLoaderSystem(this.em, this.scene);
    this.inputSystem = new InputSystem(this.em);
    this.movementSystem = new MovementSystem(this.em);
    this.renderSystem = new RenderSystem(
      this.renderer,
      this.scene,
      this.camera
    );
    this.shootSystem = new ShootSystem(this.em, this.scene);
    this.transformSystem = new TransformSystem(this.em);
    this.playerMovementSystem = new PlayerMovementSystem(this.em);
    this.bulletSystem = new BulletSystem(this.em);
    this.enemySpawnSystem = new EnemySpawnSystem(this.em);
    this.approachPlayerSystem = new ApproachPlayerSystem(this.em);
    this.collisionSystem = new CollisionSystem(this.em);
    this.enemyShootSystem = new EnemyShootSystem(this.em, this.scene);

    this.environmentManager = new EnvironmentManager(this.scene);
    this.environmentManager.init();

    const player = this.em.createEntity();

    this.em.addComponent<PlayerComponent>(player, "Player", {
      radius: 10.0,
      hp: 5,
    });
    this.em.addComponent<GLTFLoadRequestComponent>(player, "GLTFLoadRequest", {
      url: "models/ship-medium.gltf",
      loaded: "notYet",
    });
    this.em.addComponent<TransformComponent>(player, "Transform", {
      x: 0,
      y: 0,
      z: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
    });
    this.em.addComponent<VelocityComponent>(player, "Velocity", {
      vx: 0,
      vy: 0,
      vz: 0,
    });
    this.em.addComponent<InputComponent>(player, "Input", {
      forward: false,
      backward: false,
      left: false,
      right: false,
      shoot: false,
    });
    this.em.addComponent<PlayerStatsComponent>(player, "PlayerStats", {
      nextShootTime: 0,
      shootCooldown: 0.2,
    });

    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(time: number) {
    const dt = (time - this.previousTime) / 1000;
    this.previousTime = time;

    if (this.environmentManager) {
      this.environmentManager.update(dt);
    }

    this.gltfLoaderSystem.update();
    this.inputSystem.update();
    this.playerMovementSystem.update(dt);
    this.shootSystem.update(dt);
    this.movementSystem.update(dt);
    this.bulletSystem.update(dt);
    this.enemySpawnSystem.update(dt);
    this.approachPlayerSystem.update(dt);
    this.enemyShootSystem.update(this.previousTime / 1000);
    this.collisionSystem.update();
    this.transformSystem.update();
    this.renderSystem.update();

    requestAnimationFrame(this.loop.bind(this));
  }
}
