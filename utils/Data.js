import PogObject from "PogData";

const defaultData = {
    // More Data here
}

const defaultHudData = {
    /**
    testHud: {
        x: 0.5,
        y: 0.5,
        scale: 1.0
    }
    */
    // More HudData here
}


export let Data = new PogObject('jcnlkAddons', defaultData, './data/Data.json');
export let HudData = new PogObject('jcnlkAddons', defaultHudData, './data/HudData.json');
// More DataObjects here


export const resetData = () => {
    Object.keys(defaultData).forEach((k) => {
        data[k] = defaultData[k];
    });
    data.save();
};

///// Macro Check Data /////
// Default data structure
const defaultMacroCheckData = {
    movementRanges: [], // [{ axis: 'x'|'z', y: number, otherAxis: number, min: number, max: number }]
    angles: [],
    isNotifierActive: false
};

export let MacroCheckData = new PogObject("jcnlkAddons", defaultMacroCheckData, 'data/MacroCheckData.json');

/**
 * Rounds a value to one decimal place
 */
function roundToDecimal(value) {
    return Math.round(value * 10) / 10;
}

/**
 * Checks if two ranges are similar
 */
function areRangesSimilar(range1, range2, tolerance = 0.5) {
    return range1.axis === range2.axis &&
           Math.abs(range1.y - range2.y) < tolerance &&
           Math.abs(range1.otherAxis - range2.otherAxis) < tolerance &&
           Math.abs(range1.min - range2.min) < tolerance &&
           Math.abs(range1.max - range2.max) < tolerance;
}

/**
 * Merges two overlapping ranges
 */
function mergeRanges(range1, range2) {
    return {
        axis: range1.axis,
        y: (range1.y + range2.y) / 2,
        otherAxis: (range1.otherAxis + range2.otherAxis) / 2,
        min: Math.min(range1.min, range2.min),
        max: Math.max(range1.max, range2.max)
    };
}

/**
 * Finds an overlapping range for given positions
 */
function findOverlappingRange(pos1, pos2) {
    const y = roundToDecimal(pos1.y);
    let movementAxis, otherAxis, min, max;

    if (pos1.z === pos2.z) {
        movementAxis = 'x';
        otherAxis = roundToDecimal(pos1.z);
        min = Math.min(roundToDecimal(pos1.x), roundToDecimal(pos2.x));
        max = Math.max(roundToDecimal(pos1.x), roundToDecimal(pos2.x));
    }
    else if (pos1.x === pos2.x) {
        movementAxis = 'z';
        otherAxis = roundToDecimal(pos1.x);
        min = Math.min(roundToDecimal(pos1.z), roundToDecimal(pos2.z));
        max = Math.max(roundToDecimal(pos1.z), roundToDecimal(pos2.z));
    }
    else {
        return null;
    }

    // Find overlapping or adjacent ranges
    const overlappingRanges = MacroCheckData.movementRanges.filter(range => 
        range.axis === movementAxis &&
        Math.abs(range.y - y) < 0.5 &&
        Math.abs(range.otherAxis - otherAxis) < 0.5 &&
        (max + 0.5 >= range.min && min - 0.5 <= range.max)
    );

    if (overlappingRanges.length > 0) {
        // Merge all overlapping ranges
        let mergedRange = overlappingRanges[0];
        for (let i = 1; i < overlappingRanges.length; i++) {
            mergedRange = mergeRanges(mergedRange, overlappingRanges[i]);
        }
        return mergedRange;
    }

    return null;
}

/**
 * Adds a new position to the movement ranges
 */
