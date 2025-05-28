import Location from "../../../tska/skyblock/Location";
import { registerWhen } from "../../utils/Utils";
import config from "../../config";

registerWhen(register("chat", () => {
  if (!Location.inArea("Catacombs")) return;
  Client.scheduleTask(20, () => ChatLib.command("potionbag"));
}).setCriteria(Player.getName() + " is now ready!"), () => config.autoOpenPotionbag);