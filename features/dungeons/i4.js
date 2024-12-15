
import config from "../../config";
import { getCurrentClass } from "../../utils/Dungeon";
import { showGeneralJAMessage } from "../../utils/ChatUtils";

let SendAti4 = false;
let SendAti4Entry = false;
let SendEnteredi4 = false;
let inStorm = false;

function i4() {
    if ((Player.getX() > 91 && Player.getX() < 93) && (Player.getY() > 129 && Player.getY() < 133) && (Player.getZ() > 44 && Player.getZ() < 46)) return 1;
    else if ((Player.getX() > 87 && Player.getX() < 91) && (Player.getY() > 129 && Player.getY() < 134) && (Player.getZ() > 46 && Player.getZ() < 50)) return 2;
    else if ((Player.getX() > 61 && Player.getX() < 65) && (Player.getY() > 126 && Player.getY() < 130) && (Player.getZ() > 33 && Player.getZ() < 37)) return 3;
    else return 0;
}

register("chat", (message) => {
    if (message == "[BOSS] Storm: Pathetic Maxor, just like expected.") {
        inStorm = true;
    }
    else if (message == "[BOSS] Storm: I should have known that I stood no chance.") {
        inStorm = false;
    }
}).setCriteria("${message}")

register("tick", () => {
    if (config.announcei4Position) {
        const playerClass = getCurrentClass();
        if (inStorm && playerClass != 'Healer') {
            if (i4() === 1 && !SendAti4Entry) {
                ChatLib.command(`pc At i4 Entry (HEALER CAN LEAP)!`);
                SendAti4Entry  = true;
                showGeneralJAMessage("Announced i4 Entry Position.");
            }
            else if (i4() === 2 && !SendEnteredi4) {
                ChatLib.command(`pc Moving to i4 (DON'T LEAP)!`);
                SendEnteredi4 = true;
                showGeneralJAMessage("Announced Moving to i4.");
            }
            else if (i4() === 3 && !SendAti4) {
                ChatLib.command(`pc At i4!`);
                SendAti4 = true;
                showGeneralJAMessage("Announced At i4 Position.");
            }
        }
    }
});

register("worldUnload", () => {
    SendAti4 = false;
    SendAti4Entry = false;
    SendEnteredi4 = false;
    inStorm = false;
    playerClass = null;
});