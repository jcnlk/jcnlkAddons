// Config
import config from "./config";

// General

import "./features/general/AutoPetruleTitle";
import "./features/general/AttributeAbbrev";
import "./features/general/CustomEmotes";
import "./features/general/Reminders";

// Utils
import { showGeneralJAMessage, showDebugMessage } from "./utils/ChatUtils";
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
import "./features/dungeons/MaskTimer";
import "./features/dungeons/PreDev";
import "./features/dungeons/i4";

// Commands
import "./features/commands/PartyCommands";
import "./features/commands/DmCommands";

register("command", (subCommand, ...args) => {
  if (!subCommand) {
    config.openGUI();
    return;
  }

  subCommand = subCommand.toLowerCase();

  switch (subCommand) {
    /**
    case "emote":
      if (!args[0]) {
        showGeneralJAMessage(
          "Usage: /ja emote [add|remove|list] [emotename] [emote]"
        );
        return;
      }
      const emoteAction = args[0].toLowerCase();
      switch (emoteAction) {
        case "add":
          if (args.length < 3) {
            showGeneralJAMessage("Usage: /ja emote add [emotename] [emote]");
            return;
          }
          const emoteName = args[1];
          const emote = args.slice(2).join(" ");
          addCustomEmote(emoteName, emote);
          break;
        case "remove":
          if (args.length !== 2) {
            showGeneralJAMessage("Usage: /ja emote remove [emotename]");
            return;
          }
          removeCustomEmote(args[1]);
          break;
        case "list":
          listCustomEmotes();
          break;
        default:
          showGeneralJAMessage(
            "Unknown emote action. Use add, remove, or list."
          );
      }
      break;
      */
    case "hud":
      HudManager.openGui();
      break;
    case "help":
      showGeneralJAMessage(
        "Available subcommands: crypts, help, hud, emote, test"
      );
      showDebugMessage("Displayed /ja help information");
      break;
  }
}).setName("ja").setAliases("jcnlkAddons").setTabCompletions(["crypts", "help", "emote", "hud"]);

register("gameLoad", () => {
  showGeneralJAMessage(`jcnlkAddons loaded successfully!`, "success");
});
