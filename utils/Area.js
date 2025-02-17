const MAX_RETRIES = 20;
let currentArea = "";
let retryCount = 0;

const extractZone = (zoneStr) => {
  return zoneStr
    .replace("⏣ ", "")
    .replace("ф ", "")
    .removeFormatting()
    .replace(/[^\x00-\x7F]/g, "")
    .trim();
};

export const updateCurrentArea = () => {
  try {
    const tabList = TabList.getNames();
    if (!tabList) {
      throw new Error("TabList is null");
    }

    const areaLine = tabList.find(
      (name) => name.includes("Area") || name.includes("Dungeon: ")
    );

    if (areaLine) {
      if (areaLine.includes("Dungeon: ") || areaLine.includes("Kuudra")) {
        setTimeout(() => {
          const scoreboard = Scoreboard.getLines();
          const zoneLine = scoreboard.find((line) =>
            line.getName().includes("⏣") || line.getName().includes("ф")
          );
          if (zoneLine) {
            const zone = extractZone(zoneLine.getName());
            if (currentArea !== zone) {
              currentArea = zone;
              retryCount = 0;
            }
          } else {
            retryCount++;
            if (retryCount < MAX_RETRIES) {
              setTimeout(updateCurrentArea, 1000);
            }
          }
        }, 1000);
      }
      else if (areaLine.includes("Area")) {
        const area = areaLine.replace("Area: ", "").removeFormatting().trim();
        if (currentArea !== area) {
          currentArea = area;
          retryCount = 0;
        }
      }
    } else {
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        setTimeout(updateCurrentArea, 1000);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const getCurrentArea = () => currentArea;

export const getCurrentZone = () => {
  const scoreboard = Scoreboard.getLines();
  const zoneLine = scoreboard.find((line) =>
    line.getName().includes("⏣") || line.getName().includes("ф")
  );
  if (zoneLine) {
    return extractZone(zoneLine.getName());
  }
  return "";
};

register("worldLoad", () => {
  retryCount = 0;
  updateCurrentArea();
});

register("worldUnload", () => {
  retryCount = 0;
  currentArea = "";
});

export function isPlayerInArea(x1, x2, y1, y2, z1, z2) {
  const x = Player.getX();
  const y = Player.getY();
  const z = Player.getZ();

  return (
    x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
    y >= Math.min(y1, y2) && y <= Math.max(y1, y2) &&
    z >= Math.min(z1, z2) && z <= Math.max(z1, z2)
  );
}