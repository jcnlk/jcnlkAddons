import { showGeneralJAMessage, showDebugMessage } from "./ChatUtils"

/**
 * Used to find the index of a certain item
 * @param {string} name
 * @returns {number}
 */
export function GetIndexOf(name) {
    return Player.getInventory().getItems().findIndex(a => a?.getName()?.removeFormatting()?.includes(name))
}

/**
 * Used to get the stack size of a certain item
 * @param {string} name
 * @returns {number}
 */
export function GetStackSizeOf(name) {
    return Player.getInventory().getItems().find(a => a?.getName()?.removeFormatting() == name)?.getStackSize() ?? 0
}

/**
 * Used to check if the held item is a certain name
 * @param {string} name
 * @return {boolean}
 */
 export function HeldItemCheck(name) {
    return Player.getHeldItem()?.getName()?.includes(name)
}

/**
 * Used to check if the inventory contains a certain item
 * @param {string} name
 * @return {boolean}
 */
export function InvCheck(name) {
    return Player.getInventory().getItems().find(a => a?.getName()?.includes(name))
}

/**
 * Used to check if the lore of a certain item contains a certain string
 * @param {string} name
 * @param {string} lorestring
 * @return {boolean}
 */
export function IsInLore(name, lorestring) {
    const lore = Player.getInventory().getItems().find(a => a?.getName()?.removeFormatting()?.includes(name))?.getLore()
    lore.forEach(line => {
        if(line.includes(lorestring)) return true
    })
    return false
}

/**
 * Used to check if the helmet is a certain name
 * @param {string} name
 * @return {boolean}
 */
export function helmetCheck(name) {
    return Player.armor.getHelmet()?.getName()?.includes(name)
}

/**
 * Used to check if the chestplate is a certain name
 * @param {string} name
 * @return {boolean}
 */
export function chestCheck(name) {
    return Player.armor.getChestplate()?.getName()?.includes(name)
}

/**
 * Used to check if the leggings are a certain name
 * @param {string} name
 * @return {boolean}
 */
export function legginsCheck(name) {
    return Player.armor.getLeggings()?.getName()?.includes(name)
}   

/**
 * Used to check if the boots are a certain name
 * @param {string} name
 * @return {boolean}
 */
export function bootsCheck(name) {
    return Player.armor.getBoots()?.getName()?.includes(name)
}

/**
 * Get item ID from item instance.
 * @param {Item} item
 * @returns {string} The item ID or 'UNKNOWN_ITEM' if not found
 */
export const getItemId = (item) => {
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
export const getHeldItemId = () => {
    const heldItem = Player.getHeldItem();
    return getItemId(heldItem);
}

/**
 * Get attributes of an item
 * @param {Item} item - The item to get attributes from
 * @returns {Object|null} - An object containing the item's attributes or null if no attributes found
 */
export function getItemAttributes(item) {
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
export function formatAttributeName(attributeName) {
    if (attributeName === "mending") {
        return "Vitality";
    }
    return attributeName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

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

///// Commands /////
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

register("command", () => {
    const heldItemId = getHeldItemId();
    showGeneralJAMessage(`Held Item ID: ${heldItemId}`);
    showDebugMessage(`getItemId command executed. Held Item ID: ${heldItemId}`);
}).setName("getItemId");