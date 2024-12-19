import Config from "../../config";
import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import { showTitle } from "../../utils/Title";

// Default values for coordinates and camera angles
let whitelistedPositions = [];
let whitelistedAngles = [];
let isNotifierActive = false;
let lastPosition = null;
let lastAngle = null;

// Recording mode variables
let isRecording = false;
let recordedPositions = [];
let recordedAngles = [];
let lastRecordedPosition = null;
let lastRecordedAngle = null;

// Tolerance and rounding values
const POSITION_TOLERANCE = 0.05;  // Small tolerance for floating point comparison
const ANGLE_TOLERANCE = 0.5;     // degrees

/**
 * Rounds a coordinate value to one decimal place (0.1 blocks)
 * @param {number} value - The coordinate value to round
 * @returns {number} - The rounded coordinate value
 */
function roundCoordinate(value) {
    return Math.round(value * 10) / 10;
}

/**
 * Creates a rounded position object from current player position
 * @returns {Object} - The rounded position object
 */
function getRoundedPosition() {
    return {
        x: roundCoordinate(Player.getX()),
        y: roundCoordinate(Player.getY()),
        z: roundCoordinate(Player.getZ())
    };
}

/**
 * Checks if two positions are equal (within tolerance)
 * @param {Object} pos1 - First position
 * @param {Object} pos2 - Second position
 * @returns {boolean} - Whether the positions are equal
 */
function arePositionsEqual(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) < POSITION_TOLERANCE &&
           Math.abs(pos1.y - pos2.y) < POSITION_TOLERANCE &&
           Math.abs(pos1.z - pos2.z) < POSITION_TOLERANCE;
}

/**
 * Check if a position is already whitelisted
 * @param {Object} position - The position to check
 * @returns {boolean} - Whether the position is whitelisted
 */
function isPositionWhitelisted(position) {
    return whitelistedPositions.some(wp => arePositionsEqual(wp, position));
}

/**
 * Check if an angle is whitelisted
 * @param {Object} angle - The angle to check
 * @returns {boolean} - Whether the angle is whitelisted
 */
function isAngleWhitelisted(angle) {
    return whitelistedAngles.some(wa => (
        Math.abs(wa.yaw - angle.yaw) <= ANGLE_TOLERANCE &&
        Math.abs(wa.pitch - angle.pitch) <= ANGLE_TOLERANCE
    ));
}

/**
 * Start recording mode
 */
function startRecording() {
    if (isRecording) {
        showGeneralJAMessage("Already recording! Use /macrocheck record stop to stop recording.");
        return;
    }
    
    isRecording = true;
    recordedPositions = [];
    recordedAngles = [];
    lastRecordedPosition = null;
    lastRecordedAngle = null;
    
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
    
    // Filter out duplicates and add to whitelist
    let addedPositions = 0;
    recordedPositions.forEach(pos => {
        if (!isPositionWhitelisted(pos)) {
            whitelistedPositions.push(pos);
            addedPositions++;
        }
    });
    
    let addedAngles = 0;
    recordedAngles.forEach(angle => {
        if (!isAngleWhitelisted(angle)) {
            whitelistedAngles.push(angle);
            addedAngles++;
        }
    });
    
    showGeneralJAMessage(`§aRecording stopped! Added §6${addedPositions}§a new positions and §6${addedAngles}§a new angles to whitelist.`);
    saveWhitelist();
    
    recordedPositions = [];
    recordedAngles = [];
}

/**
 * Record current position and angle if they're different
 */
function recordCurrentPosition() {
    if (!isRecording) return;
    
    const currentPosition = getRoundedPosition();
    const currentAngle = {
        yaw: Player.getYaw(),
        pitch: Player.getPitch()
    };
    
    // Only record if position is new
    if (!lastRecordedPosition || !arePositionsEqual(currentPosition, lastRecordedPosition)) {
        // Check if this position is already in recordedPositions
        if (!recordedPositions.some(pos => arePositionsEqual(pos, currentPosition))) {
            recordedPositions.push(currentPosition);
            lastRecordedPosition = currentPosition;
            showDebugMessage(`Recorded new position: (${currentPosition.x}, ${currentPosition.y}, ${currentPosition.z})`);
        }
    }
    
    // Only record if angle has changed significantly
    if (!lastRecordedAngle ||
        Math.abs(currentAngle.yaw - lastRecordedAngle.yaw) > ANGLE_TOLERANCE ||
        Math.abs(currentAngle.pitch - lastRecordedAngle.pitch) > ANGLE_TOLERANCE) {
        
        recordedAngles.push(currentAngle);
        lastRecordedAngle = currentAngle;
    }
}

