// External Modules
import { convertToTimeString } from "../BloomCore/utils/Utils";
import request from "../requestV2";

// Config
import config from "./config";

// General
import { addReminder, removeReminder, listReminders } from "./features/general/Reminders";
import "./features/general/AutoPetruleTitle";
import "./features/general/AttributeAbbrev";
import "./features/general/UwuAddonsHider";
import "./features/general/CustomEmotes";

// Utils
import { showChatMessage, moduleVersion } from "./utils/Utils";
import HudManager from "./utils/Hud";
import { data } from "./utils/Data";

// Dungeons
import "./features/dungeons/HighlightDungeonLoot";
import "./features/dungeons/FireFreezeNotifier";
import "./features/dungeons/HidePlayerOnLeap";
import "./features/dungeons/CryptReminder";
import "./features/dungeons/QuizTimer";

// Floor 7
import "./features/floor7/SimonSaysPhaseTracker";
import "./features/floor7/MaskReminder";
import "./features/floor7/MaskTimer";
import "./features/floor7/PosTitles";
import "./features/floor7/Posmsg";

// Commands
import "./features/commands/DmCommands";

const commands = [
  {cmd: "ja", options: "", description: "Open the settings"},
  {cmd: "ja help", options: "", description: "Show this message"},
  {cmd: "ja hud", options: "", description: "Open the HUDs and move them arround"},
  {cmd: "ja update", options: "", description: "Check if there is a newer version on Github"},
  {cmd: "ja reminder", options: " <add|list|remove>", description: "Create reminder"},
  {cmd: "ja emotes", options: " <add|list|remove>", description: "Create custom emotes"}
]

const GITHUB_API_URL = "https://api.github.com/repos/jcnlk/jcnlkAddons/releases";
const GITHUB_RELEASE_URL = "https://github.com/jcnlk/jcnlkAddons/releases/latest";

function checkForUpdate() {
  showChatMessage("Checking for updates..");
  request({
    url: GITHUB_API_URL,
    headers: { "User-Agent": "jcnlkAddons" },
    json: true
  })
  .then(function (response) {
    if (!response || !response.length) {
      showChatMessage("No Release found!");
      return;
    }
    const latest = response[0];
    const remoteVersion = latest.tag_name.replace(/^v/, '').split("-")[0];
    const localVersion = moduleVersion.replace(/^v/, '').split("-")[0];
    if (localVersion < remoteVersion) {
      showChatMessage("Update available: " + localVersion + " -> " + remoteVersion);
      ChatLib.chat(
        new TextComponent("&8[&6JA&8]&r &a[Click here to go to the Github release page!]")
          .setClick("open_url", GITHUB_RELEASE_URL)
      );
    } else if (localVersion > remoteVersion) {
      showChatMessage("You are currently using the newest version!");
    } else {
      showChatMessage("You are currently using the dev version!");
    }
  })
  .catch(function (error) {
    showChatMessage("Failed to check for update!");
    console.error(error);
  });
}

register("command", (...args) => {
  if (args === undefined) {
    config.openGUI();
    return;
  }
  const subCommand = args[0].toLowerCase();
  switch (subCommand) {
    case "settings":
    case "setting":
      config.openGUI();
      break;
    case "hud":
    case "edit":
      HudManager.openGui();
      break;
    case "help":
      showChatMessage("Commands:");
      commands.forEach(({ cmd, options, description }) => {
        let text = new TextComponent("&7> &a/" + cmd + options + " &7- &e" + description)
        .setClick("run_command", "/"+ cmd)
        .setHover("show_text", `&7Click to run &a/${cmd}`)
        text.chat();
      });
      break;
    case "reminder": {
      if (!config.enableReminders) {
        showChatMessage("Reminders are currently disabled in the config.");
        break;
      }
      if (args.length < 2) {
        showChatMessage("Usage: /ja reminder [add|remove|list] [name|index] [time]");
        break;
      }
      const reminderAction = args[1].toLowerCase();
      switch (reminderAction) {
        case "add": {
          if (args.length < 4) {
            showChatMessage("Usage: /ja reminder add [name] [time]");
          } else {
            const timeArg = args[args.length - 1];
            const name = args.slice(2, -1).join(" ");
            const success = addReminder(name, timeArg);
            if (success) {
              showChatMessage(`Reminder '${name}' set for ${timeArg}`, "success");
            } else {
              showChatMessage(`Failed to set reminder '${name}'. Please check the time format.`, "error");
            }
          }
          break;
        }
        case "remove": {
          if (args.length < 3) {
            showChatMessage("Usage: /ja reminder remove [name|index]");
          } else {
            const removeIdentifier = args[2];
            const removeIndex = parseInt(removeIdentifier);
            if (removeReminder(isNaN(removeIndex) ? removeIdentifier : removeIndex)) {
              showChatMessage(`Reminder '${removeIdentifier}' removed`, "success");
            } else {
              showChatMessage(`No reminder found with identifier '${removeIdentifier}'`, "error");
            }
          }
          break;
        }
        case "list": {
          const reminderList = listReminders();
          if (reminderList.length > 0) {
            showChatMessage("Active reminders:");
            reminderList.forEach(reminder => {
              showChatMessage(
                `${reminder.index}. ${reminder.name} - Time left: ${convertToTimeString(reminder.timeLeft)}`
              );
            });
          } else {
            showChatMessage("No active reminders");
          }
          break;
        }
        default:
          showChatMessage("Usage: /ja reminder [add|remove|list] [name|index] [time]");
      }
      break;
    }
    case "emote":
    case "emotes": {
      let emoteAction = "list";
      if (args.length >= 2) {
        emoteAction = args[1].toLowerCase();
      }
      switch (emoteAction) {
        case "list": {
          const keys = Object.keys(data.customEmotes);
          if (keys.length === 0) {
            showChatMessage("No custom emotes defined.");
          } else {
            showChatMessage("Custom Emotes:");
            keys.forEach(key =>
              showChatMessage(`${key} -> ${data.customEmotes[key]}`)
            );
          }
          break;
        }
        case "add": {
          if (args.length < 3) {
            showChatMessage("Usage: /ja emote add [emotename] [emote]");
          } else {
            const emotename = args[2];
            const emote = args.slice(3).join(" ");
            if (data.customEmotes[emotename]) {
              showChatMessage(
                `Emote "${emotename}" already exists. Remove it first to update it.`
              );
            } else {
              data.customEmotes[emotename] = emote;
              data.save();
              showChatMessage(`Added: ${emotename} -> ${emote}`);
            }
          }
          break;
        }
        case "remove":
        case "delete": {
          if (args.length < 3) {
            showChatMessage("Usage: /ja emote remove [emotename]");
          } else {
            const emotename = args[2];
            if (data.customEmotes[emotename]) {
              delete data.customEmotes[emotename];
              data.save();
              showChatMessage(`Removed: ${emotename}`);
            } else {
              showChatMessage(`Emote "${emotename}" not found.`);
            }
          }
          break;
        }
        default:
          showChatMessage("Usage: /ja emote [list|add|remove]");
      }
      break;
    }
    case "update":
    case "updates":
      checkForUpdate();
      break;
    default:
      showChatMessage("Unknown command. Use '/ja help' for a list of commands.");
      break;
  }
}).setName("ja").setAliases("jcnlkAddons");

register("serverConnect", () => Client.scheduleTask(100, checkForUpdate));

register("gameLoad", () => {
  showChatMessage("jcnlkAddons loaded successfully!", "success");
  checkForUpdate();
});