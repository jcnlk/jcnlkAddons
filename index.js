// Import necessary modules and configurations
import config from "./config";
import * as Dungeons from "./features/dungeons/Dungeons";
import * as Reminders from "./features/general/Reminders";
import { showSimplePopup } from "./utils/Popup";
import { scanItemAttributes } from "./utils/LootScanner.js";
import { renderAttributeAbbreviations } from "./utils/AttributeAbbrev";
import { showGeneralJAMessage, showDebugMessage } from "./utils/ChatUtils";
import "./features/dungeons/DungeonUtils"
import "./utils/HighlightSlots"
import * as CustomEmotes from "./features/general/CustomEmotes";
const DmCommands = require("./features/commands/DmCommands.js");
const PartyCommands = require("./features/commands/PartyCommands.js");

// Global variables
let titles = [];
let slashCommandsInitialized = false;

/**
 * Initializes a module and handles any errors
 * @param {string} name - The name of the module
 * @param {Function} initFunction - The initialization function for the module
 * @returns {boolean} - Whether the initialization was successful
 */
function initializeModule(name, initFunction) {
    try {
        showDebugMessage(`Starting initialization of ${name}`, 'warning');
        initFunction();
        showDebugMessage(`${name} initialized successfully`, 'success');
        return true;
    } catch (error) {
        showDebugMessage(`Error initializing ${name}: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Registers a slash command
 * @param {string} command - The command to register
 * @param {string} description - The description of the command
 * @param {Function} action - The action to perform when the command is executed
 * @param {Array} tabCompletions - The tab completions for the command
 */
function registerSlashCommand(command, description, action, tabCompletions) {
    register("command", (...args) => {
        showDebugMessage(`Executing slash command: /${command} ${args.join(' ')}`);
        action(...args);
    }).setName(command).setTabCompletions(tabCompletions || []);
}

/**
 * Initializes all slash commands
 */
function initializeSlashCommands() {
    if (slashCommandsInitialized) {
        showDebugMessage("Slash commands already initialized, skipping.", 'warning');
        return;
    }
    showDebugMessage("Starting Slash Commands initialization", 'warning');

    // /ja command
    registerSlashCommand("ja", "Main command for jcnlkAddons", (subCommand, ...args) => {
        if (!subCommand) {
            config.openGUI();
            showDebugMessage("Opened jcnlkAddons configuration GUI");
            return;
        }

        subCommand = subCommand.toLowerCase();

        switch (subCommand) {
            case "crypts":
                if (config.enableCryptReminder) {
                    showGeneralJAMessage(`Current Crypt Count: ${Dungeons.killedCrypts}`);
                } else {
                    showGeneralJAMessage("Crypt Reminder is currently disabled.");
                }
                break;
            case "puzzles":
                displayPuzzleStatus();
                showDebugMessage("Displayed puzzle status");
                break;
            case "emote":
                if (args.length < 1) {
                    showGeneralJAMessage("Usage: /ja emote [add|remove|list] [emotename] [emote]");
                    return;
                }
                const emoteAction = args[0].toLowerCase();
                switch (emoteAction) {
                    case "add":
                        if (args.length !== 3) {
                            showGeneralJAMessage("Usage: /ja emote add [emotename] [emote]");
                            return;
                        }
                        CustomEmotes.addCustomEmote(args[1], args[2]);
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
                    showGeneralJAMessage("Unknown emote action. Use add, remove, or list.");
            }
            break;
            case "test":
                    showGeneralJAMessage("The Module is actually running!");
                break;
            case "help":
                showGeneralJAMessage("Available subcommands: crypts, help, puzzles, emote, test");
                showDebugMessage("Displayed /ja help information");
                break;
            default:
                showGeneralJAMessage("Unknown subcommand. Use 'crypts' to see crypt count, 'puzzles' to see puzzle status, or 'help' for more info.");
                showDebugMessage(`Unknown /ja subcommand: ${subCommand}`);
        }
    }, ["crypts", "help", "puzzles","emote", "test"]);

    // /testpopup command
    registerSlashCommand("testpopup", "Show a test popup", (message, ...args) => {
        if (!message) {
            message = "This is a Test Popup!";
        }
        const fullMessage = [message, ...args].join(" ");
        showSimplePopup(fullMessage, 3000, true, "JA Popup");
        showDebugMessage(`Displayed test popup with message: ${fullMessage}`);
    });

    // /reminder command
    registerSlashCommand("reminder", "Set a reminder", (...args) => {
        if (!config.enableReminders) {
            showGeneralJAMessage("Reminders are currently disabled in the config.");
            return;
        }

        if (args.length === 0) {
            showGeneralJAMessage("Usage: /reminder [add|remove|list] [name] [time]");
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
                if (Reminders.addReminder(name, timeArg, (reminderName) => {
                    showGeneralJAMessage(`Reminder: ${reminderName}`);
                })) {
                    showGeneralJAMessage(`Reminder '${name}' set for ${timeArg}`, 'success');
                } else {
                    showGeneralJAMessage(`Failed to set reminder '${name}'. Please check the time format.`, 'error');
                }
                break;
            case "remove":
                if (args.length < 2) {
                    showGeneralJAMessage("Usage: /reminder remove [name]");
                    return;
                }
                const removeName = args.slice(1).join(" ");
                if (Reminders.removeReminder(removeName)) {
                    showGeneralJAMessage(`Reminder '${removeName}' removed`, 'success');
                } else {
                    showGeneralJAMessage(`No reminder found with name '${removeName}'`, 'error');
                }
                break;
            case "list":
                const list = Reminders.listReminders();
                if (list.length > 0) {
                    showGeneralJAMessage(`Active reminders: ${list.join(", ")}`);
                } else {
                    showGeneralJAMessage("No active reminders");
                }
                break;
            default:
                showGeneralJAMessage("Usage: /reminder [add|remove|list] [name] [time]");
        }
    }, ["add", "remove", "list"]);

    slashCommandsInitialized = true;
    showDebugMessage("Slash commands initialized", 'success');
}

/**
 * Initializes the JA Module
 */
function initializeJAModule() {
    showGeneralJAMessage("Loading jcnlkAddons...");
    showDebugMessage("Starting jcnlkAddons initialization", 'warning');
    
    let successCount = 0;
    const totalModules = 5;  // SlashCommands, Dungeons, PartyCommands, DmCommands, Custom Emotes

    initializeSlashCommands();
    successCount++;
    
    if (config.enableCryptReminder) {
        successCount += initializeModule("Dungeons module", () => Dungeons.updateCryptCount());
    } else {
        showDebugMessage("Dungeons module skipped (not enabled in config)", 'info');
    }
    
    successCount += initializeModule("Party Commands", () => PartyCommands(showDebugMessage, showGeneralJAMessage));
    successCount += initializeModule("DM Commands", () => DmCommands(showDebugMessage, showGeneralJAMessage));
    successCount += initializeModule("Custom Emotes", () => CustomEmotes.initialize());

    showDebugMessage("jcnlkAddons initialization completed", 'success');

    if (successCount === totalModules) {
        showGeneralJAMessage("jcnlkAddons loaded successfully!", 'success');
    } else {
        showGeneralJAMessage(`jcnlkAddons loaded with ${totalModules - successCount} errors.`, 'error');
    }
}

// Call the initialization function
initializeJAModule();