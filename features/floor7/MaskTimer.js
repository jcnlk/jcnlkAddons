import config from "../../config";
import { data } from "../../utils/Data";
import HudManager from "../../utils/Hud";
import { Hud } from "../../utils/Hud";
import { registerWhen } from "../../utils/Register";
import { getIsInDungeon } from "../../utils/Dungeon";
import { WHITE, BLUE, RED, GREEN } from "../../utils/Utils";

const maskTimerPlaceholder = `${BLUE}Bonzo Mask: ${GREEN}READY\n${WHITE}Spirit Mask: ${GREEN}READY\n${RED}Pheonix: ${GREEN}READY`;
const procPlaceholder = `${BLUE}Bonzo Mask Procced!`;

const maskTimerHud = new Hud("maskTimerHud", maskTimerPlaceholder, HudManager, data);
const procHud = new Hud("procHud", procPlaceholder, HudManager, data);

const masks = {
  bonzo: {
    name: `${BLUE}Bonzo Mask`,
    duration: 1800,
    procText: `${BLUE}Bonzo Mask Procced!`,
    chatCriteria: [/Your (⚚)? Bonzo's Mask saved your life!/]
  },
  spirit: {
    name: `${WHITE}Spirit Mask`,
    duration: 300,
    procText: `${WHITE}Spirit Mask Procced!`,
    chatCriteria: ["Second Wind Activated! Your Spirit Mask saved your life!"]
  },
  phoenix: {
    name: `${RED}Pheonix`,
    duration: 600,
    procText: `${RED}Pheonix Procced!`,
    chatCriteria: ["Your Phoenix Pet saved you from certain death!"]
  }
};

const timers = {};
Object.keys(masks).forEach(key => {
  timers[key] = 0;
});

let procMessage = "";

function setProcMessage(message) {
  procMessage = message;
  setTimeout(() => {
    if (procMessage === message) {
      procMessage = "";
    }
  }, 1500);
}

registerWhen(register("step", () => {
  if (!World.isLoaded()) return;
  Object.keys(timers).forEach(key => {
    if (timers[key] > 0) timers[key]--;
  });
}).setFps(10), () => config.maskTimer);

Object.keys(masks).forEach(key => {
  masks[key].chatCriteria.forEach(criteria => {
    register("chat", () => {
      if (!config.maskTimer) return;
      timers[key] = masks[key].duration;
      setProcMessage(masks[key].procText);
    }).setCriteria(criteria);
  });
});

registerWhen(register("renderOverlay", () => {
  if (!World.isLoaded() || !getIsInDungeon() || HudManager.isEditing) return;
  
  let timerText = "";
  Object.keys(masks).forEach(key => {
    const time = timers[key];
    const line = time <= 0
      ? `${masks[key].name}: &aREADY`
      : `${masks[key].name}: &6${(time / 10).toFixed(1)}`;
    timerText += line + "\n";
  });
  timerText = timerText.trim();
  maskTimerHud.draw(timerText);
}), () => config.maskTimer);

registerWhen(register("renderOverlay", () => {
  if (!World.isLoaded() || !getIsInDungeon() || HudManager.isEditing) return;
  procHud.draw(procMessage);
}), () => config.maskTimer);
