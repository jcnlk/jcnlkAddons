import Config from "../../config";
import { showGeneralJAMessage } from "../../utils/ChatUtils";

function handleInviteCommand(commandParts, senderName) {
  if (!commandParts || commandParts.length < 1) return;

  let playerToInvite = commandParts.slice(1).join(" ") || senderName;
  ChatLib.command(`party invite ${playerToInvite}`);
  showGeneralJAMessage(`Inviting -> ${playerToInvite}`);
}

function handleKickCommand(commandParts) {
  let playerToKick = commandParts[1]?.trim();
  if (!playerToKick) return;
  ChatLib.command(`party kick ${playerToKick}`);
  showGeneralJAMessage(`Kicking -> ${playerToKick}`);
}

register("chat", (rank, player, message) => {
  if (!message.startsWith("!")) return;

  let commandParts = message.split(" ");
  let command = commandParts[0].toLowerCase();
  let senderName = player.trim();

  if (!Config.enableDmCommands) return;

  if (command === "!p" && Config.partyCommand) {
    handleInviteCommand(commandParts, senderName);
  } else if ((command === "!kick" || command === "!pk") && Config.kickCommand) {
    handleKickCommand(commandParts);
  }
}).setChatCriteria("From ${rank} ${player}: ${message}");
