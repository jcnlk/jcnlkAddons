import { showDebugMessage } from "./ChatUtils";

let itemsToHighlight = [];

/**
 * Gets the coordinates of a slot in the GUI
 * @param {number} i - The slot index
 * @returns {number[]} - The x and y coordinates of the slot
 */
function getSlotCoords(i) {
    if (i >= Player.getContainer().getSize()) return [0, 0];
    const gui = Client.currentGui.get();
    const slot = gui.field_147002_h ? gui.field_147002_h.func_75139_a(i) : null;
    const x = slot ? slot.field_75223_e + (gui.getGuiLeft ? gui.getGuiLeft() : 0) : 0;
    const y = slot ? slot.field_75221_f + (gui.getGuiTop ? gui.getGuiTop() : 0) : 0;
    return [x, y];
}

/**
 * Renders highlights for items
 */
const renderHighlight = register("guiRender", function() {
    itemsToHighlight.forEach(function(item) {
        const [x, y] = getSlotCoords(item.slot);
        Renderer.translate(0, 0, 100);
        Renderer.drawRect(item.color, x, y, 16, 16);
    });
}).unregister();

/**
 * Clears highlights when GUI is closed
 */
const clearHighlight = register("guiClosed", function() {
    itemsToHighlight = [];
    renderHighlight.unregister();
    clearHighlight.unregister();
}).unregister();

/**
 * Sets the items to highlight
 * @param {Array} items - The items to highlight
 */
function setItemsToHighlight(items) {
    itemsToHighlight = items;
    if (items.length > 0) {
        renderHighlight.register();
        clearHighlight.register();
    } else {
        renderHighlight.unregister();
        clearHighlight.unregister();
    }
}

export {
    setItemsToHighlight
};