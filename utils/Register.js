import { showDebugMessage } from "./ChatUtils";
import Config from "../config";

let registers = [];

/**
 * Register a trigger with a dependency
 * @param {Trigger} trigger - The trigger to register
 * @param {Function} dependency - The dependency function that determines if the trigger should be registered
 * @param {Object} debugInfo - Debug information for the trigger
 * @param {string} debugInfo.type - The type of the trigger
 * @param {string} debugInfo.name - The name of the trigger
 */
export const registerWhen = (trigger, dependency, debugInfo = { type: '', name: '' }) => {
    registers.push([trigger.unregister(), dependency, false, debugInfo]);
}

/**
 * Set all registers based on their dependencies
 */
export const setRegisters = () => {
    let registerInfo = '';
    let unregisterInfo = '';
    let registerCount = 0;
    let unregisterCount = 0;
    
    registers.forEach((trigger) => {
        if (trigger[1]() && !trigger[2]) {
            trigger[0].register();
            trigger[2] = true;
            registerInfo += `${trigger[3].type} of ${trigger[3].name}, `;
            if (registerCount % 3 === 2) registerInfo += '\n';
            registerCount++;
        } else if (!trigger[1]() && trigger[2]) {
            trigger[0].unregister();
            trigger[2] = false;
            unregisterInfo += `${trigger[3].type} of ${trigger[3].name}, `;
            if (unregisterCount % 3 === 2) unregisterInfo += '\n';
            unregisterCount++;
        }
    });

    if (Config.debugMode) {
        if (!(registerCount === 0 && unregisterCount === 0)) {
            showDebugMessage(`Registered or unregistered triggers.`);
            showDebugMessage(`Registered: ${registerInfo}`);
            showDebugMessage(`Unregistered: ${unregisterInfo}`);
        }
    }
}

// Initial setup of registers
setTimeout(() => {
    setRegisters();
}, 1000);