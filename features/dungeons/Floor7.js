import config from "../../config";
import { GREEN, RED, YELLOW } from "../../utils/Constants";
import { getItemId } from "../../utils/ItemID";
import { showTitle } from "../../utils/Title";

/**
 * Original idea from TurtleAddons: https://www.chattriggers.com/modules/v/TurtleAddons
 * 
 * TODO list: 
 * - Make Pre Enter P4 announcement (idk)
 *      - In middle as a 2nd annoucement (idk)
 * - Make Pre Enter P5 announcement
 *      - Healer only option
 * - Making "ati4Entry" annoucement when waiting (means no announcement when insta enter)
 * - Create a Title if somebody is Pre Enter - Player.getX(${playerName}) && Player.getY(${playerName}) && Player.getZ(${playerName})
 *      - Only show the ati4Entry title to Healer
 *      - Don't show if Client sent it (no self title)
 */

let inMaxor = false;
let inStorm = false;
let goldorPhase = 0;
let inNecron = false;
let lastSend = 0;
let alreadySenti4 = false;
let alreadySenti4Entry = false;
let alreadySentEnteredi4 = false;
let lastSendDev = 0;
let alreadySentAtPreP2 = false;
let alreadySentMaskTitle = false;

function inGoldorPhase() {
    if ((Player.getX() > 90 && Player.getX() < 110) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 52 && Player.getZ() < 123)) return 1;
    else if ((Player.getX() > 17 && Player.getX() < 105) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 125 && Player.getZ() < 142)) return 2;
    else if ((Player.getX() > -2 && Player.getX() < 15) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 49 && Player.getZ() < 137)) return 3;
    else if ((Player.getX() > -2 && Player.getX() < 88) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 30 && Player.getZ() < 48)) return 4;
    else if ((Player.getX() > 41 && Player.getX() < 68) && (Player.getY() > 110 && Player.getY() < 150) && (Player.getZ() > 59 && Player.getZ() < 117)) return 5;
    else return 0;
}

function ati4() {
    if ((Player.getX() > 61 && Player.getX() < 65) && (Player.getY() > 126 && Player.getY() < 130) && (Player.getZ() > 33 && Player.getZ() < 37)) return true;
    else return false;
}

function ati4Entry() {
    //Party > [MVP+] jcnlk: x: 92, y: 132, z: 45
    //Party > [MVP+] jcnlk: x: 92, y: 131, z: 45
    if ((Player.getX() > 91 && Player.getX() < 93) && (Player.getY() > 129 && Player.getY() < 133) && (Player.getZ() > 44 && Player.getZ() < 46)) return true;
    else return false;
}

function Enteredi4() {
    //90 131 45
    //88 132 48 
    if ((Player.getX() > 87 && Player.getX() < 91) && (Player.getY() > 129 && Player.getY() < 134 ) && (Player.getZ () > 46 && Player.getZ() < 50)) return true
    else return false;
}

function atDev() {
    if ((Player.getX() > 106 && Player.getX() < 111) && (Player.getY() > 119 && Player.getY() < 122) && (Player.getZ() > 92 && Player.getZ() < 95)) return 1;
    // Party > [MVP+] jcnlk: x: 61, y: 131, z: 142
    // Party > [MVP+] jcnlk: x: 59, y: 132, z: 138
    else if ((Player.getX() > 58 && Player.getX() < 62) && (Player.getY() > 130 && Player.getY() < 135) && (Player.getZ() > 137 && Player.getZ() < 143)) return 2;
    // Party > [MVP+] jcnlk: x: 3, y: 120, z: 76
    // Party > [MVP+] jcnlk: x: -2, y: 120, z: 78
    else if ((Player.getX() > -3 && Player.getX() < 4) && (Player.getY() > 119 && Player.getY() < 123) && (Player.getZ() > 75 && Player.getZ() < 79)) return 3;
    //else if ((Player.getX() > 61 && Player.getX() < 65) && (Player.getY() > 126 && Player.getY() < 130) && (Player.getZ() > 33 && Player.getZ() < 37)) return 4; // not needed cuz ati4 is the same
    else return 0;
}

