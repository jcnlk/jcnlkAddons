import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import Config from "../../config";
import { registerWhen } from "../../utils/Register";
import { inDungeon } from "../../utils/Dungeon";

let hidingMessage = false;
let showingMessage = false;

// Store hidden players and their unhide timers
let hiddenPlayers = new Map();

/**
 * Hide a specific player for a duration
 * @param {string} playerName - Name of the player to hide
 * @param {number} duration - Duration in milliseconds
 */
function hidePlayer(playerName) {
    hiddenPlayers.set(playerName, Date.now() + 5000); // 5 seconds duration
    showDebugMessage(`Hiding player ${playerName} for 5 seconds`);
}

/**
 * Returns True if entity is player otherwise False.
 * 
 * @param {Entity} entity - OtherPlayerMP Minecraft Entity.
 * @returns {Boolean} - Whether or not player is human.
 */
export function isPlayer(entity) {
    const player = World.getPlayerByName(entity.getName());
    return player?.getPing() === 1;
}

/**
 * Check if a player should be hidden
 * @param {Entity} entity - The entity to check
 * @returns {boolean} - Whether the entity should be hidden
 */
function shouldHidePlayer(entity) {
    // Don't hide yourself
    if (entity.getName() === Player.getName()) return false;
    
    // Check if player is in hidden list and timer hasn't expired
    if (hiddenPlayers.has(entity.getName())) {
        const unhideTime = hiddenPlayers.get(entity.getName());
        if (Date.now() >= unhideTime) {
            // Timer expired, remove from hidden list
            hiddenPlayers.delete(entity.getName());
            
            if (showingMessage) return;
            showGeneralJAMessage(`Showing Players`);
            showingMessage = true;
            hidingMessage = false;

            return false;
        }
        return true;
    }
    return false;
}

// Handle hiding players within range when teleporting
register("chat", (location) => {
    if (!Config.enablePlayerHiding) return;
    //if (!inDungeon()) return; // inDungeon only
    
    const playerX = Player.getX();
    const playerY = Player.getY();
    const playerZ = Player.getZ();
    
    World.getAllPlayers().forEach(player => {
        if (player.getName() === Player.getName()) return; // Skip yourself
        
        // Calculate distance
        const dx = player.getX() - playerX;
        const dy = player.getY() - playerY;
        const dz = player.getZ() - playerZ;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Hide players within 5 blocks
        if (distance <= 5) {
            hidePlayer(player.getName());

            if (hidingMessage) return;
            showGeneralJAMessage(`Hiding players`);
            hidingMessage = true;
            showingMessage = false;
        }
    });
}).setCriteria("You have teleported to ${location}!");
//You have teleported to JOE123546!

// Register entity renderer to handle hiding players
registerWhen(
    register("renderEntity", (entity, pos, partialTicks, event) => {
        if (!Config.enablePlayerHiding) return;

        // Check if the entity is a player
        if (!isPlayer(entity)) return;

        // Determine if the player should be hidden
        if (shouldHidePlayer(entity)) {
            cancel(event);
        }
    }),
    () => Config.enablePlayerHiding
);

// Cleanup on world change
register("worldLoad", () => {
    hiddenPlayers.clear();
    showDebugMessage("Cleared hidden players list");
    hidingMessage = false;
    showingMessage = false;
});