import { getCurrentGoldorPhase } from "../../utils/Dungeon";
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

const melodyWarningHud = new Hud("melodyWarningHud", "&cPlayer has Melody! 3/4", HudManager, data);

function resetMelody() {
  while (playersStackingMelody.length) playersStackingMelody.pop();
  melodyProgress = "";
  furthestAlongMelody = 0;
}

registerWhen(register("tick", () => {
  const currentPhase = getCurrentGoldorPhase();
  if (currentPhase !== lastPhase) {
    resetMelody();
    lastPhase = currentPhase;
  }
}), () => config.melodyWarning);

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
    if (parseInt(progress) >= 25) {
      progress = Math.floor(parseInt(progress) / 25) + "/4";
    }
    
    if (progress > furthestAlongMelody || furthestAlongMelody === 0) {
      playerName = playerMatched;
      furthestAlongMelody = progress;
      melodyProgress = progress;
      World.playSound("random.orb", 1, 1);
    }
    return;
  }

  const terminalMatch = message.match(/^(\w+) activated a terminal! \(\d\/\d\)$/);
  if (terminalMatch && playersStackingMelody.includes(terminalMatch[1])) {
    const index = playersStackingMelody.indexOf(terminalMatch[1]);
    if (index > -1) {
      playersStackingMelody.splice(index, 1);
    }
    
    if (terminalMatch[1] === playerName) {
      resetMelody();
    }
  }
}).setCriteria("${message}"), () => config.melodyWarning);

registerWhen(register("renderOverlay", () => {
  const currentPhase = getCurrentGoldorPhase();
  if (!melodyProgress || currentPhase < 0 || currentPhase > 5 || HudManager.isEditing) return;
  
  const displayMessage = `&c${playerName} has Melody! ${melodyProgress}`;
  melodyWarningHud.draw(displayMessage);
}), () => config.melodyWarning);

register("worldLoad", () => {
  resetMelody();
  lastPhase = 0;
});