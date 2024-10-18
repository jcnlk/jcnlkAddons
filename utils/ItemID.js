import { showDebugMessage, showGeneralJAMessage } from "./ChatUtils";

/**
 * Get item ID from item instance.
 * @param {Item} item
 * @returns {string} The item ID or 'UNKNOWN_ITEM' if not found
 */
const getItemId = (item) => {
    try {
        if (!item) {
            throw new Error("Item is null or undefined");
        }
        const nbt = item.getNBT();
        if (!nbt) {
            throw new Error("NBT data is null or undefined");
        }
        const extraAttributes = nbt.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes');
        if (!extraAttributes) {
            throw new Error("ExtraAttributes not found in NBT data");
        }
        const itemId = extraAttributes.getString('id');
        if (!itemId) {
            throw new Error("Item ID not found in ExtraAttributes");
        }
        return itemId;
    } catch (e) {
        showDebugMessage(`Error in getItemId: ${e.message}`, 'error');
        return 'UNKNOWN_ITEM';
    }
}

/**
 * Get the ID of the item currently held by the player
 * @returns {string} The ID of the held item or 'UNKNOWN_ITEM' if not found
 */
const getHeldItemId = () => {
    const heldItem = Player.getHeldItem();
    return getItemId(heldItem);
}

// Add a new command for testing
register("command", () => {
    const heldItemId = getHeldItemId();
    showGeneralJAMessage(`Held Item ID: ${heldItemId}`);
    showDebugMessage(`getItemId command executed. Held Item ID: ${heldItemId}`);
}).setName("getItemId");

export { getItemId, getHeldItemId };