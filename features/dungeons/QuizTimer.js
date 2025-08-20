import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { onTick } from "../../../tska/shared/ServerTick";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

let initialDuration = 0;
let currentDuration = 0;

const quizTimerHud = new Hud("quizTimerHud", `&bQuiz: &c12s`, HudManager, data);

Dungeon.registerWhenInDungeon(register("renderOverlay", () => {
  if (!config.quizTimer || currentDuration <= 0) return;

  const fraction = currentDuration / initialDuration;
  let color;
  if (fraction > 0.5) color = `&c`;
  else if (fraction > 0.25) color = `&e`;
  else color = `&a`;

  quizTimerHud.draw(`${color}${currentDuration.toFixed(2)}s`);
}));

const startTimer = (duration) => {
  initialDuration = duration;
  currentDuration = duration;
};

onTick(() => {
  if (!config.quizTimer) return;
  if (currentDuration > 0) currentDuration -= 0.05;
});

register("chat", () => startTimer(11)).setCriteria("[STATUE] Oruo the Omniscient: I am Oruo the Omniscient. I have lived many lives. I have learned all there is to know.");
register("chat", () => startTimer(7)).setCriteria(/\[STATUE\] Oruo the Omniscient: .+ answered Question #\d correctly!/);

register("worldUnload", () => {
  initialDuration = 0;
  currentDuration = 0;
});