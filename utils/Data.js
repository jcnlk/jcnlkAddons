import PogObject from "../../PogData";

const defaultData = {
    maskTimerHud: {
        x: 0.5,
        y: 0.5,
        scale: 1.0
    },
    reminders: [],
    customEmotes: {}
};

export let data = new PogObject("jcnlkAddons/data", defaultData, "Data.json");

/**
export const resetData = () => {
    Object.keys(defaultData).forEach((k) => {
        data[k] = defaultData[k];
    });
    saveData();
};
*/

register("gameUnload", () => {
    data.save();
});