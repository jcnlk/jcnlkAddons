import { showDebugMessage, showGeneralJAMessage } from "./ChatUtils";

let currentArea = "";
let retryCount = 0;

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
          const zoneLine = scoreboard.find(
            (line) =>
              line.getName().includes("⏣") || line.getName().includes("ф")
          );
          if (zoneLine) {
            const zone = zoneLine
              .getName()
              .replace("⏣ ", "")
              .replace("ф ", "")
              .removeFormatting()
              .replace(/[^\x00-\x7F]/g, "")
              .trim();
            if (currentArea !== zone) {
              currentArea = zone;
              showDebugMessage(`Current area updated to: ${currentArea}`);
            }
          } else {
            retryCount++;
            if (retryCount < 20) {
              setTimeout(updateCurrentArea, 1000);
            } else {
              showDebugMessage(
                "Failed to get zone from scoreboard after 20 attempts",
                "error"
              );
            }
          }
        }, 1000);
      } else if (areaLine.includes("Area")) {
        const area = areaLine.replace("Area: ", "").removeFormatting();
        if (currentArea !== area) {
          currentArea = area;
          showDebugMessage(`Current area updated to: ${currentArea}`);
        }
      }
    } else {
      if (retryCount < 20) {
        retryCount++;
        setTimeout(updateCurrentArea, 1000);
      } else {
        showDebugMessage("Failed to get current area :(", "error");
      }
    }
  } catch (e) {
    showDebugMessage(`Error in updateCurrentArea: ${e.message}`, "error");
    console.error(e);
  }
};

export const getCurrentArea = () => currentArea;

export const getCurrentZone = () => {
  const scoreboard = Scoreboard.getLines();
  const zoneLine = scoreboard.find(
    (l) => l.getName().includes("⏣") || l.getName().includes("ф")
  );
  if (zoneLine) {
    return zoneLine
      .getName()
      .replace("⏣ ", "")
      .replace("ф ", "")
      .removeFormatting()
      .replace(/[^\x00-\x7F]/g, "")
      .trim();
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

register("command", () => {
  const area = getCurrentArea();
  const zone = getCurrentZone();
  showGeneralJAMessage(`Current Area: ${area}`);
  showGeneralJAMessage(`Current Zone: ${zone}`);
}).setName("getCurrentArea");
