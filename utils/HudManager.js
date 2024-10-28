import { setRegisters } from "./Register";

class HudManager {
    constructor() {
        this.gui = new Gui();
        this.isEditing = false;
        this.selectedHudName = '';
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
    }

    /**
     * Select hud for editing.
     * @param {string} name 
     */
    selectHud = (name) => {
        this.selectedHudName = name;
    }

    /**
     * Release hud selection.
     */
    unselectHud = () => {
        this.selectedHudName = '';
    }
}

export default new HudManager();