// External Modules
import { CommandHandler } from "../tska/command/CommandHandler";
import { convertToTimeString } from "../BloomCore/utils/Utils";
import { fetch } from "../tska/polyfill/fetch";

// Config and Utils
import { showChatMessage, moduleVersion, PREFIX, registerWhen } from "./utils/Utils";
import HudManager from "./utils/Hud";
import { data } from "./utils/Data";
import config from "./config";

// General
import { addReminder, removeReminder, listReminders } from "./features/general/Reminders";
import "./features/general/AutoPetruleTitle";
import "./features/general/AttributeAbbrev";
import "./features/general/CustomEmotes";
import "./features/general/MessageHider";

// Dungeons
import "./features/dungeons/HighlightDungeonLoot";
import "./features/dungeons/FireFreezeNotifier";
import "./features/dungeons/HidePlayerOnLeap";
import "./features/dungeons/CryptReminder";
import "./features/dungeons/LeapAnnounce";
import "./features/floor7/MelodyWarning";
import "./features/dungeons/QuizTimer";

// Floor 7
import "./features/floor7/MaskReminder";
import "./features/floor7/MaskTimer";
import "./features/floor7/PosTitles";
import "./features/floor7/Posmsg";

// Commands
import "./features/commands/DmCommands";

// Ja command
const commandHandler = new CommandHandler("jcnlkAddons")
  .setTitleFormat(`${PREFIX} &eCommands:`)
  .setCommandFormat("&8• &a/ja ${name} &7- &e${description}")
  .setAliasFormat("") // Empty alias format cuz we don't want to spam the chat
  .setName("ja", (args) => {
    if (args === undefined || args.length === 0) {
      config.openGUI();
      return 1;
    }
  });

commandHandler
  .pushWithAlias("hud", ["edit"], "Open the HUDs editor", () => {
    HudManager.openGui();
  })
  .push("update", "Check for updates", () => {
    checkForUpdate();
  });

// Reminder subcommand
commandHandler.push("reminder", "Manage reminders", (action, ...args) => {
  if (!config.enableReminders) {
    showChatMessage("Reminders are currently disabled in the settings.", "error");
    return;
  }
  
  if (!action) {
    showChatMessage("Usage: /ja reminder [add|list|remove] [name] [time]");
    showChatMessage("Time can be in format: 2h 30m 15s, 1d 12h, 90m, etc.");
    return;
  }
  
  switch (action.toLowerCase()) {
    case "add":
      if (args.length < 2) {
        showChatMessage("Usage: /ja reminder add [name] [time]");
        showChatMessage("Example: /ja reminder add Check auction 2h 30m");
        return;
      }
      
      let timeIndex = args.findIndex((arg, i) => /\d+[dhms]/.test(arg));
      if (timeIndex === -1) timeIndex = args.length - 1;
      
      const name = args.slice(0, timeIndex).join(" ");
      const timeArg = args.slice(timeIndex).join(" ");
      
      if (!name) {
        showChatMessage("Please provide a reminder name.", "error");
        return;
      }
      
      const success = addReminder(name, timeArg);
      showChatMessage(
        success 
          ? `Reminder '${name}' set for ${timeArg}` 
          : `Failed to set reminder '${name}'. Please check the time format.`,
        success ? "success" : "error"
      );
      
      if (!success) showChatMessage("Valid time formats: 2h 30m 15s, 1d 12h, 90m, etc.");
      break;
      
    case "list":
      const reminderList = listReminders();
      if (reminderList.length > 0) {
        showChatMessage("Active reminders:");
        reminderList.forEach(reminder => {
          showChatMessage(`${reminder.index}. ${reminder.name} - Time left: ${convertToTimeString(reminder.timeLeft).replace(/\.\d+s/, 's')}`);
        });
      } else {
        showChatMessage("No active reminders");
      }
      break;
      
    case "remove":
      if (args.length < 1) {
        showChatMessage("Usage: /ja reminder remove [name|index]");
        return;
      }
      
      const identifier = args[0];
      const index = parseInt(identifier);
      const removed = removeReminder(isNaN(index) ? identifier : index);
      
      showChatMessage(
        removed 
          ? `Reminder '${identifier}' removed` 
          : `No reminder found with identifier '${identifier}'`,
        removed ? "success" : "error"
      );
      break;
      
    default:
      showChatMessage("Usage: /ja reminder [add|list|remove] [name] [time]");
      showChatMessage("Time can be in format: 2h 30m 15s, 1d 12h, 90m, etc.");
  }
});

// Emote subcommand
commandHandler.pushWithAlias("emotes", ["emote"], "Manage custom emotes", (action, ...args) => {
  if (!action) action = "list";
  
  switch (action.toLowerCase()) {
    case "list":
      const emotes = Object.keys(data.customEmotes);
      if (emotes.length === 0) {
        showChatMessage("No custom emotes defined.");
        return;
      }
      
      showChatMessage("Custom Emotes:");
      emotes.forEach(key => showChatMessage(`${key} -> ${data.customEmotes[key]}`));
      break;
      
    case "add":
      if (args.length < 2) {
        showChatMessage("Usage: /ja emote add [emotename] [emote]");
        return;
      }
      
      const emoteName = args[0];
      const emote = args.slice(1).join(" ");
      
      if (data.customEmotes[emoteName]) {
        showChatMessage(`Emote "${emoteName}" already exists. Remove it first to update it.`);
        return;
      }
      
      data.customEmotes[emoteName] = emote;
      data.save();
      showChatMessage(`Added: ${emoteName} -> ${emote}`);
      break;
      
    case "remove":
    case "delete":
      if (args.length < 1) {
        showChatMessage("Usage: /ja emote remove [emotename]");
        return;
      }
      
      const name = args[0];
      if (!data.customEmotes[name]) {
        showChatMessage(`Emote "${name}" not found.`);
        return;
      }
      
      delete data.customEmotes[name];
      data.save();
      showChatMessage(`Removed: ${name}`);
      break;
      
    default:
      showChatMessage("Usage: /ja emote [list|add|remove]");
  }
});

function checkForUpdate() {
  showChatMessage("Checking for updates..");
  fetch("https://api.github.com/repos/jcnlk/jcnlkAddons/releases", {json: true})
    .then(response => {
      if (!response || !response.length) return;
      
      const latest = response[0];
      const remoteVersion = latest.tag_name.replace(/^v/, '').split("-")[0];
      
      if (moduleVersion < remoteVersion) {
        showChatMessage(`Update available: ${moduleVersion} -> ${remoteVersion}`);
        new TextComponent(`${PREFIX} &a[Click here to go to the Github release page!]`)
          .setClick("open_url", "https://github.com/jcnlk/jcnlkAddons/releases/latest")
          .chat();
      } else if (moduleVersion === remoteVersion) {
        showChatMessage("You are currently using the newest version!");
      } else {
        showChatMessage("You are currently using the dev version!");
      }
    })
    .catch(error => {
      showChatMessage("Failed to check for update!");
      console.error(error);
    });
}

registerWhen(register("serverConnect", () => Client.scheduleTask(100, checkForUpdate)), () => config.updateChecker);

register("gameLoad", () => {
  showChatMessage("jcnlkAddons loaded successfully!", "success");
  if (config.updateChecker) checkForUpdate();
});