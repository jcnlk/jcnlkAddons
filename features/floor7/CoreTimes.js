import { registerWhen, showChatMessage, isPlayerInArea } from "../../utils/Utils";
import { getCurrentGoldorPhase } from "../../utils/Dungeon";
import config from "../../config";

let coreEntranceOpenTime = 0;
let playersInCore = new Map();
let messageAnnounced = false;

function resetTracker() {
  coreEntranceOpenTime = 0;
  playersInCore.clear();
  messageAnnounced = false;
}

function formatCoreMessage() {
  if (playersInCore.size === 0) return "";

  let message = " Time Into Core | ";

  playersInCore.forEach((entranceTime, playerName) => {
    const timeToEnter = ((entranceTime - coreEntranceOpenTime) / 1000).toFixed(2);
    message += `${playerName} took ${timeToEnter}s | `;
  });

  return message;
}

function announceCore() {
  if (messageAnnounced || playersInCore.size === 0) return;

  const message = formatCoreMessage();
  ChatLib.command(`party chat ${message}`);
  showChatMessage(`Announcing -> Core Entrance Data`);
  messageAnnounced = true;
}

registerWhen(register("chat", () => {
  if (!World.isLoaded()) return;

  resetTracker();
  coreEntranceOpenTime = Date.now();
}).setCriteria("The Core entrance is opening!"), () => config.coreTracker);

registerWhen(register("tick", () => {
    if (!World.isLoaded() || coreEntranceOpenTime === 0) return;
    if (getCurrentGoldorPhase() !== 5) return;

    World.getAllPlayers().forEach((entity) => {
      if (entity.isInvisible() || entity.getPing() !== 1 || playersInCore.has(entity.getName())) return;

      if (isPlayerInArea(39, 71, 112, 155.5, 54, 118, entity)) {
        const playerName = entity.getName();
        const entranceTime = Date.now();
        playersInCore.set(playerName, entranceTime);

        if (!config.coreAnnounceAtEnd) {
          const timeToEnter = ((entranceTime - coreEntranceOpenTime) / 1000).toFixed(2);
          const message = `${playerName} entered core in ${timeToEnter}s`;

          ChatLib.command(`party chat ${message}`);
          showChatMessage(`Announcing -> ${message}`);
        }
      }
    });
  }), () => config.coreTracker);

registerWhen(register("chat", () => {
  if (config.coreAnnounceAtEnd) announceCore();
  resetTracker();
}).setCriteria("[BOSS] Goldor: ...."), () => config.coreTracker);

registerWhen(register("chat", () => {
  if (config.coreAnnounceAtEnd) announceCore();
  resetTracker();
}).setCriteria(/\[BOSS\] Necron: (Finally, I heard so much about you.|You went further than any human before).*?/), () => config.coreTracker);

register("worldUnload", resetTracker);