import Config from "../../config";
import * as Reminders from "../general/Reminders";

let userCooldowns = {};
let userCommandCounts = {};
let globalCommandCount = 0;
let globalLastCommandTime = 0;

let commandOutputs;
try {
    const jsonPath = "./data/PartyCommands.json";
    const jsonContent = FileLib.read("jcnlkTools", jsonPath);
    if (!jsonContent) {
        throw new Error(`PartyCommands.json is empty or not found at path: ${jsonPath}`);
    }
    commandOutputs = JSON.parse(jsonContent);
    if (!commandOutputs || typeof commandOutputs !== 'object') {
        throw new Error("Invalid JSON format in PartyCommands.json");
    }
} catch (error) {
    console.error("Error loading PartyCommands.json:", error);
    commandOutputs = {}; // Set an empty object fallback
}

function isUserAllowed(playerName, showDebugMessage) {
    const currentTime = Date.now();
    
    if (Config.enableGlobalCooldown) {
        if (currentTime - globalLastCommandTime < Config.globalCooldownDuration * 1000) {
            showDebugMessage(`Global cooldown active for ${playerName}. Time remaining: ${((Config.globalCooldownDuration * 1000) - (currentTime - globalLastCommandTime)) / 1000}s`);
            return false;
        }

        if (currentTime - globalLastCommandTime > Config.globalLimitPeriod * 1000) {
            globalCommandCount = 0;
        }

        if (globalCommandCount >= Config.maxGlobalCommands) {
            showDebugMessage(`Global command limit reached. Count: ${globalCommandCount}/${Config.maxGlobalCommands}`);
            return false;
        }

        globalCommandCount++;
        globalLastCommandTime = currentTime;
    }

    if (Config.enablePerUserCooldown) {
        if (!userCooldowns[playerName]) {
            userCooldowns[playerName] = 0;
            userCommandCounts[playerName] = { count: 0, lastResetTime: currentTime };
        }

        if (currentTime - userCooldowns[playerName] < Config.perUserCooldownDuration * 1000) {
            showDebugMessage(`User cooldown active for ${playerName}. Time remaining: ${((Config.perUserCooldownDuration * 1000) - (currentTime - userCooldowns[playerName])) / 1000}s`);
            return false;
        }

        if (currentTime - userCommandCounts[playerName].lastResetTime > Config.perUserLimitPeriod * 1000) {
            userCommandCounts[playerName] = { count: 0, lastResetTime: currentTime };
        }

        if (userCommandCounts[playerName].count >= Config.maxCommandsPerUser) {
            showDebugMessage(`User command limit reached for ${playerName}. Count: ${userCommandCounts[playerName].count}/${Config.maxCommandsPerUser}`);
            return false;
        }

        userCommandCounts[playerName].count++;
        userCooldowns[playerName] = currentTime;
    }

    return true;
}

