import { registerWhen, showTitleV2 } from "../../utils/Utils";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import config from "../../config";

registerWhen(register("chat", (key) => {
  if (!World.isLoaded()) return;
  if (!Dungeon.inDungeon !== "M3") return;

  new Thread(() => {
    Thread.sleep(1000);
    showTitleV2(`&cIn 4 sec`, 3000, 0.5, -20, 4, null, `&eGet Ready!`);

    World.playSound("random.burp", 2, 1);
    Thread.sleep(4000);
    World.playSound("random.burp", 2, 1);
    Thread.sleep(4000);

    showTitleV2(`&4NOW!`, 1000, 0.5, -20, 4, null, `&eUSE THE Fire Freeze Staff`);
    World.playSound("random.anvil_land", 2, 1);
  }).start();
}).setCriteria("[BOSS] The Professor: Oh? You found my Guardians' one weakness?"), () => config.FireFreezeNotifier);