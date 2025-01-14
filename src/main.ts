import { Game } from "./core/Game";

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("gameContainer");
  if (container) {
    new Game(container);
  }
});
