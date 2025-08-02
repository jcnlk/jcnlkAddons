import { registerWhen, showChatMessage } from "../../utils/Utils";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { positionDefinitions } from "../../utils/Dungeon";
import config from "../../config";

const lastLocation = {};
positionDefinitions.forEach(pos => lastLocation[pos.id] = false);

function sendMessage(message) {
  Client.scheduleTask(5, () => ChatLib.command(`party chat ${message}`));
  showChatMessage("Announcing -> " + message);
}

registerWhen(register("tick", () => {
  if (!World.isLoaded() || Player.getPlayer().func_82150_aj()) return; // skip if player is invisible
  const playerClass = Dungeon.classes[Player.getName()];
  if (!playerClass) return; // not in dungeon
  positionDefinitions.forEach(position => {
    if (!lastLocation[position.id] && 
        position.checkCondition(playerClass) && 
        position.checkPosition(Player)) {
      lastLocation[position.id] = true;
      sendMessage(position.messageText);
    }
  });
}), () => config.togglePosMsg);

register("worldUnload", () => positionDefinitions.forEach(pos => lastLocation[pos.id] = false));