import Config from "../../config";
import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import { showTitle } from "../../utils/Title";
import { 
    inDungeon,
    getCrypts,
    getCurrentFloor,
    getDungeonTime } from "../../utils/Dungeon";

let killedCrypts = 0;
let reminderSent = false;
let reminderEligibleTime = 0;
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
    if (!inDungeon() || !Config.enableCryptReminder) return false;

    const newCount = getCrypts();
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

    showTitle(`${selectedColor} Need ${cryptsNeeded} more crypts!`, 5000, true); //, `${selectedColor}Crypt Reminder`
    showDebugMessage(`Showing crypt reminder popup.`);
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
        const time = getDungeonTime(currentLine);
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
 * Starts the main loop for dungeon tracking
 */
function startMainLoop() {
    register("step", function() {
        if (!Config.enableCryptReminder) return;

        if (checkDungeonTimeout === null) {
            checkDungeonTimeout = setTimeout(function() {
                const wasInDungeon = inDungeon();

                if (inDungeon() !== wasInDungeon) {
                    if (inDungeon()) {
                        const currentFloor = getCurrentFloor();
                        showGeneralJAMessage("Entered Dungeon" + (currentFloor ? " (" + currentFloor + ")" : ''));
                        killedCrypts = 0;
                        reminderSent = false;
                        reminderEligibleTime = 0;
                    } else {
                        showGeneralJAMessage("Dungeon Left!");
                        reminderSent = false;
                        reminderEligibleTime = 0;
                    }
                }

                if (inDungeon()) {
                    const currentDungeonTime = getDungeonTime();
                    if (currentDungeonTime !== null) {
                        updateCryptCount();
                        sendCryptReminder(currentDungeonTime);
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