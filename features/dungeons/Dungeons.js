import Config from "../../config";
import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";

// Global variables
let killedCrypts = 0;
let inDungeon = false;
let reminderSent = false;
let reminderEligibleTime = 0;
let timeScoreboardLine = null;
let searchingForTimeLine = false;
let checkDungeonTimeout = null;

/**
 * Initializes the Dungeon module
 */
function initialize() {
    if (!World.isLoaded()) {
        setTimeout(initialize, 1000);
        return;
    }
    
    startMainLoop();
}

/**
 * Checks if the player is currently in a dungeon
 * @returns {boolean} True if in dungeon, false otherwise
 */
function checkInDungeon() {
    try {
        const tabList = TabList.getNames();
        if (!tabList) {
            showDebugMessage("TabList is null", 'error');
            return false;
        }
        return tabList.some(line => 
            ChatLib.removeFormatting(line).includes("Dungeon:")
        );
    } catch (error) {
        showDebugMessage(`Error in checkInDungeon: ${error}`, 'error');
        return false;
    }
}

/**
 * Gets the current crypt count from the tablist
 * @returns {number} The current crypt count
 */
function getCryptCountFromTablist() {
    try {
        const tabList = TabList.getNames();
        if (!tabList) {
            showDebugMessage("TabList is null in getCryptCountFromTablist", 'error');
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
        showDebugMessage(`Error in getCryptCountFromTablist: ${error}`, 'error');
    }
    return 0;
}

/**
 * Formats time in seconds to a string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Formats crypt count for display
 * @param {number} count - Crypt count
 * @returns {string} Formatted crypt count
 */
function formatCryptCount(count) {
    return count > 5 ? "5+" : count.toString();
}

/**
 * Updates the crypt count
 * @returns {boolean} True if count was updated, false otherwise
 */
function updateCryptCount() {
    if (!inDungeon || !Config.enableCryptReminder) return false;

    const newCount = getCryptCountFromTablist();
    if (newCount !== killedCrypts) {
        killedCrypts = newCount;
        showGeneralJAMessage(`Updated Killed Crypts: ${formatCryptCount(killedCrypts)}`);
        return true;
    }
    return false;
}

/**
 * Sends a crypt reminder if conditions are met
 * @param {number} currentTime - Current dungeon time in seconds
 */
function sendCryptReminder(currentTime) {
    if (!Config.enableCryptReminder || Config.cryptReminderTime === 0 || reminderSent) return;

    const reminderTimeInSeconds = Config.cryptReminderTime * 60;
    const protectionTime = 10; // 10 seconds protection time

    if (currentTime >= reminderTimeInSeconds && currentTime <= (reminderTimeInSeconds + protectionTime) && currentTime >= reminderEligibleTime) {
        const cryptsNeeded = Math.max(0, 5 - killedCrypts);
        if (cryptsNeeded > 0) {
            const message = Config.cryptReminderMessage.replace("{count}", cryptsNeeded);
            ChatLib.say(`/pc ${message}`);
            showDebugMessage(`Sent crypt reminder: ${message}`);
            reminderSent = true;
        }
    }
}

/**
 * Starts the main loop for dungeon tracking
 */
function startMainLoop() {
    register("step", () => {
        if (!Config.enableCryptReminder) return;

        if (checkDungeonTimeout === null) {
            checkDungeonTimeout = setTimeout(() => {
                const wasInDungeon = inDungeon;
                inDungeon = checkInDungeon();

                if (inDungeon !== wasInDungeon) {
                    if (inDungeon) {
                        showGeneralJAMessage("Entered Dungeon. Starting Crypt Reminder.");
                        killedCrypts = 0;
                        reminderSent = false;
                        reminderEligibleTime = 0;
                        timeScoreboardLine = null;
                        searchForTimeLine();
                    } else {
                        showGeneralJAMessage("Left Dungeon. Stopping Crypt Reminder.");
                        reminderSent = false;
                        reminderEligibleTime = 0;
                        timeScoreboardLine = null;
                    }
                }

                if (inDungeon) {
                    const currentDungeonTime = getTimeFromScoreboard();
                    if (currentDungeonTime !== null) {
                        updateCryptCount();
                        sendCryptReminder(currentDungeonTime);
                        
                        if (Config.debugMode && currentDungeonTime % 30 === 0) {
                            showDebugMessage(`Status: Crypts: ${formatCryptCount(killedCrypts)}, Time: ${formatTime(currentDungeonTime)}, Time Line: ${timeScoreboardLine !== null ? timeScoreboardLine + 1 : 'Searching'}`);
                        }
                    }
                }

                checkDungeonTimeout = null;
            }, 5000); // 5 seconds delay
        }
    }).setFps(1);
}

// Start initialization
initialize();

export {
    killedCrypts,
    inDungeon,
    updateCryptCount
};