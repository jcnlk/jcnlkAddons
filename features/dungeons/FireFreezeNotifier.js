import { registerWhen, showTitle } from "../../utils/Utils";
import { getIsInM3 } from "../../utils/Dungeon";
import config from "../../config";

registerWhen(register("chat", (key) => {
  if (!World.isLoaded()) return;
  if (!getIsInM3()) return;

  new Thread(() => {
    Thread.sleep(1000);
    showTitle(`&cIn 4 sec`, 3000, true, `&eGet Ready!`);

    World.playSound("random.burp", 2, 1);
    Thread.sleep(4000);
    World.playSound("random.burp", 2, 1);
    Thread.sleep(4000);

    showTitle(`&4NOW!`, 1000, true, `$&eUSE THE Fire Freeze Staff`);
    World.playSound("random.anvil_land", 2, 1);
  }).start();
}).setCriteria("[BOSS] The Professor: Oh? You found my Guardians' one weakness?"), () => config.FireFreezeNotifier);