import Dungeon from "../../BloomCore/dungeons/Dungeon";
import { isInBox } from "./Utils";

export function getClassColor(playerClass) {
  if (playerClass === "Healer") return "&d";
  if (playerClass === "Tank") return "&a";
  if (playerClass === "Mage") return "&b";
  if (playerClass === "Berserk") return "&c";
  if (playerClass === "Archer") return "&6";
}

// To track the current Goldor phase (S1, S2, S3, S4)
let currentStage = 0;

Dungeon.registerWhenInDungeon(register("chat", message => {
  if (message === "[BOSS] Storm: I should have known that I stood no chance.") currentStage = 1;
  if ((message.includes("(7/7)") || message.includes("(8/8)")) && !message.includes(":")) currentStage += 1;
}).setCriteria("${message}"));

register("worldUnload", () => currentStage = 0);

export const getStage = () => currentStage;
export const inStage = (stage) => Array.isArray(stage) ? stage.includes(currentStage) : currentStage === stage;

// To Trach the current Phase (P1, P2, P3, P4, P5)
let currentPhase = 0;

Dungeon.registerWhenInDungeon(register("chat", (name) => {
  name = name.removeFormatting();
  if (name === "Maxor") currentPhase = 1;
  if (name === "Storm") currentPhase = 2;
  if (name === "Goldor") currentPhase = 3;
  if (name === "Necron") currentPhase = 4;
  if (name === "Wither King") currentPhase = 5;
}).setCriteria(/\[BOSS\] (Maxor|Storm|Goldor|Necron|Wither King): .+/));

register("worldLoad", () => currentPhase = 0);

export const getPhase = () => currentPhase;
export const inPhase = (phase) => Array.isArray(phase) ? phase.includes(currentPhase) : currentPhase === phase;

// Criteria for PosMsg and PosTitles
export const positionDefinitions = [
  {
    id: "AtP2",
    messageText: "At P2!",
    checkCondition: (playerClass) => inPhase(1) && playerClass !== "Healer",
    checkPosition: (entity) => entity.getY() < 205 && entity.getY() > 164,
    validMessages: ["at p2", "in p2"]
  },
  {
    id: "AtSS",
    messageText: "At SS!",
    checkCondition: () => inPhase([2,3]),
    checkPosition: (entity) => isInBox(106, 110, 118, 122, 92, 96, entity),
    validMessages: ["at ss", "at simon says", "at ssc"]
  },
  {
    id: "AtEE2",
    messageText: "At Pre Enter 2!",
    checkCondition: () => inStage(1),
    checkPosition: (entity) => isInBox(49, 58, 108, 115, 129, 133, entity),
    validMessages: ["early enter 2", "pre enter 2", "at ee2", "entered 3.2"]
  },
  {
    id: "AtEE2High",
    messageText: "At Pre Enter 2 (High)!",
    checkCondition: () => inStage(1),
    checkPosition: (entity) => isInBox(62, 59, 132, 135, 143, 138, entity),
    validMessages: ["high pre enter 2", "high ee2", "ee2 high", "early enter high", "high early enter 2", "pre enter 2 (high)"],
  },
  {
    id: "AtSafespot2",
    messageText: "At Safespot 2!",
    checkCondition: () => inStage(1),
    checkPosition: (entity) => isInBox(46, 49, 109, 109, 121.987, 121.988, entity),
    validMessages: ["2 safespot", "safespot 2"]
  },
  {
    id: "AtEE3",
    messageText: "At Pre Enter 3!",
    checkCondition: () => inStage(2),
    checkPosition: (entity) => isInBox(0, 4, 108, 115, 98, 107, entity),
    validMessages: ["early enter 3", "pre enter 3", "at ee3", "entered 3.3"]
  },
  {
    id: "AtSafespot3",
    messageText: "At Safespot 3!",
    checkCondition: () => inStage(2),
    checkPosition: (entity) => isInBox(19, 18, 121.5, 125, 91, 100, entity),
    validMessages: ["safespot 3", "3 safespot"]
  },
  {
    id: "AtCore",
    messageText: "At Core!",
    checkCondition: () => inStage([2,3]),
    checkPosition: (entity) => isInBox(52, 56, 113, 117, 49, 53, entity),
    validMessages: ["at core", "pre enter 4", "early enter 4", "at ee4", "entered 3.4"]
  },
  {
    id: "InGoldorTunnel",
    messageText: "Inside Goldor Tunnel!",
    checkCondition: () => inStage(4),
    checkPosition: (entity) => isInBox(41, 68, 110, 150, 59, 117, entity),
    validMessages: ["in goldor tunnel", "inside goldor tunnel", "in core", "entered 3.5", "at ee5", "pre enter 5"]
  },
  {
    id: "AtMid",
    messageText: "At Mid!",
    checkCondition: () => inPhase(4),
    checkPosition: (entity) => isInBox(47, 61, 64, 75, 69, 83, entity),
    validMessages: ["at mid", "in mid"]
  },
  {
    id: "AtPre4Entry",
    messageText: "At Pre4 Entry!",
    checkCondition: (playerClass) => inPhase(2) && playerClass !== "Healer",
    checkPosition: (entity) => isInBox(91, 93, 129, 133, 44, 46, entity),
    validMessages: ["i4 entry", "pre4 entry"]
  },
  {
    id: "AtP5",
    messageText: "At P5!",
    checkCondition: (playerClass) => inPhase(4) && playerClass === "Healer",
    checkPosition: (entity) => entity.getY() < 50 && entity.getY() > 4,
    validMessages: ["at p5", "in p5"]
  }
];