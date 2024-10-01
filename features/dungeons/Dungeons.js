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
 * Extracts time from a scoreboard line
 * @param {Object} line - Scoreboard line object
 * @returns {number|null} Time in seconds or null if not found
 */
function extractTimeFromLine(line) {
    if (line && line.getName) {
        const cleanLine = ChatLib.removeFormatting(line.getName()).trim();
        if (cleanLine.includes("Time Elapsed:")) {
            const timeStr = cleanLine.split("Time Elapsed:")[1].trim();
            const match = timeStr.match(/(?:(\d+)m\s*)?(\d+)s/);
            if (match) {
                const minutes = parseInt(match[1] || "0");
                const seconds = parseInt(match[2]);
                return minutes * 60 + seconds;
            }
            if (Config.debugMode) {
                ChatLib.chat(`Failed to parse time: "${timeStr}"`);
            }
        }
    }
    return null;
}
/**
 * Searches for the time line in the scoreboard
 */
function searchForTimeLine() {
    if (searchingForTimeLine) return;
    searchingForTimeLine = true;
    timeScoreboardLine = null;
    let currentLine = 5; // Starting from line 6 (index 5)
    
    function checkNextLine() {
        if (currentLine > 9 || timeScoreboardLine !== null) {
            searchingForTimeLine = false;
            if (timeScoreboardLine === null && Config.debugMode) {
                showDebugMessage(`Time not found in scoreboard lines 6-10`);
            }
            return;
        }
        const scoreboardLines = Scoreboard.getLines();
        if (currentLine < scoreboardLines.length) {
            const line = scoreboardLines[currentLine];
            const time = extractTimeFromLine(line);
            
            if (Config.debugMode) {
                showDebugMessage(`Checking line ${currentLine + 1}: ${ChatLib.removeFormatting(line.getName()).trim()}`);
                if (time !== null) {
                    showDebugMessage(`Extracted time: ${formatTime(time)}`);
                }
            }
            if (time !== null) {
                timeScoreboardLine = currentLine;
                if (Config.debugMode) {
                    showDebugMessage(`Time found in line ${currentLine + 1}`);
                }
                searchingForTimeLine = false;
                return;
            }
        }
        currentLine++;
        setTimeout(checkNextLine, 50);
    }
    checkNextLine();
}

/**
 * Gets the current time from the scoreboard
 * @returns {number|null} Time in seconds or null if not found
 */
function getTimeFromScoreboard() {
    if (timeScoreboardLine === null) {
        if (Config.debugMode) {
            showGeneralJAMessage(`Time line not set, starting search`);
        }
        searchForTimeLine();
        return null;
    }
    const scoreboardLines = Scoreboard.getLines();
    if (timeScoreboardLine < scoreboardLines.length) {
        const time = extractTimeFromLine(scoreboardLines[timeScoreboardLine]);
        if (time === null) {
            if (Config.debugMode) {
                showGeneralJAMessage(`Time not found in expected line ${timeScoreboardLine + 1}, restarting search`);
            }
            timeScoreboardLine = null;
            searchForTimeLine();
            return null;
        }
        return time;
    } else {
        if (Config.debugMode) {
            showGeneralJAMessage(`Expected time line ${timeScoreboardLine + 1} out of range, restarting search`);
        }
        timeScoreboardLine = null;
        searchForTimeLine();
        return null;
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