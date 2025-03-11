/**
 * TODO: Make this one actually good..
 */

import { showChatMessage, registerWhen, showTitle, isPlayerInArea } from "../../utils/Utils";
import { getClassOf } from "../../utils/Dungeon";
import config from "../../config";

let lastExisted = false;
let blocks = new Set();
let currentPhase = 0;
let lastAnnouncedPhase = 0;
let hasSentTitle = false;

const start = [111, 120, 92];
const doneListeners = [];

const getCurrentPhase = () => {
  return Math.min(blocks.size, 5);
};

const checkPhaseChange = () => {
  const newPhase = getCurrentPhase();

  if (newPhase > currentPhase) {
    currentPhase = newPhase;
    if (currentPhase > lastAnnouncedPhase) {
      announcePhaseToParty(currentPhase);
      lastAnnouncedPhase = currentPhase;
    }
  }

  if (newPhase < currentPhase) {
    currentPhase = newPhase;
  }
};

const announcePhaseToParty = (phase) => {
  if (config.announceSSProgression && isPlayerInArea(106, 111, 119, 122, 92, 95)) {
    const text = `party chat Current Simon Says phase: ${phase}/5`;
    setTimeout(() => ChatLib.command(`${text}`), 300);
    showChatMessage(`Announcing: SS Phase ${phase}/5`);
  }
};

register("tick", () => {
  let [x0, y0, z0] = start;
  let buttonsExist = World.getBlockAt(x0 - 1, y0, z0).type.getID() === 77;

  if (buttonsExist && !lastExisted) {
    lastExisted = true;
    doneListeners.forEach((func) => func(blocks));
  }

  if (!buttonsExist && lastExisted) {
    lastExisted = false;
    blocks.clear();
  }

  for (let dy = 0; dy <= 3; dy++) {
    for (let dz = 0; dz <= 3; dz++) {
      let [x, y, z] = [x0, y0 + dy, z0 + dz];
      let block = World.getBlockAt(x, y, z);
      let coordinateKey = [x, y, z].join(",");
      if (block.type.getID() !== 169) continue;
      blocks.add(coordinateKey);
    }
  }

  checkPhaseChange();
});

register("playerInteract", (action, pos) => {
  if (action.toString() !== "RIGHT_CLICK_BLOCK" || !blocks.size) return;

  let [x, y, z] = [pos.getX(), pos.getY(), pos.getZ()];
  if (x === 110 && y === 121 && z === 91) {
    blocks.clear();
    return;
  }

  let isButton = World.getBlockAt(x, y, z).type.getID() === 77;
  if (!isButton) return;

  let coordinateKey = [x + 1, y, z].join(",");
  blocks.delete(coordinateKey);
});

registerWhen(register("tick", () => {
  const playerClass = getClassOf();
  const PhaseSS = getCurrentPhase();
  if (playerClass === "Archer" && PhaseSS >= 4 && !hasSentTitle) {
    showTitle(" ", 3000, true, `&aEarly enter now!`);
    hasSentTitle = true;
    World.playSound("note.harp", 2, 1);
  }
  if (PhaseSS < 4) hasSentTitle = false;

}), () => config.EE2Helper);

register("worldUnload", () => {
  currentPhase = 0;
  blocks.clear();
  lastAnnouncedPhase = 0;
  hasSentTitle = false;
});
