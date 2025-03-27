import { registerWhen, showChatMessage, showTitleV2 } from "../../utils/Utils";
import { getClassColor, positionDefinitions } from "../../utils/Dungeon";
import { stripRank } from "../../../BloomCore/utils/Utils";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import config from "../../config";

const lastLocation = {
  AtP2: false,
  AtSS: false,
  AtEE2: false,
  AtEE3: false,
  AtCore: false,
  InGoldorTunnel: false,
  AtMid: false,
  Ati4Entry: false,
  AtP5: false
};

function playSound() {
  let count = 0;
  const playNext = () => {
    if (count >= 120) return;
    World.playSound("note.harp", 0.7, 1.6);
    count++;
    setTimeout(playNext, 3);
  };
  playNext();
}

function showAlert(playerName, playerClass, text) {
  showChatMessage(getClassColor(playerClass) + `${playerName} (${playerClass[0]}) &e${text}`);
  showTitleV2(getClassColor(playerClass) + `${playerName} (${playerClass[0]}) &e${text}`, 2000, 0.5, 0.25, 1.7, playSound());
}

registerWhen(register("tick", () => { // maybe change to step
  if (!World.isLoaded() || Dungeon.bossEntry === null) return; // Should fix alerts triggering randomly on world change
  World.getAllPlayers().forEach(entity => {
    if (entity.getPing() !== 1) return; // Skip non-player entities
    const playerName = entity.getName();
    if (playerName === Player.getName()) return; // Skip player itself
    const playerClass = Dungeon.classes[playerName];
    positionDefinitions.forEach(position => {
      if (!lastLocation[position.id] &&
          position.checkCondition(playerClass) &&
          position.checkPosition(entity)) {
        lastLocation[position.id] = true;
        showAlert(playerName, playerClass, position.messageText);
      }
    });
  });
}), () => config.togglePosTitles);

registerWhen(register("chat", (player, message) => {
  const strippedPlayer = stripRank(player);
  if (strippedPlayer === Player.getName()) return; // skip player itself
  const msg = message.toLowerCase();
  const playerClass = Dungeon.classes[strippedPlayer];
  if (!playerClass) return;
  positionDefinitions.forEach(position => {
    if (!lastLocation[position.id] &&
        position.checkCondition(playerClass) &&
        position.validMessages.some(term => msg.includes(term))) {
      lastLocation[position.id] = true;
      showAlert(strippedPlayer, playerClass, position.messageText);
    }
  });
}).setCriteria("Party > ${player}: ${message}"), () => config.togglePosTitles);

register("worldUnload", () => Object.keys(lastLocation).forEach(key => lastLocation[key] = false));