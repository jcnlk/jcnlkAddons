import Config from "../config";
import { showDebugMessage, showGeneralJAMessage } from "./ChatUtils";

// Load Kuudra loot data
let kuudraLoot;
try {
    const jsonPath = "./data/KuudraLoot.json";
    const jsonContent = FileLib.read("jcnlkAddons", jsonPath);
    if (!jsonContent) {
        throw new Error("KuudraLoot.json is empty or not found at path: " + jsonPath);
    }
    kuudraLoot = JSON.parse(jsonContent);
    if (!kuudraLoot || typeof kuudraLoot !== 'object') {
        throw new Error("Invalid JSON format in KuudraLoot.json");
    }
} catch (error) {
    showDebugMessage(`Error loading KuudraLoot.json: ${error}`, 'error');
    kuudraLoot = {
        godRolls: {},
        goodRolls: {},
        attributes: [],
        baseItems: [],
        armorPieces: [],
        moltenPieces: [],
        specialDrops: { red: [], green: [], yellow: [] },
        attributeShards: { yellow: [] },
        enchantedBooks: { green: [], red: [] }
    };
}

// Regular expressions for parsing item data
const attributePattern = new RegExp("(" + kuudraLoot.attributes.join('|') + ")\\s+(\\d+|[IVX]+)(?:\\s+.*)?$", 'i');
const baseItemPattern = new RegExp("(" + kuudraLoot.baseItems.join('|') + ") (" + [...kuudraLoot.armorPieces, ...kuudraLoot.moltenPieces].join('|') + ")", 'i');
const enchantmentPattern = new RegExp("(" + [...kuudraLoot.enchantedBooks.green, ...kuudraLoot.enchantedBooks.red].join('|') + ")\\s+(\\d+|[IVX]+)", 'i');

const romanNumerals = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
    'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
};

let itemsWithAttributes = [];

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
 * Checks if an item has a god roll
 * @param {string} baseItem - The base item name
 * @param {Object} attributes - The item's attributes
 * @returns {boolean} - Whether the item is a god roll
 */
function isGodRoll(baseItem, attributes) {
    if (!baseItem) return false;
    const [itemType, piece] = baseItem.split(' ');
    const godRolls = kuudraLoot.godRolls[itemType];
    if (!godRolls) return false;

    return godRolls.some(function(roll) {
        if (!roll.pieces.includes(piece)) return false;
        return roll.attributes.every(function(attr) {
            return Object.keys(attributes).some(function(itemAttr) {
                return itemAttr.toLowerCase() === attr.toLowerCase();
            });
        });
    });
}

/**
 * Checks if an item has a good roll
 * @param {string} baseItem - The base item name
 * @param {Object} attributes - The item's attributes
 * @returns {boolean} - Whether the item is a good roll
 */
function isGoodRoll(baseItem, attributes) {
    if (!baseItem) return false;
    const [itemType, piece] = baseItem.split(' ');
    const goodRolls = kuudraLoot.goodRolls[itemType];
    if (!goodRolls) return false;

    return goodRolls.some(function(roll) {
        if (!roll.pieces.includes(piece)) return false;
        return roll.attributes.every(function(attr) {
            return Object.keys(attributes).some(function(itemAttr) {
                return itemAttr.toLowerCase() === attr.toLowerCase();
            });
        });
    });
}

/**
 * Checks if an item is a special drop
 * @param {string} itemName - The item name
 * @returns {string|null} - The color of the special drop or null if not special
 */
function isSpecialDrop(itemName) {
    for (const [color, items] of Object.entries(kuudraLoot.specialDrops)) {
        if (items.includes(itemName)) {
            return color;
        }
    }
    return null;
}

/**
 * Checks if an item is an attribute shard
 * @param {string} itemName - The item name
 * @param {string} attribute - The attribute name
 * @returns {string|null} - The color of the attribute shard or null if not a shard
 */
