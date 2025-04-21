import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import config from "../../config";

Dungeon.registerWhenInDungeon(register("chat", () => {
  if (!config.autoOpenPotionbag) return;
  Client.scheduleTask(20, () => ChatLib.command("potionbag"));
}).setCriteria(Player.getName() + " is now ready!"));