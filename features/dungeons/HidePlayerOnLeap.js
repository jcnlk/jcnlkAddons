import { showChatMessage, registerWhen } from "../../utils/Utils";
import config from "../../config";

let hidePlayersUntil = 0;

function hideAllPlayers() {
  hidePlayersUntil = Date.now() + 5000;
  showChatMessage("Hiding Players");
}

registerWhen(register("renderEntity", (entity, pos, partialTicks, event) => {
  if (entity.getName() === Player.getName()) return;
  
  const player = World.getPlayerByName(entity.getName());
  if (!player || player.getPing() !== 1) return;
    
  if (Date.now() < hidePlayersUntil) {
    cancel(event);
  } else if (hidePlayersUntil > 0) {
    showChatMessage("Showing Players");
    hidePlayersUntil = 0;
  }
}).setFilteredClass(Java.type("net.minecraft.entity.player.EntityPlayer")), () => config.enablePlayerHiding);

registerWhen(register("chat", () => hideAllPlayers()).setCriteria("You have teleported to ${location}!"), () => config.enablePlayerHiding);

register("worldUnload", () => hidePlayersUntil = 0);