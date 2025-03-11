import Dungeon from "../../BloomCore/dungeons/Dungeon";
import { getCurrentArea } from "./Utils";

const BossStatus = Java.type("net.minecraft.entity.boss.BossStatus");
const tablistClassRegex = /\[(?:.+)\] (.+) \((Berserk|Archer|Mage|Tank|Healer) ([a-zA-Z]+)\)/;

export function getClassOf(name = Player.getName()) {
  if (!TabList) return;
  const names = TabList.getNames().map(line => line.removeFormatting());
  if (!names) return;
  let index = names.findIndex(line => line.includes(name));
  if (index === -1) return;
  let match = names[index].match(tablistClassRegex);
  if (!match) return "?";
  const result = match[2];
  if(result.includes("Healer")) return "Healer"
  if(result.includes("Tank")) return "Tank"
  if(result.includes("Mage")) return "Mage"
  if(result.includes("Berserk")) return "Berserk"
  if(result.includes("Archer")) return "Archer"
  else return null;
}

export function getClassColor(playerName) {
  if (getClassOf(playerName) === "Healer") return "&d";
  if (getClassOf(playerName) === "Tank") return "&a";
  if (getClassOf(playerName) === "Mage") return "&b";
  if (getClassOf(playerName) === "Berserk") return "&c";
  if (getClassOf(playerName) === "Archer") return "&6";
}

export function getCurrentFloor() {
  const area = getCurrentArea();
  const match = area.match(/The Catacombs \((F|M)(\d+)\)/);
  if (match) {
    return {
      type: match[1],
      number: parseInt(match[2], 10),
    };
  }
  return null;
}

export function getIsInDungeon() {
  return getCurrentArea().includes("The Catacombs");
}

export function getIsInDungeonHub() {
  return getCurrentArea().includes("Dungeon Hub");
}

function createFloorFunction(type, number) {
  return function () {
    const floor = getCurrentFloor();
    return floor && floor.type === type && floor.number === number;
  };
}

export const getIsInF7 = createFloorFunction("F", 7);
export const getIsInM3 = createFloorFunction("M", 3);
export const getIsInM7 = createFloorFunction("M", 7);

export function getIsInBoss(boss) {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  return bossName.removeFormatting().includes(boss);
}

export function getCrypts() {
  try {
    const tabList = TabList.getNames();
    if (!tabList) return 0;
    for (let line of tabList) {
      line = ChatLib.removeFormatting(line);
      if (line.includes("Crypts: ")) {
        const count = parseInt(line.split("Crypts: ")[1], 10);
        return isNaN(count) ? 0 : count;
      }
    }
  } catch (error) {
  }
  return 0;
}

export function getPuzzleCount() {
  const tabList = TabList.getNames();
  if (!tabList) return 0;
  for (let line of tabList) {
    line = ChatLib.removeFormatting(line);
    if (line.includes("Puzzles: (")) {
      const number = parseInt(line.split("Puzzles: (")[1], 10);
      return isNaN(number) ? 0 : number;
    }
  }
  return 0;
}

export function getDungeonTime() {
  try {
    const tabList = TabList.getNames();
    if (!tabList || tabList.length < 46) return null;
    const timeLine = ChatLib.removeFormatting(tabList[45]).trim();
    if (!timeLine.startsWith("Time: ")) return null;
    const timeMatch = timeLine.match(/Time: (?:(\d+)m )?(\d+)s/);
    if (timeMatch) {
      const minutes = timeMatch[1] ? parseInt(timeMatch[1], 10) : 0;
      const seconds = parseInt(timeMatch[2], 10);
      return minutes * 60 + seconds;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// To track the current Goldor phase (S1, S2, S3, S4)
let currentGoldorPhase = 0;

Dungeon.registerWhenInDungeon(register("chat", message => {
  if (message === "[BOSS] Storm: I should have known that I stood no chance.") currentGoldorPhase = 1;
  if ((message.includes("(7/7)") || message.includes("(8/8)")) && !message.includes(":")) currentGoldorPhase += 1;
}).setCriteria("${message}"));

register("worldUnload", () => currentGoldorPhase = 0);

export function getCurrentGoldorPhase() {
  return currentGoldorPhase;
}