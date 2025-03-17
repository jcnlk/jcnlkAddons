import Dungeon from "../../BloomCore/dungeons/Dungeon";
import { isPlayerInArea } from "./Utils";

const BossStatus = Java.type("net.minecraft.entity.boss.BossStatus");

export function getClassColor(playerClass) {
  if (playerClass === "Healer") return "&d";
  if (playerClass === "Tank") return "&a";
  if (playerClass === "Mage") return "&b";
  if (playerClass === "Berserk") return "&c";
  if (playerClass === "Archer") return "&6";
}

export function getIsInBoss(boss) {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  return bossName.removeFormatting().includes(boss);
}

// To track the current Goldor phase (S1, S2, S3, S4)
let currentGoldorPhase = 0;

Dungeon.registerWhenInDungeon(register("chat", message => {
  if (message === "[BOSS] Storm: I should have known that I stood no chance.") currentGoldorPhase = 1;
  if ((message.includes("(7/7)") || message.includes("(8/8)")) && !message.includes(":")) currentGoldorPhase += 1;
}).setCriteria("${message}"));

register("worldUnload", () => currentGoldorPhase = 0);

export const getCurrentGoldorPhase = () => currentGoldorPhase;

// Criteria for PosMsg and PosTitles
export const positionDefinitions = [
  {
    id: 'AtP2',
    messageText: 'At P2!',
    checkCondition: (playerClass) => getIsInBoss("Maxor") && playerClass !== "Healer",
    checkPosition: (entity) => entity.getY() < 205 && entity.getY() > 164,
    validMessages: ["at p2", "in p2"]
  },
  {
    id: 'AtSS',
    messageText: 'At SS!',
    checkCondition: () => getIsInBoss("Storm") || getIsInBoss("Goldor"),
    checkPosition: (entity) => isPlayerInArea(106, 110, 118, 122, 92, 96, entity),
    validMessages: ["at ss", "at simon says"]
  },
  {
    id: 'AtEE2',
    messageText: 'At Pre Enter 2!',
    checkCondition: () => getCurrentGoldorPhase() === 1,
    checkPosition: (entity) => isPlayerInArea(49, 58, 108, 115, 129, 133, entity),
    validMessages: ["early enter 2", "pre enter 2", "at ee2", "entered 3.2"]
  },
  {
    id: 'AtEE3',
    messageText: 'At Pre Enter 3!',
    checkCondition: () => getCurrentGoldorPhase() === 2,
    checkPosition: (entity) => isPlayerInArea(0, 4, 108, 115, 98, 107, entity),
    validMessages: ["early enter 3", "pre enter 3", "at ee3", "entered 3.3"]
  },
  {
    id: 'AtCore',
    messageText: 'At Core!',
    checkCondition: () => getCurrentGoldorPhase() === 2 || getCurrentGoldorPhase() === 3,
    checkPosition: (entity) => isPlayerInArea(52, 56, 113, 117, 49, 53, entity),
    validMessages: ["at core", "pre enter 4", "early enter 4", "at ee4", "entered 3.4"]
  },
  {
    id: 'InGoldorTunnel',
    messageText: 'Inside Goldor Tunnel!',
    checkCondition: () => getCurrentGoldorPhase() === 4,
    checkPosition: (entity) => isPlayerInArea(41, 68, 110, 150, 59, 117, entity),
    validMessages: ["in goldor tunnel", "inside goldor tunnel", "in core", "entered 3.5", "at ee5", "at pre enter 5"]
  },
  {
    id: 'AtMid',
    messageText: 'At Mid!',
    checkCondition: () => getIsInBoss("Necron"),
    checkPosition: (entity) => isPlayerInArea(47, 61, 64, 75, 69, 83, entity),
    validMessages: ["at mid", "in mid"]
  },
  {
    id: 'Ati4Entry',
    messageText: 'At i4 Entry!',
    checkCondition: (playerClass) => getIsInBoss("Storm") && playerClass !== "Healer",
    checkPosition: (entity) => isPlayerInArea(91, 93, 129, 133, 44, 46, entity),
    validMessages: ["i4 entry"]
  },
  {
    id: 'AtP5',
    messageText: 'At P5!',
    checkCondition: (playerClass) => getIsInBoss("Necron") && playerClass === "Healer",
    checkPosition: (entity) => entity.getY() < 50 && entity.getY() > 4,
    validMessages: ["at p5", "in p5"]
  }
];