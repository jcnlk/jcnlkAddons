// Basic Stuff
export const PREFIX = `&8[&6JA&8]`;
export const moduleVersion = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).version;
export const moduleAuthor = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).author;

// Chat Message Stuff
const messageColors = { info: `&e`, success: `&a`, error: `&c`, warning: `&6` };

function makeChatMessage(message, status = "info", isDebug = false) {
  const prefix = isDebug ? DEBUG_PREFIX : PREFIX;
  const color = messageColors[status] || messageColors.info;

  ChatLib.chat(`${prefix} ${color}${message}`);
}

export const showChatMessage = (message, status = "info") => makeChatMessage(message, status, false);

// Alternative to World.playSound()
export const playSound = (soundName, volume, pitch) => new net.minecraft.network.play.server.S29PacketSoundEffect(soundName, Player.getX(), Player.getY(), Player.getZ(), volume, pitch).func_148833_a(Client.getConnection());

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