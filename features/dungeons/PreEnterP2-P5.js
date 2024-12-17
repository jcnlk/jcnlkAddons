import config from "../../config";
import { showGeneralJAMessage } from "../../utils/ChatUtils";
import { getCurrentClass, inMaxor, inGoldor, inNecron } from "../../utils/Dungeon";

//let inGoldor = false;
let goldorPhase = 0;
let SendPre2 = false;
let SendPre3 = false;
let SendPre4 = false;
let SendPre5 = false;
let SendPreP2 = false;
//let inMaxor = false;
let SendPreP4 = false;
let SendPreMid = false;
//let inNecron = false;
let SendPreP5 = false;

function inGoldorPhase() {
    if ((Player.getX() > 90 && Player.getX() < 110) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 52 && Player.getZ() < 123)) return 1;
    else if ((Player.getX() > 17 && Player.getX() < 105) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 125 && Player.getZ() < 142)) return 2;
    else if ((Player.getX() > -2 && Player.getX() < 15) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 49 && Player.getZ() < 137)) return 3;
    else if ((Player.getX() > -2 && Player.getX() < 88) && (Player.getY() > 107 && Player.getY() < 145) && (Player.getZ() > 30 && Player.getZ() < 48)) return 4;
    else if ((Player.getX() > 41 && Player.getX() < 68) && (Player.getY() > 110 && Player.getY() < 150) && (Player.getZ() > 59 && Player.getZ() < 117)) return 5;
    else return 0;
}

function atPreP2() {
    if (Player.getY() < 205 && Player.getY() > 168) return true;
    else return false;
}

function atPreP4() {
    if (Player.getY() < 100 && Player.getY() > 64) return true;
    else return false;
}

function atMid() {
    if ((Player.getX() > 48 && Player.getX() < 60) && (Player.getY() > 63 && Player.getY() < 70) && (Player.getZ() > 70 && Player.getZ() < 82)) return true;
    else return false;  
}

function atPreP5() {
    if (Player.getY() < 61 && Player.getY() > 4) return true;
    else return false;
}


register("chat", (message) => {
    /**
    if (message == "[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!") {
        inMaxor = true;
        inStorm = false;
        inGoldor = false;
        goldorPhase = 0;
        inNecron = false;
    }
    else if (message == "[BOSS] Storm: I should have known that I stood no chance.") {
        inMaxor = false;
        inStorm = false;
        goldorPhase = 1;
        inGoldor = true;
    }
    */
    if ((message.includes('(7/7)') || message.includes('(8/8)')) && !message.includes(':')) {
        //inMaxor = false;
        //inStorm = false;
        //inGoldor = true;
        goldorPhase += 1;
        //inNecron = false;
    }
    /**
    else if (message == "[BOSS] Necron: Finally, I heard so much about you. The Eye likes you very much.") {
        inMaxor = false;
        inStorm = false;
        goldorPhase = 0;
        inGoldor = false;
        inNecron = true;
    }
    */
}).setCriteria("${message}");

register("tick", () => {
    if (config.announcePreEnterPhase3 && inGoldor()) {
        if (inGoldorPhase() === 2 && goldorPhase === 1 && !SendPre2) {
            ChatLib.command(`pc At Pre Enter 2!`);
            SendPre2 = true;
            showGeneralJAMessage(`Announed Pre Enter 2 Position.`);
        }
        else if (inGoldorPhase() === 3 && goldorPhase === 2 && !SendPre3) {
            ChatLib.command(`pc At Pre Enter 3!`);
            SendPre3 = true;
            showGeneralJAMessage(`Announced Pre Enter 3 Position.`);
        }
        else if (inGoldorPhase() === 4 && goldorPhase === 3 &&!SendPre4) {
            ChatLib.command(`pc At Pre Enter 4!`);
            SendPre4 = true;
            SendPre5 = false; // to make sure that Core also gets announced after ee4
            showGeneralJAMessage(`Announced Pre Enter 4 Position.`);
        }
        else if (inGoldorPhase() === 5 && goldorPhase > 1 && !SendPre5) {
            ChatLib.command(`pc At Core!`);
            SendPre5 = true;
            showGeneralJAMessage(`Announced Core Position.`);
        }
    }
    if (config.announcePreEnterP2 && inMaxor()) {
        const playerClass = getCurrentClass();
        if (atPreP2() && playerClass != "Healer" && !SendPreP2) {
            ChatLib.command(`pc At Pre Enter P2!`);
            SendPreP2 = true;
            showGeneralJAMessage(`Announced Pre Enter P2.`);
        }
    }
    if (config.announcePreP4) {
        if (atMid() && !SendPreMid) {
            if (inGoldor()) {
                ChatLib.command(`pc At Mid!`);
                SendPreMid = true;
                showGeneralJAMessage(`Announced At Mid Position.`);
            }
        }
        else if (!atMid() && !SendPreP4) {
            if (atPreP4() && inGoldor()) {
                ChatLib.command(`pc At P4!`);
                SendPreP4 = true;
                showGeneralJAMessage(`Announced At P4 Position.`);
            } 
        }
    }
    if (config.announcePreP5) {
        if (atPreP5() && inNecron() && !SendPreP5) {
            ChatLib.command(`pc At P5!`);
            SendPreP5 = true;
            showGeneralJAMessage(`Announced At P5 Position.`);
        }
    }
});

register("gameUnload", () => {
    //inGoldor = false;
    goldorPhase = 0;
    SendPre2 = false;
    SendPre3 = false;
    SendPre4 = false;
    SendPre5 = false;
    SendPreP2 = false;
    //inMaxor = false;
    SendPreP4 = false;
    //inNecron = false;
    SendPreP5 = false;
});