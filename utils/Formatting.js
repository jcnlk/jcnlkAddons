import { showDebugMessage } from "./ChatUtils";

/**
 * Default Y coordinate to use when none is provided
 */
let DEFAULT_Y = 100;

/**
 * Extracts numbers from a string
 * @param {string} input - The string to extract numbers from
 * @returns {number[]} Array of extracted numbers
 */
function extractNumbers(input) {
    try {
        const matches = input.match(/-?\d+\.?\d*/g);
        return matches ? matches.map(num => parseFloat(num)) : [];
    } catch (error) {
        showDebugMessage(`Error extracting numbers: ${error}`, 'error');
        return [];
    }
}

/**
 * Formats coordinates into the Patcher format
 * @param {number} x - X coordinate
 * @param {number} z - Z coordinate
 * @param {number} [y] - Y coordinate (optional)
 * @returns {string} Formatted coordinates
 */
function formatToPatcher(x, y = DEFAULT_Y, z) {
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);
    const roundedZ = Math.round(z);
    return `x: ${roundedX}, y: ${roundedY}, z: ${roundedZ}`;
}

/**
 * Parses coordinate string into numbers
 * @param {string} input - The coordinate string to parse
 * @returns {Object|null} Parsed coordinates or null if invalid
 */
function parseCoordinates(input) {
    try {
        if (!input) return null;
        
        // Clean the input
        const cleanInput = input.toLowerCase().trim();
        showDebugMessage(`Parsing coordinates from: ${cleanInput}`);

        // Extract all numbers from the input
        const numbers = extractNumbers(cleanInput);
        showDebugMessage(`Extracted numbers: ${numbers.join(', ')}`);

        if (numbers.length < 2 || numbers.length > 3) {
            showDebugMessage('Invalid number of coordinates');
            return null;
        }

        // Handle both 2 and 3 number formats
        if (numbers.length === 2) {
            return {
                x: numbers[0],
                y: DEFAULT_Y,
                z: numbers[1],
                hasY: false
            };
        } else {
            return {
                x: numbers[0],
                y: numbers[1],
                z: numbers[2],
                hasY: true
            };
        }
    } catch (error) {
        showDebugMessage(`Error parsing coordinates: ${error}`, 'error');
        return null;
    }
}

/**
 * Formats coordinates from any supported format into Patcher format
 * @param {string} input - The coordinate string to format
 * @returns {string|null} Formatted coordinates or null if invalid
 */
function formatCoordinates(input) {
    const coords = parseCoordinates(input);
    if (!coords) return null;
    
    return formatToPatcher(coords.x, coords.y, coords.z);
}

/**
 * Sets the default Y coordinate
 * @param {number} y - The new default Y coordinate
 */
function setDefaultY(y) {
    if (typeof y === 'number' && !isNaN(y)) {
        DEFAULT_Y = y;
        showDebugMessage(`Set default Y coordinate to ${y}`, 'info');
    }
}

/**
 * Formats time in seconds to a string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

/**
 * @param {number} number 
 * @returns 
 */
export function formatNumber(number) {
    let formattedNumber;
    number = parseFloat(number.toString().replace(/,/g, ''));

    if (number >= 1000000000) {
        formattedNumber = (number / 1000000000).toFixed(0) + "B";
    } else if (number >= 10000000) {
        formattedNumber = (number / 1000000).toFixed(0) + "M";
    } else if (number >= 1000000) {
        formattedNumber = (number / 1000000).toFixed(1) + "M";
    } else if (number >= 100000) {
        formattedNumber = (number / 1000).toFixed(0) + "K";
    } else if (number >= 1000) {
        formattedNumber = (number / 1000).toFixed(1) + "K";
    }

    return formattedNumber;
}

// Test command
register("command", (...args) => {
    if (args.length === 0) {
        ChatLib.chat("§cUsage: /testcoords <coordinate string>");
        return;
    }

    const input = args.join(" ");
    const coords = parseCoordinates(input);
    
    if (coords) {
        const formatted = formatCoordinates(input);
        ChatLib.chat(`§aFormatted coordinates: ${formatted}`);
        if (!coords.hasY) {
            ChatLib.chat(`§eNote: Using default Y coordinate (${DEFAULT_Y})`);
        }
    } else {
        ChatLib.chat("§cCould not parse coordinates from input");
    }
}).setName("formatcoords");

export {
    formatCoordinates,
    parseCoordinates,
    formatToPatcher,
    setDefaultY
};