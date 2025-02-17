import { getSkyblockItemID, highlightSlot } from "../../../BloomCore/utils/Utils";
import { getIsInDungeon, getIsInDungeonHub } from "../../utils/Dungeon";
import PriceUtils from "../../../BloomCore/PriceUtils";
import { registerWhen } from "../../utils/Register";
import config from "../../config";

const validChests = new Set(["Wood", "Gold", "Diamond", "Emerald", "Obsidian", "Bedrock"]);

const LOW_PROFIT_THRESHOLD = 100000;
const MEDIUM_PROFIT_THRESHOLD = 1000000;

const alwaysBuy = new Set([
  "NECRON_HANDLE",
  "DARK_CLAYMORE",
  "FIRST_MASTER_STAR",
  "SECOND_MASTER_STAR",
  "THIRD_MASTER_STAR",
  "FOURTH_MASTER_STAR",
  "FIFTH_MASTER_STAR",
  "SHADOW_FURY",
  "SHADOW_WARP_SCROLL",
  "IMPLOSION_SCROLL",
  "WITHER_SHIELD_SCROLL",
  "ENCHANTMENT_ULTIMATE_ONE_FOR_ALL_1",
  "RECOMBOBULATOR_3000"
]);

const worthless = new Set([
  "DUNGEON_DISC_5",
  "MAXOR_THE_FISH",
  "STORM_THE_FISH",
  "GOLDOR_THE_FISH"
]);

function isInDungeonArea() {
  return getIsInDungeon() || getIsInDungeonHub();
}

function createChestItem(item, slot) {
  let quantity = 1;
  let itemID = getSkyblockItemID(item);
  const rawName = item.getName();
  const cleanName = rawName.removeFormatting();
  const essenceMatch = cleanName.match(/^(\w+) Essence x(\d+)$/);

  if (essenceMatch) {
    const [, type, amt] = essenceMatch;
    itemID = `ESSENCE_${type}`.toUpperCase();
    quantity = parseInt(amt, 10);
  }

  let name = rawName;
  if (itemID.startsWith("ENCHANTMENT")) {
    const lore = item.getLore();
    if (lore && lore.length >= 2) {
      name = lore[1];
    }
  }

  let value = 0;
  if (!worthless.has(itemID)) {
    const sellInfo = PriceUtils.getSellPrice(itemID, true);
    if (sellInfo) {
      let [price, source] = sellInfo;
      value = price * quantity;
      if (item.getRegistryName() === "minecraft:enchanted_book") {
        value = PriceUtils.getBookPriceWhenCrafted(item);
      }
      if (source === PriceUtils.locations.AUCTION) {
        value = PriceUtils.getBINPriceAfterTax(value);
      } else {
        const TAX_RATE = 0.0125;
        value *= (1 - TAX_RATE);
      }
      value = Math.floor(value);
    }
  }

  return { item, slot, quantity, value, profit: 0, itemID, name };
}

let currentChest = null;
let lastUpdate = 0;
const UPDATE_INTERVAL = 333;

function updateChest() {
  if (!World.isLoaded() || !isInDungeonArea()) return;
  const container = Player.getContainer();
  if (!container) return;
  const containerName = container.getName();
  const chestMatch = containerName.match(/^(\w+) Chest$/);
  if (!chestMatch) return;
  const chestName = chestMatch[1];
  if (!validChests.has(chestName)) return;

  const nugget = container.getStackInSlot(31);
  if (!nugget) return;

  const lore = nugget.getLore();
  const chest = { name: chestName, cost: 0, items: [] };

  if (lore && lore.length >= 7) {
    const costLine = lore[7].removeFormatting();
    const costMatch = costLine.match(/^([\d,]+) Coins$/);
    if (costMatch) {
      chest.cost = parseInt(costMatch[1].replace(/,/g, ""), 10);
    }
  }

  const lootItems = [];
  for (let i = 9; i < 18; i++) {
    const stack = container.getStackInSlot(i);
    if (stack && stack.getID() !== 160) {
      lootItems.push({ slot: i, item: stack });
    }
  }

  chest.items = lootItems.map(({ slot, item }) => createChestItem(item, slot));
  chest.items.forEach(item => {
    item.profit = Math.floor(item.value - chest.cost);
  });
  currentChest = chest;
}

function renderChest() {
  if (!World.isLoaded() || !isInDungeonArea()) return;
  const container = Player.getContainer();
  if (!container || !currentChest) return;
  if (!/^(\w+) Chest$/.test(container.getName())) return;

  const gui = Client.currentGui.get();
  currentChest.items.forEach(item => {
    if (alwaysBuy.has(item.itemID)) {
      highlightSlot(gui, item.slot, 0, 1, 0, 0.5, true);
    } else if (item.profit < LOW_PROFIT_THRESHOLD) {
      highlightSlot(gui, item.slot, 1, 0, 0, 0.5, true);
    } else if (item.profit < MEDIUM_PROFIT_THRESHOLD) {
      highlightSlot(gui, item.slot, 1, 1, 0, 0.5, true);
    } else {
      highlightSlot(gui, item.slot, 0, 1, 0, 0.5, true);
    }
  });
}

registerWhen(
  register("guiRender", () => {
    const now = Date.now();
    if (now - lastUpdate >= UPDATE_INTERVAL) {
      updateChest();
      lastUpdate = now;
    }
    renderChest();
  }),
  () => config.dungeonChestHighlighting
);

register("guiClosed", () => {
  currentChest = null;
});
