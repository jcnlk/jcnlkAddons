import config from "../../config";
import { showChatMessage } from "../../utils/Utils";
import { registerWhen } from "../../utils/Register";

function handleInviteCommand(commandParts, senderName) {
  if (!commandParts || commandParts.length < 1) return;

  let playerToInvite = commandParts.slice(1).join(" ") || senderName;
  ChatLib.command(`party invite ${playerToInvite}`);
  showChatMessage(`Inviting -> ${playerToInvite}`);
}

function handleKickCommand(commandParts) {
  let playerToKick = commandParts[1]?.trim();
  if (!playerToKick) return;
  ChatLib.command(`party kick ${playerToKick}`);
  showChatMessage(`Kicking -> ${playerToKick}`);
}

registerWhen(register("chat", (rank, player, message) => {
  if (!config.enableDmCommands) return;
  if (!message.startsWith("!")) return;

  let commandParts = message.split(" ");
  let command = commandParts[0].toLowerCase();
  let senderName = player.trim();


  if (command === "!p" && Config.partyCommand) {
    handleInviteCommand(commandParts, senderName);
  } else if ((command === "!kick" || command === "!pk") && Config.kickCommand) {
    handleKickCommand(commandParts);
  }
}).setChatCriteria("From ${rank} ${player}: ${message}"), () => config.enableDmCommands == true);
