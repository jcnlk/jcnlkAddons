import Config from "../../config";
import { showGeneralJAMessage } from "../../utils/ChatUtils";
import { showTitle } from "../../utils/Title";
import {
  getIsInDungeon,
  getCrypts,
  getDungeonTime,
} from "../../utils/Dungeon";

let killedCrypts = 0;
let reminderSent = false;
let reminderEligibleTime = 0;
let checkDungeonTimeout = null;

function formatCryptCount(count) {
  return count > 5 ? "5+" : count.toString();
}

function updateCryptCount() {
  if (!getIsInDungeon() || !Config.enableCryptReminder) return false;

  const newCount = getCrypts();
  if (newCount !== killedCrypts) {
    killedCrypts = newCount;
    showGeneralJAMessage(
      `Updated Killed Crypts: ${formatCryptCount(killedCrypts)}`
    );
    return true;
  }
  return false;
}

function sendCryptReminder(currentTime) {
  if (
    !Config.enableCryptReminder ||
    Config.cryptReminderTime === 0 ||
    reminderSent
  )
    return;

  const reminderTimeInSeconds = Config.cryptReminderTime * 60;
  const protectionTime = 10;

  if (
    currentTime >= reminderTimeInSeconds &&
    currentTime <= reminderTimeInSeconds + protectionTime &&
    currentTime >= reminderEligibleTime
  ) {
    const cryptsNeeded = Math.max(0, 5 - killedCrypts);
    if (cryptsNeeded > 0) {
      const message = Config.cryptReminderMessage.replace(
        "{count}",
        cryptsNeeded
      );
      ChatLib.command(`party chat ${message}`);
      showGeneralJAMessage(`Announing -> Crypt Reminder`);

      if (Config.enableCryptReminderPopup) {
        showCryptReminderPopup(cryptsNeeded);
        playCryptReminderSound();
      }

      reminderSent = true;
    }
  }
}

function showCryptReminderPopup(cryptsNeeded) {
  if (!Config.enableCryptReminderPopup) return;

  const colorCodes = ["§c", "§a", "§b", "§e", "§f", "§d"];
  const selectedColor = colorCodes[Config.cryptReminderPopupColor];

  showTitle(`${selectedColor} Need ${cryptsNeeded} more crypts!`, 5000, true);
}

function playCryptReminderSound() {
  if (!Config.enableCryptReminderPopup) return;

  const sounds = [
    "random.orb",
    "random.levelup",
    "random.pop",
    "note.pling",
    "mob.enderdragon.growl",
  ];
  const selectedSound = sounds[Config.cryptReminderSound];
  World.playSound(selectedSound, Config.cryptReminderSoundVolume, 1);
}

register("step", function () {
  if (!Config.enableCryptReminder) return;

  if (checkDungeonTimeout === null) {
    checkDungeonTimeout = setTimeout(function () {
      const wasInDungeon = getIsInDungeon();

      if (getIsInDungeon() !== wasInDungeon) {
        if (getIsInDungeon()) {
          killedCrypts = 0;
          reminderSent = false;
          reminderEligibleTime = 0;
        } else {
          reminderSent = false;
          reminderEligibleTime = 0;
        }
      }

      if (getIsInDungeon()) {
        const currentDungeonTime = getDungeonTime();
        if (currentDungeonTime !== null) {
          updateCryptCount();
          sendCryptReminder(currentDungeonTime);
        }
      }

      checkDungeonTimeout = null;
    }, 5000);
  }
}).setFps(1);