function atEarlyP2() {
    if (Player.getY() < 205 && Player.getY() > 168) return true;
    else return false;
}

// I know that most of that values are not needed but i do it just in case of "/ct reload" (probably not needed)
register("chat", (message) => {
    if (message == "[BOSS] Storm: I should have known that I stood no chance.") {
        goldorPhase = 1;
        inMaxor = false;
        inStorm = false;
        inNecron = false
    }
    else if ((message.includes('(7/7)') || message.includes('(8/8)')) && !message.includes(':')) {
        goldorPhase += 1;
        inMaxor = false;
        inStorm = false;
        inNecron = false;
    }
    else if (message == "[BOSS] Storm: Pathetic Maxor, just like expected.") {
        inMaxor = false;
        inStorm = true;
        goldorPhase = 0;
        inNecron = false;
    }
    else if (message == "[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!") {
        inMaxor = true;
        inStorm = false;
        goldorPhase = 0;
        inNecron = false;
    }
    else if (message = "[BOSS] Necron: Finally, I heard so much about you. The Eye likes you very much.") {
        inMaxor = false;
        inStorm = false;
        goldorPhase = 0;
        inNecron = true;
    }
}).setCriteria("${message}")

register("tick", () => {
    if (config.announcePreEnterPhase3) {
        //if (goldorPhase > 0 && inGoldorPhase() != lastSend && inGoldorPhase() > goldorPhase) {
        if (goldorPhase > 0 && inGoldorPhase() != lastSend) {
            if (goldorPhase === 1 && inGoldorPhase() === 2) {
                ChatLib.command(`pc At Pre Enter 2!`);
                lastSend = 2;
            } 
            else if (goldorPhase === 2 && inGoldorPhase() === 3) {
                ChatLib.command(`pc At Pre Enter 3!`);
                lastSend = 3;
            }
            else if (goldorPhase === 3 && inGoldorPhase() === 4) {
                ChatLib.command(`pc At Pre Enter 4!`);
                lastSend = 4;
            }
            else if (goldorPhase === 4 && inGoldorPhase() === 5) { 
                ChatLib.command(`pc At Core!`);
                lastSend = 5;
            }
            
        }
    }
})

