import { getCurrentGoldorPhase, getIsInBoss, getClassOf, getClassColor } from "../../utils/Dungeon";
import { isPlayerInArea, registerWhen, showChatMessage } from "../../utils/Utils";
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
}

// At P2
const validP2Msg = ["at p2", "in p2"];
const isValidP2 = playerClass => !lastLocation.AtP2 && getIsInBoss("Maxor") && playerClass !== "Healer";
// At SS
const validAtSSMsg = ["at ss", "at simon says"];
const isValidAtSS = () => !lastLocation.AtSS && (getIsInBoss("Storm") || getIsInBoss("Goldor"));
// At EE2
const validEE2Msg = ["early enter 2", "pre enter 2", "at ee2", "entered 3.2"];
const isValidEE2 = () => !lastLocation.AtEE2 && getCurrentGoldorPhase() === 1;
// At EE3
const validEE3Msg = ["early enter 3", "pre enter 3", "at ee3", "entered 3.3"];
const isValidEE3 = () => !lastLocation.AtEE3 && getCurrentGoldorPhase() === 2;
// At Core
const validAtCoreMsg = ["at core", "pre enter 4", "early enter 4", "at ee4", "entered 3.4"];
const isValidAtCore = () => !lastLocation.AtCore && (getCurrentGoldorPhase() === 2 || getCurrentGoldorPhase() === 3);
// In Goldor Tunnel
const validInGoldorTunnelMsg = ["in goldor tunnel", "inside goldor tunnel", "in core", "entered 3.5", "at ee5", "at pre enter 5"];
const isValidInGoldorTunnel = () => !lastLocation.InGoldorTunnel && getCurrentGoldorPhase() === 4;
// At Mid
const validAtMidMsg = ["at mid", "in mid"];
const isValidAtMid = () => !lastLocation.AtMid && getIsInBoss("Necron");
// At i4 Entry
const validAti4EntryMsg = ["i4 entry"];
const isValidAti4Entry = playerClass => !lastLocation.Ati4Entry && getIsInBoss("Storm") && playerClass !== "Healer";
// At P5
const validAtP5Msg = ["at p5", "in p5"];
const isValidAtP5 = () => !lastLocation.AtP5 && getIsInBoss("Necron");

function playSound() {
  let count = 0;
  const playNext = () => {
    if (count >= 120) return;
    World.playSound("note.harp", 0.7, 1.6);
    count++;
    setTimeout(playNext, 3);
  };
  playNext();
};

function showTitle(text) {
  const overlay = register("renderOverlay", () => {
    const scale = 1.7;
    const screenWidth = Renderer.screen.getWidth();
    const screenHeight = Renderer.screen.getHeight();
    const yPos = screenHeight * 0.25;
    Renderer.translate(screenWidth / 2, yPos);
    Renderer.scale(scale, scale);
    Renderer.drawStringWithShadow(text, -Renderer.getStringWidth(text) / 2, 0);
  });
  playSound();
  setTimeout(() => overlay.unregister(), 2000);
};

function showAlert(playerName, playerClass, text) {
  showChatMessage(getClassColor(playerClass) + `${playerName} (${playerClass[0]}) &e${text}`);
  showTitle(getClassColor(playerClass) + `${playerName} (${playerClass[0]}) &e${text}`);
}

