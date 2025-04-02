import { LocalStore } from "../../tska/storage/LocalStore";

const defaultData = {
    maskTimerHud: {
        x: 0.7,
        y: 0.5,
        scale: 1.25
    },
    quizTimerHud: {
        x: 0.5,
        y: 0.525,
        scale: 0.85
    },
    procHud: {
        x: 0.5,
        y: 0.35,
        scale: 1.5
    },
    melodyWarningHud: {
        x: 0.5,
        y: 0.2,
        scale: 1.5
    },
    posTitlesHud: {
        x: 0.5,
        y: 0.3,
        scale: 1.5
    },
    fireFreezeHud: {
        x: 0.5,
        y: 0.4,
        scale: 1.5
    },
    reminders: [],
    customEmotes: {}
};

export const data = new LocalStore("jcnlkAddons/data", defaultData, "Data.json");