// This is used because some of the i4 position annoucements are overlapping with inGoldorPhase positions
register("tick", () => {
    // Helper function to get player class
    function getPlayerClass() {
        const regex = new RegExp(`${Player.getName()} \\((\\w+)`);
        const match = TabList.getNames()
            .map(a => ChatLib.removeFormatting(a))
            .join(", ")
            .match(regex);
        return match ? match[1] : null;
    }

    if (config.announcei4Position) {
        if (inStorm) {
            const playerClass = getPlayerClass();
            if ((!config.i4PositionBerserkOnly || playerClass === 'Berserk')) {
                if (ati4() && !alreadySenti4) {
                    ChatLib.command(`pc At i4!`);
                    alreadySenti4 = true;
                }
                else if (ati4Entry() && !alreadySenti4Entry) {
                    ChatLib.command(`pc At i4 Entry (HEALER CAN LEAP)!`);
                    alreadySenti4Entry = true;
                }
                else if (Enteredi4() && !alreadySentEnteredi4) {
                    ChatLib.command(`pc Moving to i4 (DON'T LEAP)!`);
                    alreadySentEnteredi4 = true;
                }
            }
        }
    }

    const playerClass = getPlayerClass();

    if (config.announcePreSS) {
        if (inStorm) {
            if (!config.PreSSHealerOnly || playerClass === 'Healer') {
                if (atDev() === 1 && !lastSendDev) {
                    ChatLib.command(`pc At SS!`);
                    lastSendDev = 1;
                }
            }
        }
    }

    if (config.announcePreDevPosition) {
        if (inStorm) {
            if (!config.PreDevPositionHealerOnly || playerClass === 'Healer') {
                if (atDev() === 2 && lastSendDev !== 2) {
                    ChatLib.command(`pc At Pre Dev 2!`);
                    lastSendDev = 2;
                }
                if (atDev() === 3 && lastSendDev !== 3) {
                    ChatLib.command(`pc At Pre Dev 3!`);
                    lastSendDev = 3;
                }
            }
        }
    }

    // Don't ask my why i did it this way..
    if (config.announcePreEnterP2) {
        if (inMaxor) {
            if (playerClass === 'Berserk') {
                if (!config.PreEnterP2MageOnly) {
                    if (atEarlyP2() && !alreadySentAtPreP2) {
                        ChatLib.command(`pc At Pre Enter P2!`);
                        alreadySentAtPreP2 = true;
                    }
                }
                else if (config.PreEnterP2MageOnly && config.PreEnterP2BerserkOnly) {
                    if (atEarlyP2() && !alreadySentAtPreP2) {
                        ChatLib.command(`pc At Pre Enter P2!`);
                        alreadySentAtPreP2 = true;
                    }
                }
            }
            if (!playerClass === 'Mage') {
                if (!config.PreEnterP2BerserkOnly) {
                    if (atEarlyP2() && !alreadySentAtPreP2) {
                        ChatLib.command(`pc At Pre Enter P2!`);
                        alreadySentAtPreP2 = true;
                    }
                }
                else if (config.PreEnterP2MageOnly && config.PreEnterP2BerserkOnly) {
                    if (atEarlyP2() && !alreadySentAtPreP2) {
                        ChatLib.command(`pc At Pre Enter P2!`);
                        alreadySentAtPreP2 = true;
                    }
                }
            }
            //else ChatLib.chat("No class match!"); // Could happen in solo runs or when scoreboard is bugged (or bad code ofc)
        }
    }

    // if setting here
        //if (inNecron) {
            //Class only here idk
                // if at position here
                
        //}
    
    if (config.MaskReminder) {
        if (goldorPhase === 1 && !alreadySentMaskTitle) {
            const helmetItemId = getItemId(Player.armor.getHelmet());
            if (helmetItemId === 'BONZO_MASK' || helmetItemId === 'STARRED_BONZO_MASK' || helmetItemId === 'SPIRIT_MASK' || helmetItemId === 'STARRED_SPIRIT_MASK') return;
            else {
                showTitle(`${RED}⚠ MASK NOT EQUIPPED! ⚠`, 3000, true);
                World.playSound("random.orb", 1, 1); // maybe a different sound idk
                alreadySentMaskTitle = true;
            }
        }
    }
});

/**
 * Original idea from TepturedAddons :https://www.chattriggers.com/modules/v/TepturedAddons
 */

let lastTitleTime = 0;
const TITLE_COOLDOWN = 1000; // 1 second cooldown between titles

function meowSoundLoop(duration) {
    const numberOfMeows = Math.floor(duration / 10);
    const delays = Array(numberOfMeows).fill(10);
    
    function playWithDelay(index) {
        if (index >= delays.length) return;
        
        setTimeout(() => {
            World.playSound("mob.cat.meow", 0.45, 2.5);
            playWithDelay(index + 1);
        }, delays[index]);
    }
    
    playWithDelay(0);
}

function showPartyTitle(titleText, duration = 3000) {
    const currentTime = Date.now();
    if (currentTime - lastTitleTime < TITLE_COOLDOWN) return;
    
    meowSoundLoop(duration);
    showTitle(titleText, duration, true);
    lastTitleTime = currentTime;
}

function checkPreEnterMessage(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.match(/\b(early enter|pre enter|ee|pre|early entry) 2\b/i) || 
        lowerMsg.includes("at ee2") || 
        lowerMsg.includes("entered 3.2")) {
        return "2";
    } else if (lowerMsg.match(/\b(early enter|pre enter|ee|pre|early entry) 3\b/i) || 
               lowerMsg.includes("at ee3") || 
               lowerMsg.includes("entered 3.3")) {
        return "3";
    } else if (lowerMsg.match(/\b(early enter|pre enter|ee|pre|early entry) 4\b/i) || 
               lowerMsg.includes("at ee4") || 
               lowerMsg.includes("entered 3.4")) {
        return "4";
    } else if (lowerMsg.match(/\b(early enter|pre enter|ee|pre|early entry) 5\b/i) || 
               lowerMsg.includes("at ee5") || 
               lowerMsg.includes("entered 3.5") || 
               lowerMsg.includes("at core")) {
        return "5";
    }
    return null;
}

