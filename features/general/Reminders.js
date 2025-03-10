import { showTitle } from "../../utils/Title";
import { showChatMessage, RED } from "../../utils/Utils";
import { data } from "../../utils/Data.js";
import { timeToMS } from "../../../BloomCore/utils/Utils.js";

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
      showChatMessage(`Reminder: ${name}`);
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
  showTitle(`${RED}Reminder: ${name}`, 5000, true, `${RED}JA Reminder`);
  showChatMessage(`Reminder: ${name}`);
  World.playSound("random.orb", 1, 1);
}