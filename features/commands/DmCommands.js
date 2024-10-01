import Config from "../../config";

// User cooldown and command count tracking
let userCooldowns = {};
let userCommandCounts = {};
let globalCommandCount = 0;
let globalLastCommandTime = 0;

/**
 * Checks if a user is allowed to execute a command based on cooldowns and limits
 * @param {string} playerName - The name of the player
 * @param {Function} showDebugMessage - Function to show debug messages
 * @returns {boolean} - Whether the user is allowed to execute the command
 */
function isUserAllowed(playerName, showDebugMessage) {
    const currentTime = Date.now();
    
    // Check global cooldown
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

    // Check per-user cooldown
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
    /**
     * Handles the test command
     * @param {string} senderName - Name of the command sender
     */
    function handleTestCommand(senderName) {
        showGeneralJTMessage("DM Command Test successful!");
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

        if (!isUserAllowed(senderName, showDebugMessage)) {
            showDebugMessage(`Command ${command} from ${senderName} was blocked due to cooldown or limit`);
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