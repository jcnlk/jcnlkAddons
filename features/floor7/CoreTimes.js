import { registerWhen, showChatMessage, isPlayerInArea } from "../../utils/Utils";
import { inStage } from "../../utils/Dungeon";
import config from "../../config";

let coreEntranceOpenTime = 0;
let playersInCore = new Map();
let messageAnnounced = false;

function resetTracker() {
  coreEntranceOpenTime = 0;
  playersInCore.clear();
  messageAnnounced = false;
}

function getPlayerCoreTimes() {
  const playerTimes = [];
  
  playersInCore.forEach((entranceTime, playerName) => {
    const timeToEnter = ((entranceTime - coreEntranceOpenTime) / 1000).toFixed(2);
    playerTimes.push({ playerName, timeToEnter });
  });
  
  return playerTimes.sort((a, b) => parseFloat(a.timeToEnter) - parseFloat(b.timeToEnter));
}

function formatPartyMessage() {
  if (playersInCore.size === 0) return "";

  let message = "Time Into Core | ";

  getPlayerCoreTimes().forEach(({ playerName, timeToEnter }) => {
    message += `${playerName} took ${timeToEnter}s | `;
  });

  return message;
}

function showTimesInChat() {
  if (playersInCore.size === 0) return;
  
  getPlayerCoreTimes().forEach(({ playerName, timeToEnter }) => {
    showChatMessage(`&b${playerName} &bhas entered core in &b${timeToEnter}s`);
  });
}

function announceCore() {
  if (messageAnnounced || playersInCore.size === 0) return;
  if (config.coreTimesChat) showTimesInChat();
  if (config.coreTimesAnnounce) {
    const message = formatPartyMessage();
    ChatLib.command(`party chat ${message}`);
    showChatMessage(`Announcing -> Core Times`);
  }
  
  messageAnnounced = true;
  
  if (!config.coreTimesChat && !config.coreTimesAnnounce) resetTracker();
}

registerWhen(register("chat", () => {
  resetTracker();
  coreEntranceOpenTime = Date.now();
}).setCriteria("The Core entrance is opening!"), () => config.coreTimes);

registerWhen(register("tick", () => {
  if (!World.isLoaded() || coreEntranceOpenTime === 0 || !inStage(5)) return;

  World.getAllPlayers().forEach((entity) => {
    if (entity.getPing() !== 1 || entity.isInvisible() || playersInCore.has(entity.getName())) return;
    if (isPlayerInArea(39, 71, 112, 155.5, 54, 118, entity)) {
      const playerName = entity.getName();
      const entranceTime = Date.now();
      playersInCore.set(playerName, entranceTime);
    }
  });
}), () => config.coreTimes);

registerWhen(register("chat", () => announceCore()).setCriteria("[BOSS] Goldor: Necron, forgive me."), () => config.coreTimes);
register("worldUnload", resetTracker);