import { showChatMessage, registerWhen, showTitleV2 } from "../../utils/Utils";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import config from "../../config";

let reminderSent = false;

registerWhen(register("step", () => {
  if (!World.isLoaded()) return;
  if (!config.cryptReminderTime) return;
  if (reminderSent) return;
  
  const cryptsFound = Dungeon.crypts;
  const dungeonTime = Dungeon.seconds;
  const reminderTime = config.cryptReminderTime * 60;
  
  if (cryptsFound >= 5) return;
  if (dungeonTime < reminderTime) return;
  if (dungeonTime > reminderTime + 10) return;
 
  const cryptsNeeded = 5 - cryptsFound;
  
  if (config.cryptReminderMessage) {
    const message = config.cryptReminderMessage.replace("{count}", cryptsNeeded);
    ChatLib.command(`party chat ${message}`);
    showChatMessage(`Announcing -> Crypt Reminder`);
  }
  
  if (config.cryptReminderPopup) () => showTitleV2(`&cNeed ${cryptsNeeded} more crypts!`, 5000, 0.5, -20, 4, World.playSound("random.orb", 0.5, 1));
  
  reminderSent = true;
}).setFps(1), () => config.cryptReminder);

register("worldUnload", () => reminderSent = false);