function isAttributeShard(itemName, attribute) {
    if (itemName.includes("Attribute Shard")) {
        if (kuudraLoot.attributeShards.yellow.includes(attribute)) {
            return "yellow";
        }
        return "red";
    }
    return null;
}

/**
 * Checks if an item is an enchanted book
 * @param {string} itemName - The item name
 * @param {string} enchantment - The enchantment name
 * @returns {string|null} - The color of the enchanted book or null if not a book
 */
function isEnchantedBook(itemName, enchantment) {
    if (itemName === "Enchanted Book") {
        if (kuudraLoot.enchantedBooks.green.some(function(e) { return enchantment.startsWith(e); })) {
            return "green";
        } else if (kuudraLoot.enchantedBooks.red.some(function(e) { return enchantment.startsWith(e); })) {
            return "red";
        }
    }
    return null;
}

/**
 * Scans an item for attributes and other properties
 * @param {Object} item - The item to scan
 * @returns {Object|null} - The scan result or null if invalid
 */
function scanItemAttributes(item) {
    if (!item) return null;

    const foundAttributes = {};
    let baseItem = null;
    let isSpecial = null;
    let isAttributeShardItem = null;
    let isEnchantedBookItem = null;
    let enchantment = null;

    try {
        const name = ChatLib.removeFormatting(item.getName());
        showDebugMessage(`Scanning item: ${name}`);

        isSpecial = isSpecialDrop(name);
        if (isSpecial) {
            showDebugMessage("Found special drop: " + name + ", color: " + isSpecial);
            return { attributes: {}, baseItem: null, isSpecialDrop: isSpecial };
        }

        const baseItemMatch = name.match(baseItemPattern);
        if (baseItemMatch) {
            baseItem = baseItemMatch[0];
            showDebugMessage("Found base item: " + baseItem);
        }

        const lore = item.getLore();
        showDebugMessage("Item lore: " + JSON.stringify(lore));

        if (name === "Enchanted Book" && lore.length > 1) {
            const enchantmentLine = ChatLib.removeFormatting(lore[1]);
            showDebugMessage("Enchantment line: " + enchantmentLine);
            const enchantmentMatch = enchantmentLine.match(/^(.+?)\s+(\d+|[IVX]+)$/);
            if (enchantmentMatch) {
                enchantment = enchantmentMatch[1];
                showDebugMessage("Found Enchantment: " + enchantment);
                isEnchantedBookItem = isEnchantedBook(name, enchantment);
                showDebugMessage("Is Enchanted Book: " + isEnchantedBookItem + ", color: " + (isEnchantedBookItem || "none"));
                return { 
                    attributes: {}, 
                    baseItem: null, 
                    isEnchantedBook: isEnchantedBookItem, 
                    enchantment: enchantment 
                };
            }
        }

        for (const line of lore) {
            const match = line.match(attributePattern);
            if (match) {
                const attribute = match[1];
                const level = match[2];
                let numericLevel = parseInt(level);
                if (isNaN(numericLevel)) {
                    numericLevel = romanNumerals[level] || 0;
                }
                foundAttributes[attribute] = numericLevel;
                showDebugMessage("Found attribute: " + attribute + " = " + numericLevel);

                if (name.includes("Attribute Shard")) {
                    isAttributeShardItem = isAttributeShard(name, attribute);
                    showDebugMessage("Found Attribute Shard: " + attribute + ", color: " + isAttributeShardItem);
                    break;  // We only need the first attribute for Attribute Shards
                }
            }
        }
    } catch (error) {
        showDebugMessage(`Error scanning item attributes: ${error.message}`, 'error');
        showDebugMessage(`Error stack: ${error.stack}`, 'error');
    }

    const isGodRollItem = isGodRoll(baseItem, foundAttributes);
    const isGoodRollItem = !isGodRollItem && isGoodRoll(baseItem, foundAttributes);

    showDebugMessage(`Base Item: ${baseItem}`);
    showDebugMessage(`Found Attributes: ${JSON.stringify(foundAttributes)}`);
    showDebugMessage(`Is GodRoll: ${isGodRollItem}, Is GoodRoll: ${isGoodRollItem}`);
    showDebugMessage(`Is Attribute Shard: ${isAttributeShardItem}`);
    showDebugMessage(`Is Enchanted Book: ${isEnchantedBookItem}, Enchantment: ${enchantment}`);

    return { 
        attributes: foundAttributes, 
        baseItem: baseItem, 
        isGodRoll: isGodRollItem, 
        isGoodRoll: isGoodRollItem, 
        isSpecialDrop: isSpecial,
        isAttributeShard: isAttributeShardItem,
        isEnchantedBook: isEnchantedBookItem,
        enchantment: enchantment
    };
}

