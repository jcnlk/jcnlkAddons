import { showDebugMessage, showGeneralJAMessage } from "./ChatUtils";
import { getItemId } from "./ItemID";

/**
 * Format enchantment name to be more readable
 * @param {string} name
 */
const formatEnchantmentName = (name) => {
    name = name.toLowerCase();

    // Don't remove "ultimate_" from "ultimate wise" and "ultimate jerry"
    if (name === 'ultimate_wise' || name === 'ultimate_jerry') {
        return name.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Remove "ultimate_"
    name = name.replace(/^ultimate_/, '');

    return name.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Get enchant of the enchanted book.
 * @param {Item} ebook
 */
export const getEnchantBookDetail = (ebook) => {
    try {
        if (!ebook) {
            throw new Error("Item is null or undefined");
        }
        
        const itemId = getItemId(ebook);
        if (itemId !== "ENCHANTED_BOOK") {
            throw new Error("This item is not an Enchanted Book");
        }

        const nbt = ebook.getNBT();
        if (!nbt) {
            throw new Error("NBT data is null or undefined");
        }
        const extraAttributes = nbt.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes');
        if (!extraAttributes) {
            throw new Error("ExtraAttributes not found in NBT data");
        }
        const enchantments = extraAttributes.getCompoundTag('enchantments');
        if (!enchantments) {
            throw new Error("No enchantments found on this item");
        }
        
        const enchantmentsObj = enchantments.toObject();
        const enchantName = Object.keys(enchantmentsObj)[0];
        const enchantLevel = enchantmentsObj[enchantName];
        
        if (!enchantName || enchantLevel === undefined) {
            throw new Error("Could not find enchantment details");
        }
        
        return {
            name: formatEnchantmentName(enchantName),
            level: enchantLevel
        };
    } catch (e) {
        showDebugMessage(`Error in getEnchantBookDetail: ${e.message}`, 'error');
        return null;
    }
}

// Add command for getting enchanted book details
register("command", () => {
    const heldItem = Player.getHeldItem();
    if (!heldItem) {
        showGeneralJAMessage("You must be holding an enchanted book!");
        return;
    }
    const enchantDetails = getEnchantBookDetail(heldItem);
    if (enchantDetails) {
        showGeneralJAMessage(`Enchantment: ${enchantDetails.name} ${enchantDetails.level}`);
        showDebugMessage(`Raw enchantment name: ${Object.keys(heldItem.getNBT().getCompoundTag('tag').getCompoundTag('ExtraAttributes').getCompoundTag('enchantments').toObject())[0]}`);
    } else {
        showGeneralJAMessage("This item doesn't appear to be an enchanted book.");
    }
    showDebugMessage(`getEnchantedBookDetail command executed.`);
}).setName("getEnchantedBookDetail");