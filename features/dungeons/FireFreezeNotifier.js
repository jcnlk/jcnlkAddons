import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { registerWhen } from "../../utils/Utils";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

const fireFreezeHud = new Hud("fireFreezeHud", "&bFire Freeze: &c4.0s", HudManager, data);
let timerStart = 0;

registerWhen(register("chat", () => {
  if (Dungeon.floor !== "M3") return;
  
  timerStart = Date.now();
  
  setTimeout(() => World.playSound("random.burp", 2, 1), 1000);
  setTimeout(() => World.playSound("random.anvil_land", 2, 1), 5000);
}).setCriteria("[BOSS] The Professor: Oh? You found my Guardians' one weakness?"), () => config.FireFreezeNotifier);

registerWhen(register("renderOverlay", () => {
  if (!World.isLoaded() || HudManager.isEditing || timerStart === 0) return;
  
  const elapsed = (Date.now() - timerStart) / 1000;
  
  if (elapsed > 1 && elapsed < 5) {
    const remaining = 5 - elapsed;
    const color = remaining > 3.35 ? "&c" : remaining > 1.7 ? "&6" : "&e";
    fireFreezeHud.draw(`&bFire Freeze: ${color}In ${remaining.toFixed(1)}s`);
  } 
  if (elapsed >= 5 && elapsed < 6.5) fireFreezeHud.draw("&bFire Freeze: &aNOW!");
}), () => config.FireFreezeNotifier);

register("worldUnload", () => timerStart = 0);