export function addPosition(position) {
    const currentPos = {
        x: roundToDecimal(position.x),
        y: roundToDecimal(position.y),
        z: roundToDecimal(position.z)
    };

    if (!MacroCheckData.lastPos) {
        MacroCheckData.lastPos = currentPos;
        return true;
    }

    if (currentPos.x === MacroCheckData.lastPos.x && 
        currentPos.y === MacroCheckData.lastPos.y && 
        currentPos.z === MacroCheckData.lastPos.z) {
        return false;
    }

    const overlappingRange = findOverlappingRange(MacroCheckData.lastPos, currentPos);

    if (overlappingRange) {
        // Remove overlapping ranges and add merged range
        MacroCheckData.movementRanges = MacroCheckData.movementRanges.filter(range => 
            !areRangesSimilar(range, overlappingRange)
        );
        MacroCheckData.movementRanges.push(overlappingRange);
    } else {
        // Create new range for straight line movement
        const newRange = {
            y: roundToDecimal(currentPos.y)
        };

        if (currentPos.z === MacroCheckData.lastPos.z) {
            newRange.axis = 'x';
            newRange.otherAxis = roundToDecimal(currentPos.z);
            newRange.min = Math.min(roundToDecimal(MacroCheckData.lastPos.x), roundToDecimal(currentPos.x));
            newRange.max = Math.max(roundToDecimal(MacroCheckData.lastPos.x), roundToDecimal(currentPos.x));
        }
        else if (currentPos.x === MacroCheckData.lastPos.x) {
            newRange.axis = 'z';
            newRange.otherAxis = roundToDecimal(currentPos.x);
            newRange.min = Math.min(roundToDecimal(MacroCheckData.lastPos.z), roundToDecimal(currentPos.z));
            newRange.max = Math.max(roundToDecimal(MacroCheckData.lastPos.z), roundToDecimal(currentPos.z));
        }

        // Only add if no similar range exists
        const existingSimilarRange = MacroCheckData.movementRanges.find(range => 
            areRangesSimilar(range, newRange)
        );

        if (!existingSimilarRange) {
            MacroCheckData.movementRanges.push(newRange);
        }
    }

    MacroCheckData.lastPos = currentPos;
    MacroCheckData.save();
    return true;
}

/**
 * Checks if a position is within whitelisted ranges
 */
export function isPositionWhitelisted(position) {
    const pos = {
        x: roundToDecimal(position.x),
        y: roundToDecimal(position.y),
        z: roundToDecimal(position.z)
    };

    return MacroCheckData.movementRanges.some(range => {
        if (Math.abs(range.y - pos.y) > 0.5) return false;

        if (range.axis === 'x') {
            return Math.abs(range.otherAxis - pos.z) < 0.5 &&
                   pos.x >= range.min - 0.5 && pos.x <= range.max + 0.5;
        } else {
            return Math.abs(range.otherAxis - pos.x) < 0.5 &&
                   pos.z >= range.min - 0.5 && pos.z <= range.max + 0.5;
        }
    });
}

/**
 * Adds a new angle to the whitelist
 */
export function addAngle(angle) {
    const roundedAngle = {
        yaw: roundToDecimal(angle.yaw),
        pitch: roundToDecimal(angle.pitch)
    };

    // Check if similar angle already exists
    const exists = MacroCheckData.angles.some(ang => 
        Math.abs(ang.yaw - roundedAngle.yaw) < 0.5 && 
        Math.abs(ang.pitch - roundedAngle.pitch) < 0.5
    );

    if (!exists) {
        MacroCheckData.angles.push(roundedAngle);
        MacroCheckData.save();
        return true;
    }
    return false;
}

/**
 * Checks if an angle is within whitelisted angles
 */
export function isAngleWhitelisted(angle) {
    const roundedAngle = {
        yaw: roundToDecimal(angle.yaw),
        pitch: roundToDecimal(angle.pitch)
    };

    return MacroCheckData.angles.some(ang => 
        Math.abs(ang.yaw - roundedAngle.yaw) <= 0.5 &&
        Math.abs(ang.pitch - roundedAngle.pitch) <= 0.5
    );
}

/**
 * Clears all saved data
 */
export function clearAll() {
    MacroCheckData.movementRanges = [];
    MacroCheckData.angles = [];
    MacroCheckData.lastPos = null;
    MacroCheckData.save();
}

/**
 * Gets statistics about saved data
 */
export function getStats() {
    let totalLength = 0;
    MacroCheckData.movementRanges.forEach(range => {
        totalLength += range.max - range.min;
    });

    return {
        ranges: MacroCheckData.movementRanges.length,
        angles: MacroCheckData.angles.length,
        totalLength: roundToDecimal(totalLength)
    };
}