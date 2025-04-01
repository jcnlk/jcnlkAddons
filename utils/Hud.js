/**
 * Full Creadit to TakeshiClient: https://www.chattriggers.com/modules/v/TakeshiClient
 */

////////// HUD MANAGER //////////
import { setRegisters } from "./Utils";

class HudManager {
  constructor() {
    this.gui = new Gui();
    this.isEditing = false;
    this.selectedHudName = "";
    this.gui.registerClosed(() => {
      this.isEditing = false;
      setRegisters();
    });
  }

  /**
   * Open hud edit gui.
   */
  openGui = () => {
    this.gui.open();
    this.isEditing = true;
  };

  /**
   * Select hud for editing.
   * @param {string} name
   */
  selectHud = (name) => {
    this.selectedHudName = name;
  };

  /**
   * Release hud selection.
   */
  unselectHud = () => {
    this.selectedHudName = "";
  };
}
export default new HudManager();

////////// HUD //////////
export class Hud {
  /**
   * Class for text hud.
   * @param {string} name
   * @param {string} defaultText
   * @param {HudManager} hudManager
   * @param {any} data
   * @param {boolean} [isCustom=false]
   * @param {boolean} [background=false]
   * @param {any} [color=null]
   * @param {string} [hAlign="center"] - Horizontal alignment: "left", "center", or "right"
   * @param {string} [vAlign="center"] - Vertical alignment: "top", "center", or "bottom"
   */
  constructor(name, defaultText, hudManager, data, isCustom = false, background = false, color = null, hAlign = "center", vAlign = "center") {
    this.name = name;
    this.defaultText = defaultText;
    this.hudManager = hudManager;
    this.saveData = () => {
      data.save();
    };
    if (isCustom) {
      this.data = data.data.filter((d) => d.name === name)[0];
    } else {
      this.data = data[name];
    }
    this.background = background;
    this.color = color;
    this.hAlign = hAlign;
    this.vAlign = vAlign;
    this.currentText = new Text(defaultText).setShadow(true);
    this.editBox = new Rectangle(0x9696964d, 0, 0, 0, 0);
    this.dragTrigger = register("dragged", (dx, dy) => {
      if (!this.hudManager.isEditing) return;
      if (hudManager.selectedHudName === this.name) {
        const [current_x, current_y] = this.getCoords();
        this.setCoords(current_x + dx, current_y + dy);
      }
    });
    this.scrollTrigger = register("scrolled", (x, y, d) => {
      if (!this.hudManager.isEditing) return;
      const [current_x, current_y] = this.getCoords();
      const width = this.currentText.getWidth();
      const height = this.currentText.getHeight();
      
      const [adjustedX, adjustedY] = this.getAdjustedPosition(current_x, current_y, width, height);
      
      if (x >= adjustedX - 3 && x <= adjustedX + width + 3 && y >= adjustedY - 3 && y <= adjustedY + height + 3) {
        const scale = this.getScale();
        if (d === 1 && scale < 10) this.setScale(scale + 0.1);
        else if (scale > 0.5) this.setScale(scale - 0.1);
      }
    });
    this.renderOverlayTrigger = register("renderOverlay", () => {
      if (!this.hudManager.isEditing) return;
      const [current_x, current_y] = this.getCoords();
      const scale = this.getScale();
      
      this.currentText.setScale(scale);
      const width = this.currentText.getWidth();
      const height = this.currentText.getHeight();
      
      const [adjustedX, adjustedY] = this.getAdjustedPosition(current_x, current_y, width, height);
      
      this.editBox.setX(adjustedX - 3).setY(adjustedY - 3).setWidth(width + 6).setHeight(height + 6).draw();
      this.currentText.setX(adjustedX).setY(adjustedY).draw();
    });
    this.clickTrigger = register("clicked", (x, y, b, isDown) => {
      if (!this.hudManager.isEditing) return;
      const [current_x, current_y] = this.getCoords();
      
      const width = this.currentText.getWidth();
      const height = this.currentText.getHeight();
      
      const [adjustedX, adjustedY] = this.getAdjustedPosition(current_x, current_y, width, height);
      
      if (x >= adjustedX - 3 && x <= adjustedX + width + 3 && y >= adjustedY - 3 && y <= adjustedY + height + 3) {
        if (isDown && hudManager.selectedHudName === "") {
          hudManager.selectHud(this.name);
        } else {
          hudManager.unselectHud();
        }
      }
      if (!isDown) {
        hudManager.unselectHud();
      }
    });
  }

  /**
   * Adjusts the drawing position based on alignment settings
   * @param {number} x - Original X coordinate
   * @param {number} y - Original Y coordinate
   * @param {number} width - Content width
   * @param {number} height - Content height
   * @returns {Array} [adjustedX, adjustedY]
   */
  getAdjustedPosition = (x, y, width, height) => {
    let adjustedX = x;
    let adjustedY = y;
    
    if (this.hAlign === "center") {
      adjustedX = x - (width / 2);
    } else if (this.hAlign === "right") {
      adjustedX = x - width;
    }
    
    if (this.vAlign === "center") {
      adjustedY = y - (height / 2);
    } else if (this.vAlign === "bottom") {
      adjustedY = y - height;
    }
    
    return [adjustedX, adjustedY];
  };

  /**
   * Remove this hud.
   */
  remove = () => {
    this.dragTrigger.unregister();
    this.scrollTrigger.unregister();
    this.renderOverlayTrigger.unregister();
    this.clickTrigger.unregister();
    this.name = null;
    this.defaultText = null;
    this.hudManager = null;
    this.saveData = null;
    this.currentText = null;
    this.editBox = null;
  };

  /**
   * Get hud coords.
   * @returns
   */
  getCoords = () => {
    const x = this.data.x;
    const y = this.data.y;
    const width = Renderer.screen.getWidth();
    const height = Renderer.screen.getHeight();
    return [width * x, height * y];
  };

  /**
   * Set hud coords.
   * @param {number} x
   * @param {number} y
   * @returns
   */
  setCoords = (x, y) => {
    const width = Renderer.screen.getWidth();
    const height = Renderer.screen.getHeight();
    this.data.x = x / width;
    this.data.y = y / height;
    this.saveData();
    return;
  };

  /**
   * Set hud scale.
   * @returns {number} scale
   */
  getScale = () => {
    const scale = this.data.scale;
    return scale;
  };

  /**
   * Get hud scale.
   * @param {number} scale
   * @returns
   */
  setScale = (scale) => {
    this.data.scale = scale;
    this.saveData();
    return;
  };

  /**
   * Set text. (mainly for custom hud)
   * @param {string} text
   */
  setText = (text) => {
    this.currentText.setString(text);
  };

  /**
   * Draw hud.
   * @param {string} text
   */
  draw = (text) => {
    if (!this.hudManager.isEditing) {
      GlStateManager.func_179147_l();
      const [x, y] = this.getCoords();
      const scale = this.getScale();
      
      this.currentText.setString(text).setScale(scale);
      const width = this.currentText.getWidth();
      const height = this.currentText.getHeight();
      
      const [drawX, drawY] = this.getAdjustedPosition(x, y, width, height);
      
      if (this.background) {
        Renderer.drawRect(
          this.color,
          drawX - 3,
          drawY - 3,
          width + 6,
          height + 6
        );
      }
      
      this.currentText.setX(drawX).setY(drawY).draw();
      GlStateManager.func_179084_k();
    }
  };
}