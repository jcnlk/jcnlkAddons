import { showGeneralJAMessage } from "../../utils/ChatUtils";
import { registerWhen } from "../../utils/Register";
import config from "../../config";

let shownHidingMessage = false;
let shownShowingMessage = false;
let hiddenPlayers = new Map();

function tempHidePlayer(playerName) {
  hiddenPlayers.set(playerName, Date.now() + 5000);
}

function getIsPlayer(entity) {
  const player = World.getPlayerByName(entity.getName());
  return player?.getPing() === 1;
}

function shouldHidePlayer(entity) {
  if (entity.getName() === Player.getName()) return false;

  if (hiddenPlayers.has(entity.getName())) {
    const unhideTime = hiddenPlayers.get(entity.getName());
    if (Date.now() >= unhideTime) {
      hiddenPlayers.delete(entity.getName());

      if (shownShowingMessage) return;
      showGeneralJAMessage(`Showing Players`);
      shownShowingMessage = true;
      shownHidingMessage = false;

      return false;
    }
    return true;
  }
  return false;
}

registerWhen(register("chat", (location) => {
  const playerX = Player.getX();
  const playerY = Player.getY();
  const playerZ = Player.getZ();

  World.getAllPlayers().forEach((player) => {
    if (player.getName() === Player.getName()) return;

    const dx = player.getX() - playerX;
    const dy = player.getY() - playerY;
    const dz = player.getZ() - playerZ;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance <= 7) {
      tempHidePlayer(player.getName());

      if (shownHidingMessage) return;
      showGeneralJAMessage(`Hiding players`);
      shownHidingMessage = true;
      shownShowingMessage = false;
    }
  });
}).setCriteria("You have teleported to ${location}!"), () => config.enablePlayerHiding);
//You have teleported to JOE123546!

registerWhen(register("renderEntity", (entity, pos, partialTicks, event) => {
    if (!getIsPlayer(entity)) return;

    if (shouldHidePlayer(entity)) {
      cancel(event);
    }
  }),
  () => config.enablePlayerHiding
);

register("worldUnload", () => {
  hiddenPlayers.clear();
  shownHidingMessage = false;
  shownShowingMessage = false;
});
