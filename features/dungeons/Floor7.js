import config from "../../config";

/**
 * Original idea from TurtleAddons: https://www.chattriggers.com/modules/v/TurtleAddons
 * 
 * TODO list: 
 * - Making "ati4Entry" annoucement when waiting (means no announcement when insta enter)
 * - Create a Title if somebody is Pre Enter - Player.getX(${playerName}) && Player.getY(${playerName}) && Player.getZ(${playerName})
 *      - Only show the ati4Entry title to Healer
 *      - Don't show if Client sent it (no self title)
 */

let inMaxor = false;
let inStorm = false;
let goldorPhase = 0;
let lastSend = 0;
let alreadySenti4 = false;
let alreadySenti4Entry = false;
let alreadySentEnteredi4 = false;
let lastSendDev = 0;

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
    if ((Player.getX() > 91 && Player.getX() < 93) && (Player.getY() > 129 && Player.getY() < 134) && (Player.getZ() > 44 && Player.getZ() < 46)) return true;
    else return false;
}

function Enteredi4() {
    //90 131 45
    //88 132 48 
    if ((Player.getX() > 8 && Player.getX() < 91) && (Player.getY() > 129 && Player.getY() < 134 ) && (Player.getZ () > 46 && Player.getZ() < 50)) return true
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
    //else if ((Player.getX() > 61 && Player.getX() < 65) && (Player.getY() > 126 && Player.getY() < 130) && (Player.getZ() > 33 && Player.getZ() < 37)) return 4; // not needed rn
    else return 0;
}

register('worldLoad', () => {
    inMaxor = false;
    inStorm = false;
    goldorPhase = 0;
    lastSend = 0;
    alreadySenti4 = false;
    alreadySenti4Entry = false;
    alreadySentEnteredi4 = false;
    lastSendDev = 0;
})

register("chat", (message) => {
    if (message == "[BOSS] Storm: I should have known that I stood no chance.") {
        goldorPhase = 1;
        inMaxor = false; // just incase as a backup
        inStorm = false;
    }
    else if ((message.includes('(7/7)') || message.includes('(8/8)')) && !message.includes(':')) {
        goldorPhase += 1;
        inMaxor = false; // just as a backup
        inStorm = false; // same here
    }
    else if (message == "[BOSS] Storm: Pathetic Maxor, just like expected.") {
        inMaxor = false;
        inStorm = true;
    }
    else if (message == "[BOSS] Maxor: WELL WELL WELL LOOK WHO'S HERE!") inMaxor = true;
}).setCriteria("${message}")

register("tick", () => {
    if (config.announcePreEnterPhase3) {
        //if (goldorPhase > 0 && inGoldorPhase() != lastSend && inGoldorPhase() > goldorPhase) {
        if (goldorPhase > 0 && inGoldorPhase() != lastSend) { // && inGoldorPhase() > goldorPhase
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
            if (!config.i4PositionBerserkerOnly || playerClass === 'Berserk') {
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
});






/**
import Settings from "../../config"; // this to config

let inp3 = false; // use inGoldorPhase > 0
const currentTitle = { title: null, time: null };
let started = null;

register("chat", () => inp3 = true).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?");
register("chat", () => inp3 = false).setCriteria("The Core entrance is opening!");

function catnoises() {
    World.playSound("mob.cat.meow", 0.45, 2.5);
}

function catnoisesloop() {
    const delays = Array(120).fill(10);

    function playWithDelay(index) {
        if (index >= delays.length) return;

        setTimeout(() => {
            catnoises();
            playWithDelay(index + 1);
        }, delays[index]);
    }

    playWithDelay(0);
}

// ig just use showTitle
const _drawTitle = (title) => {
    const screenWidth = Renderer.screen.getWidth();
    const screenHeight = Renderer.screen.getHeight();
    const scale = 2.5;
    const titleWidth = Renderer.getStringWidth(title) * scale;
    const x = (screenWidth - titleWidth) / 2 / scale;
    const y = (screenHeight / 2 / scale) - 20;

    Renderer.scale(scale);
    Renderer.drawStringWithShadow(title, x, y);
    Renderer.scale(1 / scale);
};

function formatMessage(msg) {
    const lowerCaseMsg = msg.toLowerCase();

    if (lowerCaseMsg.match(/\b(early enter|pre enter|ee|pre|early entry) 2\b/i) || lowerCaseMsg.includes("at ee2")) {
        return "2";
    } else if (lowerCaseMsg.match(/\b(early enter|pre enter|ee|pre|early entry) 3\b/i) || lowerCaseMsg.includes("at ee3")) {
        return "3";
    } else if (lowerCaseMsg.match(/\b(early enter|pre enter|ee|pre|early entry) 4\b/i) || lowerCaseMsg.includes("at ee4") || lowerCaseMsg.includes("at core")) {
        return "4";
    }

    return "";
}

const showTitle = (name, msg) => {
    const formattedMsg = formatMessage(msg);

    if (formattedMsg !== "") {
        let titleStyle = Settings.titleStyle === 0 ? "Pre Enter" : "Early Enter";  // Adjusted to match selector options order; not needed ig
        currentTitle.title = `&e${name} is At ${titleStyle} ${formattedMsg}`;
        if (msg.includes("!")) {
            currentTitle.title += "!!";
        } else {
            currentTitle.title += "!";
        }
        currentTitle.time = 1500;
        started = Date.now();

        catnoisesloop();
    }
};

register("chat", (rank, name, msg) => {
    if (!Settings.eeTitles || !inp3 || name === Player.getName()) return;

    showTitle(name, msg);
}).setCriteria(/Party > (\[.+\])? ?(.+): (.+)/);

register("renderOverlay", () => {
    if (!currentTitle.time || !currentTitle.title) return;

    const elapsed = Date.now() - started;
    const remainingTime = currentTitle.time - elapsed;

    if (remainingTime <= 0) {
        currentTitle.title = null;
        currentTitle.time = null;
        return;
    }

    _drawTitle(currentTitle.title);
});
*/