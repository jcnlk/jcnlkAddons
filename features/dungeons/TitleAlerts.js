import config from "../../config";
import { GREEN, RED, YELLOW } from "../../utils/Constants";
import { inDungeon } from "../../utils/Dungeon";

// Cooldown tracking
let lastTitleTime = 0;
const TITLE_COOLDOWN = 1000;

/**
 * Removes rank prefixes from player names
 * @param {string} name - The player name with possible rank
 * @returns {string} - Clean player name without rank
 */
function removeRank(name) {
    return name.replace(/\[.*?\] /, '');
}

/**
 * Plays a sequence of meow sounds
 * @param {number} duration - Total duration in ms
 * @param {number} pitch - Sound pitch
 */
function playMeowLoop(duration = 3000, pitch = 2) {
    const interval = 125;  // Time between meows
    const numberOfMeows = Math.floor(duration / interval);
    
    function playNext(index) {
        if (index >= numberOfMeows) return;
        setTimeout(() => {
            World.playSound("mob.cat.meow", 1, pitch);
            playNext(index + 1);
        }, interval);
    }
    
    playNext(0);
}

/**
 * Shows a dungeon alert title in more cleaner
 * @param {string} mainText - The main title text
 * @param {string} subText - Optional subtitle text
 */
function showDungeonAlert(mainText, subText = "") {
    let overlay = register("renderOverlay", () => {
        const scaleMain = 1.7;
        const scaleSub = 1.4;
        
        const screenHeight = Renderer.screen.getHeight();
        const screenWidth = Renderer.screen.getWidth();
        const yPos = screenHeight * 0.25;
        
        // Main text
        Renderer.translate(screenWidth / 2, yPos);
        Renderer.scale(scaleMain, scaleMain);
        Renderer.drawStringWithShadow(
            mainText,
            -Renderer.getStringWidth(mainText) / 2,
            0
        );
        
        // Subtitles
        if (subText) {
            Renderer.translate(screenWidth / 2, yPos + 20);
            Renderer.scale(scaleSub / scaleMain, scaleSub / scaleMain);
            Renderer.drawStringWithShadow(
                subText,
                -Renderer.getStringWidth(subText) / 2,
                0
            );
        }
    });

    playMeowLoop();
    
    setTimeout(() => {
        overlay.unregister();
    }, 3000);
}

/**
 * Checks if a message is from the current player
 * @param {string} name - The name to check
 * @returns {boolean} - Whether the message is from the current player
 */
function isOwnMessage(name) {
    const playerName = Player.getName();
    return name === playerName || removeRank(name) === playerName;
}

/**
 * Checks if a message contains pre-enter phase announcements
 * @param {string} message - The chat message to check
 * @returns {string|null} - The phase number or null
 */
function checkPreEnterMessage(message) {
    const lowerMsg = message.toLowerCase();
    
    // Phase 2
    if (lowerMsg.match(/\b(early enter|pre enter|ee|early entry) 2\b/i) || 
        lowerMsg.match(/\b(ee2)\b/i) ||
        lowerMsg.includes("at ee2") || 
        lowerMsg.includes("entered 3.2") ||
        lowerMsg.includes("at pre enter 2") ||
        lowerMsg.includes("at pre 2") ||
        lowerMsg.includes("early 2")) {
        return "2";
    } 
    
    // Phase 3
    if (lowerMsg.match(/\b(early enter|pre enter|ee|early entry) 3\b/i) || 
        lowerMsg.match(/\b(ee3)\b/i) ||
        lowerMsg.includes("at ee3") || 
        lowerMsg.includes("entered 3.3") ||
        lowerMsg.includes("at pre enter 3") ||
        lowerMsg.includes("at pre 3") ||
        lowerMsg.includes("early 3")) {
        return "3";
    }
    
    // Phase 4
    if (lowerMsg.match(/\b(early enter|pre enter|ee|early entry) 4\b/i) || 
        lowerMsg.match(/\b(ee4)\b/i) ||
        lowerMsg.includes("at ee4") || 
        lowerMsg.includes("entered 3.4") ||
        lowerMsg.includes("at pre enter 4") ||
        lowerMsg.includes("at pre 4") ||
        lowerMsg.includes("early 4")) {
        return "4";
    }
    
    // Phase 5 / Core
    if (lowerMsg.match(/\b(early enter|pre enter|ee|early entry) 5\b/i) || 
        lowerMsg.match(/\b(ee5)\b/i) ||
        lowerMsg.includes("at ee5") || 
        lowerMsg.includes("entered 3.5") || 
        lowerMsg.includes("at core") ||
        lowerMsg.includes("at pre enter 5") ||
        lowerMsg.includes("at pre 5") ||
        lowerMsg.includes("early 5")) {
        return "5";
    }
    
    return null;
}

