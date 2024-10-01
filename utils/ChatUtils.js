import config from "../config";

// Constants for chat prefixes and colors
const PREFIX = "§3[JA]§r";
const DEBUG_PREFIX = "§9[JA-DEBUG]§r";
const COLORS = {
    info: "§e",
    success: "§a",
    error: "§c",
    warning: "§6"
};

/**
 * Displays a message in the chat
 * @param {string} message - The message to display
 * @param {string} status - The status of the message (info, success, error, warning)
 * @param {boolean} isDebug - Whether this is a debug message
 */
function showChatMessage(message, status = 'info', isDebug = false) {
    const prefix = isDebug ? DEBUG_PREFIX : PREFIX;
    const color = COLORS[status] || COLORS.info;
    
    if (isDebug && !config.debugMode) return;
    
    const timestamp = isDebug ? `§7[${new Date().toLocaleTimeString()}]§r ` : '';
    ChatLib.chat(`${prefix} ${timestamp}${color}${message}§r`);
}

/**
 * Displays a general message in the chat
 * @param {string} message - The message to display
 * @param {string} status - The status of the message (info, success, error, warning)
 */
export function showGeneralJAMessage(message, status = 'info') {
    showChatMessage(message, status, false);
}

/**
 * Displays a debug message in the chat if debug mode is enabled
 * @param {string} message - The debug message to display
 * @param {string} status - The status of the message (info, success, error, warning)
 */
export function showDebugMessage(message, status = 'info') {
    showChatMessage(message, status, true);
}