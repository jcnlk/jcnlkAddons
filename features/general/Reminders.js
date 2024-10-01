import Config from "../../config";
import { showSimplePopup } from "../../utils/Popup";
import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";

let reminders = new Map();
let lastTickTime = Date.now();

/**
 * Updates and triggers reminders on each game tick
 */
register("tick", () => {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTickTime;
    lastTickTime = currentTime;

    reminders.forEach((reminder, name) => {
        reminder.timeLeft -= deltaTime;
        if (reminder.timeLeft <= 0) {
            triggerReminder(name);
        }
    });
});

/**
 * Saves reminder data to a file
 */
function saveData() {
    const reminderData = Array.from(reminders.entries()).map(([name, reminder]) => ({
        name,
        timeLeft: reminder.timeLeft,
        isPartyReminder: reminder.isPartyReminder,
        senderName: reminder.senderName
    }));
    
    const data = { reminders: reminderData };
    const jsonString = JSON.stringify(data, null, 2);
    try {
        FileLib.write("jcnlkAddons", "data/storage.json", jsonString);
        if (Config.debugMode) {
            showDebugMessage(`Saved ${reminderData.length} reminders to storage.`, 'success');
        }
    } catch (error) {
        showDebugMessage(`Error writing to storage file: ${error}`, 'error');
    }
}

/**
 * Loads reminder data from a file
 */
function loadData() {
    if (!FileLib.exists("jcnlkAddons", "data/storage.json")) {
        if (Config.debugMode) {
            showDebugMessage("Storage file does not exist. Creating a new one.", 'warning');
        }
        saveData();
        return;
    }
    
    let jsonString;
    try {
        jsonString = FileLib.read("jcnlkAddons", "data/storage.json");
    } catch (error) {
        showDebugMessage(`Error reading storage file: ${error}`, 'error');
        return;
    }
    
    if (!jsonString || jsonString.trim() === "") {
        if (Config.debugMode) {
            showDebugMessage("Storage file is empty. Initializing with empty data.", 'warning');
        }
        saveData();
        return;
    }
    
    try {
        const data = JSON.parse(jsonString);
        
        if (data && Array.isArray(data.reminders)) {
            const now = Date.now();
            let loadedCount = 0;
            let expiredCount = 0;
            data.reminders.forEach(reminder => {
                if (reminder.timeLeft > 0) {
                    reminders.set(reminder.name, { 
                        timeLeft: reminder.timeLeft,
                        isPartyReminder: reminder.isPartyReminder,
                        senderName: reminder.senderName
                    });
                    if (Config.debugMode) {
                        const timeLeft = formatTime(reminder.timeLeft);
                        showDebugMessage(`Loaded reminder "${reminder.name}" with ${timeLeft} remaining`, 'info');
                    }
                    loadedCount++;
                } else {
                    expiredCount++;
                }
            });
            if (Config.debugMode) {
                const totalCount = data.reminders.length;
                const summaryColor = loadedCount > 0 ? 'success' : 'warning';
                showDebugMessage(`Loaded ${loadedCount} active reminder${loadedCount !== 1 ? 's' : ''} from storage.`, summaryColor);
                if (expiredCount > 0) {
                    showDebugMessage(`${expiredCount} expired reminder${expiredCount !== 1 ? 's were' : ' was'} not loaded.`, 'info');
                }
                showDebugMessage(`§aTotal reminders in storage: ${totalCount}`, 'info');
            }
        } else {
            if (Config.debugMode) {
                showDebugMessage("No valid reminders found in storage.", 'warning');
            }
        }
    } catch (error) {
        showDebugMessage(`Error parsing JSON from storage file: ${error}`, 'error');
        saveData();
    }
}

// Load saved reminders when the module starts
register("gameLoad", loadData);

// Save reminders when the game is closed
register("gameUnload", saveData);

/**
 * Adds a new reminder
 * @param {string} name - The name of the reminder
 * @param {string} time - The time for the reminder (e.g., "5m" for 5 minutes)
 * @param {Function} callback - The function to call when the reminder triggers
 * @returns {boolean} - Whether the reminder was successfully added
 */
function addReminder(name, time, callback) {
    name = name.trim();
    if (reminders.has(name)) {
        if (Config.debugMode) {
            showDebugMessage(`Reminder "${name}" already exists.`, 'warning');
        }
        return false;
    }
    
    const timeInMs = parseTime(time);
    if (timeInMs === null) {
        if (Config.debugMode) {
            showDebugMessage(`Invalid time format: ${time}`, 'error');
        }
        return false;
    }
    
    reminders.set(name, { timeLeft: timeInMs, callback, isPartyReminder: false });
    saveData();
    if (Config.debugMode) {
        showDebugMessage(`Added reminder "${name}" for ${formatTime(timeInMs)}`, 'success');
    }
    return true;
}

