//Basic Stuff
export const ModuleVersion = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).version;
export const Creator = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).author;

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

// Checks if current server is hypixel
export const InSkyblock = () => {
    if (Server.getIP().includes('hypixel') && ChatLib.removeFormatting(Scoreboard.getTitle()).includes('SKYBLOCK'))
        return true;
    return false;
}