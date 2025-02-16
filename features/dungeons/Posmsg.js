import config from "../../config";
import { showGeneralJAMessage } from "../../utils/ChatUtils";
import { registerWhen } from "../../utils/Register";
import { isPlayerInArea } from "../../utils/Area";
import {
  getCurrentClass,
  getIsInMaxor,
  getIsInStorm,
  getIsInGoldor,
  getIsInNecron,
  getIsInF7,
  getIsInM7,
  getIsInDungeon
} from "../../utils/Dungeon";

const announcements = {
  preDev: {
    ss: false,
    dev2: false,
    dev3: false
  },
  i4: {
    entry: false,
    moving: false,
    at: false,
  },
  preEnter: {
    pre2: false,
    pre3: false,
    pre4: false,
    pre5: false,
    phase2: false,
    phase4: false,
    phase5: false,
    mid: false,
  }
};

let currentGoldorPhase = 0;
let playerClass = getCurrentClass();

function sendAnnouncement(chatMsg, generalMsg) {
  setTimeout(() => ChatLib.command(`party chat ${chatMsg}`), 300);
  showGeneralJAMessage(`Announcing -> ${generalMsg}`);
}

//////////////////////
// Pre Dev Announce //
//////////////////////

function getDevPosition() {
  if (isPlayerInArea(106, 111, 119, 122, 92, 95)) return 1;
  if (isPlayerInArea(58, 62, 130, 135, 137, 143)) return 2;
  if (isPlayerInArea(-3, 4, 119, 123, 75, 79)) return 3;
  return 0;
}

function announceDevPosition() {
  if (!World.isLoaded()) return;
  if (playerClass !== "Healer") return;

  const devPos = getDevPosition();

  if (getIsInMaxor() || getIsInStorm()) {
    if (devPos === 3 && !announcements.preDev.dev3) {
      sendAnnouncement("At Pre Dev 3!", "Pre At Dev 3");
      announcements.preDev.dev3 = true;
    } else if (devPos === 2 && !announcements.preDev.dev2) {
      sendAnnouncement("At Pre Dev 2!", "Pre At Dev 2");
      announcements.preDev.dev2 = true;
    }
  }
  if (getIsInStorm() && devPos === 1 && !announcements.preDev.ss) {
    sendAnnouncement("At SS!", "At SS");
    announcements.preDev.ss = true;
  }
}

registerWhen(register("tick", announceDevPosition), () => config.announcePreDevPosition);

////////////////////
// Pre I4 Announce//
////////////////////

function getI4Position() {
  if (isPlayerInArea(91, 93, 129, 133, 44, 46)) return 1;
  if (isPlayerInArea(87, 91, 129, 134, 46, 50)) return 2;
  if (isPlayerInArea(61, 65, 126, 130, 33, 37)) return 3;
  return 0;
}

function announceI4Position() {
  if (!World.isLoaded()) return;
  if (playerClass === "Healer") return;
  if (!getIsInMaxor()) return;

  const pos = getI4Position();

  if (pos === 1 && !announcements.i4.entry) {
    sendAnnouncement("At i4 Entry (HEALER CAN LEAP)!", "i4 Entry Position");
    announcements.i4.entry = true;
  } else if (pos === 2 && !announcements.i4.moving) {
    sendAnnouncement("Moving to i4 (DON'T LEAP)!", "Moving to i4");
    announcements.i4.moving = true;
  } else if (pos === 3 && !announcements.i4.at) {
    sendAnnouncement("At i4 (DON'T LEAP)!", "At i4 Position");
    announcements.i4.at = true;
  }
}

registerWhen(register("tick", announceI4Position), () => config.announceI4Position);

//////////////////////////
// Pre Enter Announcements//
//////////////////////////

function getGoldorPhaseLocation() {
  if (isPlayerInArea(90, 110, 107, 145, 52, 123)) return 1;
  if (isPlayerInArea(17, 105, 107, 145, 125, 142)) return 2;
  if (isPlayerInArea(-2, 15, 107, 145, 49, 137)) return 3;
  if (isPlayerInArea(-2, 88, 107, 145, 30, 48)) return 4;
  if (isPlayerInArea(41, 68, 110, 150, 59, 117)) return 5;
  return 0;
}

