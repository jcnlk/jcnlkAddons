import { showChatMessage, registerWhen } from "../../utils/Utils";
import { Render2D } from "../../../tska/rendering/Render2D";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import config from "../../config";

let reminderSent = false;

registerWhen(register("step", () => {
  if (!Dungeon.inDungeon) return;
  if (!config.cryptReminderTime) return;
  if (reminderSent) return;
  
  const cryptsFound = Dungeon.crypts;
  const dungeonTime = Dungeon.seconds;
  const reminderTime = config.cryptReminderTime;
  
  if (cryptsFound >= 5) return;
  if (dungeonTime < reminderTime) return;
  if (dungeonTime > reminderTime + 10) return;
 
  const cryptsNeeded = 5 - cryptsFound;
  
  if (config.cryptReminderAnnounce) {
    ChatLib.command(`party chat Crypt Reminder: We need ${cryptsNeeded} more Crypts!`);
    showChatMessage(`Announcing -> Crypt Reminder`);
  }
  
  if (config.cryptReminderPopup) {
    Render2D.showTitle(`&cNeed ${cryptsNeeded} more crypts!`, null, 5000);
    World.playSound("random.orb", 1, 1);
  }
  
  reminderSent = true;
}).setFps(1), () => config.cryptReminder);

register("worldUnload", () => reminderSent = false);