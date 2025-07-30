import { getClassColor, positionDefinitions } from "../../utils/Dungeon";
import { registerWhen, showChatMessage } from "../../utils/Utils";
import { stripRank } from "../../../BloomCore/utils/Utils";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

const posTitlesHud = new Hud("posTitlesHud", "&aTest Player (T) &eAt Mid!", HudManager, data);

const lastLocation = {
  AtP2: false,
  AtSS: false,
  AtEE2: false,
  AtEE3: false,
  AtCore: false,
  InGoldorTunnel: false,
  AtMid: false,
  AtPre4Entry: false,
  AtP5: false
};

let currentHudMessage = "";
let hudDisplayTimeout = null;

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
  currentHudMessage = getClassColor(playerClass) + `${playerName} (${playerClass[0]}) &e${text}`;
  if (hudDisplayTimeout) clearTimeout(hudDisplayTimeout);
  playSound();
  hudDisplayTimeout = setTimeout(() => currentHudMessage = "", 2000);
}

registerWhen(register("tick", () => {
  if ((Dungeon.floor !== "F7" && Dungeon.floor !== "M7") || !Dungeon.bossEntry || (Date.now() - Dungeon.bossEntry < 1000)) return;
  
  World.getAllPlayers().forEach(entity => {
    if (entity.getPing() !== 1 || entity.isInvisible()) return;
    
    const playerName = entity.getName();
    if (playerName === Player.getName()) return;
    
    const playerClass = Dungeon.classes[playerName];
    if (!playerClass) return;
    
    positionDefinitions.forEach(position => {
      if (!lastLocation[position.id] &&
          position.checkCondition(playerClass) &&
          position.checkPosition(entity)) {
        
        if (position.checkPosition(Player)) return;
        
        lastLocation[position.id] = true;
        showAlert(playerName, playerClass, position.messageText);
      }
    });
  });
}), () => config.togglePosTitles);

registerWhen(register("chat", (player, message) => {
  const strippedPlayer = stripRank(player);
  if (strippedPlayer === Player.getName()) return;
  
  const msg = message.toLowerCase();
  const playerClass = Dungeon.classes[strippedPlayer];
  if (!playerClass) return;
  
  positionDefinitions.forEach(position => {
    if (!lastLocation[position.id] &&
        position.checkCondition(playerClass) &&
        position.validMessages.some(term => msg.includes(term))) {
      
      if (position.checkPosition(Player)) return;
      
      lastLocation[position.id] = true;
      showAlert(strippedPlayer, playerClass, position.messageText);
    }
  });
}).setCriteria("Party > ${player}: ${message}"), () => config.togglePosTitles);

registerWhen(register("renderOverlay", () => {
  if (!currentHudMessage || HudManager.isEditing) return;
  posTitlesHud.draw(currentHudMessage);
}), () => config.togglePosTitles);

register("worldUnload", () => {
  Object.keys(lastLocation).forEach(key => lastLocation[key] = false);
  currentHudMessage = "";
  if (hudDisplayTimeout) {
    clearTimeout(hudDisplayTimeout);
    hudDisplayTimeout = null;
  }
});