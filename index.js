// Import necessary modules and configurations
import config from "./config";
import * as Dungeons from "./features/dungeons/Dungeons";
import * as Reminders from "./features/general/Reminders";
import { showSimplePopup } from "./utils/Popup";
import { scanItemAttributes } from "./utils/KuudraLootScanner";
import { renderAttributeAbbreviations } from "./utils/AttributeAbbrev"
const DmCommands = require("./features/commands/DmCommands.js");
const PartyCommands = require("./features/commands/PartyCommands.js");

// Constants for chat prefixes
const PREFIX_GENERAL = `§3[JA]§r`;
const PREFIX_DEBUG = "§9[JA-DEBUG]§r";

// Global variables
let titles = [];
let slashCommandsInitialized = false;

/**
 * Displays a general message in the chat
 * @param {string} message - The message to display
 * @param {string} status - The status of the message (info, success, error)
 */
function showGeneralJTMessage(message, status = 'info') {
    let color;
    switch (status) {
        case 'success': color = "§a"; break;
        case 'error': color = "§c"; break;
        case 'info': 
        default: color = "§e"; break;
    }
    ChatLib.chat(`${PREFIX_GENERAL} ${color}${message}§r`);
}

/**
 * Displays a debug message in the chat if debug mode is enabled
 * @param {string} message - The debug message to display
 * @param {string} status - The status of the message (info, success, error, warning)
 */
function showDebugMessage(message, status = 'info') {
    if (config.debugMode) {
        let color;
        switch (status) {
            case 'success': color = "§a"; break;
            case 'error': color = "§c"; break;
            case 'warning': color = "§e"; break;
            case 'info': 
            default: color = "§f"; break;
        }
        const timestamp = new Date().toLocaleTimeString();
        ChatLib.chat(`${PREFIX_DEBUG} §7[${timestamp}]§r ${color}${message}§r`);
    }
}

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
                    showGeneralJTMessage(`Current Crypt Count: ${Dungeons.killedCrypts}`);
                } else {
                    showGeneralJTMessage("Crypt Reminder is currently disabled.");
                }
                break;
            case "test":
                if (config.enableTestCommand) {
                    showGeneralJTMessage("The Module is actually running!");
                    showDebugMessage("Executed /ja test command");
                } else {
                    showGeneralJTMessage("/ja test is currently disabled in the config");
                }
                break;
            case "help":
                showGeneralJTMessage("Available subcommands: crypts, help, test");
                showDebugMessage("Displayed /ja help information");
                break;
            default:
                showGeneralJTMessage("Unknown subcommand. Use 'crypts' to see crypt count, 'help' for more info.");
                showDebugMessage(`Unknown /ja subcommand: ${subCommand}`);
        }
    }, ["crypts", "help", "test"]);

    // /testpopup command
    registerSlashCommand("testpopup", "Show a test popup", (message, ...args) => {
        if (!message) {
            message = "This is a Test Popup!";
        }
        const fullMessage = [message, ...args].join(" ");
        showSimplePopup(fullMessage, 3000, true, "JT Popup");
        showDebugMessage(`Displayed test popup with message: ${fullMessage}`);
    });

    // /reminder command
    registerSlashCommand("reminder", "Set a reminder", (...args) => {
        if (!config.enableReminders) {
            showGeneralJTMessage("Reminders are currently disabled in the config.");
            return;
        }

        if (args.length === 0) {
            showGeneralJTMessage("Usage: /reminder [add|remove|list] [name] [time]");
            return;
        }

        const action = args[0].toLowerCase();

        switch (action) {
            case "add":
                if (args.length < 3) {
                    showGeneralJTMessage("Usage: /reminder add [name] [time]");
                    return;
                }
                const timeArg = args[args.length - 1];
                const name = args.slice(1, -1).join(" ");
                if (Reminders.addReminder(name, timeArg, (reminderName) => {
                    showGeneralJTMessage(`Reminder: ${reminderName}`);
                })) {
                    showGeneralJTMessage(`Reminder '${name}' set for ${timeArg}`);
                } else {
                    showGeneralJTMessage(`Failed to set reminder '${name}'. Please check the time format.`);
                }
                break;
            case "remove":
                if (args.length < 2) {
                    showGeneralJTMessage("Usage: /reminder remove [name]");
                    return;
                }
                const removeName = args.slice(1).join(" ");
                if (Reminders.removeReminder(removeName)) {
                    showGeneralJTMessage(`Reminder '${removeName}' removed`);
                } else {
                    showGeneralJTMessage(`No reminder found with name '${removeName}'`);
                }
                break;
            case "list":
                const list = Reminders.listReminders();
                if (list.length > 0) {
                    showGeneralJTMessage(`Active reminders: ${list.join(", ")}`);
                } else {
                    showGeneralJTMessage("No active reminders");
                }
                break;
            default:
                showGeneralJTMessage("Usage: /reminder [add|remove|list] [name] [time]");
        }
    }, ["add", "remove", "list"]);

    slashCommandsInitialized = true;
    showDebugMessage("Slash commands initialized", 'success');
}

/**
 * Initializes the JT Module
 */
function initializeJTModule() {
    showGeneralJTMessage("Loading jcnlkAddons...");
    showDebugMessage("Starting jcnlkAddons initialization", 'warning');
    
    let successCount = 0;
    const totalModules = 4;  // SlashCommands, Dungeons, PartyCommands, DmCommands

    initializeSlashCommands();
    successCount++;
    
    if (config.enableCryptReminder) {
        successCount += initializeModule("Dungeons module", () => Dungeons.updateCryptCount());
    } else {
        showDebugMessage("Dungeons module skipped (not enabled in config)", 'info');
    }
    
    successCount += initializeModule("Party Commands", () => PartyCommands(showDebugMessage, showGeneralJTMessage));
    successCount += initializeModule("DM Commands", () => DmCommands(showDebugMessage, showGeneralJTMessage));

    showDebugMessage("jcnlkAddons initialization completed", 'success');

    if (successCount === totalModules) {
        showGeneralJTMessage("jcnlkAddons loaded successfully!", 'success');
    } else {
        showGeneralJTMessage(`jcnlkAddons loaded with ${totalModules - successCount} errors.`, 'error');
    }
}

// Call the initialization function
initializeJTModule();

// Export functions
export {
    showDebugMessage,
    showGeneralJTMessage
};