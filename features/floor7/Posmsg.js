import { registerWhen, showChatMessage } from "../../utils/Utils";
import Dungeon from "../../../tska/skyblock/dungeon/Dungeon";
import { positionDefinitions } from "../../utils/Dungeon";
import config from "../../config";

const lastLocation = {
  AtP2: false,
  AtSS: false,
  AtEE2: false,
  AtEE3: false,
  AtCore: false,
  InGoldorTunnel: false,
  AtMid: false,
  Ati4Entry: false,
  AtP5: false
};

function sendMessage(message) {
  setTimeout(() => ChatLib.command(`party chat ${message}`), 300);
  showChatMessage("Announcing -> " + message);
}

registerWhen(register("tick", () => {
  if (!Dungeon.inBoss() || Player.getPlayer().func_82150_aj()) return;
  positionDefinitions.forEach(position => {
    if (!lastLocation[position.id] && 
        position.checkCondition(Dungeon.getCurrentClass()) && 
        position.checkPosition(Player)) {
      lastLocation[position.id] = true;
      sendMessage(position.messageText);
    }
  });
}), () => config.togglePosMsg);

register("worldUnload", () => Object.keys(lastLocation).forEach(key => lastLocation[key] = false));