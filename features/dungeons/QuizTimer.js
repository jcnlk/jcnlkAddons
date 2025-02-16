import { registerWhen } from "../../utils/Register";
import { getIsInDungeon } from "../../utils/Dungeon";
import config from "../../config";
import HudManager from "../../utils/Hud";
import { Hud } from "../../utils/Hud";
import { data } from "../../utils/Data";
import { GREEN, YELLOW, RED } from "../../utils/Utils";

let timerStart = 0;
let timerDuration = 0;

const quizTimerHud = new Hud("quizTimerHud", `${RED}12s`, HudManager, data);

registerWhen(
  register("renderOverlay", () => {
    if (!World.isLoaded || !getIsInDungeon()) return;

    const elapsed = (Date.now() - timerStart) / 1000;
    const remaining = timerDuration - elapsed;
    if (remaining <= 0) return;

    const formattedTime = remaining.toFixed(2);

    const fraction = remaining / timerDuration;
    let color;
    if (fraction > 0.5) {
      color = `${RED}`;
    } else if (fraction > 0.25) {
      color = `${YELLOW}`;
    } else {
      color = `${GREEN}`;
    }

    quizTimerHud.draw(`${color}${formattedTime}s`);
  }),
  () => config.quizTimer
);

const startQuizTimer = (duration) => {
  timerStart = Date.now();
  timerDuration = duration;
};

register("chat", () => startQuizTimer(12)).setCriteria(
  "[STATUE] Oruo the Omniscient: I am Oruo the Omniscient. I have lived many lives. I have learned all there is to know."
);

register("chat", () => startQuizTimer(8.2)).setCriteria(
  /\[STATUE\] Oruo the Omniscient: .+ answered Question #\d correctly!/
);