register("chat", (name, message) => {
    if (name === Player.getName()) return;
    
    const phase = checkPreEnterMessage(message);
    if (phase) {
        const titleText = phase === "5" ? 
            `${GREEN} ${name} at Core!` : 
            `${GREEN} ${name} at Pre Enter ${phase}!`;
        showPartyTitle(titleText);
    }
}).setCriteria("Party > ${name}: ${message}");

function getPlayerClass() {
    const regex = new RegExp(`${Player.getName()} \\((\\w+)`);
    const match = TabList.getNames()
        .map(a => ChatLib.removeFormatting(a))
        .join(", ")
        .match(regex);
    return match ? match[1] : null;
}

function checki4Message(message) {
    const lowerMsg = message.toLowerCase();
    
    // Don't trigger for regular "at i4" messages
    if (lowerMsg === "at i4!") return null;
    
    if (lowerMsg.includes("at i4 entry")) {
        return "entry";
    } else if (lowerMsg.includes("moving to i4")) {
        return "moving";
    }
    return null;
}

// Separate sound functions for different i4 states
function meowSoundLoopEntry(duration) {
    const numberOfMeows = Math.floor(duration / 10);
    const delays = Array(numberOfMeows).fill(10);
    
    function playWithDelay(index) {
        if (index >= delays.length) return;
        
        setTimeout(() => {
            World.playSound("mob.cat.meow", 0.45, 2.5); // High pitch for entry (existing sound)
            playWithDelay(index + 1);
        }, delays[index]);
    }
    
    playWithDelay(0);
}

function meowSoundLoopMoving(duration) {
    const numberOfMeows = Math.floor(duration / 10);
    const delays = Array(numberOfMeows).fill(10);
    
    function playWithDelay(index) {
        if (index >= delays.length) return;
        
        setTimeout(() => {
            World.playSound("mob.cat.meow", 0.45, 0.7); // Lower pitch for moving warning
            playWithDelay(index + 1);
        }, delays[index]);
    }
    
    playWithDelay(0);
}

register("chat", (name, message) => {
    if (!config.enablei4PositionTitles) return;
    if (name === Player.getName()) return;

    if (config.i4TitlesHealerOnly) {
        const playerClass = getPlayerClass();
        if (playerClass !== 'Healer') return;
    }

    const currentTime = Date.now();
    if (currentTime - lastTitleTime < TITLE_COOLDOWN) return;
    
    const i4Status = checki4Message(message);
    if (i4Status) {
        switch(i4Status) {
            case "entry":
                showTitle(
                    `${GREEN}Leap to ${name}!`, 
                    3000, 
                    true,
                    `${GREEN}Healer at i4 entry!`
                );
                meowSoundLoopEntry(3000);
                break;
            case "moving":
                showTitle(
                    `${RED}Don't Leap to ${name}!`, 
                    3000, 
                    true,
                    `${RED}Healer is moving to i4!`
                );
                meowSoundLoopMoving(3000);
                break;
        }
        lastTitleTime = currentTime;
    }
}).setCriteria("Party > ${name}: ${message}");

// Reset all the stuff on world changes (world load)
register('worldLoad', () => {
    inMaxor = false;
    inStorm = false;
    goldorPhase = 0;
    inNecron = false;
    lastSend = 0;
    alreadySenti4 = false;
    alreadySenti4Entry = false;
    alreadySentEnteredi4 = false;
    lastSendDev = 0;
    alreadySentAtPreP2 = false;
    alreadySentMaskTitle = false;
    lastTitleTime = 0;
});
