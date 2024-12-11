import config from "../../config";
import { RED } from "../../utils/Constants";
import { getItemId } from "../../utils/ItemID";
import { showTitle } from "../../utils/Title";

let isGoldorStarted = false;
let reminderShown = false;

register("chat", () => {
    isGoldorStarted = true;
    if (config.MaskReminder) {
        const helmetId = getItemId(Player.armor.getHelmet());
        if (helmetId !== 'BONZO_MASK' && 
            helmetId !== 'STARRED_BONZO_MASK' && 
            helmetId !== 'SPIRIT_MASK' && 
            helmetId !== 'STARRED_SPIRIT_MASK' &&
            !reminderShown) {

            showTitle(`${RED}⚠ MASK NOT EQUIPPED! ⚠`, 3000, true);
            World.playSound("random.orb", 1, 1);
            reminderShown = true;
        }
    }
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.");

register("worldLoad", () => {
    isGoldorStarted = false;
    reminderShown = false;
});