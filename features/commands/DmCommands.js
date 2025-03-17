import { showChatMessage, registerWhen } from "../../utils/Utils";
import { stripRank } from "../../../BloomCore/utils/Utils";
import config from "../../config";

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

registerWhen(register("chat", (player, message) => {
  if (!message.startsWith("!")) return;
  const commandParts = message.split(" ");
  const command = commandParts[0].toLowerCase();
  const strippedPlayer = stripRank(player);
  
  if (command === "!p" && config.partyCommand) handleInviteCommand(commandParts, strippedPlayer);
  if ((command === "!kick" || command === "!pk") && config.kickCommand) handleKickCommand(commandParts);
}).setChatCriteria("From ${player}: ${message}"), () => config.enableDmCommands);