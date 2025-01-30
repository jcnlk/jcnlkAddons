import Config from "../config";
import { showDebugMessage, showGeneralJAMessage } from "./ChatUtils";
import { setItemsToHighlight } from "./HighlightSlots";
import {
    getItemId,
    getItemAttributes,
    getEnchantedBookDetail
} from "./Items";

// ============================================================================
// 1) Load Kuudra loot data
// ============================================================================
let kuudraLoot;
try {
    const jsonPath = "./data/KuudraLoot.json";
    const jsonContent = FileLib.read("jcnlkAddons", jsonPath);

    if (!jsonContent) {
        throw new Error(`KuudraLoot.json is empty or not found at path: ${jsonPath}`);
    }

    kuudraLoot = JSON.parse(jsonContent);

    if (!kuudraLoot || typeof kuudraLoot !== "object") {
        throw new Error("Invalid JSON format in KuudraLoot.json");
    }
} catch (error) {
    showDebugMessage(`Error loading KuudraLoot.json: ${error}`, "error");
    // Fallback structure to prevent crashes
    kuudraLoot = {
        godRolls: {},
        goodRolls: {},
        attributes: [],
        attributeAbbreviations: {},
        baseItems: [],
        armorPieces: [],
        moltenPieces: [],
        specialDrops: { red: [], green: [], yellow: [] },
        attributeShards: { yellow: [] },
        enchantedBooks: { green: [], red: [] },
        romanNumerals: {}
    };
}

// ============================================================================
// 2) Helper Functions
// ============================================================================

/**
 * Determines if the given item name is a "special drop" from Kuudra.
 * @param {string} displayName - The unformatted name of the item.
 * @returns {string|null} - "red", "green", or "yellow" if special, otherwise null.
 */
function isSpecialDrop(displayName) {
    for (const [color, items] of Object.entries(kuudraLoot.specialDrops)) {
        if (items.includes(displayName)) {
            return color;
        }
    }
    return null;
}

/**
 * Determines if a given itemId + attributes combo qualifies as a "God Roll."
 * @param {string} itemId - e.g. "crimson_chestplate"
 * @param {Object} attributes - e.g. { Dominance: 5, ManaPool: 4 }
 * @returns {boolean}
 */
function isGodRoll(itemId, attributes) {
    if (!itemId) return false;

    // Example logic: split at underscore => [ "crimson", "chestplate" ]
    const [itemType, piece] = itemId.split("_");
    const godRollsForType = kuudraLoot.godRolls[itemType.charAt(0).toUpperCase() + itemType.slice(1)];
    if (!godRollsForType) return false;

    return godRollsForType.some((roll) => {
        if (!roll.pieces.includes(capitalizeFirst(piece))) return false;
        return roll.attributes.every((attr) => {
            const abbreviation = kuudraLoot.attributeAbbreviations[attr] || attr;
            return Object.keys(attributes).includes(abbreviation);
        });
    });
}

/**
 * Determines if a given itemId + attributes combo qualifies as a "Good Roll."
 * @param {string} itemId
 * @param {Object} attributes
 * @returns {boolean}
 */
function isGoodRoll(itemId, attributes) {
    if (!itemId) return false;

    const [itemType, piece] = itemId.split("_");
    const goodRollsForType = kuudraLoot.goodRolls[itemType.charAt(0).toUpperCase() + itemType.slice(1)];
    if (!goodRollsForType) return false;

    return goodRollsForType.some((roll) => {
        if (!roll.pieces.includes(capitalizeFirst(piece))) return false;
        return roll.attributes.every((attr) => {
            const abbreviation = kuudraLoot.attributeAbbreviations[attr] || attr;
            return Object.keys(attributes).includes(abbreviation);
        });
    });
}

/**
 * Determines if an item is an attribute shard and if so, what color it should be.
 * @param {string} itemId
 * @param {Object} attributes
 * @returns {string|null} - "yellow" or "red" if it's a shard, otherwise null.
 */
function getAttributeShardColor(itemId, attributes) {
    // If itemId doesn't indicate a shard, skip
    if (!itemId.toLowerCase().includes("shard")) return null;

    // If there's exactly one attribute or multiple, check if any appear in "yellow" set
    for (const attr in attributes) {
        if (kuudraLoot.attributeShards.yellow.includes(attr)) {
            return "yellow";
        }
    }
    return "red";
}

