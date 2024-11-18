import config from "../../config";
import { inDungeon, inM3 } from "../../utils/Dungeon";
import { showTitle } from "../../utils/Title";
import { RED, YELLOW, DARK_RED } from "../../utils/Constants";

register("chat", (key) => {
    if (config.FireFreezeNotifier && inDungeon() && inM3()){
        new Thread(() => {
            Thread.sleep(1000);
            showTitle(`${RED}In 4 sec`, 3000, true, `${YELLOW}Get Ready!`);

            World.playSound("random.burp", 2, 1);
            Thread.sleep(4000);

            showTitle(`${DARK_RED}NOW!`, 1000, true, `${YELLOW}USE THE Fire Freeze Staff`);
            World.playSound("random.anvil_land", 2, 1);
        }).start();
    }
}).setCriteria("[BOSS] The Professor: Oh? You found my Guardians' one weakness?").setContains();