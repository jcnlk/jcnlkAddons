import config from "../../config";
import { showGeneralJAMessage } from "../../utils/ChatUtils";
import { showTitle } from "../../utils/Title";
import {
  getIsInDungeon,
  getCrypts,
  getDungeonTime,
} from "../../utils/Dungeon";
import { RED } from "../../utils/Constants";
import { registerWhen } from "../../utils/Register";

const MAX_CRYPTS_DISPLAY = 5;
const REQUIRED_CRYPTS = 5;
const REMINDER_PROTECTION_TIME = 10;

let killedCrypts = 0;
let reminderSent = false;
let reminderEligibleTime = 0;
let checkDungeonTimeout = null;

const formatCryptCount = (count) =>
  count > MAX_CRYPTS_DISPLAY ? `${MAX_CRYPTS_DISPLAY}+` : count.toString();

const updateCryptCount = () => {
  if (!getIsInDungeon() || !config.cryptReminder) return false;

  const newCount = getCrypts();
  if (newCount !== killedCrypts) {
    killedCrypts = newCount;
    showGeneralJAMessage(
      `Updated Killed Crypts: ${formatCryptCount(killedCrypts)}`
    );
    return true;
  }
  return false;
};

const sendCryptReminder = (currentTime) => {
  if (!config.cryptReminder || config.cryptReminderTime === 0 || reminderSent)
    return;

  const reminderTimeInSeconds = config.cryptReminderTime * 60;

  if (
    currentTime >= reminderTimeInSeconds &&
    currentTime <= reminderTimeInSeconds + REMINDER_PROTECTION_TIME &&
    currentTime >= reminderEligibleTime
  ) {
    const cryptsNeeded = Math.max(0, REQUIRED_CRYPTS - killedCrypts);
    if (cryptsNeeded > 0) {
      const message = config.cryptReminderMessage.replace(
        "{count}",
        cryptsNeeded
      );
      ChatLib.command(`party chat ${message}`);
      showGeneralJAMessage(`Announcing -> Crypt Reminder`);

      if (config.cryptReminderPopup) {
        showCryptReminderPopup(cryptsNeeded);
      }

      reminderSent = true;
    }
  }
};

const showCryptReminderPopup = (cryptsNeeded) => {
  if (!config.cryptReminderPopup) return;
  showTitle(`${RED} Need ${cryptsNeeded} more crypts!`, 5000, true);
  World.playSound("random.orb", 0.5, 1);
};

registerWhen(register("step", () => {
  if (checkDungeonTimeout !== null) return;

  const wasInDungeon = getIsInDungeon();

  checkDungeonTimeout = setTimeout(() => {
    const isInDungeon = getIsInDungeon();

    if (isInDungeon !== wasInDungeon) {
      if (isInDungeon) {
        killedCrypts = 0;
      }
      reminderSent = false;
      reminderEligibleTime = 0;
    }

    if (isInDungeon) {
      const currentDungeonTime = getDungeonTime();
      if (currentDungeonTime !== null) {
        updateCryptCount();
        sendCryptReminder(currentDungeonTime);
      }
    }

    checkDungeonTimeout = null;
  }, 5000);
}).setFps(1), () => config.cryptReminder);
