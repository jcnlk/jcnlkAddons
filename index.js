// External Modules
import { convertToTimeString } from "../BloomCore/utils/Utils";
import request from "../requestV2";

// Config and Utils
import { showChatMessage, moduleVersion, PREFIX } from "./utils/Utils";
import HudManager from "./utils/Hud";
import { data } from "./utils/Data";
import config from "./config";

// General
import { addReminder, removeReminder, listReminders } from "./features/general/Reminders";
import "./features/general/AutoPetruleTitle";
import "./features/general/AttributeAbbrev";
import "./features/general/UwuAddonsHider";
import "./features/general/CustomEmotes";

// Dungeons
import "./features/dungeons/HighlightDungeonLoot";
import "./features/dungeons/FireFreezeNotifier";
import "./features/dungeons/HidePlayerOnLeap";
import "./features/dungeons/CryptReminder";
import "./features/dungeons/QuizTimer";

// Floor 7
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
];

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
        new TextComponent(`&7> &a/${cmd}${options} &7- &e${description}`)
          .setClick("run_command", `/${cmd}`)
          .setHover("show_text", `&7Click to run &a/${cmd}`)
          .chat();
      });
      break;  
    case "reminder":
    case "reminders":
      handleReminderCommand(args);
      break; 
    case "emote":
    case "emotes":
      handleEmoteCommand(args);
      break; 
    case "update":
    case "updates":
      checkForUpdate();
      break; 
    default:
      showChatMessage("Unknown command. Use '/ja help' for a list of commands.");
  }
}).setName("ja").setAliases("jcnlkAddons");

function handleReminderCommand(args) {
  if (!config.enableReminders) return;
  if (args.length < 2) {
    showChatMessage("Usage: /ja reminder [add|list|remove] [name] [time]");
    showChatMessage("Time can be in format: 2h 30m 15s, 1d 12h, 90m, etc.");
    return;
  }
  const action = args[1].toLowerCase();
  switch (action) {
    case "add":
      if (args.length < 4) {
        showChatMessage("Usage: /ja reminder add [name] [time]");
        showChatMessage("Example: /ja reminder add Check auction 2h 30m");
        return;
      }

      let timeIndex = args.findIndex((arg, i) => i > 1 && /\d+[dhms]/.test(arg));
      if (timeIndex === -1) timeIndex = args.length - 1;
      
      const name = args.slice(2, timeIndex).join(" ");
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
    case "remove":
      if (args.length < 3) {
        showChatMessage("Usage: /ja reminder remove [name|index]");
        return;
      }
      
      const identifier = args[2];
      const index = parseInt(identifier);
      const removed = removeReminder(isNaN(index) ? identifier : index);
      
      showChatMessage(
        removed 
          ? `Reminder '${identifier}' removed` 
          : `No reminder found with identifier '${identifier}'`,
        removed ? "success" : "error"
      );
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
    default:
      showChatMessage("Usage: /ja reminder [add|list|remove] [name] [time]");
      showChatMessage("Time can be in format: 2h 30m 15s, 1d 12h, 90m, etc.");
  }
}

function handleEmoteCommand(args) {
  const action = args.length >= 2 ? args[1].toLowerCase() : "list";
  
  switch (action) {
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
      if (args.length < 3) {
        showChatMessage("Usage: /ja emote add [emotename] [emote]");
        return;
      }
      
      const emoteName = args[2];
      const emote = args.slice(3).join(" ");
      
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
      if (args.length < 3) {
        showChatMessage("Usage: /ja emote remove [emotename]");
        return;
      }
      
      const name = args[2];
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
}

function checkForUpdate() {
  showChatMessage("Checking for updates..");
  request({url: "https://api.github.com/repos/jcnlk/jcnlkAddons/releases", json: true})
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

register("serverConnect", () => {
  if (config.updateChecker) Client.scheduleTask(100, checkForUpdate);
});

register("gameLoad", () => {
  showChatMessage("jcnlkAddons loaded successfully!", "success");
  if (config.updateChecker) checkForUpdate();
});