registerWhen(register("tick", () => {
  if (!World.isLoaded) return;

  World.getAllPlayers().forEach(entity => {
    if (entity.getPing() !== 1) return; // Skip non-player entities
    const playerName = entity.getName();
    if (playerName === Player.getName()) return; // Skip us
    const playerClass = getClassOf(playerName);
    if (!playerClass) return; // not in dungeon

    if (entity.getY() < 205 && entity.getY() > 164 && isValidP2(playerClass)) {
      lastLocation.AtP2 = true;
      showAlert(playerName, playerClass, "At P2!");
    }
    if (isPlayerInArea(106, 110, 118, 122, 92, 96, entity) && isValidAtSS()) {
      lastLocation.AtSS = true;
      showAlert(playerName, playerClass, "At SS!");
    }
    if (isPlayerInArea(49, 58, 108, 115, 129, 133, entity) && isValidEE2()) {
      lastLocation.AtEE2 = true;
      showAlert(playerName, playerClass, "At Pre Enter 2!");
    }
    if (isPlayerInArea(0, 4, 108, 115, 98, 107, entity) && isValidEE3()) {
      lastLocation.AtEE3 = true;
      showAlert(playerName, playerClass, "At Pre Enter 3!");
    }
    if (isPlayerInArea(52, 56, 113, 117, 49, 53, entity) && isValidAtCore()) {
      lastLocation.AtCore = true;
      showAlert(playerName, playerClass, "At Core!");
    }
    if (isPlayerInArea(41, 68, 110, 150, 59, 117, entity) && !isValidInGoldorTunnel()) {
      lastLocation.InGoldorTunnel = true;
      showAlert(playerName, playerClass, "Inside Goldor Tunnel");
    }
    if (isPlayerInArea(47, 61, 64, 75, 69, 83, entity) && isValidAtMid()) {
      lastLocation.AtMid = true;
      showAlert(playerName, playerClass, "At Mid!");
    }
    if (entity.getY() < 50 && entity.getY() > 4 && isValidAtP5()) {
      lastLocation.AtP5 = true;
      showAlert(playerName, playerClass, "At P5!");
    }
    if (isPlayerInArea(91, 93, 129, 133, 44, 46, entity) && isValidAti4Entry(playerClass)) {
      lastLocation.Ati4Entry = true;
      showAlert(playerName, playerClass, "At i4 Entry!");
    }
  });
}), () => config.togglePosTitles);

registerWhen(register("chat", (player, message) => {
  const name = player.replace(/\[.*?\]\s*/, ""); // remove rank
  if (name === Player.getName()) return; // skip us
  let msg = message.toLocaleLowerCase();

  const playerClass = getClassOf(name);

  if (isValidP2(playerClass) && validP2Msg.some(term => msg.includes(term))) {
    lastLocation.AtP2 = true;
    showAlert(name, playerClass, "At P2!");
  }
  if (isValidAtSS() && validAtSSMsg.some(term => msg.includes(term))) {
    lastLocation.AtSS = true;
    showAlert(name, playerClass, "At SS!");
  }
  if (isValidEE2() && validEE2Msg.some(term => msg.includes(term))) {
    lastLocation.AtEE2 = true;
    showAlert(name, playerClass, "At Pre Enter 2!");
  }
  if (isValidEE3() && validEE3Msg.some(term => msg.includes(term))) {
    lastLocation.AtEE3 = true;
    showAlert(name, playerClass, "At Pre Enter 3!");
  }
  if (isValidAtCore() && validAtCoreMsg.some(term => msg.includes(term))) {
    lastLocation.AtCore = true;
    showAlert(name, playerClass, "At Core!");
  }
  if (isValidInGoldorTunnel() && validInGoldorTunnelMsg.some(term => msg.includes(term))) {
    lastLocation.InGoldorTunnel = true;
    showAlert(name, playerClass, "Inside Goldor Tunnel!");
  }
  if (isValidAtMid() && validAtMidMsg.some(term => msg.includes(term))) {
    lastLocation.AtMid = true;
    showAlert(name, playerClass, "At Mid!");
  }
  if (isValidAti4Entry(playerClass) && validAti4EntryMsg.some(term => msg.includes(term))) {
    lastLocation.Ati4Entry = true;
    showAlert(name, playerClass, "At i4 Entry!");
  }
  if (isValidAtP5() && validAtP5Msg.some(term => msg.includes(term))) {
    lastLocation.AtP5 = true;
    showAlert(name, playerClass, "At P5!");
  }
}).setCriteria("Party > ${player}: ${message}"), () => config.togglePosTitles);

register("worldUnload", () => Object.keys(lastLocation).forEach(key => lastLocation[key] = false));