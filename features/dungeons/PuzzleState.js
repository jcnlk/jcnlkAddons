import { showDebugMessage } from "../../utils/ChatUtils";

// Initialize variables
let debugTrigger = null;

/**
 * Outputs the puzzle information from tablist with detailed debugging
 */
function outputPuzzleInfo() {
    showDebugMessage("Starting puzzle info analysis...");

    const tabList = TabList.getNames();
    showDebugMessage(`Tablist length: ${tabList.length}`);

    if (!tabList || tabList.length < 48) {
        showDebugMessage("Tablist is not long enough to read puzzle information", 'warning');
        return;
    }

    // Extract total puzzles from line 47
    const puzzleLine = ChatLib.removeFormatting(tabList[47]);
    showDebugMessage(`Puzzle line (47): ${puzzleLine}`);

    const totalPuzzlesMatch = puzzleLine.match(/Puzzles: \((\d+)\)/);
    const totalPuzzles = totalPuzzlesMatch ? parseInt(totalPuzzlesMatch[1]) : 0;

    showDebugMessage(`Total Puzzles: ${totalPuzzles}`);

    if (totalPuzzles === 0) {
        showDebugMessage("No puzzles to analyze");
        return;
    }

    // Create a local copy of the relevant part of the tabList
    const puzzleLines = tabList.slice(48, 48 + totalPuzzles);
    showDebugMessage(`Extracted puzzle lines: ${JSON.stringify(puzzleLines)}`);

    // Analyze puzzle states for the corresponding number of lines
    let unexploredPuzzles = 0;
    puzzleLines.forEach((line, index) => {
        const lineIndex = 48 + index;
        showDebugMessage(`Checking line index: ${lineIndex}`);

        const cleanLine = ChatLib.removeFormatting(line);
        showDebugMessage(`Line ${lineIndex} content: "${cleanLine}"`);

        if (cleanLine === " ???: [✦]") {
            unexploredPuzzles++;
            showDebugMessage(`Line ${lineIndex}: Unexplored Puzzle`);
        } else {
            showDebugMessage(`Line ${lineIndex}: Explored or different content`);
        }
    });

    showDebugMessage(`Unexplored Puzzles: ${unexploredPuzzles}`);
    showDebugMessage("Puzzle info analysis complete.");
}

/**
 * Starts the puzzle info output trigger
 */
function startPuzzleInfoOutput() {
    if (debugTrigger) {
        debugTrigger.unregister();
    }
    debugTrigger = register("step", outputPuzzleInfo).setDelay(30); // 30 seconds
    showDebugMessage("Started Puzzle State info output (30s interval)");
}

/**
 * Stops the puzzle info output trigger
 */
function stopPuzzleInfoOutput() {
    if (debugTrigger) {
        debugTrigger.unregister();
        debugTrigger = null;
        showDebugMessage("Stopped Puzzle State info output");
    }
}

// Start the puzzle info output when the game loads
register("gameLoad", startPuzzleInfoOutput);

// Stop the puzzle info output when the game unloads
register("gameUnload", stopPuzzleInfoOutput);

// Export functions if needed
export {
    startPuzzleInfoOutput,
    stopPuzzleInfoOutput
};