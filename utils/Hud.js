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
     */
    constructor(name, defaultText, hudManager, data, isCustom = false, background = false, color = null) {
        this.name = name;
        this.defaultText = defaultText;
        this.hudManager = hudManager;
        this.saveData = () => {
            data.save();
        }
        if (isCustom) {
            this.data = data.data.filter(d => d.name === name)[0];
        } else {
            this.data = data[name];
        }
        this.background = background;
        this.color = color;
        this.currentText = new Text(defaultText).setShadow(true);
        this.editBox = new Rectangle(0x9696964d, 0, 0, 0, 0);
        this.dragTrigger = register('dragged', (dx, dy) => {
            if (!this.hudManager.isEditing) return;
            if (hudManager.selectedHudName === this.name) {
                const [current_x, current_y] = this.getCoords();
                this.setCoords(current_x + dx, current_y + dy);
            }
        });
        this.scrollTrigger = register('scrolled', (x, y, d) => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const width = this.currentText.getWidth();
            const height = this.currentText.getHeight();
            if (x >= current_x - 3 && x <= current_x + width + 3 && y >= current_y - 3 && y <= current_y + height + 3) {
                const scale = this.getScale();
                if (d === 1 && scale < 10)
                    this.setScale(scale + 0.1);
                else if (scale > 0.5)
                    this.setScale(scale - 0.1);
            }
        });
        this.renderOverlayTrigger = register('renderOverlay', () => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const scale = this.getScale();
            const width = this.currentText.getWidth();
            const height = this.currentText.getHeight();
            this.editBox.setX(current_x - 3).setY(current_y - 3).setWidth(width + 3).setHeight(height + 3).draw();
            this.currentText.setX(current_x).setY(current_y).setScale(scale).draw();
        });
        this.clickTrigger = register('clicked', (x, y, b, isDown) => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const width = this.currentText.getWidth();
            const height = this.currentText.getHeight();
            if (x >= current_x - 3 && x <= current_x + width + 3 && y >= current_y - 3 && y <= current_y + height + 3) {
                if (isDown && hudManager.selectedHudName === '') {
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
    }

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
    }

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
        // this.data.save();
        this.saveData();
        return;
    }

    /**
     * Set hud scale.
     * @returns {number} scale
     */
    getScale = () => {
        const scale = this.data.scale;
        return scale;
    }

    /**
     * Get hud scale.
     * @param {number} scale 
     * @returns 
     */
    setScale = (scale) => {
        this.data.scale = scale;
        // this.data.save();
        this.saveData();
        return;
    }

    /**
     * Set text. (mainly for custom hud)
     * @param {string} text 
     */
    setText = (text) => {
        this.currentText.setString(text);
    }

    /**
     * Draw hud.
     * @param {string} text 
     * @param {boolean} skyblockOnly
     */
    draw = (text, skyblockOnly = true) => {
        if (!this.hudManager.isEditing) {
            if (skyblockOnly) {
                if (Server.getIP().includes('hypixel') && ChatLib.removeFormatting(Scoreboard.getTitle()).includes('SKYBLOCK')) {
                    GlStateManager.func_179147_l();
                    const [x, y] = this.getCoords();
                    const scale = this.getScale();
                    if (this.background) {
                        Renderer.drawRect(
                            this.color,
                            x - 3,
                            y - 3,
                            this.currentText.getWidth() + 3,
                            this.currentText.getHeight() + 3
                        );
                    }
                    this.currentText.setString(text).setX(x).setY(y).setScale(scale).draw();
                    GlStateManager.func_179084_k();
                }
            } else {
                GlStateManager.func_179147_l();
                const [x, y] = this.getCoords();
                const scale = this.getScale();
                if (this.background) {
                    Renderer.drawRect(
                        this.color,
                        x - 3,
                        y - 3,
                        this.currentText.getWidth() + 3,
                        this.currentText.getHeight() + 3
                    );
                }
                this.currentText.setString(text).setX(x).setY(y).setScale(scale).draw();
                GlStateManager.func_179084_k();
            }
        }
    }
}
