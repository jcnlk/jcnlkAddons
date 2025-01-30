import Config from "../../config";
import { showTitle } from "../../utils/Title";
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
  const reminderData = Array.from(reminders.entries()).map(
    ([name, reminder]) => ({
      name,
      timeLeft: reminder.timeLeft,
      isPartyReminder: reminder.isPartyReminder,
      senderName: reminder.senderName,
    })
  );

  const data = { reminders: reminderData };
  const jsonString = JSON.stringify(data, null, 2);
  try {
    FileLib.write("jcnlkAddons", "data/Reminders.json", jsonString);
    if (Config.debugMode) {
      showDebugMessage(
        `Saved ${reminderData.length} reminders to storage.`,
        "success"
      );
    }
  } catch (error) {
    showDebugMessage(`Error writing to storage file: ${error}`, "error");
  }
}

/**
 * Loads reminder data from a file
 */
function loadData() {
  if (!FileLib.exists("jcnlkAddons", "data/Reminders.json")) {
    if (Config.debugMode) {
      showDebugMessage(
        "Storage file does not exist. Creating a new one.",
        "warning"
      );
    }
    saveData();
    return;
  }

  let jsonString;
  try {
    jsonString = FileLib.read("jcnlkAddons", "data/Reminders.json");
  } catch (error) {
    showDebugMessage(`Error reading storage file: ${error}`, "error");
    return;
  }

  if (!jsonString || jsonString.trim() === "") {
    if (Config.debugMode) {
      showDebugMessage(
        "Storage file is empty. Initializing with empty data.",
        "warning"
      );
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
      data.reminders.forEach((reminder) => {
        if (reminder.timeLeft > 0) {
          reminders.set(reminder.name, {
            timeLeft: reminder.timeLeft,
            isPartyReminder: reminder.isPartyReminder,
            senderName: reminder.senderName,
          });
          if (Config.debugMode) {
            const timeLeft = formatTime(reminder.timeLeft);
            showDebugMessage(
              `Loaded reminder "${reminder.name}" with ${timeLeft} remaining`,
              "info"
            );
          }
          loadedCount++;
        } else {
          expiredCount++;
        }
      });
      if (Config.debugMode) {
        const totalCount = data.reminders.length;
        const summaryColor = loadedCount > 0 ? "success" : "warning";
        showDebugMessage(
          `Loaded ${loadedCount} active reminder${
            loadedCount !== 1 ? "s" : ""
          } from storage.`,
          summaryColor
        );
        if (expiredCount > 0) {
          showDebugMessage(
            `${expiredCount} expired reminder${
              expiredCount !== 1 ? "s were" : " was"
            } not loaded.`,
            "info"
          );
        }
        showDebugMessage(`§aTotal reminders in storage: ${totalCount}`, "info");
      }
    } else {
      if (Config.debugMode) {
        showDebugMessage("No valid reminders found in storage.", "warning");
      }
    }
  } catch (error) {
    showDebugMessage(`Error parsing JSON from storage file: ${error}`, "error");
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
export function addReminder(name, time, callback) {
  name = name.trim();
  if (reminders.has(name)) {
    if (Config.debugMode) {
      showDebugMessage(`Reminder "${name}" already exists.`, "warning");
    }
    return false;
  }

  const timeInMs = parseTime(time);
  if (timeInMs === null) {
    if (Config.debugMode) {
      showDebugMessage(`Invalid time format: ${time}`, "error");
    }
    return false;
  }

  reminders.set(name, { timeLeft: timeInMs, callback, isPartyReminder: false });
  saveData();
  if (Config.debugMode) {
    showDebugMessage(
      `Added reminder "${name}" for ${formatTime(timeInMs)}`,
      "success"
    );
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
export function addPartyReminder(senderName, name, time, callback) {
  name = name.trim();
  if (reminders.has(name)) {
    if (Config.debugMode) {
      showDebugMessage(`Reminder "${name}" already exists.`, "warning");
    }
    return false;
  }

  const timeInMs = parseTime(time);
  if (timeInMs === null) {
    if (Config.debugMode) {
      showDebugMessage(`Invalid time format: ${time}`, "error");
    }
    return false;
  }

  reminders.set(name, {
    timeLeft: timeInMs,
    callback,
    isPartyReminder: true,
    senderName,
  });
  saveData();
  if (Config.debugMode) {
    showDebugMessage(
      `Added party reminder "${name}" for ${senderName} for ${formatTime(
        timeInMs
      )}`,
      "success"
    );
  }
  return true;
}

/**
 * Removes a reminder
 * @param {string|number} identifier - The name or index of the reminder to remove
 * @returns {boolean} - Whether the reminder was successfully removed
 */
export function removeReminder(identifier) {
  if (typeof identifier === "number") {
    // Remove by index
    const reminderList = listReminders();
    if (identifier > 0 && identifier <= reminderList.length) {
      const reminderToRemove = reminderList[identifier - 1];
      reminders.delete(reminderToRemove.name);
      saveData();
      if (Config.debugMode) {
        showDebugMessage(
          `Removed reminder "${reminderToRemove.name}" by index ${identifier}`
        );
      }
      return true;
    }
  } else if (reminders.has(identifier)) {
    // Remove by name
    reminders.delete(identifier);
    saveData();
    if (Config.debugMode) {
      showDebugMessage(`Removed reminder "${identifier}"`);
    }
    return true;
  }
  if (Config.debugMode) {
    showDebugMessage(`Reminder "${identifier}" not found.`);
  }
  return false;
}

/**
 * Lists all active reminders
 * @returns {Object[]} - An array of reminder objects with name, timeLeft, and index
 */
export function listReminders() {
  const now = Date.now();
  let reminderList = [];
  let index = 1;
  reminders.forEach((reminder, name) => {
    reminderList.push({
      name: name,
      timeLeft: reminder.timeLeft,
      index: index++,
    });
  });
  if (Config.debugMode) {
    reminderList.forEach((reminder) => {
      showDebugMessage(
        `Reminder: ${reminder.index}. ${reminder.name}, Time left: ${formatTime(
          reminder.timeLeft
        )}`
      );
    });
  }
  return reminderList;
}

/**
 * Parses a time string into milliseconds
 * @param {string} time - The time string to parse (e.g., "5m" for 5 minutes)
 * @returns {number|null} - The time in milliseconds, or null if invalid
 */
export function parseTime(time) {
  const regex = /^(\d+)([smh])$/;
  const match = time.match(regex);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return null;
  }
}

/**
 * Formats time in milliseconds to a readable string
 * @param {number} ms - Time in milliseconds
 * @returns {string} - Formatted time string
 */
export function formatTime(ms) {
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
export function triggerReminder(name) {
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
    showDebugMessage(`Triggered reminder "${name}"`, "success");
  }
}

/**
 * Shows a popup for a reminder
 * @param {string} name - The name of the reminder
 */
export function showReminderPopup(name) {
  const colorCodes = ["§c", "§a", "§b", "§e", "§f", "§d"];
  const selectedColor = colorCodes[Config.reminderPopupColor];

  if (Config.debugMode) {
    showDebugMessage(
      `Showing popup: "Reminder: ${name}" with duration 5000ms`,
      "info"
    );
  }

  showTitle(
    `${selectedColor}Reminder: ${name}`,
    5000,
    true,
    `${selectedColor}JA Reminder`
  );
  showGeneralJAMessage(`Reminder: ${name}`);

  // Play the selected sound when the reminder pops up
  const sounds = [
    "random.orb",
    "random.levelup",
    "random.pop",
    "note.pling",
    "mob.enderdragon.growl",
  ];
  const selectedSound = sounds[Config.reminderSound];
  World.playSound(selectedSound, Config.reminderSoundVolume, 1);
  if (Config.debugMode) {
    showDebugMessage(
      `Played sound: ${selectedSound} at volume ${Config.reminderSoundVolume}`,
      "info"
    );
  }

  // Schedule a debug message for when the popup is removed
  if (Config.debugMode) {
    setTimeout(() => {
      showDebugMessage(`Removed popup: "Reminder: ${name}"`, "info");
    }, 5000);
  }
}