/**
 * Save whitelist to file
 */
function saveWhitelist() {
    const data = {
        positions: whitelistedPositions,
        angles: whitelistedAngles
    };
    
    try {
        FileLib.write("jcnlkAddons", "data/MacroCheckWhitelist.json", JSON.stringify(data, null, 2));
        showDebugMessage("Saved whitelist to file", 'success');
    } catch (error) {
        showDebugMessage(`Error saving whitelist: ${error}`, 'error');
    }
}

/**
 * Load whitelist from file
 */
function loadWhitelist() {
    try {
        const content = FileLib.read("jcnlkAddons", "data/MacroCheckWhitelist.json");
        if (content) {
            const data = JSON.parse(content);
            // Convert positions to rounded values on load
            whitelistedPositions = (data.positions || []).map(pos => ({
                x: roundCoordinate(pos.x),
                y: roundCoordinate(pos.y),
                z: roundCoordinate(pos.z)
            }));
            whitelistedAngles = data.angles || [];
            showDebugMessage(`Loaded ${whitelistedPositions.length} positions and ${whitelistedAngles.length} angles`, 'success');
        }
    } catch (error) {
        showDebugMessage(`Error loading whitelist: ${error}`, 'error');
    }
}

/**
 * Clear all whitelisted positions and angles
 */
function clearWhitelist() {
    whitelistedPositions = [];
    whitelistedAngles = [];
    saveWhitelist();
    showGeneralJAMessage("Cleared all whitelisted positions and angles");
}

// Main monitoring logic
register("tick", () => {
    // Record position if in recording mode
    recordCurrentPosition();
    
    if (!isNotifierActive) return;
    
    const currentPosition = getRoundedPosition();
    const currentAngle = {
        yaw: Player.getYaw(),
        pitch: Player.getPitch()
    };
    
    if (lastPosition && lastAngle) {
        // Check for significant changes
        const positionChanged = !arePositionsEqual(currentPosition, lastPosition);
        const angleChanged = (
            Math.abs(currentAngle.yaw - lastAngle.yaw) > ANGLE_TOLERANCE ||
            Math.abs(currentAngle.pitch - lastAngle.pitch) > ANGLE_TOLERANCE
        );
        
        if ((positionChanged && !isPositionWhitelisted(currentPosition)) ||
            (angleChanged && !isAngleWhitelisted(currentAngle))) {
            // Trigger notification
            showTitle("§c⚠ Possible Macro Check! ⚠", 3000, true, "§eUnexpected Movement Detected!");
            showGeneralJAMessage("§c⚠ Warning: §eUnexpected movement or rotation detected - possible macro check!");
            // Play warning sound every second for 3 seconds
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    World.playSound("random.orb", 1, 1);
                }, i * 1000);
            }
        }
    }
    
    lastPosition = currentPosition;
    lastAngle = currentAngle;
});

// Commands
register("command", (action, ...args) => {
    switch (action?.toLowerCase()) {
        case "start":
            isNotifierActive = true;
            showGeneralJAMessage("§aMacroCheck Notifier started");
            break;
            
        case "stop":
            isNotifierActive = false;
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
            clearWhitelist();
            break;
            
        case "list":
            showGeneralJAMessage("§6=== Whitelisted Positions ===");
            whitelistedPositions.forEach((pos, index) => {
                showGeneralJAMessage(`${index + 1}. (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`);
            });
            showGeneralJAMessage("§6=== Whitelisted Angles ===");
            whitelistedAngles.forEach((angle, index) => {
                showGeneralJAMessage(`${index + 1}. Yaw: ${angle.yaw.toFixed(1)}, Pitch: ${angle.pitch.toFixed(1)}`);
            });
            break;
            
        case "toggle":
            isNotifierActive = !isNotifierActive;
            showGeneralJAMessage(isNotifierActive ? 
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
            showGeneralJAMessage("§7/macrocheck clear §f- Clear all whitelisted positions and angles");
            showGeneralJAMessage("§7/macrocheck list §f- List all whitelisted positions and angles");
    }
}).setName("macrocheck");

// Load whitelist on world load
register("worldLoad", loadWhitelist);

// Stop recording if world unloads
register("worldUnload", () => {
    if (isRecording) {
        stopRecording();
    }
});