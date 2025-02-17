import { getCurrentArea } from "./Area";

const BossStatus = Java.type("net.minecraft.entity.boss.BossStatus");

export function getCurrentClass() {
  const names = TabList?.getNames();
  if (!names) return;
  const index = names.findIndex((line) => line?.includes(Player.getName()));
  if (index === -1) return;
  const match = names[index].removeFormatting().match(/.+ \((.+) .+\)/);
  if (!match) return "EMPTY";
  return match[1];
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
  return bossName.removeFormatting().includes("Maxor");
}

export function getIsInStorm() {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  return bossName.removeFormatting().includes("Storm");
}

export function getIsInGoldor() {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  return bossName.removeFormatting().includes("Goldor");
}

export function getIsInNecron() {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  return bossName.removeFormatting().includes("Necron");
}

export function getIsInWitherKing() {
  const bossName = BossStatus.field_82827_c;
  if (!bossName) return false;
  return bossName.removeFormatting().includes("Wither King");
}

export function getBossHealthPercent() {
  return BossStatus.field_82828_a;
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
