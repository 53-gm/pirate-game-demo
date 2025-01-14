export type BulletOwner = "player" | "enemy";

export interface BulletComponent {
  timeToLive: number; // 弾が消滅するまでの時間（秒）
  radius: number; // 衝突判定の大きさ (球体)
  owner: BulletOwner; // 弾を打ってるやつ
}
