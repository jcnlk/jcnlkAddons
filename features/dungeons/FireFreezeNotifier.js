import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { registerWhen } from "../../utils/Utils";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

const fireFreezeTHud = new Hud("fireFreezeHud", "&bFire Freeze: &c8.0s", HudManager, data);
let timerEndTime = 0;

registerWhen(register("chat", () => {
  if (!World.isLoaded() || Dungeon.inDungeon !== "M3") return;
  
  timerEndTime = Date.now() + 8000;
  World.playSound("random.burp", 2, 1);
  
  setTimeout(() => World.playSound("random.burp", 2, 1), 4000);
  setTimeout(() => World.playSound("random.anvil_land", 2, 1), 8000);
}).setCriteria("[BOSS] The Professor: Oh? You found my Guardians' one weakness?"), () => config.FireFreezeNotifier);

registerWhen(register("renderOverlay", () => {
  if (!World.isLoaded() || HudManager.isEditing) return;
  
  const now = Date.now();
  const remaining = (timerEndTime - now) / 1000;
  
  if (remaining <= 0 && remaining > -2) fireFreezeTHud.draw("&bFire Freeze: &aNOW!");
  if (remaining > 0) {
    const color = remaining > 6 ? "&c" : remaining > 4 ? "&6" : remaining > 2 ? "&e" : "&a";
    fireFreezeTHud.draw(`&bFire Freeze: ${color}${remaining.toFixed(1)}s`);
  }
}), () => config.FireFreezeNotifier);

register("worldUnload", () => timerEndTime = 0);