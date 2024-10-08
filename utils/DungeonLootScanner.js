import Config from "../config";
import { showDebugMessage, showGeneralJAMessage } from "./ChatUtils";

// Load Dungeon loot data
let dungeonLoot;
try {
    const jsonPath = "./data/DungeonLoot.json";
    const jsonContent = FileLib.read("jcnlkAddons", jsonPath);
    if (!jsonContent) {
        throw new Error("DungeonLoot.json is empty or not found at path: " + jsonPath);
    }
    dungeonLoot = JSON.parse(jsonContent);
    if (!dungeonLoot || typeof dungeonLoot !== 'object') {
        throw new Error("Invalid JSON format in DungeonLoot.json");
    }
} catch (error) {
    showDebugMessage(`Error loading DungeonLoot.json: ${error}`, 'error');
    dungeonLoot = {
        items: { green: [], yellow: [], red: [] },
        books: { green: [], yellow: [], red: [] }
    };
}

let itemsWithRarity = [];

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
 * Checks the rarity of an item
 * @param {string} itemName - The name of the item
 * @returns {string|null} - The rarity color of the item or null if not found
 */
function checkItemRarity(itemName) {
    for (const [color, items] of Object.entries(dungeonLoot.items)) {
        if (items.includes(itemName)) {
            return color;
        }
    }
    return null;
}

/**
 * Checks if an item is an enchanted book and its rarity
 * @param {string} itemName - The item name
 * @param {string} enchantment - The enchantment name
 * @returns {string|null} - The color of the enchanted book or null if not a book
 */
function isEnchantedBook(itemName, enchantment) {
    if (itemName === "Enchanted Book") {
        for (const [color, books] of Object.entries(dungeonLoot.books)) {
            if (books.some(book => enchantment.startsWith(book))) {
                return color;
            }
        }
    }
    return null;
}

/**
 * Scans an item for rarity and other properties
 * @param {Object} item - The item to scan
 * @returns {Object|null} - The scan result or null if invalid
 */
function scanDungeonItem(item) {
    if (!item) return null;

    try {
        const name = ChatLib.removeFormatting(item.getName());
        showDebugMessage(`Scanning dungeon item: ${name}`);

        let itemRarity = checkItemRarity(name);
        let isEnchantedBookItem = null;
        let enchantment = null;

        if (itemRarity) {
            showDebugMessage(`Found special item: ${name}, rarity: ${itemRarity}`);
            return { name: name, rarity: itemRarity, isSpecialItem: true };
        }

        if (name === "Enchanted Book" && item.getLore().length > 1) {
            const enchantmentLine = ChatLib.removeFormatting(item.getLore()[1]);
            showDebugMessage("Enchantment line: " + enchantmentLine);
            const enchantmentMatch = enchantmentLine.match(/^(.+?)\s+(\d+|[IVX]+)$/);
            if (enchantmentMatch) {
                enchantment = enchantmentMatch[1];
                isEnchantedBookItem = isEnchantedBook(name, enchantment);
                showDebugMessage(`Found Enchanted Book: ${enchantment}, rarity: ${isEnchantedBookItem}`);
                return { 
                    name: name,
                    rarity: isEnchantedBookItem, 
                    isEnchantedBook: true,
                    enchantment: enchantment 
                };
            }
        }

        return null; // Item is not special and not an enchanted book
    } catch (error) {
        showDebugMessage(`Error scanning dungeon item: ${error.message}`, 'error');
        return null;
    }
}

/**
 * Renders highlights for special items and enchanted books
 */
const renderHighlight = register("guiRender", function() {
    itemsWithRarity.forEach(function(item) {
        const [x, y] = getSlotCoords(item.slot);
        Renderer.translate(0, 0, 100);
        let color;
        switch (item.rarity) {
            case 'green': color = Renderer.color(0, 255, 0, 128); break;
            case 'yellow': color = Renderer.color(255, 255, 0, 128); break;
            case 'red': color = Renderer.color(255, 0, 0, 128); break;
            default: color = Renderer.color(128, 128, 128, 128); break;
        }
        Renderer.drawRect(color, x, y, 16, 16);
    });
}).unregister();

