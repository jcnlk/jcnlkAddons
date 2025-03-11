import { playSound, registerWhen, showTitle } from "../../utils/Utils";
import { getSkyblockItemID } from "../../../BloomCore/utils/Utils";
import { getIsInF7, getIsInM7 } from "../../utils/Dungeon";
import config from "../../config"

let reminderShown = false;

registerWhen(register("chat", () => {
  if (!World.isLoaded) return;
  if (!getIsInF7() && !getIsInM7()) return;
  if (reminderShown) return;
  const helmetId = getSkyblockItemID(Player.armor.getHelmet());

  if (helmetId.includes("BONZO_MASK") || helmetId.includes("SPIRIT_MASK") ) return;
  showTitle(`&c⚠ MASK NOT EQUIPPED! ⚠`, 3000, true);
  playSound("random.orb", 1, 1);
  reminderShown = true;
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance."), () => config.MaskReminder);

register("worldUnload", () => reminderShown = false);