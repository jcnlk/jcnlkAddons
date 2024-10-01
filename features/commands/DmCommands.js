import Config from "../../config";
import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";

module.exports = () => {
    /**
     * Handles the test command
     * @param {string} senderName - Name of the command sender
     */
    function handleTestCommand(senderName) {
        showGeneralJAMessage("DM Command Test successful!");
        showDebugMessage(`Test command executed successfully for ${senderName}`);
    }

    /**
     * Handles the party invite command
     * @param {string[]} commandParts - Parts of the command
     * @param {string} senderName - Name of the command sender
     */
    function handlePartyCommand(commandParts, senderName) {
        let playerToParty = senderName;
        if (commandParts.length > 1) {
            playerToParty = commandParts.slice(1).join(" ");
        }
        ChatLib.say(`/p ${playerToParty}`);
        showDebugMessage(`Party invite sent to ${playerToParty} for ${senderName}`);
    }

    /**
     * Handles the kick command
     * @param {string[]} commandParts - Parts of the command
     * @param {string} senderName - Name of the command sender
     */
    function handleKickCommand(commandParts, senderName) {
        let playerToKick = commandParts[1];
        if (playerToKick) {
            ChatLib.say(`/p kick ${playerToKick}`);
            showDebugMessage(`Kick command executed for ${playerToKick} by ${senderName}`);
        } else {
            showDebugMessage(`Kick command executed without specifying a player by ${senderName}`);
        }
    }

    /**
     * Main DM command handler
     */
    const DmCommandModule = register("chat", (rank, player, message) => {
        showDebugMessage(`Received DM: From ${rank} ${player}: ${message}`);
        
        if (!message.startsWith("!")) return;
        
        let commandParts = message.split(" ");
        let command = commandParts[0].toLowerCase();
        let senderName = player.trim();

        showDebugMessage(`Processing DM command: ${command} from player: ${senderName}`);

        if (!Config.enableDmCommands) {
            showDebugMessage(`DM commands are currently disabled.`);
            return;
        }

        let isCommandEnabled = false;
        switch (command) {
            case "!test": isCommandEnabled = Config.testCommand; break;
            case "!p": isCommandEnabled = Config.partyCommand; break;
            case "!kick":
            case "!pk": 
                isCommandEnabled = Config.kickCommand; 
                break;
            default: 
                showDebugMessage(`Unknown command: ${command}`);
                return;
        }

        if (!isCommandEnabled) {
            showDebugMessage(`The command ${command} is currently disabled.`);
            return;
        }

        switch(command) {
            case "!test":
                handleTestCommand(senderName);
                break;
            case "!p":
                handlePartyCommand(commandParts, senderName);
                break;
            case "!kick":
            case "!pk":
                handleKickCommand(commandParts, senderName);
                break;
        }
    }).setChatCriteria("From ${rank} ${player}: ${message}");

    return {
        DmCommandModule
    };
};