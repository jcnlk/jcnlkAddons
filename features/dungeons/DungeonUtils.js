import { showDebugMessage } from "../../utils/ChatUtils";

/**
 * Checks if the player is currently in a dungeon
 * @returns {boolean} True if in dungeon, false otherwise
 */
export function checkInDungeon() {
    try {
        const tabList = TabList.getNames();
        if (!tabList) {
            showDebugMessage("TabList is null", 'error');
            return false;
        }
        return tabList.some(line => 
            ChatLib.removeFormatting(line).includes("Dungeon:")
        );
    } catch (error) {
        showDebugMessage(`Error in checkInDungeon: ${error}`, 'error');
        return false;
    }
}

/**
 * Gets the current crypt count from the tablist
 * @returns {number} The current crypt count
 */
export function getCryptCountFromTablist() {
    try {
        const tabList = TabList.getNames();
        if (!tabList) {
            showDebugMessage("TabList is null in getCryptCountFromTablist", 'error');
            return 0;
        }
        for (let line of tabList) {
            line = ChatLib.removeFormatting(line);
            if (line.includes("Crypts: ")) {
                const count = parseInt(line.split("Crypts: ")[1]);
                return isNaN(count) ? 0 : count;
            }
        }
    } catch (error) {
        showDebugMessage(`Error in getCryptCountFromTablist: ${error}`, 'error');
    }
    return 0;
}

/**
 * Extracts the current Dungeon Floor from the scoreboard
 * @returns {string|null} The current Dungeon Floor (e.g., "F1", "M2") or null if not found
 */
export function getDungeonFloor() {
    try {
        const scoreboard = Scoreboard.getLines();
        if (!scoreboard || scoreboard.length < 10) {
            showDebugMessage("Scoreboard is not long enough to read floor information", 'warning');
            return null;
        }

        const floorLine = ChatLib.removeFormatting(scoreboard[8].getName()).trim();
        showDebugMessage("Extracted floor line: \"" + floorLine + "\"", 'info');

        // More tolerant regex that allows for potential changes in the future
        const floorMatch = floorLine.match(/(?:⏣ )?The Catacombs \(([FM][1-7])\)/);
        
        if (floorMatch) {
            showDebugMessage("Detected Dungeon Floor: " + floorMatch[1], 'info');
            return floorMatch[1];
        } else {
            // If the main regex fails, try a more lenient approach
            const fallbackMatch = floorLine.match(/([FM][1-7])/);
            if (fallbackMatch) {
                showDebugMessage("Detected Dungeon Floor (fallback): " + fallbackMatch[1], 'info');
                return fallbackMatch[1];
            }
            showDebugMessage("Failed to parse Dungeon Floor from: \"" + floorLine + "\"", 'warning');
            return null;
        }
    } catch (error) {
        showDebugMessage("Error in getDungeonFloor: " + error, 'error');
        return null;
    }
}

/**
 * Gets the current dungeon time from the tablist
 * @returns {number|null} Time in seconds or null if not found
 */
export function getTimeFromTablist() {
    try {
        const tabList = TabList.getNames();
        if (!tabList || tabList.length < 46) {
            showDebugMessage("Tablist is not long enough to read time information", 'warning');
            return null;
        }

        const timeLine = ChatLib.removeFormatting(tabList[45]).trim();
        
        if (!timeLine.startsWith("Time: ")) {
            showDebugMessage(`Unexpected time line format: "${timeLine}"`, 'warning');
            return null;
        }

        // Match either "XXm XXs" or just "XXs"
        const timeMatch = timeLine.match(/Time: (?:(\d+)m )?(\d+)s/);
        
        if (timeMatch) {
            const minutes = timeMatch[1] ? parseInt(timeMatch[1]) : 0;
            const seconds = parseInt(timeMatch[2]);
            return minutes * 60 + seconds;
        } else {
            showDebugMessage(`Failed to parse time from tablist: "${timeLine}"`, 'warning');
            return null;
        }
    } catch (error) {
        showDebugMessage(`Error in getTimeFromTablist: ${error}`, 'error');
        return null;
    }
}

/**
 * Analyzes the puzzle information from tablist
 * @returns {Object|null} An object containing puzzle state changes and total counts, or null if not in dungeon
 */
export function analyzePuzzleInfo() {
    if (!checkInDungeon()) {
        return null;
    }

    const tabList = TabList.getNames();
    if (!tabList || tabList.length < 48) {
        showDebugMessage("Tablist is not long enough to read puzzle information", 'warning');
        return null;
    }

    const puzzleLine = ChatLib.removeFormatting(tabList[47]);
    const totalPuzzlesMatch = puzzleLine.match(/Puzzles: \((\d+)\)/);
    const totalPuzzles = totalPuzzlesMatch ? parseInt(totalPuzzlesMatch[1]) : 0;

    if (totalPuzzles === 0) {
        return null;
    }

    const puzzleLines = tabList.slice(48, 48 + totalPuzzles);
    let counts = { unexplored: 0, explored: 0, finished: 0, failed: 0 };

    puzzleLines.forEach((line) => {
        const cleanLine = ChatLib.removeFormatting(line).trim();
        if (cleanLine === "???: [✦]") {
            counts.unexplored++;
        } else if (cleanLine.match(/^.+: \[✦\]$/)) {
            counts.explored++;
        } else if (cleanLine.match(/^.+: \[✔\]$/)) {
            counts.finished++;
        } else if (cleanLine.match(/^.+: \[✖\](\s*\([^)]*\))?$/)) {
            counts.failed++;
        }
    });

    return { counts, totalPuzzles };
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
 * Formats crypt count for display
 * @param {number} count - Crypt count
 * @returns {string} Formatted crypt count
 */
export function formatCryptCount(count) {
    return count > 5 ? "5+" : count.toString();
}