/**
 * Returns an RGBA color (Renderer.color) based on the item's properties.
 */
function getItemColor({
    isSpecialDrop,
    attributeShardColor,
    isEnchantedBook,
    isGodRoll,
    isGoodRoll
}) {
    if (isSpecialDrop) {
        switch (isSpecialDrop) {
            case "red":    return Renderer.color(255, 0, 0, 128);
            case "green":  return Renderer.color(0, 255, 0, 128);
            case "yellow": return Renderer.color(255, 255, 0, 128);
        }
    }
    if (attributeShardColor) {
        return attributeShardColor === "yellow"
            ? Renderer.color(255, 255, 0, 128)
            : Renderer.color(255, 0, 0, 128);
    }
    if (isEnchantedBook) {
        return isEnchantedBook === "green"
            ? Renderer.color(0, 255, 0, 128)
            : Renderer.color(255, 0, 0, 128);
    }
    if (isGodRoll)  return Renderer.color(0, 255, 0, 128);
    if (isGoodRoll) return Renderer.color(255, 255, 0, 128);

    // Default: red
    return Renderer.color(255, 0, 0, 128);
}

/**
 * Returns a short chat prefix based on the item’s properties.
 */
function getRollTypePrefix({
    isSpecialDrop,
    attributeShardColor,
    isEnchantedBook,
    isGodRoll,
    isGoodRoll
}) {
    if (isSpecialDrop) {
        switch (isSpecialDrop) {
            case "red":    return "&c-";
            case "green":  return "&a++";
            case "yellow": return "&e+";
        }
    }
    if (attributeShardColor) {
        return attributeShardColor === "yellow" ? "&e+" : "&c-";
    }
    if (isEnchantedBook) {
        return isEnchantedBook === "green" ? "&a++" : "&c-";
    }
    if (isGodRoll)  return "&6++";
    if (isGoodRoll) return "&e+";
    return "&7-";
}

/**
 * Capitalizes the first letter of a string (e.g. "crimson" => "Crimson").
 * @param {string} str
 * @returns {string}
 */
