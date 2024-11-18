import Config from "../../config";
import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import { showTitle } from "../../utils/Title";
import {
    checkInDungeon,
    getCryptCountFromTablist,
    getTimeFromTablist,
    analyzePuzzleInfo,
    formatTime,
    formatCryptCount,
    getDungeonFloor
} from "./DungeonUtils";

// Global variables
let killedCrypts = 0;
let inDungeon = false;
let reminderSent = false;
let reminderEligibleTime = 0;
let checkDungeonTimeout = null;
let puzzleStates = {};
let lastTotalPuzzles = 0;

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
            
            // Show popup if enabled
            if (Config.enableCryptReminderPopup) {
                showCryptReminderPopup(cryptsNeeded);
                playCryptReminderSound();
            }
            
            reminderSent = true;
        }
    }
}

/**
 * Shows a popup for crypt reminders
 * @param {number} cryptsNeeded - Number of crypts needed
 */
function showCryptReminderPopup(cryptsNeeded) {
    if (!Config.enableCryptReminderPopup) return;

    const colorCodes = ["§c", "§a", "§b", "§e", "§f", "§d"];
    const selectedColor = colorCodes[Config.cryptReminderPopupColor];
    
    const popupMessage = `Need ${cryptsNeeded} more crypts!`;
    

    showTitle(`${selectedColor} ${popupMessage}`, 5000, true, `${selectedColor}Crypt Reminder`);
    showDebugMessage(`Showing crypt reminder popup: ${popupMessage}`);
}

/**
 * Plays a sound for crypt reminders
 */
function playCryptReminderSound() {
    if (!Config.enableCryptReminderPopup) return;

    const sounds = ["random.orb", "random.levelup", "random.pop", "note.pling", "mob.enderdragon.growl"];
    const selectedSound = sounds[Config.cryptReminderSound];
    World.playSound(selectedSound, Config.cryptReminderSoundVolume, 1);
    showDebugMessage(`Played crypt reminder sound: ${selectedSound} at volume ${Config.cryptReminderSoundVolume}`);
}

/**
 * Searches for the time line in the scoreboard
 */
export function searchForTimeLine() {
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
        const time = getTimeFromScoreboard(currentLine);
        if (time !== null) {
            timeScoreboardLine = currentLine;
            if (Config.debugMode) {
                showDebugMessage(`Time found in line ${currentLine + 1}`);
            }
            searchingForTimeLine = false;
            return;
        }
        currentLine++;
        setTimeout(checkNextLine, 50);
    }
    checkNextLine();
}

/**
 * Outputs changes in puzzle states
 */
function outputPuzzleChanges() {
    const analysis = analyzePuzzleInfo();
    if (!analysis) return;

    const { counts, totalPuzzles } = analysis;
    let changesDetected = false;

    // Check for changes in total puzzles
    if (lastTotalPuzzles !== totalPuzzles) {
        //showGeneralJAMessage(`Total puzzles changed from ${lastTotalPuzzles} to ${totalPuzzles}`);
        lastTotalPuzzles = totalPuzzles;
        changesDetected = true;
    }

    // Compare new counts with previous states to detect changes
    for (const [state, count] of Object.entries(counts)) {
        if (puzzleStates[state] !== count) {
            const stateCapitalized = state.charAt(0).toUpperCase() + state.slice(1);
            //showGeneralJAMessage(`${stateCapitalized} puzzles changed from ${puzzleStates[state] || 0} to ${count}`);
            puzzleStates[state] = count;
            changesDetected = true;
        }
    }

    // Only output the current status if changes were detected
    if (changesDetected) {
        //showGeneralJAMessage(`Current puzzle status: ${counts.unexplored} unexplored, ${counts.explored} explored, ${counts.finished} finished, ${counts.failed} failed`);
    }
}

/**
 * Displays current puzzle status
 */
export function displayPuzzleStatus() {
    const analysis = analyzePuzzleInfo();
    if (!analysis) {
        showGeneralJAMessage("Not in a dungeon or no puzzle information available.");
        return;
    }

    const { counts, totalPuzzles } = analysis;
    showGeneralJAMessage("Current Puzzle Status:");
    showGeneralJAMessage(`Total Puzzles: ${totalPuzzles}`);
    showGeneralJAMessage(`Unexplored: ${counts.unexplored}`);
    showGeneralJAMessage(`Explored: ${counts.explored}`);
    showGeneralJAMessage(`Finished: ${counts.finished}`);
    showGeneralJAMessage(`Failed: ${counts.failed}`);
}

/**
 * Resets the puzzle state
 */
function resetPuzzleState() {
    puzzleStates = {};
    lastTotalPuzzles = 0;
    showDebugMessage("Puzzle state reset");
}

/**
 * Starts the main loop for dungeon tracking
 */
function startMainLoop() {
    register("step", function() {
        if (!Config.enableCryptReminder) return;

        if (checkDungeonTimeout === null) {
            checkDungeonTimeout = setTimeout(function() {
                const wasInDungeon = inDungeon;
                inDungeon = checkInDungeon();

                if (inDungeon !== wasInDungeon) {
                    if (inDungeon) {
                        const currentFloor = getDungeonFloor();
                        showGeneralJAMessage("Entered Dungeon" + (currentFloor ? " (" + currentFloor + ")" : '') + ". Starting Crypt Reminder and Puzzle Tracking.");
                        killedCrypts = 0;
                        reminderSent = false;
                        reminderEligibleTime = 0;
                        resetPuzzleState();
                    } else {
                        showGeneralJAMessage("Dungeon Left!");
                        reminderSent = false;
                        reminderEligibleTime = 0;
                        resetPuzzleState();
                    }
                }

                if (inDungeon) {
                    const currentDungeonTime = getTimeFromTablist();
                    if (currentDungeonTime !== null) {
                        updateCryptCount();
                        sendCryptReminder(currentDungeonTime);
                        outputPuzzleChanges();
                        
                        if (Config.debugMode && currentDungeonTime % 30 === 0) {
                            const currentFloor = getDungeonFloor();
                            showDebugMessage("Status: Floor: " + (currentFloor || 'Unknown') + ", Crypts: " + formatCryptCount(killedCrypts) + ", Time: " + formatTime(currentDungeonTime));
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
    updateCryptCount
};