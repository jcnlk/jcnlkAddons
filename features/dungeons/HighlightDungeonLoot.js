import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import { getItemId } from "../../utils/Items";
import { getEnchantedBookDetail } from "../../utils/Items";
import { setItemsToHighlight } from "../../utils/HighlightSlots";
import config from "../../config";
import {
  greenItems,
  yellowItems,
  redItems,
  greenEnchantments,
  yellowEnchantments,
  redEnchantments,
} from "../../data/DungeonLoot";
import { registerWhen } from "../../utils/Register";

let isProcessingChestOpen = false;

const VALID_CHEST_TYPES = [
  "Wood Chest",
  "Gold Chest",
  "Diamond Chest",
  "Emerald Chest",
  "Obsidian Chest",
  "Bedrock Chest",
];

function getItemCategory(itemId) {
  if (greenItems.includes(itemId)) return "green";
  if (yellowItems.includes(itemId)) return "yellow";
  if (redItems.includes(itemId)) return "red";
  return null;
}

function getEnchantmentCategory(enchantment) {
  if (greenEnchantments.includes(enchantment)) return "green";
  if (yellowEnchantments.includes(enchantment)) return "yellow";
  if (redEnchantments.includes(enchantment)) return "red";
  return null;
}

function getCategorySymbol(category) {
  switch (category) {
    case "green":
      return "§a++§r";
    case "yellow":
      return "§e+§r";
    case "red":
      return "§c-§r";
    default:
      return "§7-§r";
  }
}

function scanChestContents(container) {
  if (!config.enableDungeonChestHighlighting) {
    showDebugMessage(
      "Dungeon chest highlighting is disabled, skipping scan",
      "info"
    );
    return;
  }

  if (!container) {
    showDebugMessage("Invalid container", "error");
    return;
  }

  const containerName = container.getName();
  showDebugMessage(`Container name: ${containerName}`, "info");

  if (
    !VALID_CHEST_TYPES.some((chestType) => containerName.includes(chestType))
  ) {
    showDebugMessage(
      `Container "${containerName}" is not a valid dungeon chest, skipping scan`,
      "info"
    );
    return;
  }

  showDebugMessage(`Scanning chest: ${containerName}`, "info");

  const containerSize = container.getSize();
  const playerInventorySize = 36;
  const slotsToScan = containerSize - playerInventorySize;

  showDebugMessage(
    `Container size: ${containerSize}, Slots to scan: ${slotsToScan}`,
    "info"
  );

  let itemsToHighlight = [];
  let notableItems = [];

  for (let i = 0; i < slotsToScan; i++) {
    const item = container.getStackInSlot(i);
    if (item) {
      showDebugMessage(`Processing item in slot ${i}`, "info");
      try {
        const itemId = getItemId(item);
        const itemName = item.getName().replace(/§./g, "");
        const itemCategory = getItemCategory(itemId);

        if (itemCategory || itemId === "ENCHANTED_BOOK") {
          const categorySymbol = getCategorySymbol(itemCategory);

          let outputString = `${categorySymbol} §f${itemName}`;
          let category = itemCategory;

          if (itemId === "ENCHANTED_BOOK") {
            const enchantDetails = getEnchantedBookDetail(item);
            if (enchantDetails) {
              const enchantmentCategory = getEnchantmentCategory(
                `${enchantDetails.name} ${enchantDetails.level}`
              );
              const enchantmentSymbol = getCategorySymbol(enchantmentCategory);
              outputString = `${enchantmentSymbol} Enchanted Book (§f${enchantDetails.name} ${enchantDetails.level})`;
              category = enchantmentCategory || category;
              showDebugMessage(
                `Enchanted Book found - Name: ${enchantDetails.name}, Level: ${enchantDetails.level}`,
                "info"
              );
            } else {
              outputString += ` (§cUnable to read enchantment)`;
              showDebugMessage(
                `Unable to read enchantment details for book in slot ${i}`,
                "warning"
              );
            }
          }

          if (category) {
            notableItems.push(outputString);
            itemsToHighlight.push({
              slot: i,
              color:
                category === "green"
                  ? Renderer.color(0, 255, 0, 128)
                  : category === "yellow"
                  ? Renderer.color(255, 255, 0, 128)
                  : Renderer.color(255, 0, 0, 128),
            });
          }
        }

        showDebugMessage(
          `Item processed - Name: ${itemName}, ID: ${itemId}`,
          "info"
        );
      } catch (error) {
        showDebugMessage(
          `Error processing item in slot ${i}: ${error.message}`,
          "error"
        );
      }
    } else {
      showDebugMessage(`Slot ${i} is empty`, "info");
    }
  }

  if (config.enableDungeonLootChatOutput) {
    if (notableItems.length > 0) {
      ChatLib.chat("§6&l========= Dungeon Loot =========");
      notableItems.forEach((item) => ChatLib.chat(item));
      ChatLib.chat("§6&l=============================");
    } else {
      showGeneralJAMessage("§cNo notable Dungeon loot found.");
    }
  }

  showDebugMessage("Chest scan completed", "info");

  setItemsToHighlight(itemsToHighlight);
}

registerWhen(register("guiOpened", function (event) {
  //showDebugMessage("GUI opened event triggered", 'info');

  if (isProcessingChestOpen) {
    //showDebugMessage("Already processing a chest open event, skipping", 'info');
    return;
  }

  isProcessingChestOpen = true;

  setTimeout(function () {
    const screen = Client.currentGui.get();
    //showDebugMessage(`Current GUI: ${screen}`, 'info');

    if (screen && screen.toString().includes("GuiChest")) {
      showDebugMessage("Chest GUI detected", "info");
      const container = Player.getContainer();
      if (container) {
        showDebugMessage("Valid container found, starting scan", "info");
        scanChestContents(container);
      } else {
        showDebugMessage("No valid container detected", "warning");
      }
    } else {
      showDebugMessage("Opened GUI is not a chest", "info");
    }

    isProcessingChestOpen = false;
    //showDebugMessage("Finished processing GUI open event", 'info');
  }, 50);
}), () => config.enableDungeonChestHighlighting);
