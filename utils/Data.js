import PogObject from "PogData";

const defaultData = {
    // More Data here
}

const defaultHudData = {
    /**
    testHud: {
        x: 0.5,
        y: 0.5,
        scale: 1.0
    }
    */
    // More HudData here
}


export let Data = new PogObject('jcnlkAddons', defaultData, './data/Data.json');
export let HudData = new PogObject('jcnlkAddons', defaultHudData, './data/HudData.json');
// More DataObjects here


export const resetData = () => {
    Object.keys(defaultData).forEach((k) => {
        data[k] = defaultData[k];
    });
    data.save();
};