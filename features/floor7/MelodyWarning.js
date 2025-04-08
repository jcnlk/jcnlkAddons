import { getCurrentGoldorPhase, getClassColor } from "../../utils/Dungeon";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { registerWhen } from "../../utils/Utils";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

const playersStackingMelody = [];
let playerName = "";
let melodyProgress = "";
let furthestAlongMelody = 0;
let lastPhase = 0;

const melodyWarningHud = new Hud("melodyWarningHud", "&cPlayer (B) has Melody! 3/4", HudManager, data);

function resetMelody() {
  playersStackingMelody.length = 0;
  melodyProgress = "";
  furthestAlongMelody = 0;
  playerName = "";
}

registerWhen(register("step", () => {
  const currentPhase = getCurrentGoldorPhase();
  if (currentPhase !== lastPhase) {
    resetMelody();
    lastPhase = currentPhase;
  }
}).setFps(1), () => config.melodyWarning);

registerWhen(register("chat", (message) => {
  const currentPhase = getCurrentGoldorPhase();
  if (currentPhase < 1 || currentPhase > 4) return;
  
  const melodyMatch = message.match(/^Party >[\s\[\w+\]]* (\w+): .*(\d\/\d|\d\d%)$/);
  
  if (melodyMatch) {
    const playerMatched = melodyMatch[1];
    
    if (!playersStackingMelody.includes(playerMatched) && playerMatched !== Player.getName()) {
      playersStackingMelody.push(playerMatched);
    }
    
    if (playerMatched === Player.getName()) return;
    
    let progress = melodyMatch[2];
    if (progress.includes("%")) {
      const percentage = parseInt(progress);
      if (!isNaN(percentage) && percentage >= 25) progress = Math.floor(percentage / 25) + "/4";
    }
    
    if (progress > furthestAlongMelody || furthestAlongMelody === 0) {
      playerName = playerMatched;
      furthestAlongMelody = progress;
      melodyProgress = progress;
      World.playSound("random.orb", 1, 1);
    }
    return;
  }

  const terminalMatch = message.match(/^(\w+) activated a terminal! \(\d+\/\d+\)$/);
  if (terminalMatch) {
    const completedPlayer = terminalMatch[1];
    
    const index = playersStackingMelody.indexOf(completedPlayer);
    if (index > -1) playersStackingMelody.splice(index, 1);
    if (completedPlayer === playerName) resetMelody();
  }
}).setCriteria("${message}"), () => config.melodyWarning);

registerWhen(register("renderOverlay", () => {
  const currentPhase = getCurrentGoldorPhase();
  
  if (!melodyProgress || currentPhase < 1 || currentPhase > 4 || HudManager.isEditing) return;
  
  const playerClass = Dungeon.classes[playerName];
  if (!playerClass) return;
  
  const displayMessage = getClassColor(playerClass) + `${playerName} (${playerClass[0]}) &ehas Melody! ${melodyProgress}`;
  melodyWarningHud.draw(displayMessage);
}), () => config.melodyWarning);

register("worldLoad", () => {
  resetMelody();
  lastPhase = 0;
});