import { getSkyblockItemID } from "../../../BloomCore/utils/Utils";
import { Render2D } from "../../../tska/rendering/Render2D";
import { playSound, registerWhen } from "../../utils/Utils";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import config from "../../config";

let reminderShown = false;

registerWhen(register("chat", () => {
  if (Dungeon.floor !== "F7" && Dungeon.floor !== "M7") return;
  if (reminderShown) return;
  const helmetId = getSkyblockItemID(Player.armor.getHelmet());

  if (helmetId.includes("BONZO_MASK") || helmetId.includes("SPIRIT_MASK")) return;
  Render2D.showTitle(`&c⚠ MASK NOT EQUIPPED! ⚠`, null, 3000);
  playSound("random.orb", 1, 1); 
  reminderShown = true;
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance."), () => config.MaskReminder);

register("worldUnload", () => reminderShown = false);