import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import { checkInDungeon } from "../dungeons/Dungeons";

// Initialize variables
let puzzleStates = {};
let lastTotalPuzzles = 0;
let inDungeon = false;
let checkDungeonTimeout = null;

/**
 * Analyzes the puzzle information from tablist and returns changes
 * @returns {Object} An object containing puzzle state changes and total counts
 */
function analyzePuzzleInfo() {
    if (!inDungeon) {
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
    let changes = {};
    let counts = { unexplored: 0, explored: 0, finished: 0, failed: 0 };

    puzzleLines.forEach((line, index) => {
        const cleanLine = ChatLib.removeFormatting(line).trim();
        let newState;

        if (cleanLine === "???: [✦]") {
            newState = "unexplored";
            counts.unexplored++;
        } else if (cleanLine.match(/^.+: \[✦\]$/)) {
            newState = "explored";
            counts.explored++;
        } else if (cleanLine.match(/^.+: \[✔\]$/)) {
            newState = "finished";
            counts.finished++;
        } else if (cleanLine.match(/^.+: \[✖\](\s*\([^)]*\))?$/)) {
            newState = "failed";
            counts.failed++;
        } else {
            newState = "unknown";
        }

        const puzzleName = cleanLine.split(":")[0];
        if (puzzleStates[puzzleName] !== newState) {
            changes[puzzleName] = { from: puzzleStates[puzzleName], to: newState };
            puzzleStates[puzzleName] = newState;
        }
    });

    // Check if total puzzles changed
    if (lastTotalPuzzles !== totalPuzzles) {
        changes.totalPuzzlesChanged = { from: lastTotalPuzzles, to: totalPuzzles };
        lastTotalPuzzles = totalPuzzles;
    }

    return { changes, counts, totalPuzzles };
}

/**
 * Outputs changes in puzzle states
 */
function outputPuzzleChanges() {
    const analysis = analyzePuzzleInfo();
    if (!analysis) return;

    const { changes, counts, totalPuzzles } = analysis;

    for (const [puzzleName, change] of Object.entries(changes)) {
        if (puzzleName === 'totalPuzzlesChanged') {
            showGeneralJAMessage(`Total puzzles changed from ${change.from} to ${change.to}`);
        } else {
            showGeneralJAMessage(`Puzzle "${puzzleName}" changed from ${change.from || 'unknown'} to ${change.to}`);
        }
    }

    if (Object.keys(changes).length > 0) {
        showGeneralJAMessage(`Current puzzle status: ${counts.unexplored} unexplored, ${counts.explored} explored, ${counts.finished} finished, ${counts.failed} failed`);
    }
}

/**
 * Displays current puzzle status
 */
function displayPuzzleStatus() {
    const analysis = analyzePuzzleInfo();
    if (!analysis) {
        showGeneralJAMessage("Not in a dungeon or no puzzle information available.");
        return;
    }

    const { counts, totalPuzzles } = analysis;
    showGeneralJAMessage("Current Puzzle Status:");
    showGeneralJAMessage(`Total Puzzles: ${totalPuzzles}`);
    showGeneralJAMessage(`Unexplored: ${counts.unexplored}`);
    showGeneralJAMessage(`Explored: ${counts.explored}`);
    showGeneralJAMessage(`Finished: ${counts.finished}`);
    showGeneralJAMessage(`Failed: ${counts.failed}`);
}

/**
 * Resets the puzzle state
 */
function resetPuzzleState() {
    puzzleStates = {};
    lastTotalPuzzles = 0;
    showDebugMessage("Puzzle state reset");
}

/**
 * Checks dungeon status and updates accordingly
 */
function checkDungeonStatus() {
    if (checkDungeonTimeout === null) {
        checkDungeonTimeout = setTimeout(() => {
            const wasInDungeon = inDungeon;
            inDungeon = checkInDungeon();

            if (inDungeon !== wasInDungeon) {
                if (inDungeon) {
                    showGeneralJAMessage("Entered Dungeon. Starting Puzzle Tracking.");
                    resetPuzzleState();
                } else {
                    showGeneralJAMessage("Left Dungeon. Stopping Puzzle Tracking.");
                    resetPuzzleState();
                }
            }

            checkDungeonTimeout = null;
        }, 5000); // 5 seconds delay
    }
}

// Start tracking puzzle changes and dungeon status
register("step", () => {
    checkDungeonStatus();
    if (inDungeon) {
        outputPuzzleChanges();
    }
}).setFps(1); // Check every second

// Export the displayPuzzleStatus function to be used in index.js
export { displayPuzzleStatus };