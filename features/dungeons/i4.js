import config from "../../config";
import { getCurrentClass, getIsInMaxor, getIsInStorm } from "../../utils/Dungeon";
import { showGeneralJAMessage } from "../../utils/ChatUtils";
import { registerWhen } from "../../utils/Register";

let hasAnnouncedAtI4 = false;
let hasAnnouncedI4Entry = false;
let hasAnnouncedMovingToI4 = false;
let playerClass = getCurrentClass();

function getI4Position() {
  if (
    Player.getX() > 91 &&
    Player.getX() < 93 &&
    Player.getY() > 129 &&
    Player.getY() < 133 &&
    Player.getZ() > 44 &&
    Player.getZ() < 46
  )
    return 1; // i4 entry
  if (
    Player.getX() > 87 &&
    Player.getX() < 91 &&
    Player.getY() > 129 &&
    Player.getY() < 134 &&
    Player.getZ() > 46 &&
    Player.getZ() < 50
  )
    return 2; // moving to i4
  if (
    Player.getX() > 61 &&
    Player.getX() < 65 &&
    Player.getY() > 126 &&
    Player.getY() < 130 &&
    Player.getZ() > 33 &&
    Player.getZ() < 37
  )
    return 3; // at i4
  else return 0;
}

function announceI4Position() {
  if (!World.isLoaded()) return;
  if (playerClass === "Healer") return;

  const isInMaxor = getIsInMaxor();
  if (!isInMaxor) return;

  const i4Position = getI4Position();

  if (i4Position === 1 && !hasAnnouncedI4Entry) {
    setTimeout(
      () => ChatLib.command(`party chat At i4 Entry (HEALER CAN LEAP)!`),
      300
    );
    hasAnnouncedI4Entry = true;
    showGeneralJAMessage("Announced i4 Entry Position.");
  } else if (i4Position === 2 && !hasAnnouncedMovingToI4) {
    setTimeout(
      () => ChatLib.command(`party chat Moving to i4 (DON'T LEAP)!`),
      300
    );
    hasAnnouncedMovingToI4 = true;
    showGeneralJAMessage("Announced Moving to i4.");
  } else if (i4Position === 3 && !hasAnnouncedAtI4) {
    setTimeout(() => ChatLib.command(`party chat At i4 (DON'T LEAP)!`), 300);
    hasAnnouncedAtI4 = true;
    showGeneralJAMessage("Announced At i4 Position.");
  }
}

registerWhen(register("tick", announceI4Position), () => config.announceI4Position);

register("worldUnload", () => {
  playerClass = null;
  hasAnnouncedAtI4 = false;
  hasAnnouncedI4Entry = false;
  hasAnnouncedMovingToI4 = false;
});