function capitalizeFirst(str) {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// 3) Main scanning function for a single item
// ============================================================================
/**
 * Scans a single item using your new helper functions.
 *
 * @param {Object} item - The in-game item object from ChatTriggers (or similar).
 * @returns {Object|null}
 */
function scanItem(item) {
    if (!item) return null;

    const displayName = ChatLib.removeFormatting(item.getName());
    showDebugMessage(`Scanning item: ${displayName}`);

    // 1) Get a short ID for the item (e.g. "crimson_chestplate", "enchanted_book")
    const itemId = getItemId(item)?.toLowerCase() || "";

    // 2) Check if it's a special drop by display name
    const specialDropColor = isSpecialDrop(displayName);

    // 3) If it’s an enchanted book, see what enchant it has
    const bookDetail = getEnchantedBookDetail(item); 
    // e.g. { enchantName: "Protection", enchantLevel: 5 } or null

    // 4) Fetch item attributes from your helper
    const attributes = getItemAttributes(item) || {};

    // 5) Determine if it's an attribute shard
    const attributeShardColor = getAttributeShardColor(itemId, attributes);

    // 6) Check God Roll / Good Roll
    const isGodRollItem  = isGodRoll(itemId, attributes);
    const isGoodRollItem = !isGodRollItem && isGoodRoll(itemId, attributes);

    // 7) Identify if it’s an enchanted book from your Kuudra config (green or red)
    let isEnchantedBookColor = null;
    // Guard: Only do .startsWith if we actually have a string in bookDetail.enchantName
    if (bookDetail?.enchantName && typeof bookDetail.enchantName === "string") {
        const { enchantName } = bookDetail;
        const { green, red } = kuudraLoot.enchantedBooks;

        // Check if it starts with any from the 'green' list
        if (green.some(e => enchantName.startsWith(e))) {
            isEnchantedBookColor = "green";
        } 
        // Or check if it starts with any from the 'red' list
        else if (red.some(e => enchantName.startsWith(e))) {
            isEnchantedBookColor = "red";
        }
    }

    // 8) Build the scan result
    const scanResult = {
        itemId,
        displayName,
        attributes,
        isSpecialDrop: specialDropColor,
        isGodRoll: isGodRollItem,
        isGoodRoll: isGoodRollItem,
        attributeShardColor,
        isEnchantedBook: isEnchantedBookColor,
        enchantName: bookDetail?.enchantName || null,
        enchantLevel: bookDetail?.enchantLevel || null
    };

    showDebugMessage(`Scan result: ${JSON.stringify(scanResult)}`);
    return scanResult;
}

// ============================================================================
// 4) Scan the contents of a container
// ============================================================================
/**
 * Scans the container for notable Kuudra loot using the above logic.
 *
 * @param {Object} container
 */
function scanContainerContents(container) {
    if (!Config.enableChestScanning) {
        showDebugMessage("Chest scanning is disabled in the config.");
        return;
    }

    if (!isValidChest(container)) {
        showDebugMessage(`Not a valid chest to scan: ${container?.getName()}`);
        return;
    }

    showDebugMessage(`Starting scan of ${container.getName()}...`);
    showDebugMessage(`Container size: ${container.getSize()}`);

    const itemsToHighlight = [];
    const containerSize = container.getSize();
    const playerInventorySize = 36;
    const slotsToScan = containerSize - playerInventorySize;

    for (let slotIndex = 0; slotIndex < slotsToScan; slotIndex++) {
        const item = container.getStackInSlot(slotIndex);
        if (!item) continue;

        const scanResult = scanItem(item);
        if (!scanResult) continue;

        // Decide if we highlight this item
        const { attributes, isSpecialDrop, attributeShardColor, isEnchantedBook } = scanResult;
        const hasAttributes = Object.keys(attributes).length > 0;
        const highlightCandidate = (
            hasAttributes ||
            isSpecialDrop ||
            attributeShardColor ||
            isEnchantedBook
        );

        if (highlightCandidate) {
            itemsToHighlight.push({
                slot: slotIndex,
                color: getItemColor(scanResult),
                ...scanResult
            });
        }
    }

    if (itemsToHighlight.length > 0) {
        if (Config.enableAttributeChatOutput) {
            ChatLib.chat("&6&l========= Kuudra Loot =========");
            for (const itemInfo of itemsToHighlight) {
                const prefix = getRollTypePrefix(itemInfo);
                const cleanName = itemInfo.displayName;
                let line = `${prefix} &f${cleanName}`;

                // If it's an enchanted book, append the enchant info
                if (itemInfo.isEnchantedBook) {
                    const { enchantName, enchantLevel } = itemInfo;
                    if (enchantName) {
                        line += ` &7(${enchantName} ${enchantLevel || ""})`;
                    }
                }

                // If it has attributes, show them
                const attrKeys = Object.keys(itemInfo.attributes);
                if (attrKeys.length > 0) {
                    const attrString = attrKeys
                        .map(attr => `${attr}&f:&b${itemInfo.attributes[attr]}`)
                        .join("&f & &a");
                    line += ` &r&8> &f(&a${attrString}&f)`;
                }

                ChatLib.chat(line);
            }
            ChatLib.chat("&6&l=============================");
        }

        // Highlight items in the GUI
        setItemsToHighlight(itemsToHighlight);
    } else {
        if (Config.enableAttributeChatOutput) {
            showGeneralJAMessage("&cNo notable Kuudra loot found.");
        }
        setItemsToHighlight([]);
    }
}

// ============================================================================
// 5) Validate if container is a chest we want to scan
// ============================================================================
/**
 * Determines if the given container is a valid chest (Kuudra or otherwise).
 *
 * @param {Object} container
 * @returns {boolean}
 */
function isValidChest(container) {
    if (!container) return false;

    const name = container.getName().toLowerCase();
    if (name.includes("inventory") || name.includes("ender chest")) {
        return false;
    }
    return name.includes("paid chest");
}

// ============================================================================
// 6) Event handler for when a GUI is opened
// ============================================================================
let isProcessingGuiOpen = false;

register("guiOpened", (event) => {
    if (!Config.enableChestScanning || isProcessingGuiOpen) return;

    isProcessingGuiOpen = true;
    setTimeout(() => {
        const screen = Client.currentGui.get();
        if (screen && screen.toString().includes("GuiChest")) {
            const container = Player.getContainer();
            if (container && isValidChest(container)) {
                scanContainerContents(container);
            }
        }
        isProcessingGuiOpen = false;
    }, 50);
});
