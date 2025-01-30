import Config from "../config";
import { AQUA } from "./Constants";

/**
 * Renders attribute abbreviations on an item
 * @param {Object} item - The item to render abbreviations on
 * @param {number} x - The x coordinate of the item
 * @param {number} y - The y coordinate of the item
 */
function renderAttributeAbbreviations(item, x, y) {
    if (!Config.enableAttributeAbbreviations) return;

    const attributes = item
        ?.getNBT()
        ?.getCompoundTag("tag")
        ?.getCompoundTag("ExtraAttributes")
        ?.getCompoundTag("attributes");
    
    if (!attributes || attributes.hasNoTags()) return;

    let overlay = "";
    attributes.getKeySet().forEach((key) => {
        const words = key.split("_");
        let abbreviation = "";
        for (let i = 0; i < words.length; i++) {
            abbreviation += words[i][0].toUpperCase();
        }
        overlay += AQUA + abbreviation + "\n";
    });

    Renderer.scale(0.8, 0.8);
    Renderer.translate(0, 0, 275);
    Renderer.drawString(overlay, x * 1.25 + 1, y * 1.25 + 1);
}

/**
 * Event handler for rendering items in GUI
 */
register("renderItemIntoGui", (item, x, y) => {
    renderAttributeAbbreviations(item, x, y);
});