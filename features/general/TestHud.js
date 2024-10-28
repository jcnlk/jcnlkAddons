import { Hud } from "../../utils/Hud";
import HudManager from "../../utils/HudManager";
import { registerWhen } from "../../utils/Register";
import Config from "../../config";
import { showDebugMessage } from "../../utils/ChatUtils";
import { HudData } from "../../utils/Data"

// Initialize the HUD
let testHud = new Hud('testHud', 'Test HUD Active', HudManager, HudData);

// Register the render event
registerWhen(
    register("renderOverlay", () => {
        testHud.draw("Test HUD Active", false);  // false means it will show everywhere, not just in Skyblock
    }),
    () => true,  // Always enabled for testing
    { type: 'renderOverlay', name: 'Test HUD' }
);

// Export the HUD instance for future use
export { testHud };