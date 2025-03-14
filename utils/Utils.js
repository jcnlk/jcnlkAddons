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

// Alternative to World.playSound()
export function playSound(soundName, volume, pitch) {
  try {
      new net.minecraft.network.play.server.S29PacketSoundEffect(soundName, Player.getX(), Player.getY(), Player.getZ(), volume, pitch).func_148833_a(Client.getConnection());
  } catch (e) { }
}

// Registering and unregistering of triggers
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

register("gameLoad", () => setRegisters()); // idk if i need this one but whatever

register("guiClosed", (gui) => {
  if (gui instanceof SettingsGui) setRegisters();
});

// New title function
let currentTitleOverlay = null;

export function showTitleV2(title, duration, x = 0.5, y = -20, scale = 4, callback = null, subtitle = null, subtitleScale = 2, titleXOffset = 0, titleYOffset = 4) {
  if (currentTitleOverlay) {
    currentTitleOverlay.unregister();
    currentTitleOverlay = null;
  }
 
  const screenWidth = Renderer.screen.getWidth();
  const screenHeight = Renderer.screen.getHeight();
 
  let xPos, yPos;
 
  if (x >= 0 && x <= 1) {
    xPos = screenWidth * x;
  } else {
    xPos = screenWidth * 0.5 + x;
  }
 
  if (y >= 0 && y <= 1) {
    yPos = screenHeight * y;
  } else {
    yPos = screenHeight * 0.5 + y;
  }
 
  const titleLines = Array.isArray(title) ? title : [title];
  const subtitleLines = subtitle ? (Array.isArray(subtitle) ? subtitle : [subtitle]) : [];
  const hasSubtitle = subtitleLines.length > 0;
 
  const overlay = register("renderOverlay", () => {
    const lineHeight = 10;
    const titleTotalHeight = titleLines.length * lineHeight;
    
    GL11.glPushMatrix();
    Renderer.translate(xPos + titleXOffset, yPos);
    Renderer.scale(scale, scale);
    
    for (let i = 0; i < titleLines.length; i++) {
      const width = Renderer.getStringWidth(titleLines[i]);
      const lineY = -titleTotalHeight / 2 + (i * lineHeight);
      Renderer.drawStringWithShadow(titleLines[i], -width / 2, lineY);
    }
    
    GL11.glPopMatrix();
    
    if (hasSubtitle) {
      const subtitleTotalHeight = subtitleLines.length * lineHeight;
      
      GL11.glPushMatrix();
      const subtitleYPos = yPos + (titleTotalHeight * scale / 2) + titleYOffset;
      Renderer.translate(xPos, subtitleYPos);
      Renderer.scale(subtitleScale, subtitleScale);
      
      for (let i = 0; i < subtitleLines.length; i++) {
        const width = Renderer.getStringWidth(subtitleLines[i]);
        const lineY = -subtitleTotalHeight / 2 + (i * lineHeight);
        Renderer.drawStringWithShadow(subtitleLines[i], -width / 2, lineY);
      }
      
      GL11.glPopMatrix();
    }
  });
 
  currentTitleOverlay = overlay;
 
  if (callback && typeof callback === "function") {
    callback(overlay);
  }
 
  setTimeout(() => {
    if (currentTitleOverlay === overlay) {
      overlay.unregister();
      currentTitleOverlay = null;
    }
  }, duration);
 
  return overlay;
}

// Checks if a entity is in a specific area
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

// Skyblock location stuff
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