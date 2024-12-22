import { showGeneralJAMessage } from "../../utils/ChatUtils";
import { getCurrentClass } from "../../utils/Dungeon";
import { showTitle } from "../../utils/Title";
import { GREEN } from "../../utils/Constants";
import config from "../../config";

function atSS() {
    if ((Player.getX() > 106 && Player.getX() < 111) && (Player.getY() > 119 && Player.getY() < 122) && (Player.getZ() > 92 && Player.getZ() < 95)) return true;
    else return false;
}

// Store for the current button state
let lastExisted = false;
let blocks = new Set();
let currentPhase = 0; // Current phase (0 to 5)
let lastAnnouncedPhase = 0; // Last announced phase (0 to 5)
let sendTitle = false;

// Starting point of the Simon Says board
const start = [111, 120, 92];
const doneListeners = [];

/**
 * @callback ButtonsSpawned
 * @param {Set<String>} solution - The solution
 */

/**
 * Registers a function to be executed when all buttons appear.
 * @param {ButtonsSpawned} func - The function to execute when buttons spawn.
 */
export const onButtonsSpawned = (func) => doneListeners.push(func);

/**
 * Returns the current phase based on the number of buttons.
 * @returns {number} - The current phase (1 to 5), or 0 if inactive.
 */
export const getCurrentPhase = () => {
    return Math.min(blocks.size, 5); // Maximum phase is 5
};

/**
 * Checks for phase changes and announces them in party chat.
 */
const checkPhaseChange = () => {
    const newPhase = getCurrentPhase();

    if (newPhase > currentPhase) {
        currentPhase = newPhase;
        if (currentPhase > lastAnnouncedPhase) {
            announcePhaseToParty(currentPhase);
            lastAnnouncedPhase = currentPhase;
        }
    }

    if (newPhase < currentPhase) {
        currentPhase = newPhase;
    }
};

/**
 * Announces the current phase in party chat.
 * @param {number} phase - The phase to announce.
 */
const announcePhaseToParty = (phase) => {
    if (config.announceSSProgression && atSS()) {
        const text = `pc Current Simon Says phase: ${phase}/5`;
        ChatLib.command(`${text}`);
        showGeneralJAMessage(`Announced SS Phase ${phase}`);
    }
};

// Tick listener to update button states
register("tick", () => {
    let [x0, y0, z0] = start;
    let buttonsExist = World.getBlockAt(x0 - 1, y0, z0).type.getID() === 77;

    if (buttonsExist && !lastExisted) {
        lastExisted = true;
        doneListeners.forEach(func => func(blocks));
    }

    if (!buttonsExist && lastExisted) {
        lastExisted = false;
        blocks.clear();
    }

    for (let dy = 0; dy <= 3; dy++) {
        for (let dz = 0; dz <= 3; dz++) {
            let [x, y, z] = [x0, y0 + dy, z0 + dz];
            let block = World.getBlockAt(x, y, z);
            let str = [x, y, z].join(",");
            if (block.type.getID() !== 169) continue;
            blocks.add(str);
        }
    }

    // Check for phase changes
    checkPhaseChange();
});

// Player interaction to reset buttons
register("playerInteract", (action, pos) => {
    if (action.toString() !== "RIGHT_CLICK_BLOCK" || !blocks.size) return;

    let [x, y, z] = [pos.getX(), pos.getY(), pos.getZ()];
    if (x === 110 && y === 121 && z === 91) {
        blocks.clear();
        return;
    }

    let isButton = World.getBlockAt(x, y, z).type.getID() === 77;
    if (!isButton) return;

    let str = [x + 1, y, z].join(",");
    blocks.delete(str);
});

register("tick", () => {
    if (config.EE2Helper) {
        const playerClass = getCurrentClass();
        const PhaseSS = getCurrentPhase();
        if (playerClass === 'Archer' && PhaseSS >= 4 && !sendTitle) {
            showTitle(" ", 3000, true, `${GREEN}Early enter now!`);
            sendTitle = true
            World.playSound("note.harp", 2, 1);
        }
        if (PhaseSS < 4) sendTitle = false;
    }
})

// Reset buttons when the world unloads
register("worldUnload", () => {
    playerClass = null;
    currentPhase = 0;
    blocks.clear();
    lastAnnouncedPhase = 0;
    sendTitle = false;
});