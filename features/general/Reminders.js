import { Render2D } from "../../../tska/rendering/Render2D";
import { showChatMessage, } from "../../utils/Utils";
import { data } from "../../utils/Data";

const reminders = new Map();

function parseTimeToMs(str) {
  let totalMs = 0

  const hourMatch = str.match(/(\d+)\s*h/)
  const minuteMatch = str.match(/(\d+)\s*m/)
  const secondMatch = str.match(/(\d+)\s*s/)

  if (hourMatch) totalMs += parseInt(hourMatch[1]) * 3600 * 1000
  if (minuteMatch) totalMs += parseInt(minuteMatch[1]) * 60 * 1000
  if (secondMatch) totalMs += parseInt(secondMatch[1]) * 1000

  return totalMs
}

function saveReminders() {
  data.reminders = Array.from(reminders.entries()).map(([name, reminder]) => ({
    name,
    triggerTime: reminder.triggerTime,
  }));
}

function loadReminders() {
  reminders.clear();
  const now = Date.now();
  const namesAdded = new Set();

  data.reminders = data.reminders.filter(item => {
    if (!item?.name || !item?.triggerTime) return false;
    
    if (item.triggerTime <= now) {
      showChatMessage(`Reminder: ${item.name}`);
      showReminderPopup(item.name);
      return false;
    }
    
    if (namesAdded.has(item.name)) return false;
    namesAdded.add(item.name);
    
    reminders.set(item.name, { triggerTime: item.triggerTime });
    return true;
  });
}

register("gameLoad", loadReminders);

register("step", () => {
  if (!World.isLoaded()) return;
  
  const now = Date.now();
  const triggered = [];
  
  reminders.forEach((reminder, name) => {
    if (now >= reminder.triggerTime) {
      triggered.push(name);
      showChatMessage(`Reminder: ${name}`);
      showReminderPopup(name);
    }
  });
  
  if (triggered.length > 0) {
    triggered.forEach(name => reminders.delete(name));
    saveReminders();
  }
}).setFps(2);

export function addReminder(name, time) {
  name = name.trim();
  if (!name || reminders.has(name)) return false;

  const timeInMs = parseTimeToMs(time);
  if (!timeInMs) return false;

  reminders.set(name, { 
    triggerTime: Date.now() + timeInMs
  });
  
  saveReminders();
  return true;
}

export function removeReminder(identifier) {
  if (typeof identifier === "number") {
    const list = listReminders();
    if (identifier > 0 && identifier <= list.length) {
      reminders.delete(list[identifier - 1].name);
      saveReminders();
      return true;
    }
  } if (reminders.has(identifier)) {
    reminders.delete(identifier);
    saveReminders();
    return true;
  }
  return false;
}

export function listReminders() {
  const now = Date.now();
  return Array.from(reminders.entries())
    .map(([name, reminder]) => ({
      name,
      timeLeft: Math.max(reminder.triggerTime - now, 0)
    }))
    .sort((a, b) => a.timeLeft - b.timeLeft)
    .map((reminder, idx) => ({
      ...reminder,
      index: idx + 1
    }));
}

function showReminderPopup(name) { 
  Render2D.showTitle(`&cReminder: ${name}`, null, 5000);
  World.playSound("random.orb", 1, 1);
}