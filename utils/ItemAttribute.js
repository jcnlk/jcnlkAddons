import { showDebugMessage, showGeneralJAMessage } from "./ChatUtils";

/**
 * Get attributes of an item
 * @param {Item} item - The item to get attributes from
 * @returns {Object|null} - An object containing the item's attributes or null if no attributes found
 */
function getItemAttributes(item) {
    if (!item) {
        showDebugMessage("No item provided to getItemAttributes", 'error');
        return null;
    }

    const nbt = item.getNBT();
    if (!nbt) {
        showDebugMessage("No NBT data found for item", 'warning');
        return null;
    }

    const extraAttributes = nbt.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes');
    if (!extraAttributes) {
        showDebugMessage("No ExtraAttributes found in item NBT", 'warning');
        return null;
    }

    const attributes = extraAttributes.getCompoundTag('attributes');
    if (!attributes || attributes.hasNoTags()) {
        showDebugMessage("No attributes found for item", 'info');
        return null;
    }

    const attributesObj = {};
    attributes.getKeySet().forEach(key => {
        attributesObj[key] = attributes.getInteger(key);
    });

    return attributesObj;
}

/**
 * Format attribute name
 * @param {string} attributeName - The attribute name to format
 * @returns {string} - The formatted attribute name
 */
function formatAttributeName(attributeName) {
    if (attributeName === "mending") {
        return "Vitality";
    }
    return attributeName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Register the command directly
register("command", () => {
    const heldItem = Player.getHeldItem();
    if (!heldItem) {
        showGeneralJAMessage("You must be holding an item to use this command!");
        return;
    }

    const attributes = getItemAttributes(heldItem);
    if (!attributes) {
        showGeneralJAMessage("No attributes found on this item.");
        return;
    }

    const formattedAttributes = Object.entries(attributes)
        .map(([key, value]) => `${formatAttributeName(key)} ${value}`)
        .join(", ");

    showGeneralJAMessage(`Item Attributes: ${formattedAttributes}`);
}).setName("getitemattributes");
