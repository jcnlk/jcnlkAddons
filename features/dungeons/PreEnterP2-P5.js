import config from "../../config";
import { showGeneralJAMessage } from "../../utils/ChatUtils";
import {
  getCurrentClass,
  getIsInMaxor,
  getIsInGoldor,
  getIsInNecron,
  getIsInDungeon,
  getIsInF7,
  getIsInM7,
} from "../../utils/Dungeon";

let currentGoldorPhase = 0;
let hasAnnouncedPre2 = false;
let hasAnnouncedPre3 = false;
let hasAnnouncedPre4 = false;
let hasAnnouncedPre5 = false;
let hasAnnouncedPrePhase2 = false;
let hasAnnouncedPrePhase4 = false;
let hasAnnouncedPreMid = false;
let hasAnnouncedPrePhase5 = false;
let playerClass = getCurrentClass();

function getGoldorPhaseLocation() {
  if (
    Player.getX() > 90 &&
    Player.getX() < 110 &&
    Player.getY() > 107 &&
    Player.getY() < 145 &&
    Player.getZ() > 52 &&
    Player.getZ() < 123
  )
    return 1; // goldor phase 1 area
  if (
    Player.getX() > 17 &&
    Player.getX() < 105 &&
    Player.getY() > 107 &&
    Player.getY() < 145 &&
    Player.getZ() > 125 &&
    Player.getZ() < 142
  )
    return 2; // goldor phase 2 area
  if (
    Player.getX() > -2 &&
    Player.getX() < 15 &&
    Player.getY() > 107 &&
    Player.getY() < 145 &&
    Player.getZ() > 49 &&
    Player.getZ() < 137
  )
    return 3; // goldor phase 3 area
  if (
    Player.getX() > -2 &&
    Player.getX() < 88 &&
    Player.getY() > 107 &&
    Player.getY() < 145 &&
    Player.getZ() > 30 &&
    Player.getZ() < 48
  )
    return 4; // goldor phase 4 area
  if (
    Player.getX() > 41 &&
    Player.getX() < 68 &&
    Player.getY() > 110 &&
    Player.getY() < 150 &&
    Player.getZ() > 59 &&
    Player.getZ() < 117
  )
    return 5; // goldor phase 5 area
  else return 0;
}

function getPrePhaseLocation() {
  if (Player.getY() < 205 && Player.getY() > 164) return "P2"; // in phase 2 early
  if (Player.getY() < 100 && Player.getY() > 64) return "P4"; // in phase 4 early
  if (
    Player.getX() > 48 &&
    Player.getX() < 60 &&
    Player.getY() > 63 &&
    Player.getY() < 70 &&
    Player.getZ() > 70 &&
    Player.getZ() < 82
  )
    return "NecronMid"; // in mid (necron) early
  if (Player.getY() < 50 && Player.getY() > 4) return "P5"; // in phase 5 early
  else return false;
}

function announcePrePhase2() {
  if (!getIsInMaxor()) return;
  if (!config.announcePreEnterP2) return;
  if (playerClass === "Healer") return;

  const PreLocation = getPrePhaseLocation();

  if (PreLocation === "P2" && !hasAnnouncedPrePhase2) {
    setTimeout(() => ChatLib.command(`party chat At Pre Enter P2!`), 300);
    hasAnnouncedPrePhase2 = true;
    showGeneralJAMessage(`Announcing -> Pre Enter P2`);
  }
}

function announcePrePhase3() {
  if (!getIsInGoldor()) return;
  if (!config.announcePreEnterPhase3) return;
  if (!currentGoldorPhase) return;

  const goldorPhaseLocation = getGoldorPhaseLocation();

  if (
    goldorPhaseLocation === 2 &&
    currentGoldorPhase === 1 &&
    !hasAnnouncedPre2
  ) {
    setTimeout(() => ChatLib.command(`party chat At Pre Enter 2!`), 300);
    hasAnnouncedPre2 = true;
    showGeneralJAMessage(`Announcing -> Pre Enter 2`);
  }
  if (
    goldorPhaseLocation === 3 &&
    currentGoldorPhase === 2 &&
    !hasAnnouncedPre3
  ) {
    setTimeout(() => ChatLib.command(`party chat At Pre Enter 3!`), 300);
    hasAnnouncedPre3 = true;
    showGeneralJAMessage(`Announcing -> Pre Enter 3`);
  }
  if (
    goldorPhaseLocation === 4 &&
    currentGoldorPhase === 3 &&
    !hasAnnouncedPre4
  ) {
    setTimeout(() => ChatLib.command(`party chat At Pre Enter 4!`), 300);
    hasAnnouncedPre4 = true;
    hasAnnouncedPre5 = false; // to make sure that Core also gets announced after ee4 (e.g. At Core! -> At Pre Enter 4! -> At Core!)
    showGeneralJAMessage(`Announcing -> Pre Enter 4`);
  }
  if (
    goldorPhaseLocation === 5 &&
    currentGoldorPhase > 0 &&
    !hasAnnouncedPre5
  ) {
    setTimeout(() => ChatLib.command(`party chat At Core!`), 300);
    hasAnnouncedPre5 = true;
    showGeneralJAMessage(`Announcing -> At Core`);
  }
}

function announcePrePhase4() {
  if (!getIsInGoldor()) return;
  if (!config.announcePreP4) return;

  const PreLocation = getPrePhaseLocation();

  if (PreLocation === "NecronMid" && !hasAnnouncedPreMid) {
    setTimeout(() => ChatLib.command(`party chat At Mid!`), 300);
    hasAnnouncedPreMid = true;
    showGeneralJAMessage(`Announcing -> At Mid`);
  }
  if (PreLocation === "P4" && !hasAnnouncedPrePhase4) {
    setTimeout(() => ChatLib.command(`party chat At P4!`), 300);
    hasAnnouncedPrePhase4 = true;
    showGeneralJAMessage(`Announcing -> At P4`);
  }
}

function announcePrePhase5() {
  if (!getIsInNecron()) return;
  if (!config.announcePreP5) return;

  const PreLocation = getPrePhaseLocation();

  if (PreLocation === "P5" && !hasAnnouncedPrePhase5) {
    setTimeout(() => ChatLib.command(`party chat At P5!`), 300);
    hasAnnouncedPrePhase5 = true;
    showGeneralJAMessage(`Announcing -> At P5`);
  }
}

function announcePreEnter() {
  if (!World.isLoaded()) return;
  if (!getIsInDungeon()) return;
  if (!getIsInF7() && !getIsInM7()) return;

  announcePrePhase2();

  announcePrePhase3();

  announcePrePhase4();

  announcePrePhase5();
}

register("tick", announcePreEnter);

register("chat", (message) => {
  if (message === "[BOSS] Storm: I should have known that I stood no chance.") {
    currentGoldorPhase = 1;
  }
  if (
    (message.includes("(7/7)") || message.includes("(8/8)")) &&
    !message.includes(":")
  ) {
    currentGoldorPhase += 1;
  }
}).setCriteria("${message}");

register("worldUnload", () => {
  currentGoldorPhase = 0;
  hasAnnouncedPre2 = false;
  hasAnnouncedPre3 = false;
  hasAnnouncedPre4 = false;
  hasAnnouncedPre5 = false;
  hasAnnouncedPrePhase2 = false;
  hasAnnouncedPrePhase4 = false;
  hasAnnouncedPrePhase5 = false;
});
