// Config
import config from "./config";

// General

import "./features/general/AutoPetruleTitle";
import "./features/general/AttributeAbbrev";
import "./features/general/CustomEmotes";
import "./features/general/Reminders";

// Utils
import { showGeneralJAMessage } from "./utils/ChatUtils";
import HudManager from "./utils/Hud";
import "./utils/KuudraLootScanner";
import "./utils/HighlightSlots";
import "./utils/Formatting";
import "./utils/Constants";
import "./utils/Register";
import "./utils/Dungeon";
import "./utils/Title";
import "./utils/Items";
import "./utils/Data";
import "./utils/Area";

// Dungeons
import "./features/dungeons/SimonSaysPhaseTracker";
import "./features/dungeons/HighlightDungeonLoot";
import "./features/dungeons/FireFreezeNotifier";
import "./features/dungeons/HidePlayerOnLeap";
import "./features/dungeons/CryptReminder";
import "./features/dungeons/PreEnterP2-P5";
import "./features/dungeons/MaskReminder";
import "./features/dungeons/TitleAlerts";
import "./features/dungeons/QuizTimer";
import "./features/dungeons/MaskTimer";
import "./features/dungeons/PreDev";
import "./features/dungeons/i4";

// Commands
import "./features/commands/PartyCommands";
import "./features/commands/DmCommands";

register("command", (subCommand) => {
  if (!subCommand) {
    config.openGUI();
    return;
  }

  subCommand = subCommand.toLowerCase();

  switch (subCommand) {
    case "hud":
      HudManager.openGui();
      break;
    case "help":
      showGeneralJAMessage(
        "Available subcommands: help, hud"
      );
      break;
  }
}).setName("ja").setAliases("jcnlkAddons").setTabCompletions(["help", "hud"]);

register("gameLoad", () => {
  showGeneralJAMessage(`jcnlkAddons loaded successfully!`, "success");
});
