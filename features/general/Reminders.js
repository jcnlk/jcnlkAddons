import config from "../../config";
import { showTitle } from "../../utils/Title";
import { showGeneralJAMessage } from "../../utils/ChatUtils";
import { RED } from "../../utils/Constants";
import { data } from "../../utils/Data.js";
import { timeToMS, convertToTimeString } from "../../../BloomCore/utils/Utils.js";

const reminders = new Map();

if (!Array.isArray(data.reminders)) {
  data.reminders = [];
}

function updatePersistentReminders() {
  const reminderData = Array.from(reminders.entries()).map(([name, reminder]) => ({
    name,
    triggerTime: reminder.triggerTime,
  }));
  data.reminders = reminderData;
  data.save();
}

function loadPersistentReminders() {
  const now = Date.now();
  let loadedCount = 0;
  let expiredCount = 0;

  const activeStoredReminders = data.reminders.filter(storedReminder => {
    if (storedReminder.triggerTime > now) {
      return true;
    } else {
      expiredCount++;
      return false;
    }
  });

  if (expiredCount > 0) {
    data.reminders = activeStoredReminders;
    data.save();
  }

  activeStoredReminders.forEach(storedReminder => {
    const callback = (name) => {
      showGeneralJAMessage(`Reminder: ${name}`);
      showReminderPopup(name);
    };
    reminders.set(storedReminder.name, {
      triggerTime: storedReminder.triggerTime,
      callback,
    });
    loadedCount++;
  });
}

register("gameLoad", loadPersistentReminders);

register("tick", () => {
  const currentTime = Date.now();
  for (const [name, reminder] of reminders.entries()) {
    if (currentTime >= reminder.triggerTime) {
      triggerReminder(name);
    }
  }
});

export function addReminder(name, time, callback) {
  name = name.trim();
  if (reminders.has(name)) return false;

  const timeInMs = timeToMS(time);
  if (timeInMs === null) return false;

  const triggerTime = Date.now() + timeInMs;
  reminders.set(name, { triggerTime, callback });
  updatePersistentReminders();
  return true;
}

export function removeReminder(identifier) {
  if (typeof identifier === "number") {
    const reminderList = listReminders();
    if (identifier > 0 && identifier <= reminderList.length) {
      const reminderToRemove = reminderList[identifier - 1];
      reminders.delete(reminderToRemove.name);
      updatePersistentReminders();
      return true;
    }
  } else if (reminders.has(identifier)) {
    reminders.delete(identifier);
    updatePersistentReminders();
    return true;
  }
  return false;
}

export function listReminders() {
  const now = Date.now();
  const reminderList = [];
  let index = 1;
  for (const [name, reminder] of reminders.entries()) {
    const remaining = Math.max(reminder.triggerTime - now, 0);
    reminderList.push({ name, timeLeft: remaining, index: index++ });
  }
  return reminderList;
}

export function triggerReminder(name) {
  const reminder = reminders.get(name);
  if (reminder) {
    if (reminder.callback) {
      reminder.callback(name);
    } else {
      showReminderPopup(name);
    }
  }
  reminders.delete(name);
  updatePersistentReminders();
}

function showReminderPopup(name) {
  showTitle()
  showTitle(`${RED}Reminder: ${name}`, 5000, true, `${RED}JA Reminder`);
  showGeneralJAMessage(`Reminder: ${name}`);
  World.playSound("random.orb", 1, 1);
}

register("command", (...args) => {
  if (!config.enableReminders) {
    showGeneralJAMessage("Reminders are currently disabled in the config.");
    return;
  }

  if (!args || args.length === 0) {
    showGeneralJAMessage("Usage: /reminder [add|remove|list] [name|index] [time]");
    return;
  }

  const action = args[0].toLowerCase();

  switch (action) {
    case "add":
      if (args.length < 3) {
        showGeneralJAMessage("Usage: /reminder add [name] [time]");
        return;
      }
      const timeArg = args[args.length - 1];
      const name = args.slice(1, -1).join(" ");
      if (addReminder(name, timeArg, (reminderName) => {
        showGeneralJAMessage(`Reminder: ${reminderName}`);
        showReminderPopup(reminderName);
      })) {
        showGeneralJAMessage(`Reminder '${name}' set for ${timeArg}`, "success");
      } else {
        showGeneralJAMessage(`Failed to set reminder '${name}'. Please check the time format.`, "error");
      }
      break;

    case "remove":
      if (args.length < 2) {
        showGeneralJAMessage("Usage: /reminder remove [name|index]");
        return;
      }
      const removeIdentifier = args[1];
      const removeIndex = parseInt(removeIdentifier);
      if (removeReminder(isNaN(removeIndex) ? removeIdentifier : removeIndex)) {
        showGeneralJAMessage(`Reminder '${removeIdentifier}' removed`, "success");
      } else {
        showGeneralJAMessage(`No reminder found with identifier '${removeIdentifier}'`, "error");
      }
      break;

    case "list":
      const list = listReminders();
      if (list.length > 0) {
        showGeneralJAMessage("Active reminders:");
        list.forEach(reminder => {
          showGeneralJAMessage(`${reminder.index}. ${reminder.name} - Time left: ${convertToTimeString(reminder.timeLeft)}`);
        });
      } else {
        showGeneralJAMessage("No active reminders");
      }
      break;

    default:
      showGeneralJAMessage("Usage: /reminder [add|remove|list] [name|index] [time]");
  }
}).setName("reminder").setTabCompletions(["add", "remove", "list"]);
