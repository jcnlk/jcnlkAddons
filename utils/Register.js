import config from "../config";

/**
 * Full Creadit to TakeshiClient: https://www.chattriggers.com/modules/v/TakeshiClient
 */
let registers = [];
export const registerWhen = (trigger, dependency, debugInfo = { type: '', name: '' }) => {
    registers.push([trigger.unregister(), dependency, false, debugInfo]);
}

export const setRegisters = () => {
    let registerInfo = '';
    let unregisterInfo = '';
    let registerCount = 0;
    let unregisterCount = 0;
    registers.forEach((trigger) => {
        if (trigger[1]() && !trigger[2]) {
            trigger[0].register();
            trigger[2] = true;
            registerInfo += `&b${trigger[3].type} &7of &a${trigger[3].name}, `;
            if (registerCount % 3 === 2) registerInfo += '\n';
            registerCount++;
        } else if (!trigger[1]() && trigger[2]) {
            trigger[0].unregister();
            trigger[2] = false;
            unregisterInfo += `&b${trigger[3].type} &7of &a${trigger[3].name}, `;
            if (unregisterCount % 3 === 2) unregisterInfo += '\n';
            unregisterCount++;
        }
    });
    if (config.debugMode) {
        if (!(registerCount === 0 && unregisterCount === 0)) {
            const debugMessage = new TextComponent(`&e[DEBUG] Registered or unregistered triggers.`)
                .setHoverValue(`&2Registered:\n${registerInfo}\n\n&4Unregistered:\n${unregisterInfo}`);
            ChatLib.chat(debugMessage);
        }
    }
}

setTimeout(() => {
    setRegisters();
}, 1000);