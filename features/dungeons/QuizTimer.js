import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

let timerStart = 0;
let timerDuration = 0;

const quizTimerHud = new Hud("quizTimerHud", `&bQuiz: &c12s`, HudManager, data);

Dungeon.registerWhenInDungeon(register("renderOverlay", () => {
  if (!config.quizTimer) return;

  const elapsed = (Date.now() - timerStart) / 1000;
  const remaining = timerDuration - elapsed;
  if (remaining <= 0) return;

  const formattedTime = remaining.toFixed(2);

  const fraction = remaining / timerDuration;
  let color;
  if (fraction > 0.5) {
    color = `&c`;
  } else if (fraction > 0.25) {
    color = `&e`;
  } else {
    color = `&a`;
  }

  quizTimerHud.draw(`${color}${formattedTime}s`);
}));

const startQuizTimer = (duration) => {
  timerStart = Date.now();
  timerDuration = duration;
};

register("chat", () => startQuizTimer(12)).setCriteria("[STATUE] Oruo the Omniscient: I am Oruo the Omniscient. I have lived many lives. I have learned all there is to know.");
register("chat", () => startQuizTimer(8.2)).setCriteria(/\[STATUE\] Oruo the Omniscient: .+ answered Question #\d correctly!/);