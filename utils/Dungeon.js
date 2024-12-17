import { getCurrentArea } from "./Area";
import { showDebugMessage, showGeneralJAMessage } from "./ChatUtils";
import { formatTime } from "./Formatting";

const BossStatus = Java.type('net.minecraft.entity.boss.BossStatus');

let lb = 0;
let icespray = false;

export function setLb(lbCount) { lb = lbCount; }
export function getLb() { return lb; }
export function setSpray(iceSprayHit) { icespray = iceSprayHit; }
export function getSpray() { return icespray; }

export function getCurrentClass() {
    const tabNames = TabList.getNames();
    const partyNumLine = tabNames.find(function(name) {
        return name.includes('§r§b§lParty §r§f(');
    });
    let currentClass = '';
    try {
        if (partyNumLine) {
            const partyNum = parseInt(partyNumLine.match(/\d+/g)[0]);
            for (let i = 0; i < partyNum; i++) {
                if (tabNames[i * 4 + 1].removeFormatting().includes(Player.getName())) {
                    const match = tabNames[i * 4 + 1].removeFormatting().match(/\((\S+)\s+(\S+)\)/);
                    if (match) {
                        currentClass = match[1];
                    }
                }
            }
        }
    } catch (e) {
        showDebugMessage("Error getting current class: " + e.message, 'error');
    }
    return currentClass;
}

export function getCurrentFloor() {
    const area = getCurrentArea();
    const match = area.match(/The Catacombs \((F|M)(\d+)\)/);
    if (match) {
        return {
            type: match[1], // 'F' for Floor, 'M' for Master Mode
            number: parseInt(match[2])
        };
    }
    return null;
}

export function inDungeon() {
    return getCurrentArea().includes('The Catacombs');
}

// Generate functions for each floor
function createFloorFunction(type, number) {
    return function() {
        const floor = getCurrentFloor();
        return floor && floor.type === type && floor.number === number;
    };
}

export const inF1 = createFloorFunction('F', 1);
export const inF2 = createFloorFunction('F', 2);
export const inF3 = createFloorFunction('F', 3);
export const inF4 = createFloorFunction('F', 4);
export const inF5 = createFloorFunction('F', 5);
export const inF6 = createFloorFunction('F', 6);
export const inF7 = createFloorFunction('F', 7);

export const inM1 = createFloorFunction('M', 1);
export const inM2 = createFloorFunction('M', 2);
export const inM3 = createFloorFunction('M', 3);
export const inM4 = createFloorFunction('M', 4);
export const inM5 = createFloorFunction('M', 5);
export const inM6 = createFloorFunction('M', 6);
export const inM7 = createFloorFunction('M', 7);

export function inMaxor() {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    return bossName.removeFormatting().includes('Maxor');
}

export function inStorm() {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    return bossName.removeFormatting().includes('Storm');
}

export function inGoldor() {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    return bossName.removeFormatting().includes('Goldor');
}

export function inNecron() {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    return bossName.removeFormatting().includes('Necron');
}

export function inWitherKing() {
    const bossName = BossStatus.field_82827_c;
    if (!bossName) return false;
    return bossName.removeFormatting().includes('Wither King');
}

export function getBossHealthPercent() {
    return BossStatus.field_82828_a;
}

export function getCrypts() {
    try {
        const tabList = TabList.getNames();
        if (!tabList) {
            //showDebugMessage("TabList is null in getCryptCountFromTablist", 'error');
            return 0;
        }
        for (let line of tabList) {
            line = ChatLib.removeFormatting(line);
            if (line.includes("Crypts: ")) {
                const count = parseInt(line.split("Crypts: ")[1]);
                return isNaN(count) ? 0 : count;
            }
        }
    } catch (error) {
        //showDebugMessage(`Error in getCryptCountFromTablist: ${error}`, 'error');
    }
    return 0;
}

/**
 * Gets the current dungeon time from the tablist
 * @returns {number|null} Time in seconds or null if not found
 */
export function getDungeonTime() {
    try {
        const tabList = TabList.getNames();
        if (!tabList || tabList.length < 46) {
            //showDebugMessage("Tablist is not long enough to read time information", 'warning');
            return null;
        }

        const timeLine = ChatLib.removeFormatting(tabList[45]).trim();
        
        if (!timeLine.startsWith("Time: ")) {
            //showDebugMessage(`Unexpected time line format: "${timeLine}"`, 'warning');
            return null;
        }

        // Match either "XXm XXs" or just "XXs"
        const timeMatch = timeLine.match(/Time: (?:(\d+)m )?(\d+)s/);
        
        if (timeMatch) {
            const minutes = timeMatch[1] ? parseInt(timeMatch[1]) : 0;
            const seconds = parseInt(timeMatch[2]);
            return minutes * 60 + seconds;
        } else {
            //showDebugMessage(`Failed to parse time from tablist: "${timeLine}"`, 'warning');
            return null;
        }
    } catch (error) {
        //showDebugMessage(`Error in getTimeFromTablist: ${error}`, 'error');
        return null;
    }
}

register("command", function() {
    const floor = getCurrentFloor();
    const currentClass = getCurrentClass();
    showGeneralJAMessage("Current Floor: " + (floor ? (floor.type + floor.number) : 'Not in dungeon'));
    showGeneralJAMessage("Current Dungeon Time: " + (formatTime(getDungeonTime())));
    showGeneralJAMessage("Current Class: " + (currentClass || 'Unknown'));
    showGeneralJAMessage("Crypt Count: "+ (getCrypts()));
    showGeneralJAMessage("In Dungeon: " + inDungeon());
    showGeneralJAMessage("Boss Health: " + (getBossHealthPercent() * 100) + "%");
    showGeneralJAMessage(`InMaxor: ` + (inMaxor()));
    showGeneralJAMessage(`InStorm: ` + (inStorm()));
    showGeneralJAMessage(`InGoldor: ` + (inGoldor()));
    showGeneralJAMessage(`InNecron: ` + (inNecron()));
    showGeneralJAMessage(`InWitherKing: ` + (inWitherKing()));
    showDebugMessage("getDungeonInfo command executed");
}).setName("getDungeonInfo");