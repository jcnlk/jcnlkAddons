import { Render2D } from "../../../tska/rendering/Render2D";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { registerWhen } from "../../utils/Utils";
import config from "../../config";

registerWhen(register("chat", (key) => {
  if (!World.isLoaded()) return;
  if (Dungeon.inDungeon !== "M3") return;

  new Thread(() => {
    Thread.sleep(1000);
    Render2D.showTitle(`&cIn 4 sec`, `&eGet Ready!`, 3000);

    World.playSound("random.burp", 2, 1);
    Thread.sleep(4000);
    World.playSound("random.burp", 2, 1);
    Thread.sleep(4000);

    Render2D.showTitle(`&4NOW!`, `&eUSE THE Fire Freeze Staff`, 1000)
    World.playSound("random.anvil_land", 2, 1);
  }).start();
}).setCriteria("[BOSS] The Professor: Oh? You found my Guardians' one weakness?"), () => config.FireFreezeNotifier);