import { onTick } from "../../../tska/shared/ServerTick";
import { registerWhen } from "../../utils/Utils";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

const fireFreezeHud = new Hud("fireFreezeHud", "&bFire Freeze: &c4.0s", HudManager, data);
let timerTicks = 0;

onTick(() => {
  if (!config.FireFreezeNotifier || timerTicks <= 0) return;
  
  if (timerTicks === 100) World.playSound("random.burp", 2, 1);
  if (timerTicks === 20) World.playSound("random.anvil_land", 2, 1);
  
  timerTicks--;
});

registerWhen(register("chat", () => {
  timerTicks = 120;
}).setCriteria("[BOSS] The Professor: Oh? You found my Guardians' one weakness?"), () => config.FireFreezeNotifier);

registerWhen(register("renderOverlay", () => {
  if (!World.isLoaded() || HudManager.isEditing || timerTicks <= 0) return;
  
  const elapsed = (120 - timerTicks) / 20;
  
  if (elapsed < 5) {
    const remaining = 5 - elapsed;
    const color = remaining > 3.35 ? "&c" : remaining > 1.7 ? "&6" : "&e";
    fireFreezeHud.draw(`&bFire Freeze: ${color}In ${remaining.toFixed(2)}s`);
  } 
  else if (elapsed >= 5 && elapsed < 6) fireFreezeHud.draw("&bFire Freeze: &aNOW!");
}), () => config.FireFreezeNotifier);

register("worldUnload", () => timerTicks = 0);