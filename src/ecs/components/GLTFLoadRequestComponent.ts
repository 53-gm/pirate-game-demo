export interface GLTFLoadRequestComponent {
  url: string; // ファイルパス
  loaded: "notYet" | "loading" | "done" | "error"; // 読み込み状態
}
