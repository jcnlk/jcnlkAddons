import { getCurrentGoldorPhase, getClassOf, getIsInBoss } from "../../utils/Dungeon";
import { registerWhen, isPlayerInArea, showChatMessage } from "../../utils/Utils";
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

function sendMessage(message) {
  setTimeout(() => ChatLib.command(`party chat ` + message), 200);
  showChatMessage("Announcing -> " + message);
}

registerWhen(register("tick", () => {
  if (!World.isLoaded) return;
  
  const playerClass = getClassOf();
  if (!playerClass) return; // not in dungeons

  if (Player.getY() < 205 && Player.getY() > 164 && !lastLocation.AtP2 && getIsInBoss("Maxor") && playerClass !== "Healer") {
    lastLocation.AtP2 = true;
    sendMessage("At P2!");
  }
  if (isPlayerInArea(106, 110, 118, 122, 92, 96) && !lastLocation.AtSS && (getIsInBoss("Storm") || getIsInBoss("Goldor"))) {
    lastLocation.AtSS = true;
    sendMessage("At SS!");
  }
  if (isPlayerInArea(49, 58, 108, 115, 129, 133) && !lastLocation.AtEE2 && getCurrentGoldorPhase() === 1) {
    lastLocation.AtEE2 = true;
    sendMessage("At Pre Enter 2!");
  }
  if (isPlayerInArea(0, 4, 108, 115, 98, 107) && !lastLocation.AtEE3 && getCurrentGoldorPhase() === 2) {
    lastLocation.AtEE3 = true;
    sendMessage("At Pre Enter 3!");
  }
  if (isPlayerInArea(52, 56, 113, 117, 49, 53) && !lastLocation.AtCore && (getCurrentGoldorPhase() === 2 || getCurrentGoldorPhase() === 3)) {
    lastLocation.AtCore = true;
    sendMessage("At Core!");
  }
  if (isPlayerInArea(41, 68, 110, 150, 59, 117) && !lastLocation.InGoldorTunnel && getCurrentGoldorPhase() === 4) {
    lastLocation.InGoldorTunnel = true;
    sendMessage("Inside Goldor Tunnel!");
  }
  if (isPlayerInArea(47, 61, 64, 75, 69, 83) && !lastLocation.AtMid && getIsInBoss("Necron")) {
    lastLocation.AtMid = true;
    sendMessage("At Mid!");
  }
  if (isPlayerInArea(91, 93, 129, 133, 44, 46) && !lastLocation.Ati4Entry && getIsInBoss("Storm") && playerClass !== "Healer") {
    lastLocation.Ati4Entry = true;
    sendMessage("At i4 Entry!");
  }
  if (Player.getY() < 50 && Player.getY() > 4 && !lastLocation.AtP5 && getIsInBoss("Necron")) {
    lastLocation.AtP5 = true;
    sendMessage("At P5!");
  }
}), () => config.togglePosMsg);

register("worldUnload", () => Object.keys(lastLocation).forEach((key) => (lastLocation[key] = false)));