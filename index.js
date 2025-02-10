// Config
import config from "./config";

// General
import * as CustomEmotes from "./features/general/CustomEmotes";
import * as Reminders from "./features/general/Reminders";
import "./features/general/Todo";

// Utils
import { showGeneralJAMessage, showDebugMessage } from "./utils/ChatUtils";
import "./utils/ClickableMessageContent";
import "./utils/KuudraLootScanner";
import "./utils/AttributeAbbrev";
import "./utils/HighlightSlots";
import "./utils/Formatting";
import "./utils/Constants";
import "./utils/Dungeon";
import "./utils/Title";
import "./utils/Items";
import "./utils/Area";

// Dungeons
import "./features/dungeons/SimonSaysPhaseTracker";
import "./features/dungeons/HighlightDungeonLoot";
import "./features/dungeons/FireFreezeNotifier";
import "./features/dungeons/HidePlayerOnLeap";
import "./features/dungeons/DungeonFeatures";
import "./features/dungeons/PreEnterP2-P5";
import "./features/dungeons/MaskReminder";
import "./features/dungeons/TitleAlerts";
import "./features/dungeons/PreDev";
import "./features/dungeons/i4";

// Miscellaneous
import "./features/miscellaneous/AutoPetruleAlert";
import "./features/miscellaneous/GreatSpookSolver";

// Commands
import "./features/commands/PartyCommands";
import "./features/commands/DmCommands";

/**
 * Registers a slash command
 * @param {string} command - The command to register
 * @param {string} description - The description of the command
 * @param {Function} action - The action to perform when the command is executed
 * @param {Array} tabCompletions - The tab completions for the command
 */
function registerSlashCommand(command, description, action, tabCompletions) {
  register("command", (...args) => {
    showDebugMessage(`Executing slash command: /${command} ${args.join(" ")}`);
    action(...args);
  })
    .setName(command)
    .setTabCompletions(tabCompletions || []);
}

registerSlashCommand(
  "ja",
  "Main command for jcnlkAddons",
  (subCommand, ...args) => {
    if (!subCommand) {
      config.openGUI();
      return;
    }

    subCommand = subCommand.toLowerCase();

    switch (subCommand) {
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
            CustomEmotes.addCustomEmote(emoteName, emote);
            break;
          case "remove":
            if (args.length !== 2) {
              showGeneralJAMessage("Usage: /ja emote remove [emotename]");
              return;
            }
            CustomEmotes.removeCustomEmote(args[1]);
            break;
          case "list":
            CustomEmotes.listCustomEmotes();
            break;
          default:
            showGeneralJAMessage(
              "Unknown emote action. Use add, remove, or list."
            );
        }
        break;
      case "test":
        showGeneralJAMessage("The Module is actually running!");
        break;
      case "help":
        showGeneralJAMessage(
          "Available subcommands: crypts, help, emote, test"
        );
        showDebugMessage("Displayed /ja help information");
        break;
    }
  },
  ["crypts", "help", "emote", "test"]
);

// /reminder command
registerSlashCommand(
  "reminder",
  "Set a reminder",
  (...args) => {
    if (!config.enableReminders) {
      showGeneralJAMessage("Reminders are currently disabled in the config.");
      return;
    }

    if (args.length === 0) {
      showGeneralJAMessage(
        "Usage: /reminder [add|remove|list] [name|index] [time]"
      );
      return;
    }

    const action = args[0].toLowerCase();

    switch (action) {
      case "add":
        if (args.length < 3) {
          showGeneralJAMessage("Usage: /reminder add [name] [time]");
          return;
        }
        const timeArg = args[args.length - 1];
        const name = args.slice(1, -1).join(" ");
        if (
          Reminders.addReminder(name, timeArg, (reminderName) => {
            showGeneralJAMessage(`Reminder: ${reminderName}`);
          })
        ) {
          showGeneralJAMessage(
            `Reminder '${name}' set for ${timeArg}`,
            "success"
          );
        } else {
          showGeneralJAMessage(
            `Failed to set reminder '${name}'. Please check the time format.`,
            "error"
          );
        }
        break;
      case "remove":
        if (args.length < 2) {
          showGeneralJAMessage("Usage: /reminder remove [name|index]");
          return;
        }
        const removeIdentifier = args[1];
        const removeIndex = parseInt(removeIdentifier);
        if (
          Reminders.removeReminder(
            isNaN(removeIndex) ? removeIdentifier : removeIndex
          )
        ) {
          showGeneralJAMessage(
            `Reminder '${removeIdentifier}' removed`,
            "success"
          );
        } else {
          showGeneralJAMessage(
            `No reminder found with identifier '${removeIdentifier}'`,
            "error"
          );
        }
        break;
      case "list":
        const list = Reminders.listReminders();
        if (list.length > 0) {
          showGeneralJAMessage("Active reminders:");
          list.forEach((reminder) => {
            showGeneralJAMessage(
              `${reminder.index}. ${
                reminder.name
              } - Time left: ${Reminders.formatTime(reminder.timeLeft)}`
            );
          });
        } else {
          showGeneralJAMessage("No active reminders");
        }
        break;
      default:
        showGeneralJAMessage(
          "Usage: /reminder [add|remove|list] [name|index] [time]"
        );
    }
  },
  ["add", "remove", "list"]
);

register("gameLoad", () => {
  showGeneralJAMessage(`jcnlkAddons loaded successfully!`, "success");
});
