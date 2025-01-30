import config from "../../config";
import { RED } from "../../utils/Constants";
import { getIsInF7, getIsInM7 } from "../../utils/Dungeon";
import { getItemId } from "../../utils/Items";
import { showTitle } from "../../utils/Title";

let isGoldorStarted = false;
let reminderShown = false;

register("chat", () => {
  if (!World.isLoaded) return;

  isGoldorStarted = true;

  if (!config.MaskReminder) return;
  if (!getIsInF7() || !getIsInM7()) return;
  if (!reminderShown) return;

  const helmetId = getItemId(Player.armor.getHelmet());

  if (
    helmetId !== "BONZO_MASK" ||
    helmetId !== "STARRED_BONZO_MASK" ||
    helmetId !== "SPIRIT_MASK" ||
    helmetId !== "STARRED_SPIRIT_MASK"
  )
    return;

  showTitle(`${RED}⚠ MASK NOT EQUIPPED! ⚠`, 3000, true);
  World.playSound("random.orb", 1, 1);
  reminderShown = true;
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.");

register("worldUnload", () => {
  isGoldorStarted = false;
  reminderShown = false;
});