function getPrePhaseLocation() {
  const y = Player.getY();
  if (y < 205 && y > 164) return "P2";
  if (y < 100 && y > 64) return "P4";
  if (isPlayerInArea(48, 60, 63, 70, 70, 82)) return "NecronMid";
  if (y < 50 && y > 4) return "P5";
  return false;
}

function announcePrePhase2() {
  if (!getIsInMaxor()) return;
  if (!config.announcePreEnterP2) return;
  if (playerClass === "Healer") return;

  if (getPrePhaseLocation() === "P2" && !announcements.preEnter.phase2) {
    sendAnnouncement("At Pre Enter P2!", "Pre Enter P2");
    announcements.preEnter.phase2 = true;
  }
}

function announcePrePhase3() {
  if (!getIsInGoldor()) return;
  if (!config.announcePreEnterPhase3) return;
  if (!currentGoldorPhase) return;

  const phaseLoc = getGoldorPhaseLocation();
  if (phaseLoc === 2 && currentGoldorPhase === 1 && !announcements.preEnter.pre2) {
    sendAnnouncement("At Pre Enter 2!", "Pre Enter 2");
    announcements.preEnter.pre2 = true;
  }
  if (phaseLoc === 3 && currentGoldorPhase === 2 && !announcements.preEnter.pre3) {
    sendAnnouncement("At Pre Enter 3!", "Pre Enter 3");
    announcements.preEnter.pre3 = true;
  }
  if (phaseLoc === 4 && currentGoldorPhase === 3 && !announcements.preEnter.pre4) {
    sendAnnouncement("At Pre Enter 4!", "Pre Enter 4");
    announcements.preEnter.pre4 = true;
    announcements.preEnter.pre5 = false;
  }
  if (phaseLoc === 5 && currentGoldorPhase > 0 && !announcements.preEnter.pre5) {
    sendAnnouncement("At Core!", "At Core");
    announcements.preEnter.pre5 = true;
  }
}

function announcePrePhase4() {
  if (!getIsInGoldor()) return;
  if (!config.announcePreP4) return;

  const location = getPrePhaseLocation();
  if (location === "NecronMid" && !announcements.preEnter.mid) {
    sendAnnouncement("At Mid!", "At Mid");
    announcements.preEnter.mid = true;
  }
  if (location === "P4" && !announcements.preEnter.phase4) {
    sendAnnouncement("At P4!", "At P4");
    announcements.preEnter.phase4 = true;
  }
}

function announcePrePhase5() {
  if (!getIsInNecron()) return;
  if (!config.announcePreP5) return;

  if (getPrePhaseLocation() === "P5" && !announcements.preEnter.phase5) {
    sendAnnouncement("At P5!", "At P5");
    announcements.preEnter.phase5 = true;
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

registerWhen(register("chat", (message) => {
  if (message === "[BOSS] Storm: I should have known that I stood no chance.") {
    currentGoldorPhase = 1;
  }
  if ((message.includes("(7/7)") || message.includes("(8/8)")) && !message.includes(":")) {
    currentGoldorPhase += 1;
  }
}).setCriteria("${message}"), () => getIsInF7() || getIsInM7());

register("worldUnload", () => {
  announcements.preDev.ss = false;
  announcements.preDev.dev2 = false;
  announcements.preDev.dev3 = false;
  announcements.i4.entry = false;
  announcements.i4.moving = false;
  announcements.i4.at = false;
  announcements.preEnter.pre2 = false;
  announcements.preEnter.pre3 = false;
  announcements.preEnter.pre4 = false;
  announcements.preEnter.pre5 = false;
  announcements.preEnter.phase2 = false;
  announcements.preEnter.phase4 = false;
  announcements.preEnter.phase5 = false;
  announcements.preEnter.mid = false;
  currentGoldorPhase = 0;
  playerClass = getCurrentClass();
});
