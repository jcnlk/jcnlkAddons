import { LocalStore } from "../../tska/storage/LocalStore";

const defaultData = {
    maskTimerHud: {
        x: 0.65,
        y: 0.5,
        scale: 1.0
    },
    quizTimerHud: {
        x: 0.5,
        y: 0.5,
        scale: 1.0
    },
    procHud: {
        x: 0.5,
        y: 0.35,
        scale: 1.5
    },
    melodyWarningHud: {
        x: 0.5,
        y: 0.20,
        scale: 1.5
    },
    posTitlesHud: {
        x: 0.5,
        y: 0.30,
        scale: 1.7
      },
    reminders: [],
    customEmotes: {}
};

export const data = new LocalStore("jcnlkAddons/data", defaultData, "Data.json");