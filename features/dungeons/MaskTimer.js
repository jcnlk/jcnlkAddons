import config from "../../config";
import { data } from "../../utils/Data";
import HudManager from "../../utils/Hud";
import { Hud } from "../../utils/Hud";
import { registerWhen } from "../../utils/Register";
import { getIsInDungeon } from "../../utils/Dungeon";

const masks = {
    bonzo: {
        name: "&9Bonzo Mask",
        duration: 1800,
        color: Renderer.BLUE,
        y: 200,
        chatCriteria: [/Your (⚚)? Bonzo's Mask saved your life!/]
    },
    spirit: {
        name: "&fSpirit Mask",
        duration: 300,
        color: Renderer.WHITE,
        y: 210,
        chatCriteria: ["Second Wind Activated! Your Spirit Mask saved your life!"]
    },
    phoenix: {
        name: "&cPhoenix",
        duration: 600,
        color: Renderer.RED,
        y: 220,
        chatCriteria: ["Your Phoenix Pet saved you from certain death!"]
    }
};

const timers = {};
const texts = {};

const baseYValue = Math.min(...Object.values(masks).map(m => m.y));

Object.keys(masks).forEach(key => {
    timers[key] = 0;
    texts[key] = new Text("")
        .setScale(2)
        .setShadow(true)
        .setColor(masks[key].color);
});

let proctext = " ";
const procTextDisplay = new Text("")
    .setScale(2)
    .setShadow(true)
    .setColor(Renderer.WHITE);

function setProcMessage(message) {
    proctext = message;
    setTimeout(() => {
        if (proctext === message) {
            proctext = " ";
        }
    }, 1500);
}

register("step", () => {
    if (!World.isLoaded() || !config.maskTimer) return;
    Object.keys(timers).forEach(key => {
        if (timers[key] > 0) timers[key]--;
    });
}).setFps(10);

Object.keys(masks).forEach(key => {
    masks[key].chatCriteria.forEach(criteria => {
        register("chat", () => {
            if (!config.maskTimer) return;
            timers[key] = masks[key].duration;
            setProcMessage(`${masks[key].name} Procced`);
        }).setCriteria(criteria);
    });
});

const maskTimerHud = new Hud("maskTimerHud", `&9&bBonzo Mask: &aREADY \n&f&bSpirit Mask: &aREADY \n&c&bPhoenix: &aREADY`, HudManager, data);

registerWhen(register("renderOverlay", () => {
    if (!World.isLoaded) return;
    if (HudManager.isEditing) return; //!config.maskTimer || 

    const isInDungeon = getIsInDungeon();
    if (!isInDungeon) return;
    
    const [baseX, baseY] = maskTimerHud.getCoords();
    const scale = maskTimerHud.getScale();

    Object.keys(masks).forEach(key => {
        const time = timers[key];
        const displayText = (time <= 0)
            ? `${masks[key].name}: &aREADY`
            : `${masks[key].name}: &6${(time / 10).toFixed(1)}`;
        texts[key].setString(displayText).setScale(scale);
        const relativeOffset = masks[key].y - baseYValue;
        texts[key].draw(baseX, baseY + relativeOffset * scale);
    });
    
    procTextDisplay.setScale(2 * scale);
    procTextDisplay.setString(proctext);
    const procTextWidth = procTextDisplay.getWidth();
    const procX = baseX - (procTextWidth / 2);
    const procY = baseY - 30 * scale;
    procTextDisplay.draw(procX, procY);
}), () => config.maskTimer);