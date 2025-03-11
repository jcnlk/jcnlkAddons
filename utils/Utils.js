// Basic Stuff
export const PREFIX = `&8[&6JA&8]`;
export const moduleVersion = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).version;
export const moduleAuthor = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).author;

// Chat Message Stuff
const messageColors = {
  info: `&e`,
  success: `&a`,
  error: `&c`,
  warning: `&6`,
};

function makeChatMessage(message, status = "info", isDebug = false) {
  const prefix = isDebug ? DEBUG_PREFIX : PREFIX;
  const color = messageColors[status] || messageColors.info;

  ChatLib.chat(`${prefix} ${color}${message}`);
}

export function showChatMessage(message, status = "info") {
    makeChatMessage(message, status, false);
}

// Checks if current server is hypixel
export const isInSkyblock = () => {
  if (Server.getIP().includes("hypixel") && ChatLib.removeFormatting(Scoreboard.getTitle()).includes("SKYBLOCK"))
      return true;
  return false;
}

export function playSound(soundName, volume, pitch) {
  try {
      new net.minecraft.network.play.server.S29PacketSoundEffect(soundName, Player.getX(), Player.getY(), Player.getZ(), volume, pitch).func_148833_a(Client.getConnection()) // Idk why I couldn't get World.playSound() to work but whatever
  } catch (e) { }
}

const SettingsGui = Java.type("gg.essential.vigilance.gui.SettingsGui");
const registers = [];

export const registerWhen = (trigger, dependency) => {
  registers.push({
    controller: trigger.unregister(),
    dependency,
    registered: false,
  });
};

export const setRegisters = () => {
  registers.forEach((item) => {
    const shouldBeRegistered = item.dependency();
    if (shouldBeRegistered && !item.registered) {
      item.controller.register();
      item.registered = true;
    } else if (!shouldBeRegistered && item.registered) {
      item.controller.unregister();
      item.registered = false;
    }
  });
};

register("guiClosed", (gui) => {
  if (gui instanceof SettingsGui) setRegisters();
});

register("gameLoad", () => setRegisters());

/**
 * Full credit to AsuAddons: https://www.chattriggers.com/modules/v/AsuAddons
 * 
 * Draws a title on the screen cuz I don't trust the vanilla one
 * @param {String} text The title that is displayed (supports formatting)
 * @param {Number} duration The duration how long it is displayed in ms
 * @param {Boolean} shadow Add shadow to the text
 * @param {String} subtitle The subtitle that is displayed (supports formatting)
 */
let titles = []

export function showTitle(title, duration, shadow = false, subtitle = "") {
    if (titles.length > 0) {
        for (let i = 0; i < titles.length; i++) {
            if (titles[i] != undefined) titles[i].unregister()
            titles.splice(i,1)
        }
    }
    let overlay = register("renderOverlay", () => {
        Renderer.translate(Renderer.screen.getWidth()/2, Renderer.screen.getHeight()/2)
        Renderer.scale(4,4)
        Renderer.drawString(title, -Renderer.getStringWidth(title)/2,-10,shadow)

        if (subtitle != "") {
            Renderer.translate(Renderer.screen.getWidth()/2, Renderer.screen.getHeight()/2)
            Renderer.scale(2,2)
            Renderer.drawString(subtitle, -Renderer.getStringWidth(subtitle)/2,-3,shadow)
        }
    })
    titles.push(overlay)
    setTimeout(() => {
        if (overlay != undefined) overlay.unregister()
        titles.splice(titles.indexOf(overlay),1)
    },duration)
}

export function isPlayerInArea(x1, x2, y1, y2, z1, z2, entity = Player) {
  const x = entity.getX();
  const y = entity.getY();
  const z = entity.getZ();
  return (
    x >= Math.min(x1, x2) &&
    x <= Math.max(x1, x2) &&
    y >= Math.min(y1, y2) &&
    y <= Math.max(y1, y2) &&
    z >= Math.min(z1, z2) &&
    z <= Math.max(z1, z2)
  );
}

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

const getZoneFromScoreboard = () => {
  const scoreboard = Scoreboard.getLines();
  const zoneLine = scoreboard.find((line) =>
    line.getName().includes("⏣") || line.getName().includes("ф")
  );
  return zoneLine ? extractZone(zoneLine.getName()) : "";
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
          const zone = getZoneFromScoreboard();
          if (zone) {
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
      } else if (areaLine.includes("Area")) {
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

export const getCurrentZone = getZoneFromScoreboard;

register("worldLoad", () => {
  retryCount = 0;
  updateCurrentArea();
});

register("worldUnload", () => {
  retryCount = 0;
  currentArea = "";
});