/**
 * Adds a new party reminder
 * @param {string} senderName - The name of the sender
 * @param {string} name - The name of the reminder
 * @param {string} time - The time for the reminder (e.g., "5m" for 5 minutes)
 * @param {Function} callback - The function to call when the reminder triggers
 * @returns {boolean} - Whether the reminder was successfully added
 */
function addPartyReminder(senderName, name, time, callback) {
    name = name.trim();
    if (reminders.has(name)) {
        if (Config.debugMode) {
            showDebugMessage(`Reminder "${name}" already exists.`, 'warning');
        }
        return false;
    }
    
    const timeInMs = parseTime(time);
    if (timeInMs === null) {
        if (Config.debugMode) {
            showDebugMessage(`Invalid time format: ${time}`, 'error');
        }
        return false;
    }
    
    reminders.set(name, { timeLeft: timeInMs, callback, isPartyReminder: true, senderName });
    saveData();
    if (Config.debugMode) {
        showDebugMessage(`Added party reminder "${name}" for ${senderName} for ${formatTime(timeInMs)}`, 'success');
    }
    return true;
}

/**
 * Removes a reminder
 * @param {string} name - The name of the reminder to remove
 * @returns {boolean} - Whether the reminder was successfully removed
 */
function removeReminder(name) {
    if (reminders.has(name)) {
        reminders.delete(name);
        saveData();
        if (Config.debugMode) {
            showDebugMessage(`Removed reminder "${name}"`, 'info');
        }
        return true;
    }
    if (Config.debugMode) {
        showDebugMessage(`Reminder "${name}" not found.`, 'warning');
    }
    return false;
}

/**
 * Lists all active reminders
 * @returns {string[]} - An array of reminder names
 */
function listReminders() {
    if (Config.debugMode) {
        reminders.forEach((reminder, name) => {
            showDebugMessage(`Reminder: ${name}, Time left: ${formatTime(reminder.timeLeft)}`, 'info');
        });
    }
    return Array.from(reminders.keys());
}

/**
 * Parses a time string into milliseconds
 * @param {string} time - The time string to parse (e.g., "5m" for 5 minutes)
 * @returns {number|null} - The time in milliseconds, or null if invalid
 */
function parseTime(time) {
    const regex = /^(\d+)([smh])$/;
    const match = time.match(regex);
    if (!match) return null;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        default: return null;
    }
}

/**
 * Formats a time in milliseconds to a readable string
 * @param {number} ms - The time in milliseconds
 * @returns {string} - A formatted time string
 */
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Triggers a reminder
 * @param {string} name - The name of the reminder to trigger
 */
function triggerReminder(name) {
    const reminder = reminders.get(name);
    if (reminder) {
        if (reminder.isPartyReminder) {
            if (reminder.callback) {
                reminder.callback(name);
            }
        } else {
            showReminderPopup(name);
            if (reminder.callback) {
                reminder.callback(name);
            }
        }
    }
    reminders.delete(name);
    saveData();
    if (Config.debugMode) {
        showDebugMessage(`Triggered reminder "${name}"`, 'success');
    }
}

/**
 * Shows a popup for a reminder
 * @param {string} name - The name of the reminder
 */
function showReminderPopup(name) {
    const colorCodes = ["§c", "§a", "§b", "§e", "§f", "§d"];
    const selectedColor = colorCodes[Config.reminderPopupColor];
    
    if (Config.debugMode) {
        showDebugMessage(`Showing popup: "Reminder: ${name}" with duration 5000ms`, 'info');
    }
    
    showSimplePopup(`Reminder: ${name}`, 5000, true, "JA Reminder", selectedColor);
    showGeneralJAMessage(`Reminder: ${name}`);
    
    // Play the selected sound when the reminder pops up
    const sounds = ["random.orb", "random.levelup", "random.pop", "note.pling", "mob.enderdragon.growl"];
    const selectedSound = sounds[Config.reminderSound];
    World.playSound(selectedSound, Config.reminderSoundVolume, 1);
    if (Config.debugMode) {
        showDebugMessage(`Played sound: ${selectedSound} at volume ${Config.reminderSoundVolume}`, 'info');
    }
    
    // Schedule a debug message for when the popup is removed
    if (Config.debugMode) {
        setTimeout(() => {
            showDebugMessage(`Removed popup: "Reminder: ${name}"`, 'info');
        }, 5000);
    }
}

// Export functions
export { 
    addReminder, 
    removeReminder, 
    listReminders, 
    addPartyReminder 
};