import Config from "../../config";
import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import { showTitle } from "../../utils/Title";
import { 
    MacroCheckData, 
    addPosition, 
    addAngle, 
    isPositionWhitelisted, 
    isAngleWhitelisted, 
    clearAll, 
    getStats 
} from "../../utils/Data";

// Variables
let isRecording = false;
let recordedAngles = new Set();
let lastPosition = null;
let lastAngle = null;
let isNotificationActive = false;

/**
 * Start recording mode
 */
function startRecording() {
    if (isRecording) {
        showGeneralJAMessage("Already recording! Use /macrocheck record stop to stop recording.");
        return;
    }
    
    isRecording = true;
    recordedAngles.clear();
    lastPosition = null;
    
    showGeneralJAMessage("§aStarted recording path! Move along your desired path...");
    showGeneralJAMessage("§7Use /macrocheck record stop when finished.");
}

/**
 * Stop recording mode and add recorded path to whitelist
 */
function stopRecording() {
    if (!isRecording) {
        showGeneralJAMessage("Not currently recording!");
        return;
    }
    
    isRecording = false;

    // Save angles
    let addedAngles = 0;
    recordedAngles.forEach(angle => {
        if (addAngle(angle)) {
            addedAngles++;
        }
    });

    const stats = getStats();
    showGeneralJAMessage(`§aRecording stopped!`);
    showGeneralJAMessage(`§aMovement ranges: §6${stats.ranges}§a with total length of §6${stats.totalLength}§a blocks`);
    showGeneralJAMessage(`§aAdded §6${addedAngles}§a new angles to whitelist.`);
    
    recordedAngles.clear();
    lastPosition = null;
}

/**
 * Record current position and angle
 */
function recordCurrentPosition() {
    if (!isRecording) return;
    
    const currentPosition = {
        x: Player.getX(),
        y: Player.getY(),
        z: Player.getZ()
    };
    
    const currentAngle = {
        yaw: Player.getYaw(),
        pitch: Player.getPitch()
    };
    
    if (addPosition(currentPosition)) {
        showDebugMessage(`Recorded position: (${Math.round(currentPosition.x * 10) / 10}, ${Math.round(currentPosition.y * 10) / 10}, ${Math.round(currentPosition.z * 10) / 10})`);
    }
    
    recordedAngles.add(currentAngle);
}

// Main monitoring logic
register("tick", () => {
    // Record position if in recording mode
    recordCurrentPosition();
    
    if (!MacroCheckData.isNotifierActive) return;
    
    const currentPosition = {
        x: Player.getX(),
        y: Player.getY(),
        z: Player.getZ()
    };
    
    const currentAngle = {
        yaw: Player.getYaw(),
        pitch: Player.getPitch()
    };
    
    if (lastPosition && lastAngle) {
        const positionChanged = !isPositionWhitelisted(currentPosition);
        const angleChanged = !isAngleWhitelisted(currentAngle);
        
        if ((positionChanged || angleChanged) && !isNotificationActive) {
            // Set notification as active
            isNotificationActive = true;
            
            // Trigger notification
            showTitle("§c⚠ Possible Macro Check! ⚠", 5000, true, "§eUnexpected Movement Detected!");
            showGeneralJAMessage("§c⚠ Warning: §eUnexpected movement or rotation detected - possible macro check!");
            
            // Play warning sound every second for 5 seconds
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    World.playSound("random.orb", 1, 1);
                }, i * 1000);
            }

            // Reset notification after 5 seconds
            setTimeout(() => {
                isNotificationActive = false;
            }, 5000);
        }
    }
    
    lastPosition = currentPosition;
    lastAngle = currentAngle;
});

// Commands
register("command", (action, ...args) => {
    switch (action?.toLowerCase()) {
        case "start":
            MacroCheckData.isNotifierActive = true;
            MacroCheckData.save();
            showGeneralJAMessage("§aMacroCheck Notifier started");
            break;
            
        case "stop":
            MacroCheckData.isNotifierActive = false;
            MacroCheckData.save();
            showGeneralJAMessage("§cMacroCheck Notifier stopped");
            break;
            
        case "record":
            const subAction = args[0]?.toLowerCase();
            if (subAction === "start") {
                startRecording();
            } else if (subAction === "stop") {
                stopRecording();
            } else {
                showGeneralJAMessage("Usage: /macrocheck record <start|stop>");
            }
            break;
            
        case "clear":
            clearAll();
            showGeneralJAMessage("Cleared all whitelisted movement ranges and angles");
            break;
            
        case "list":
            const stats = getStats();
            showGeneralJAMessage("§6=== MacroCheck Statistics ===");
            showGeneralJAMessage(`§7Movement Ranges: §f${stats.ranges}`);
            showGeneralJAMessage(`§7Total Range Length: §f${stats.totalLength} blocks`);
            showGeneralJAMessage(`§7Whitelisted Angles: §f${stats.angles}`);
            showGeneralJAMessage("§6===========================");
            break;
            
        case "toggle":
            MacroCheckData.isNotifierActive = !MacroCheckData.isNotifierActive;
            MacroCheckData.save();
            showGeneralJAMessage(MacroCheckData.isNotifierActive ? 
                "§aMacroCheck Notifier started" : 
                "§cMacroCheck Notifier stopped");
            break;
            
        default:
            showGeneralJAMessage("§6=== MacroCheck Notifier Help ===");
            showGeneralJAMessage("§7/macrocheck start §f- Start the notifier");
            showGeneralJAMessage("§7/macrocheck stop §f- Stop the notifier");
            showGeneralJAMessage("§7/macrocheck toggle §f- Toggle the notifier");
            showGeneralJAMessage("§7/macrocheck record start §f- Start recording a path");
            showGeneralJAMessage("§7/macrocheck record stop §f- Stop recording and add to whitelist");
            showGeneralJAMessage("§7/macrocheck clear §f- Clear all data");
            showGeneralJAMessage("§7/macrocheck list §f- Show statistics");
    }
}).setName("macrocheck");

// Stop recording if world unloads
register("worldUnload", () => {
    if (isRecording) {
        stopRecording();
    }
    isNotificationActive = false;
});