/**
 * Renders highlights for items with attributes
 */
const renderHighlight = register("guiRender", function() {
    itemsWithAttributes.forEach(function(item) {
        const [x, y] = getSlotCoords(item.slot);
        Renderer.translate(0, 0, 100);
        let color;
        if (item.isSpecialDrop) {
            switch (item.isSpecialDrop) {
                case 'red': color = Renderer.color(255, 0, 0, 128); break;
                case 'green': color = Renderer.color(0, 255, 0, 128); break;
                case 'yellow': color = Renderer.color(255, 255, 0, 128); break;
            }
        } else if (item.isAttributeShard) {
            color = item.isAttributeShard === 'yellow' ? Renderer.color(255, 255, 0, 128) : Renderer.color(255, 0, 0, 128);
        } else if (item.isEnchantedBook) {
            color = item.isEnchantedBook === 'green' ? Renderer.color(0, 255, 0, 128) : Renderer.color(255, 0, 0, 128);
        } else if (item.isGodRoll) {
            color = Renderer.color(0, 255, 0, 128); // Green for God Rolls
        } else if (item.isGoodRoll) {
            color = Renderer.color(255, 255, 0, 128); // Yellow for Good Rolls
        } else {
            color = Renderer.color(255, 0, 0, 128); // Red for other items with attributes
        }
        Renderer.drawRect(color, x, y, 16, 16);
    });
}).unregister();

/**
 * Clears highlights when GUI is closed
 */
const clearHighlight = register("guiClosed", function() {
    itemsWithAttributes = [];
    renderHighlight.unregister();
    clearHighlight.unregister();
}).unregister();

/**
 * Scans the contents of a container
 * @param {Object} container - The container to scan
 */
