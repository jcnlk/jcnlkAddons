import config from "../../config";
import {
  getCurrentClass,
  getIsInMaxor,
  getIsInStorm,
} from "../../utils/Dungeon";
import { showGeneralJAMessage } from "../../utils/ChatUtils";

let hasAnnouncedSS = false;
let hasAnnouncedDev2 = false;
let hasAnnouncedDev3 = false;
let playerClass = getCurrentClass();

function getDevPosition() {
  if (
    Player.getX() > 106 &&
    Player.getX() < 111 &&
    Player.getY() > 119 &&
    Player.getY() < 122 &&
    Player.getZ() > 92 &&
    Player.getZ() < 95
  )
    return 1;
  if (
    Player.getX() > 58 &&
    Player.getX() < 62 &&
    Player.getY() > 130 &&
    Player.getY() < 135 &&
    Player.getZ() > 137 &&
    Player.getZ() < 143
  )
    return 2;
  if (
    Player.getX() > -3 &&
    Player.getX() < 4 &&
    Player.getY() > 119 &&
    Player.getY() < 123 &&
    Player.getZ() > 75 &&
    Player.getZ() < 79
  )
    return 3;
  else return 0;
}

function announceDevPosition() {
  if (!World.isLoaded()) return;
  if (!config.announcePreDevPosition) return;
  if (playerClass !== "Healer") return; // Healer only

  const DevPosition = getDevPosition();

  if (getIsInMaxor() || getIsInStorm()) {
    if (DevPosition === 3 && !hasAnnouncedDev3) {
      setTimeout(() => ChatLib.command(`party chat At Pre Dev 3!`), 300);
      hasAnnouncedDev3 = true;
      showGeneralJAMessage("Announcing -> Pre At Dev 3");
    }
    if (DevPosition === 2 && !hasAnnouncedDev2) {
      setTimeout(() => ChatLib.command(`party chat At Pre Dev 2!`), 300);
      hasAnnouncedDev2 = true;
      showGeneralJAMessage("Announcing -> Pre At Dev 2");
    }
  }
  if (getIsInStorm()) {
    if (DevPosition === 1 && !hasAnnouncedSS) {
      setTimeout(() => ChatLib.command(`party chat At SS!`), 300);
      hasAnnouncedSS = true;
      showGeneralJAMessage("Announing -> At SS");
    }
  }
}

register("tick", announceDevPosition);

register("worldUnload", () => {
  playerClass = null;
  hasAnnouncedSS = false;
  hasAnnouncedDev2 = false;
  hasAnnouncedDev3 = false;
});
