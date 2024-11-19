import config from "../../config";

/**
 * Credits to TurtleAddons: https://www.chattriggers.com/modules/v/TurtleAddons
 */

function inGoldorPhase() {
    if ((Player.getX() > 90 && Player.getX() < 110) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 52 && Player.getZ() < 123)) return 1;
    else if ((Player.getX() > 17 && Player.getX() < 105) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 125 && Player.getZ() < 142)) return 2;
    else if ((Player.getX() > -2 && Player.getX() < 15) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 49 && Player.getZ() < 137)) return 3;
    else if ((Player.getX() > -2 && Player.getX() < 88) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 30 && Player.getZ() < 48)) return 4;
    else if ((Player.getX() > 41 && Player.getX() < 68) && (Player.getY() > 110 && Player.getY() < 150) && (Player.getZ() > 59 && Player.getZ() < 117)) return 5;
    else return 0;
}

let goldorPhase = 0;
let lastSend = 0;

register('worldLoad', () => {
    goldorPhase = 0;
    lastSend = 0;
})

register("chat", (message) => {
    if (message == '[BOSS] Storm: I should have known that I stood no chance.') goldorPhase = 1;
    else if ((message.includes('(7/7)') || message.includes('(8/8)')) && !message.includes(':')) goldorPhase += 1;
}).setCriteria("${message}")

register("tick", () => {
    if (config.announcePreEnterPhase3) {
        if (goldorPhase > 0 && inGoldorPhase() != lastSend && inGoldorPhase() > goldorPhase) {
            if (inGoldorPhase() === 5) {
                ChatLib.command(`pc At Core!`);
            } else {
                ChatLib.command(`pc At Pre Enter ${inGoldorPhase()}!`);
            }
            lastSend = inGoldorPhase();
        }
    }
})