import { Render2D } from "../../../tska/rendering/Render2D";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { showChatMessage } from "../../utils/Utils";
import config from "../../config";

let reminderSent = false;

Dungeon.registerWhenInDungeon(register("step", () => {
  if (!config.cryptReminder || !config.cryptReminderTime || reminderSent) return;

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
}).setFps(1));

register("worldUnload", () => reminderSent = false);