function scanContents(container) {
    if (!Config.enableChestScanning) {
        showDebugMessage("Chest scanning is disabled in config.");
        return;
    }

    if (!isValidChest(container)) {
        showDebugMessage(`Not a valid chest to scan: ${container.getName()}`);
        return;
    }

    showDebugMessage(`Starting scan of ${container.getName()}...`);
    showDebugMessage(`Container size: ${container.getSize()}`);

    itemsWithAttributes = [];
    let foundBaseItems = new Set();

    const containerSize = container.getSize();
    const playerInventorySize = 36;
    const slotsToScan = containerSize - playerInventorySize;

    showDebugMessage("Scanning " + slotsToScan + " slots (excluding player inventory)");

    for (let i = 0; i < slotsToScan; i++) {
        const item = container.getStackInSlot(i);
        if (item) {
            showDebugMessage("Scanning item in slot " + i + ": " + item.getName());
            const scanResult = scanItemAttributes(item);
            showDebugMessage("Item attributes: " + JSON.stringify(scanResult.attributes));
            showDebugMessage("Base item: " + scanResult.baseItem + ", Is GodRoll: " + scanResult.isGodRoll + 
                             ", Is GoodRoll: " + scanResult.isGoodRoll + ", Is Special Drop: " + scanResult.isSpecialDrop + 
                             ", Is Attribute Shard: " + scanResult.isAttributeShard + ", Is Enchanted Book: " + scanResult.isEnchantedBook);

            if (Object.keys(scanResult.attributes).length > 0 || scanResult.isSpecialDrop || scanResult.isAttributeShard || scanResult.isEnchantedBook) {
                itemsWithAttributes.push(Object.assign({
                    name: item.getName(),
                    slot: i
                }, scanResult));
            }
            if (scanResult.baseItem) {
                foundBaseItems.add(scanResult.baseItem);
            }
        }
    }

    if (Config.debugMode && foundBaseItems.size > 0) {
        showDebugMessage("Found base items: " + Array.from(foundBaseItems).join(', '));
    }

    if (itemsWithAttributes.length > 0) {
        if (Config.enableAttributeChatOutput) {
            showGeneralJAMessage("Items with attributes, special drops, attribute shards, or enchanted books found:");
            itemsWithAttributes.forEach(function(item) {
                let rollType;
                if (item.isSpecialDrop) {
                    rollType = "§" + (item.isSpecialDrop === 'red' ? 'c' : item.isSpecialDrop === 'green' ? 'a' : 'e') + "[SPECIAL]";
                } else if (item.isAttributeShard) {
                    rollType = "§" + (item.isAttributeShard === 'yellow' ? 'e' : 'c') + "[SHARD]";
                } else if (item.isEnchantedBook) {
                    rollType = "§" + (item.isEnchantedBook === 'green' ? 'a' : 'c') + "[BOOK]";
                } else if (item.isGodRoll) {
                    rollType = "§a[GODROLL]";
                } else if (item.isGoodRoll) {
                    rollType = "§e[GOODROLL]";
                } else {
                    rollType = "§c[NORMAL]";
                }
                showGeneralJAMessage(`  ${rollType} §e${item.name}${item.enchantment ? " (" + item.enchantment + ")" : ''}:`);
                if (Object.keys(item.attributes).length > 0) {
                    Object.entries(item.attributes).forEach(function([attr, level]) {
                        showGeneralJAMessage(`    §a${attr}: §b${level}`);
                    });
                }
            });
        }

        renderHighlight.register();
        clearHighlight.register();
    } else {
        if (Config.enableAttributeChatOutput) {
            showGeneralJAMessage("No items with attributes, special drops, attribute shards, or enchanted books found.", 'error');
        }
    }
}

/**
 * Checks if a container is a valid chest to scan
 * @param {Object} container - The container to check
 * @returns {boolean} - Whether the container is a valid chest
 */
function isValidChest(container) {
    if (!container) return false;

    const containerName = container.getName().toLowerCase();

    // Exclude player inventory and ender chest
    if (containerName.includes("inventory") || containerName.includes("ender chest")) {
        return false;
    }

    // Include containers with "chest" in the name (covers vanilla and custom chests)
    if (containerName.includes("chest")) {
        return true;
    }
    return false;
}

// Use a variable to track if we're already processing a GUI open event
let isProcessingGuiOpen = false;

/**
 * Event handler for when a GUI is opened
 */
register("guiOpened", function(event) {
    if (!Config.enableChestScanning || isProcessingGuiOpen) return;

    isProcessingGuiOpen = true;

    setTimeout(function() {
        const screen = Client.currentGui.get();

        if (screen && screen.toString().includes("GuiChest")) {
            showDebugMessage("Container GUI opened event triggered");
            const container = Player.getContainer();
            if (container && isValidChest(container)) {
                showDebugMessage("Valid chest detected: " + container.getName());
                scanContents(container);
            } else {
                showDebugMessage("No valid chest detected");
            }
        } else {
            showDebugMessage("Opened GUI is not a container");
        }

        isProcessingGuiOpen = false;
    }, 50);
});

// Export necessary functions
export {
    scanItemAttributes,
    scanContents
};