function checkI4Message(message) {
    const lowerMsg = message.toLowerCase();
    
    // Check for entry messages with variations
    if (lowerMsg.includes("at i4 entry") || 
        lowerMsg.includes("i4 entry")) {
        return "entry";
    }
    
    // Check for moving messages with variations
    if (lowerMsg.includes("moving to i4") ||
        lowerMsg.includes("going to i4") ||
        lowerMsg.includes("heading to i4")) {
        return "moving";
    }
    
    return null;
}

function checkPhaseMessage(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes("at p2") || 
        lowerMsg.includes("in p2") ||
        lowerMsg.includes("phase 2") ||
        lowerMsg.includes("at pre p2") ||
        lowerMsg.includes("pre enter p2")) {
        return "p2";
    }
    
    if (lowerMsg.includes("at mid") || 
        lowerMsg.includes("in mid") ||
        lowerMsg.includes("at middle")) {
        return "mid";
    }
    
    if (lowerMsg.includes("at p4") || 
        lowerMsg.includes("in p4") ||
        lowerMsg.includes("phase 4")) {
        return "p4";
    }
    
    if (lowerMsg.includes("at p5") || 
        lowerMsg.includes("in p5") ||
        lowerMsg.includes("phase 5")) {
        return "p5";
    }
    
    if (lowerMsg.includes("at ss") || 
        lowerMsg.includes("in ss") ||
        lowerMsg.includes("at simon says")) {
        return "ss";
    }
    
    return null;
}

/**
 * Gets the player's current class from tab list
 * @returns {string|null} - The player's class or null
 */
function getPlayerClass() {
    const regex = new RegExp(`${Player.getName()} \\((\\w+)`);
    const match = TabList.getNames()
        .map(a => ChatLib.removeFormatting(a))
        .join(", ")
        .match(regex);
    return match ? match[1] : null;
}

// Handle pre-enter phase announcements
register("chat", (name, message) => {
    if (!inDungeon) return;
    if (!config.PreEnterTitles || isOwnMessage(name)) return;
    
    const currentTime = Date.now();
    if (currentTime - lastTitleTime < TITLE_COOLDOWN) return;
    
    const phase = checkPreEnterMessage(message);
    if (phase) {
        const cleanName = removeRank(name);
        const mainText = phase === "5" ? 
            `${YELLOW}${cleanName} at Core!` : 
            `${YELLOW}${cleanName} at Pre Enter ${phase}!`;
            
        showDungeonAlert(mainText);
        lastTitleTime = currentTime;
    }
}).setChatCriteria("Party > ${name}: ${message}");

// Handle i4 position announcements - Healer only
register("chat", (name, message) => {
    if (!inDungeon) return;
    if (!config.i4PositionTitles || isOwnMessage(name)) return;
    
    const playerClass = getPlayerClass();
    if (playerClass !== 'Healer') return;
    
    const currentTime = Date.now();
    if (currentTime - lastTitleTime < TITLE_COOLDOWN) return;
    
    const i4Status = checkI4Message(message);
    if (i4Status) {
        const cleanName = removeRank(name);
        if (i4Status === "entry") {
            showDungeonAlert(
                `${GREEN}${cleanName} at i4 entry!`,
                //`${GREEN}You can leap!`
            );
        } else if (i4Status === "moving") {
            showDungeonAlert(
                `${RED}${cleanName} is moving to i4!`,
                //`${RED}Don't leap yet!`
            );
        }
        lastTitleTime = currentTime;
    }
}).setChatCriteria("Party > ${name}: ${message}");

// Handle phase announcements (P2/P4/Mid/P5/SS)
register("chat", (event) => {
    if (inDungeon) return;
    const message = ChatLib.removeFormatting(event);
    if (!message.startsWith('Party >')) return;
    
    const parts = message.split(':');
    if (parts.length < 2) return;
    
    const nameSection = parts[0].substring(8);
    const name = nameSection.trim();
    if (isOwnMessage(name)) return;
    
    const chatMessage = parts[1].trim();
    
    const currentTime = Date.now();
    if (currentTime - lastTitleTime < TITLE_COOLDOWN) return;
    
    const phaseStatus = checkPhaseMessage(chatMessage);
    if (!phaseStatus) return;
    
    const cleanName = removeRank(name);
    
    switch(phaseStatus) {
        case "p2":
            if (!config.PreP2Titles) return;
            showDungeonAlert(`${YELLOW}${cleanName} at P2!`);
            break;
        case "mid":
            if (!config.PreP4Titles) return;
            showDungeonAlert(`${YELLOW}${cleanName} at Mid!`);
            break;
        case "p4":
            if (!config.PreP4Titles) return;
            showDungeonAlert(`${YELLOW}${cleanName} at P4!`);
            break;
        case "p5":
            if (!config.PreP5Titles) return;
            showDungeonAlert(`${YELLOW}${cleanName} at P5!`);
            break;
        case "ss":
            if (!config.PreDevTitles) return;
            showDungeonAlert(`${YELLOW}${cleanName} at SS!`);
            break;
    }
    lastTitleTime = currentTime;
}).setCriteria("${message}");

// Reset on world load
register("worldLoad", () => {
    lastTitleTime = 0;
});