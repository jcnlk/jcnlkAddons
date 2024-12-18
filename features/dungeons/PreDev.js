
import config from "../../config";
import { getCurrentClass, inMaxor, inStorm } from "../../utils/Dungeon";
import { showGeneralJAMessage } from "../../utils/ChatUtils";

//let inMaxor = false;
//let inStorm = false;
//let inGoldor = false;
let SendDev1 = false;
let SendDev2 = false;
let SendDev3 = false;

function atDev() {
    if ((Player.getX() > 106 && Player.getX() < 111) && (Player.getY() > 119 && Player.getY() < 122) && (Player.getZ() > 92 && Player.getZ() < 95)) return 1;
    else if ((Player.getX() > 58 && Player.getX() < 62) && (Player.getY() > 130 && Player.getY() < 135) && (Player.getZ() > 137 && Player.getZ() < 143)) return 2;
    else if ((Player.getX() > -3 && Player.getX() < 4) && (Player.getY() > 119 && Player.getY() < 123) && (Player.getZ() > 75 && Player.getZ() < 79)) return 3;
    //else if ((Player.getX() > 61 && Player.getX() < 65) && (Player.getY() > 126 && Player.getY() < 130) && (Player.getZ() > 33 && Player.getZ() < 37)) return 4; // not needed cuz ati4 is the same
    else return 0;
}

/**
register("chat", (message) => {
    if (message == "[BOSS] Storm: I should have known that I stood no chance.") {
        inMaxor = false;
        inStorm = false;
        inGoldor = true;
    }
    else if (message == "[BOSS] Storm: Pathetic Maxor, just like expected.") {
        inMaxor = false;
        inStorm = true;
        inGoldor = false;
    }
    else if (message == "[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!") {
        inMaxor = true;
        inStorm = false;
        inGoldor = false;
    }
}).setCriteria("${message}");
*/

register("tick", () => {
    if (config.announcePreDevPosition) {
        const playerClass = getCurrentClass();
        if (playerClass === 'Healer') {
            if (inMaxor() || inStorm()) {
                if (atDev() === 3 && !SendDev3) {
                    ChatLib.command(`pc At Pre Dev 3!`);
                    SendDev3 = true;
                    showGeneralJAMessage("Announced Pre Dev 3 Position.");
                }
                else if (atDev() === 2 && !SendDev2) {
                    ChatLib.command(`pc At Pre Dev 2!`);
                    SendDev2 = true;
                    showGeneralJAMessage("Announced Pre Dev 2 Position.");
                }
            }
            if (inStorm()) {
                if (atDev() === 1 && !SendDev1) {
                    ChatLib.command(`pc At SS!`);
                    SendDev1 = true;
                    showGeneralJAMessage("Announced SS Position.");
                }
            }
        }
    }
})

register("worldLoad", () => {
    //inMaxor = false;
    //inStorm = false;
    //inGoldor = false;
    SendDev1 = false
    SendDev2 = false;
    SendDev3 = false;
});