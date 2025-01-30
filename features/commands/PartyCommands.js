import Config from "../../config";
import { addPartyReminder } from "../general/Reminders";
import { showGeneralJAMessage } from "../../utils/ChatUtils";

let commandOutputs;
try {
  const jsonPath = "./data/PartyCommands.json";
  const jsonContent = FileLib.read("jcnlkAddons", jsonPath);
  if (!jsonContent) {
    throw new Error(
      `PartyCommands.json is empty or not found at path: ${jsonPath}`
    );
  }
  commandOutputs = JSON.parse(jsonContent);
  if (!commandOutputs || typeof commandOutputs !== "object") {
    throw new Error("Invalid JSON format in PartyCommands.json");
  }
} catch (error) {
  console.error("Error loading PartyCommands.json:", error);
  commandOutputs = {};
}

function sendPartyChatMessage(message) {
  ChatLib.command(`party chat ${message}`);
}

function createResponse(commandType, variables) {
  if (!commandOutputs[commandType]) {
    console.error(`Invalid or missing command type: ${commandType}`);
    return null;
  }

  let templates;
  switch (commandType) {
    case "rng":
      templates =
        variables.rng <= 30
          ? commandOutputs.rng.low
          : variables.rng <= 70
          ? commandOutputs.rng.medium
          : commandOutputs.rng.high;
      break;
    case "throw":
      templates =
        variables.throwIntensity <= 30
          ? commandOutputs.throw.low
          : variables.throwIntensity <= 70
          ? commandOutputs.throw.medium
          : commandOutputs.throw.high;
      break;
    case "cf":
      templates = commandOutputs.cf[variables.result];
      break;
    case "dice":
      templates =
        variables.result <= 2
          ? commandOutputs.dice.low
          : variables.result <= 4
          ? commandOutputs.dice.medium
          : commandOutputs.dice.high;
      break;
    case "simp":
    case "sus":
      templates =
        variables.percentage <= 33
          ? commandOutputs[commandType].low
          : variables.percentage <= 66
          ? commandOutputs[commandType].medium
          : commandOutputs[commandType].high;
      break;
    default:
      templates = commandOutputs[commandType];
  }

  if (!Array.isArray(templates)) {
    console.error(`Invalid template array for command type: ${commandType}`);
    return null;
  }

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace(/\${(\w+)}/g, (_, key) =>
    variables[key] !== undefined ? variables[key] : ""
  );
}

function handleHelpCommand(args) {
  if (!commandOutputs.commands) {
    showGeneralJAMessage("Error: Commands information not available");
    return;
  }

  const availableCommands = [
    Config.rngCommand && "!rng",
    Config.coinFlipCommand && "!cf",
    Config.eightBallCommand && "!8ball",
    Config.throwCommand && "!throw",
    Config.diceCommand && "!dice",
    Config.simpCommand && "!simp",
    Config.susCommand && "!sus",
    Config.partyKickCommand && "!kick",
    Config.partyInviteCommand && "!p",
    Config.reminderCommand && "!reminder",
    "!commands",
  ].filter(Boolean);

  sendPartyChatMessage(`Available commands: ${availableCommands.join(", ")}`);
}

function handleRngCommand(senderName, commandParts) {
  const rng = getRandomInt(0, 100);
  const item = commandParts.slice(1).join(" ").toLowerCase() || null;
  return createResponse("rng", {
    playerName: senderName,
    rng,
    dropString: item ? ` for ${item}` : "",
  });
}

function handleCfCommand(senderName) {
  const result = Math.random() < 0.5 ? "Heads" : "Tails";
  return createResponse("cf", {
    playerName: senderName,
    result: result.toLowerCase(),
  });
}

function handle8BallCommand() {
  return commandOutputs["8ballResponses"][
    Math.floor(Math.random() * commandOutputs["8ballResponses"].length)
  ];
}

function handleThrowCommand(targetName) {
  const throwIntensity = Math.floor(Math.random() * 101);
  return createResponse("throw", {
    playerName: targetName,
    throwIntensity,
  });
}