/**
 * Clears highlights when GUI is closed
 */
const clearHighlight = register("guiClosed", function() {
    itemsWithRarity = [];
    renderHighlight.unregister();
    clearHighlight.unregister();
}).unregister();

/**
 * Scans the contents of a container
 * @param {Object} container - The container to scan
 */
function scanContents(container) {
    if (!Config.enableDungeonChestScanning) {
        showDebugMessage("Dungeon chest scanning is disabled in config.");
        return;
    }

    if (!isValidDungeonChest(container)) {
        showDebugMessage(`Not a valid dungeon chest to scan: ${container.getName()}`);
        return;
    }

    showDebugMessage(`Starting scan of ${container.getName()}...`);
    showDebugMessage(`Container size: ${container.getSize()}`);

    itemsWithRarity = [];

    const containerSize = container.getSize();
    const playerInventorySize = 36;
    const slotsToScan = containerSize - playerInventorySize;

    showDebugMessage("Scanning " + slotsToScan + " slots (excluding player inventory)");

    for (let i = 0; i < slotsToScan; i++) {
        const item = container.getStackInSlot(i);
        if (item) {
            showDebugMessage("Scanning item in slot " + i + ": " + item.getName());
            const scanResult = scanDungeonItem(item);
            if (scanResult) {
                itemsWithRarity.push({ ...scanResult, slot: i });
            }
        }
    }

    if (itemsWithRarity.length > 0) {
        if (Config.enableDungeonLootChatOutput) {
            ChatLib.chat("&6&l========= Dungeon Loot =========");
            itemsWithRarity.forEach(function(item) {
                let raritySymbol = item.rarity === 'green' ? '§a++' : item.rarity === 'yellow' ? '§e+' : '§c-';
                let itemType = item.isEnchantedBook ? "Enchanted Book" : "Special Item";
                let itemInfo = item.isEnchantedBook ? `(${item.enchantment})` : '';
                ChatLib.chat(`${raritySymbol} §f${item.name} §7[${itemType}] ${itemInfo}`);
            });
            ChatLib.chat("&6&l================================");
        }

        renderHighlight.register();
        clearHighlight.register();
    } else {
        if (Config.enableDungeonLootChatOutput) {
            showGeneralJAMessage("&cNo notable dungeon loot found.");
        }
    }
}

/**
 * Checks if a container is a valid dungeon chest to scan
 * @param {Object} container - The container to check
 * @returns {boolean} - Whether the container is a valid dungeon chest
 */
function isValidDungeonChest(container) {
    if (!container) return false;

    const containerName = container.getName().toLowerCase();

    // Include containers that are likely to be dungeon chests
    return containerName.includes("chest");
}

// Use a variable to track if we're already processing a GUI open event
let isProcessingGuiOpen = false;

/**
 * Event handler for when a GUI is opened
 */
register("guiOpened", function(event) {
    if (!Config.enableDungeonChestScanning || isProcessingGuiOpen) return;

    isProcessingGuiOpen = true;

    setTimeout(function() {
        const screen = Client.currentGui.get();

        if (screen && screen.toString().includes("GuiChest")) {
            showDebugMessage("Container GUI opened event triggered");
            const container = Player.getContainer();
            if (container && isValidDungeonChest(container)) {
                showDebugMessage("Valid dungeon chest detected: " + container.getName());
                scanContents(container);
            } else {
                showDebugMessage("No valid dungeon chest detected");
            }
        } else {
            showDebugMessage("Opened GUI is not a container");
        }

        isProcessingGuiOpen = false;
    }, 50);
});

export {
    scanDungeonItem,
    scanContents
};