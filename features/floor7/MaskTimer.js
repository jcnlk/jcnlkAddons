import Dungeon from "../../../tska/skyblock/dungeon/Dungeon";
import { onTick } from "../../../tska/shared/ServerTick";
import { registerWhen } from "../../utils/Utils";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

const masks = {
  bonzo: {
    name: "&9Bonzo Mask",
    procText: "&9Bonzo Mask Procced!",
    chatCriteria: [/Your (?:⚚ )?Bonzo's Mask saved your life!/]
  },
  spirit: {
    name: "&fSpirit Mask",
    procText: "&fSpirit Mask Procced!",
    chatCriteria: ["Second Wind Activated! Your Spirit Mask saved your life!"]
  },
  phoenix: {
    name: "&cPhoenix",
    procText: "&cPhoenix Procced!",
    chatCriteria: ["Your Phoenix Pet saved you from certain death!"]
  }
};

const timers = {};
let procMessage = "";
let procTimeout;

function getMaskDuration(type) {
  if (type === "bonzo")
    return Math.ceil((Dungeon.getMageReduction(720 - Dungeon.getCurrentLevel() * 7.2, true) + 3) * 2) / 2;
  if (type === "spirit") return Math.ceil((Dungeon.getMageReduction(30, true) + 3) * 2) / 2;
  if (type === "phoenix") return 64;
};

const generateTimerPlaceholder = () => Object.values(masks).map(mask => `${mask.name}: &aREADY`).join("\n");

const maskTimerHud = new Hud("maskTimerHud", generateTimerPlaceholder(), HudManager, data);
const procHud = new Hud("procHud", masks.bonzo.procText, HudManager, data);

const setProcMessage = (message) => {
  procMessage = message;
  
  if (procTimeout) clearTimeout(procTimeout);
  
  procTimeout = setTimeout(() => {
    procMessage = "";
    procTimeout = null;
  }, 1500);
};

onTick(() => {
  if (!config.maskTimer) return;
  Object.keys(timers).forEach(key => {
    if (timers[key] > 0) timers[key] -= 0.05;
  });
});

Object.entries(masks).forEach(([key, mask]) => {
  mask.chatCriteria.forEach(criteria => {
    register("chat", () => {
      if (!config.maskTimer) return;
      
      timers[key] = getMaskDuration(key);
      setProcMessage(mask.procText);
    }).setCriteria(criteria);
  });
});

registerWhen(register("renderOverlay", () => {
  if (!World.isLoaded() || HudManager.isEditing) return;
  if (Dungeon.floorNumber !== 7 || !Dungeon.inBoss()) return;

  const timerText = Object.entries(masks).map(([key, mask]) => {
    const time = timers[key] || 0;
    return time <= 0
      ? `${mask.name}: &aREADY`
      : `${mask.name}: &6${(time).toFixed(2)}s`;
  }).join("\n");
      
  maskTimerHud.draw(timerText);

  if (procMessage) procHud.draw(procMessage);
}), () => config.maskTimer);

register("worldUnload", () => Object.keys(timers).forEach(key => timers[key] = 0));