function handleDiceCommand(senderName) {
  const diceResult = Math.floor(Math.random() * 6) + 1;
  return createResponse("dice", {
    playerName: senderName,
    result: diceResult,
  });
}

function handleSimpOrSusCommand(command, targetName) {
  const percentage = Math.floor(Math.random() * 101);
  return createResponse(command.slice(1), {
    playerName: targetName,
    percentage,
  });
}

function handleKickCommand(commandParts) {
  const playerToKick = commandParts[1];
  if (playerToKick) {
    ChatLib.command(`party kick ${playerToKick}`);
    showGeneralJAMessage(`Kicking -> ${playerToKick}`);
  } else {
    sendPartyChatMessage("Please specify a player to kick.");
  }
}

function handleInviteCommand(commandParts) {
  const playerToInvite = commandParts[1];
  if (playerToInvite) {
    ChatLib.command(`party invite ${playerToInvite}`);
    showGeneralJAMessage(`Inviting -> ${playerToInvite}`);
  } else {
    sendPartyChatMessage("Please specify a player to invite.");
  }
}

function handleReminderCommand(senderName, message) {
  const timeRegex = /(\d+[smh])$/;
  const timeMatch = message.match(timeRegex);
  if (timeMatch) {
    const reminderTime = timeMatch[1];
    const reminderName = message.slice(9, -reminderTime.length).trim();
    if (reminderName && reminderTime) {
      addPartyReminder(senderName, reminderName, reminderTime, () => {
        sendPartyChatMessage(`Reminder for ${senderName}: ${reminderName}`);
      });
      return `Reminder '${reminderName}' set for ${reminderTime}.`;
    }
  }
  return "Invalid time format. Use s for seconds, m for minutes, h for hours.";
}

function isCommandEnabled(command) {
  const commandMapping = {
    "!rng": Config.rngCommand,
    "!cf": Config.coinFlipCommand,
    "!8ball": Config.eightBallCommand,
    "!throw": Config.throwCommand,
    "!dice": Config.diceCommand,
    "!simp": Config.simpCommand,
    "!sus": Config.susCommand,
    "!kick": Config.partyKickCommand,
    "!p": Config.partyInviteCommand,
    "!reminder": Config.reminderCommand,
    "!commands": true,
  };
  return commandMapping[command] || false;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

register("chat", (player, message) => {
  if (!Config.enablePartyCommands || !message.startsWith("!")) return;

  const commandParts = message.split(" ");
  const command = commandParts[0].toLowerCase();
  const senderName = player.replace(/\[.*?\]\s*/, "");
  const targetName =
    commandParts[1] && !commandParts[1].startsWith("!")
      ? commandParts[1]
      : senderName;

  if (!isCommandEnabled(command)) return;

  let createdResponse;
  switch (command) {
    case "!rng":
      createdResponse = handleRngCommand(senderName, commandParts);
      break;
    case "!cf":
      createdResponse = handleCfCommand(senderName);
      break;
    case "!8ball":
      createdResponse = handle8BallCommand();
      break;
    case "!throw":
      createdResponse = handleThrowCommand(targetName);
      break;
    case "!dice":
      createdResponse = handleDiceCommand(senderName);
      break;
    case "!commands":
      handleHelpCommand(commandParts.slice(1));
      return;
    case "!simp":
    case "!sus":
      createdResponse = handleSimpOrSusCommand(command, targetName);
      break;
    case "!kick":
      handleKickCommand(commandParts);
      return;
    case "!p":
      handleInviteCommand(commandParts);
      return;
    case "!reminder":
      createdResponse = handleReminderCommand(senderName, message);
      break;
  }

  if (createdResponse) {
    sendPartyChatMessage(createdResponse);
  } else {
    console.error(
      `Failed to generate message for ${command}. Command type might be missing in PartyCommands.json`
    );
  }
}).setChatCriteria("Party > ${player}: ${message}");
