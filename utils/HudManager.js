import { setRegisters } from "./Register";
import { showDebugMessage } from "./ChatUtils";

class HudManager {
    constructor() {
        this.gui = new Gui();
        this.isEditing = false;
        this.selectedHudName = '';
        this.gui.registerClosed(() => {
            this.isEditing = false;
            setRegisters();
            showDebugMessage("HUD edit mode closed");
        });
    }

    /**
     * Open hud edit gui.
     */
    openGui = () => {
        this.gui.open();
        this.isEditing = true;
        showDebugMessage("HUD edit mode opened");
    }

    /**
     * Select hud for editing.
     * @param {string} name 
     */
    selectHud = (name) => {
        this.selectedHudName = name;
        showDebugMessage(`Selected HUD: ${name}`);
    }

    /**
     * Release hud selection.
     */
    unselectHud = () => {
        this.selectedHudName = '';
        showDebugMessage("HUD selection released");
    }
}

export default new HudManager();