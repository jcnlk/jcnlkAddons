import Config from "../config";
import { showDebugMessage } from "./ChatUtils";

let titles = [];

/**
 * Shows a simple popup message on the screen
 * @param {string} text - The text to display in the popup
 * @param {number} duration - The duration to show the popup (in milliseconds)
 * @param {boolean} shadow - Whether to add a shadow to the text
 * @param {string} subtitle - Optional subtitle to display below the main text
 * @param {string} color - The color of the text (in Minecraft color code format)
 */
function showSimplePopup(text, duration = 3000, shadow = false, subtitle = "", color = "§e") {
    if (Config.debugMode) {
        showDebugMessage(`Showing popup: "${text}" with duration ${duration}ms`, 'info');
    }
    titles.forEach(title => { if (title) title.unregister(); });
    titles = [];

    let overlay = register("renderOverlay", () => {
        Renderer.translate(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2);
        Renderer.scale(4, 4);
        Renderer.drawString(color + text, -Renderer.getStringWidth(color + text) / 2, -10, shadow);
        if (subtitle) {
            Renderer.scale(0.5, 0.5);
            Renderer.drawString(subtitle, -Renderer.getStringWidth(subtitle) / 2, 10, shadow);
        }
    });

    titles.push(overlay);

    setTimeout(() => {
        if (overlay) overlay.unregister();
        titles = titles.filter(title => title !== overlay);
        if (Config.debugMode) {
            showDebugMessage(`Removed popup: "${text}"`, 'info');
        }
    }, duration);
}

export { showSimplePopup };