import PogObject from "../../PogData";

const defaultData = {
    testHud: {
        x: 0.5,
        y: 0.5,
        scale: 1.0
    },
    maskTimerHud: {
        x: 0.5,
        y: 0.5,
        scale: 1.0
    }
};

export let data = new PogObject("jcnlkAddons/data", defaultData, "Data.json");

export const saveData = () => {
    data.save();
    ChatLib.chat("&aHUD settings saved!");
};

export const resetData = () => {
    Object.keys(defaultData).forEach((k) => {
        data[k] = defaultData[k];
    });
    saveData();
};
