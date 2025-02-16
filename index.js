// External Modules
import request from "../requestV2";

// Config
import config from "./config";

// General
import "./features/general/AutoPetruleTitle";
import "./features/general/AttributeAbbrev";
import "./features/general/CustomEmotes";
import "./features/general/Reminders";

// Utils
import { showGeneralJAMessage } from "./utils/ChatUtils";
import { ModuleVersion } from "./utils/Constants";
import HudManager from "./utils/Hud";
import "./utils/KuudraLootScanner";
import "./utils/HighlightSlots";
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
import "./features/dungeons/MaskReminder";
import "./features/dungeons/TitleAlerts";
import "./features/dungeons/QuizTimer";
import "./features/dungeons/MaskTimer";
import "./features/dungeons/Posmsg.js";

// Commands
import "./features/commands/PartyCommands";
import "./features/commands/DmCommands";

const GITHUB_API_URL = "https://api.github.com/repos/jcnlk/jcnlkAddons/releases";
const GITHUB_RELEASE_URL = "https://github.com/jcnlk/jcnlkAddons/releases/latest";

function checkForUpdate() {
  showGeneralJAMessage("Checking for updates..");
  request({
    url: GITHUB_API_URL,
    headers: { "User-Agent": "jcnlkAddons" },
    json: true
  })
  .then(function(response) {
    if (!response || !response.length) {
      showGeneralJAMessage("No Release found!");
      return;
    }
    
    const latest = response[0];
    const remoteVersion = latest.tag_name.replace(/^v/, '').split("-")[0];
    const localVersion = ModuleVersion.replace(/^v/, '').split("-")[0];
    
    if (localVersion < remoteVersion) {
      showGeneralJAMessage("Update available: " + localVersion + " -> " + remoteVersion);
      ChatLib.chat(new TextComponent("&8[&6JA&8]&r &aClick here to go to the Github release page!&r")
        .setClick("open_url", GITHUB_RELEASE_URL));
    } else if (localVersion > remoteVersion) {
      showGeneralJAMessage("You are currently using the newest version!");
    } else {
      showGeneralJAMessage("You are currently using the dev version!");
    }
  })
  .catch(function(error) {
    showGeneralJAMessage("Failed to check for update!");
    console.error(error);
  });
}

register("command", (subCommand) => {
  if (!subCommand) {
    config.openGUI();
    return;
  }

  const command = subCommand.toLowerCase();

  switch (command) {
    case "hud":
      HudManager.openGui();
      break;
    case "help":
      showGeneralJAMessage("Available subcommands: help, hud, update");
      break;
    case "update":
      checkForUpdate();
      break;
    default:
      showGeneralJAMessage("Unknown subcommand! Use 'help' for available commands.");
  }
})
.setName("ja")
.setAliases("jcnlkAddons")
.setTabCompletions(["help", "hud", "update"]);

register("serverConnect", () => {
  Client.scheduleTask(100, checkForUpdate);
});

register("gameLoad", () => {
  showGeneralJAMessage("jcnlkAddons loaded successfully!", "success");
  checkForUpdate();
});