import Dungeon from "../../../tska/skyblock/dungeon/Dungeon";
import { Render2D } from "../../../tska/rendering/Render2D";
import { showChatMessage } from "../../utils/Utils";
import config from "../../config";

let reminderSent = false;

Dungeon.on270Score(() => {
  if (!config.cryptReminder || reminderSent || Dungeon.inBoss()) return;

  const cryptsNeeded = 5 - Dungeon.getCrypts();

  if (cryptsNeeded <= 0) return;

  if (config.cryptReminderPopup) {
    Render2D.showTitle(`&cNeed ${cryptsNeeded} more crypts!`, null, 5000);
    World.playSound("random.orb", 1, 1);
  }

  if (config.cryptReminderAnnounce) {
    setTimeout(() => ChatLib.command(`party chat Crypt Reminder: We need ${cryptsNeeded} more Crypts!`), 1000);
    showChatMessage(`Announcing -> Crypt Reminder`);
  }

  reminderSent = true;
});

register("worldUnload", () => reminderSent = false);