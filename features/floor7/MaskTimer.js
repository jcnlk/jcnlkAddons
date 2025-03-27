import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { registerWhen } from "../../utils/Utils";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

const masks = {
  bonzo: {
    name: "&9Bonzo Mask",
    duration: 1800,
    procText: "&9Bonzo Mask Procced!",
    chatCriteria: [/Your (?:⚚ )?Bonzo's Mask saved your life!/]
  },
  spirit: {
    name: "&fSpirit Mask",
    duration: 300,
    procText: "&fSpirit Mask Procced!",
    chatCriteria: ["Second Wind Activated! Your Spirit Mask saved your life!"]
  },
  phoenix: {
    name: "&cPhoenix",
    duration: 600,
    procText: "&cPhoenix Procced!",
    chatCriteria: ["Your Phoenix Pet saved you from certain death!"]
  }
};

const timers = {};
let procMessage = "";
let procTimeout;

const generateTimerPlaceholder = () => 
  Object.values(masks).map(mask => `${mask.name}: &aREADY`).join("\n");

const maskTimerHud = new Hud("maskTimerHud", generateTimerPlaceholder(), HudManager, data);
const procHud = new Hud("procHud", masks.bonzo.procText, HudManager, data);

const setProcMessage = (message) => {
  procMessage = message;
  
  if (procTimeout) clearTimeout(procTimeout);
  
  procTimeout = setTimeout(() => {
    procMessage = "";
    procTimeout;
  }, 1500);
};

registerWhen(register("step", () => {
  if (!World.isLoaded()) return;
    
  Object.keys(timers).forEach(key => {
    if (timers[key] > 0) timers[key]--;
  });
}).setFps(10), () => config.maskTimer);

Object.entries(masks).forEach(([key, mask]) => {
  mask.chatCriteria.forEach(criteria => {
    register("chat", () => {
      if (!config.maskTimer) return;
      
      timers[key] = mask.duration;
      setProcMessage(mask.procText);
    }).setCriteria(criteria);
  });
});

registerWhen(register("renderOverlay", () => {
  if (!World.isLoaded() || HudManager.isEditing) return;
  if (Dungeon.inDungeon !== "F7" || Dungeon.inDungeon !== "M7") return;
  if (Dungeon.bossEntry === null) return;

  const timerText = Object.entries(masks).map(([key, mask]) => {
    const time = timers[key] || 0;
    return time <= 0
      ? `${mask.name}: &aREADY`
      : `${mask.name}: &6${(time / 10).toFixed(1)}`;
  }).join("\n");
      
  maskTimerHud.draw(timerText);

  if (!procMessage) return;
  procHud.draw(procMessage);
}), () => config.maskTimer);