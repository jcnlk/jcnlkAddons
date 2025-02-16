import config from "../config";

// Constants for easier chat formating     
export const BLACK = "§0";
export const DARK_BLUE = "§1";
export const DARK_GREEN = "§2";
export const DARK_AQUA = "§3";
export const DARK_RED = "§4";
export const DARK_PURPLE = "§5";
export const GOLD = "§6";
export const GRAY = "§7";
export const DARK_GRAY = "§8";
export const BLUE = "§9";
export const GREEN = "§a";
export const AQUA = "§b";
export const RED = "§c";
export const LIGHT_PURPLE = "§d";
export const YELLOW = "§e";
export const WHITE = "§f";
export const OBFUSCATED = "§k";
export const BOLD = "§l";
export const STRIKETHROUGH = "§m";
export const UNDERLINE = "§n";
export const ITALIC = "§o";
export const RESET = "§r";

// Basic Stuff
const PREFIX = `${DARK_GRAY}[${GOLD}JA${DARK_GRAY}]${RESET}`;
const DEBUG_PREFIX = `${DARK_GRAY}[${RED}JA${DARK_GRAY}-${RED}DEBUG${RED}]${RESET}`;
export const moduleVersion = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).version;
export const moduleAuthor = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).author;

const messageColors = {
  info: `${YELLOW}`,
  success: `${GREEN}`,
  error: `${RED}`,
  warning: `${GOLD}`,
};

function makeChatMessage(message, status = "info", isDebug = false) {
  const prefix = isDebug ? DEBUG_PREFIX : PREFIX;
  const color = messageColors[status] || messageColors.info;

  if (isDebug && !config.debugMode) return;

  ChatLib.chat(`${prefix} ${color}${message}${RESET}`);
}

export function showChatMessage(message, status = "info") {
    makeChatMessage(message, status, false);
}

export function showDebugChatMessage(message, status = "info") {
    makeChatMessage(message, status, true);
}

// Checks if current server is hypixel
export const isInSkyblock = () => {
  if (Server.getIP().includes("hypixel") && ChatLib.removeFormatting(Scoreboard.getTitle()).includes("SKYBLOCK"))
      return true;
  return false;
}