module.exports = (showDebugMessage, showGeneralJTMessage) => {
    function sendPartyChatMessage(message) {
        ChatLib.say(`/pc ${message}`);
        showDebugMessage(`Sent party chat message: ${message}`);
    }

    function generateMessage(commandType, variables) {
        showDebugMessage(`Generating message for command: ${commandType}`);
        if (!commandOutputs[commandType]) {
            console.error(`Invalid or missing command type: ${commandType}`);
            return null;
        }
    
        let templates;
        switch (commandType) {
            case 'rng':
                templates = variables.rng <= 30 ? commandOutputs.rng.low :
                            variables.rng <= 70 ? commandOutputs.rng.medium :
                            commandOutputs.rng.high;
                break;
            case 'throw':
                templates = variables.throwIntensity <= 30 ? commandOutputs.throw.low :
                            variables.throwIntensity <= 70 ? commandOutputs.throw.medium :
                            commandOutputs.throw.high;
                break;
            case 'cf':
                templates = commandOutputs.cf[variables.result];
                break;
            case 'dice':
                templates = variables.result <= 2 ? commandOutputs.dice.low :
                            variables.result <= 4 ? commandOutputs.dice.medium :
                            commandOutputs.dice.high;
                break;
            case 'mod':
                templates = commandOutputs.mod;
                break;
            case 'simp':
            case 'sweat':
            case 'sus':
                templates = variables.percentage <= 33 ? commandOutputs[commandType].low :
                            variables.percentage <= 66 ? commandOutputs[commandType].medium :
                            commandOutputs[commandType].high;
                break;
            default:
                templates = commandOutputs[commandType];
        }
    
        if (!Array.isArray(templates)) {
            console.error(`Invalid template array for command type: ${commandType}`);
            return null;
        }
    
        const template = templates[Math.floor(Math.random() * templates.length)];
        return template.replace(/\${(\w+)}/g, (_, key) => variables[key] !== undefined ? variables[key] : '');
    }

    function handleCommandsCommand(args, command, senderName) {
        showDebugMessage(`Handling !commands command with args: ${args.join(', ')}`);
        
        if (!commandOutputs.commands) {
            showGeneralJTMessage("Error: Commands information not available");
            return;
        }
    
        let message;
        if (args.length === 0 || args[0].toLowerCase() === "list") {
            const availableCommands = [
                Config.rngCommand && "!rng",
                Config.coinFlipCommand && "!cf",
                Config.eightBallCommand && "!8ball",
                Config.throwCommand && "!throw",
                Config.diceCommand && "!dice",
                Config.petCommand && "!pet",
                Config.jokeCommand && "!joke",
                Config.modCommand && "!mod",
                Config.simpCommand && "!simp",
                Config.sweatCommand && "!sweat",
                Config.susCommand && "!sus",
                Config.partyKickCommand && "!kick",
                Config.partyInviteCommand && "!p",
                Config.reminderCommand && "!reminder",
                "!commands"
            ].filter(Boolean);

            message = `Available commands: ${availableCommands.join(", ")}`;
            showDebugMessage("Sending dynamic command list");
        } else if (args[0].toLowerCase() === "help") {
            if (args.length === 1) {
                message = commandOutputs.commands.help || "Help information not available";
                showDebugMessage("Sending general help message");
            } else {
                let specificCommand = args[1].toLowerCase();
                message = (commandOutputs.commands.specific && commandOutputs.commands.specific[specificCommand]) || 
                          `Unknown command: ${specificCommand}. Use !commands list for a list of available commands.`;
                showDebugMessage(`Sending help for ${specificCommand}`);
            }
        } else {
            message = "Invalid usage. Try !commands list or !commands help [command]";
            showDebugMessage("Sending invalid usage message");
        }

        sendPartyChatMessage(message);
    }

    const PartyCommandModule = register("chat", (player, message) => {
        if (!message.startsWith("!")) return;
        
        let commandParts = message.split(" ");
        let command = commandParts[0].toLowerCase();
        let senderName = player.replace(/\[.*?\]\s*/, '');
        let targetName = commandParts[1] && !commandParts[1].startsWith('!') ? commandParts[1] : senderName;

        showDebugMessage(`Received command: ${command} from player: ${senderName}, target: ${targetName}`);

        if (!isUserAllowed(senderName, showDebugMessage)) {
            showDebugMessage(`Command ${command} from ${senderName} was blocked due to cooldown or limit`);
            return;
        }

        if (!Config.enablePartyCommands) {
            showDebugMessage(`Party commands are currently disabled.`);
            return;
        }

        let isCommandEnabled = false;
        switch (command) {
            case "!rng": isCommandEnabled = Config.rngCommand; break;
            case "!cf": isCommandEnabled = Config.coinFlipCommand; break;
            case "!8ball": isCommandEnabled = Config.eightBallCommand; break;
            case "!throw": isCommandEnabled = Config.throwCommand; break;
            case "!dice": isCommandEnabled = Config.diceCommand; break;
            case "!pet": isCommandEnabled = Config.petCommand; break;
            case "!joke": isCommandEnabled = Config.jokeCommand; break;
            case "!commands": 
            case "!command": isCommandEnabled = true; break;
            case "!mod": isCommandEnabled = Config.modCommand; break;
            case "!simp": isCommandEnabled = Config.simpCommand; break;
            case "!sweat": isCommandEnabled = Config.sweatCommand; break;
            case "!sus": isCommandEnabled = Config.susCommand; break;
            case "!kick":
            case "!pk": isCommandEnabled = Config.partyKickCommand; break;
            case "!p": isCommandEnabled = Config.partyInviteCommand; break;
            case "!reminder": isCommandEnabled = Config.reminderCommand; break;
            default: 
                showDebugMessage(`Unknown command: ${command}`);
                return;
        }

        if (!isCommandEnabled) {
            showDebugMessage(`The command ${command} is currently disabled.`);
            return;
        }

        let generatedMessage;

        switch(command) {
            case "!rng":
                let rng = Math.floor(Math.random() * 101);
                let item = commandParts.slice(1).join(" ").toLowerCase() || null;
                generatedMessage = generateMessage("rng", {playerName: senderName, rng, dropString: item ? ` for ${item}` : ''});
                break;
            case "!cf":
                let result = Math.random() < 0.5 ? "Heads" : "Tails";
                generatedMessage = generateMessage("cf", {playerName: senderName, result: result.toLowerCase()});
                break;
            case "!8ball":
                let question = commandParts.slice(1).join(" ");
                let response = commandOutputs["8ballResponses"][Math.floor(Math.random() * commandOutputs["8ballResponses"].length)];
                generatedMessage = generateMessage("8ball", {playerName: senderName, question, response});
                break;
            case "!throw":
                let throwIntensity = Math.floor(Math.random() * 101);
                generatedMessage = generateMessage("throw", {playerName: targetName, throwIntensity});
                break;
            case "!dice":
                let diceResult = Math.floor(Math.random() * 6) + 1;
                generatedMessage = generateMessage("dice", {playerName: senderName, result: diceResult});
                break;
            case "!pet":
                generatedMessage = generateMessage("pet", {playerName: targetName});
                break;
            case "!joke":
                generatedMessage = generateMessage("joke", {playerName: senderName});
                break;
            case "!commands":
            case "!command":
                handleCommandsCommand(commandParts.slice(1), command, senderName);
                return;
            case "!mod":
                generatedMessage = generateMessage("mod");
                break;
            case "!simp":
            case "!sweat":
            case "!sus":
                let percentage = Math.floor(Math.random() * 101);
                generatedMessage = generateMessage(command.slice(1), {playerName: targetName, percentage: percentage});
                break;
            case "!kick":
            case "!pk":
                let playerToKick = commandParts[1];
                if (playerToKick) {
                    const kickCommand = `/p kick ${playerToKick}`;
                    ChatLib.say(kickCommand);
                    showDebugMessage(`Executed command: ${kickCommand}`);
                } else {
                    generatedMessage = "Please specify a player to kick";
                    showDebugMessage("Kick command executed without specifying a player");
                }
                break;
            case "!p":
                let playerToInvite = commandParts[1];
                if (playerToInvite) {
                    ChatLib.say(`/p ${playerToInvite}`);
                    generatedMessage = `Sent party invite to ${playerToInvite}`;
                } else {
                    generatedMessage = "Please specify a player to invite";
                }
                break;
            case "!reminder":
                if (Config.reminderCommand) {
                    const timeRegex = /(\d+[smh])$/;
                    const timeMatch = message.match(timeRegex);
                    if (timeMatch) {
                        const reminderTime = timeMatch[1];
                        const reminderName = message.slice(9, -reminderTime.length).trim();
                        if (reminderName && reminderTime) {
                            Reminders.addPartyReminder(senderName, reminderName, reminderTime, (reminderName) => {
                                sendPartyChatMessage(`Reminder for ${senderName}: ${reminderName}`);
                            });
                            generatedMessage = `Reminder '${reminderName}' set for ${reminderTime}`;
                        } else {
                            generatedMessage = "Usage: !reminder [name] [time]";
                        }
                    } else {
                        generatedMessage = "Invalid time format. Use s for seconds, m for minutes, h for hours.";
                    }
                }
            break;
        }
    
        if (generatedMessage) {
            sendPartyChatMessage(generatedMessage);
        } else {
            showGeneralJTMessage(`Error: Unable to generate message for ${command}`);
            showDebugMessage(`Failed to generate message for ${command}. Command type might be missing in PartyCommands.json`);
        }
    }).setChatCriteria("Party > ${player}: ${message}");
    
    return {
        PartyCommandModule
    };
};