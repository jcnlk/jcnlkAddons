import { getCurrentArea } from "./Area";
import { showGeneralJAMessage } from "./ChatUtils";
import { convertToTimeString, timeToMS } from "../../BloomCore/utils/Utils";

const BossStatus = Java.type("net.minecraft.entity.boss.BossStatus");


export function getCurrentClass() {
  let index = TabList?.getNames()?.findIndex((line) =>
    line?.includes(Player.getName())
  );
  if (index == -1) return;
  let match = TabList?.getNames()
    [index]?.removeFormatting()
    .match(/.+ \((.+) .+\)/);
  if (!match) return "EMPTY";
  return match[1];
}

export function getCurrentFloor() {
  const area = getCurrentArea();
  const match = area.match(/The Catacombs \((F|M)(\d+)\)/);
  if (match) {
    return {
      type: match[1],
      number: parseInt(match[2]),
    };
  }
  return null;
}

export function getIsInDungeon() {
  return getCurrentArea().includes("The Catacombs");
}

function createFloorFunction(type, number) {
  return function () {
    const floor = getCurrentFloor();
    return floor && floor.type === type && floor.number === number;
  };
}

export const getIsInF1 = createFloorFunction("F", 1);
export const getIsInF2 = createFloorFunction("F", 2);
export const getIsInF3 = createFloorFunction("F", 3);
export const getIsInF4 = createFloorFunction("F", 4);
export const getIsInF5 = createFloorFunction("F", 5);
export const getIsInF6 = createFloorFunction("F", 6);
export const getIsInF7 = createFloorFunction("F", 7);

export const getIsInM1 = createFloorFunction("M", 1);
export const getIsInM2 = createFloorFunction("M", 2);
export const getIsInM3 = createFloorFunction("M", 3);
export const getIsInM4 = createFloorFunction("M", 4);
export const getIsInM5 = createFloorFunction("M", 5);
export const getIsInM6 = createFloorFunction("M", 6);
export const getIsInM7 = createFloorFunction("M", 7);

export function getIsInMaxor() {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  else if (bossName.removeFormatting().includes("Maxor")) return true;
  else return false;
}

export function getIsInStorm() {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  else if (bossName.removeFormatting().includes("Storm")) return true;
  else return false;
}

export function getIsInGoldor() {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  else if (bossName.removeFormatting().includes("Goldor")) return true;
  else return false;
}

export function getIsInNecron() {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  else if (bossName.removeFormatting().includes("Necron")) return true;
  else return false;
}

export function getIsInWitherKing() {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  else if (bossName.removeFormatting().includes("Wither King")) return true;
  else return false;
}

export function getBossHealthPercent() {
  return BossStatus.field_82828_a;
}

export function getCrypts() {
  try {
    const tabList = TabList.getNames();
    if (!tabList) {
      return 0;
    }
    for (let line of tabList) {
      line = ChatLib.removeFormatting(line);
      if (line.includes("Crypts: ")) {
        const count = parseInt(line.split("Crypts: ")[1]);
        return isNaN(count) ? 0 : count;
      }
    }
  } catch (error) {}
  return 0;
}

export function getPuzzleCount() {
  const tabList = TabList.getNames();
  if (!tabList) return 0;
  for (let line of tabList) {
    line = ChatLib.removeFormatting(line);
    if (line.includes("Puzzles: (")) {
      const number = parseInt(line.split("Puzzles: (")[1]);
      return isNaN(number) ? 0 : number;
    }
  }
}

export function getDungeonTime() {
  try {
    const tabList = TabList.getNames();
    if (!tabList || tabList.length < 46) {
      return null;
    }

    const timeLine = ChatLib.removeFormatting(tabList[45]).trim();

    if (!timeLine.startsWith("Time: ")) {
      return null;
    }

    const timeMatch = timeLine.match(/Time: (?:(\d+)m )?(\d+)s/);

    if (timeMatch) {
      const minutes = timeMatch[1] ? parseInt(timeMatch[1]) : 0;
      const seconds = parseInt(timeMatch[2]);
      return minutes * 60 + seconds;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

register("command", function () {
  const floor = getCurrentFloor();
  const currentClass = getCurrentClass();
  showGeneralJAMessage(
    "Current Floor: " + (floor ? floor.type + floor.number : "Not in dungeon")
  );
  const getDungeonTimeInMs = timeToMS(getDungeonTime() + "s");
  showGeneralJAMessage("Current Dungeon Time: " + (convertToTimeString(getDungeonTimeInMs) || "Not in Dungeon"));
  showGeneralJAMessage("Current Class: " + (currentClass || "Unknown"));
  showGeneralJAMessage("Crypt Count: " + getCrypts());
  showGeneralJAMessage("In Dungeon: " + getIsInDungeon());
  showGeneralJAMessage("Boss Health: " + getBossHealthPercent() * 100 + "%");
  showGeneralJAMessage(`InMaxor: ` + getIsInMaxor());
  showGeneralJAMessage(`InStorm: ` + getIsInStorm());
  showGeneralJAMessage(`InGoldor: ` + getIsInGoldor());
  showGeneralJAMessage(`InNecron: ` + getIsInNecron());
  showGeneralJAMessage(`InWitherKing: ` + getIsInWitherKing());
}).setName("getDungeonInfo");
