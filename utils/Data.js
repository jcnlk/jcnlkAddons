import PogObject from "../../PogData";

const defaultData = {
    maskTimerHud: {
        x: 0.65,
        y: 0.50,
        scale: 1.0
    },
    quizTimerHud: {
        x: 0.5,
        y: 0.5,
        scale: 1.0
    },
    procHud: {
        x: 0.45,
        y: 0.35,
        scale: 1.5
    },
    reminders: [],
    customEmotes: {}
};

export let data = new PogObject("jcnlkAddons/data", defaultData, "Data.json");

register("gameUnload", () => {
    data.save();
});