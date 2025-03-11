import { 
    @Vigilant, 
    @SwitchProperty, 
    @DecimalSliderProperty, 
    @TextProperty, 
    @SliderProperty, 
    @SelectorProperty, 
    @ColorProperty, 
    @ButtonProperty,    
    @CheckboxProperty,
    Color   } from "Vigilance";

const GOLD = "§6";
const GRAY = "§7";
const DARK_GRAY = "§8";
const GREEN = "§a";
const AQUA = "§b";
const RED = "§c";
const YELLOW = "§e";
const WHITE = "§f";
const ITALIC = "§o";
const RESET = "§r";
const moduleVersion = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).version;
const moduleAuthor = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).author;
const configHeader = `${DARK_GRAY}[${GOLD}jcnlkAddons${DARK_GRAY}]${RESET} ${YELLOW}v${moduleVersion} \nMade by ${moduleAuthor}${RESET}`

@Vigilant("jcnlkAddons", "jcnlkAddons", {
    getCategoryComparator: () => (a, b) => {
        const order = ["General", "Dungeons", "F7/M7", "Commands", "HUD", "WIP", "Dev Stuff"];
        return order.indexOf(a.name) - order.indexOf(b.name);
    }
})

class Config {
    ////////// General Settings //////////
    @SwitchProperty({
        name: "Enable Attribute Abbreviations",
        description: "Show attribute abbreviations on items in inventory.",
        category: "General",
        subcategory: "Attributes"
    })
    attributeAbbreviations = true;

    @SwitchProperty({
        name: "Show Autopet Rule Title",
        description: "Show a title when an Autopet Rule gets triggered.",
        category: "General",
        subcategory: "Autopet Rule Title"
    })
    autopetRuleTitle = true

    @SwitchProperty({
        name: "Enable Custom Emotes",
        description: `Enable custom emotes in chat. \nAdd custom emotes with ${AQUA}/ja emote${RESET}.`,
        category: "General",
        subcategory: "Chat"
    })
    customEmotes = true;

    @SwitchProperty({
        name: "Enable Reminders",
        description: `Enable the reminder feature. \nAdd reminder with ${AQUA}/ja reminder${RESET}.`,
        category: "General",
        subcategory: "Reminders"
    })
    enableReminders = true;

    @SwitchProperty({
        name: "UwUAddons Hider",
        description: "Hide messages sent by UwUAddons.",
        category: "General",
        subcategory: "UwuAddons Hider"
    })
    hideUwUAddons = true;

    ////////// Dungeons Settings //////////
    @SwitchProperty({
        name: "Enable Crypt Reminder",
        description: "Enable the crypt reminder feature in dungeons.",
        category: "Dungeons",
        subcategory: "Crypt Reminder"
    })
    cryptReminder = true;

    @DecimalSliderProperty({
        name: "Crypt Reminder Time",
        description: `Time in minutes to remind about missing crypts \n(0 to turn it ${RED}OFF${RESET}).`,
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        minF: 0.0,
        maxF: 3.0,
        decimalPlaces: 1
    })
    cryptReminderTime = 1.0;

    @TextProperty({
        name: "Crypt Reminder Message",
        description: `Message to send as crypt reminder. \nUse ${AQUA}{count}${RESET} for the number of needed crypts.`,
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        placeholder: "We need {count} more crypts!"
    })
    cryptReminderMessage = "Crypt Reminder: We need {count} more Crypts!";

    @CheckboxProperty({
        name: "Enable Crypt Reminder Popup",
        description: "Show a popup for crypt reminder.",
        category: "Dungeons",
        subcategory: "Crypt Reminder"
    })
    cryptReminderPopup = true;

    @SwitchProperty({
        name: "Enable Dungeon Chest Highlighting",
        description: `Highlight loot in dungeon chests. \n(${GREEN}Good Loot${RESET}, ${YELLOW}Mid Loot${RESET}, ${RED}Bad Loot${RESET}).`,
        category: "Dungeons",
        subcategory: "Dungeon Loot Highlighting"
    })
    dungeonChestHighlighting = true;

    @SwitchProperty({
        name: "Fire Freeze Notification",
        description: "Tells you when to Fire Freeze in M3.",
        category: "Dungeons",
        subcategory: "M3"
    })
    FireFreezeNotifier = true

    @SwitchProperty({
        name: "Quiz Timer",
        description: "Show a timer indicating how long you have to wait before you can answer.",
        category: "Dungeons",
        subcategory: "Quiz Timer"
    })
    quizTimer = true;

    @SwitchProperty({
        name: "Hide Players After Leap",
        description: "Hide nearby players after leaping.",
        category: "Dungeons",
        subcategory: "Spirit Leap"
    })
    enablePlayerHiding = true;

    ////////// F7/M7 Settings //////////
    @SwitchProperty({
        name: "Mask Timer",
        description: "Displays a HUD with Masks/Phoenix cooldowns.",
        category: "F7/M7",
        subcategory: "Mask Timer"
    })
    maskTimer = true;

    @SwitchProperty({
        name: "Toggle Posmsg",
        description: "Toggle this cool messages",
        category: "F7/M7",
        subcategory: "!"
    })
    togglePosMsg = true;

    @SwitchProperty({
        name: "Toggle PosTitles",
        description: "text",
        category: "F7/M7",
        subcategory: "!"
    })
    togglePosTitles = true;

    @SwitchProperty({
        name: "Mask Reminder",
        description: "Reminds you to equip Bonzo/Spirit Mask before P3 has started.",
        category: "F7/M7",
        subcategory: "P2 (Storm Phase)"
    })
    MaskReminder = true;

    @SwitchProperty({
        name: "i4 Position Titles",
        description: "Show titles when someone announce i4 positions in your party.",
        category: "F7/M7",
        subcategory: "P2 (Storm Phase)"
    })
    i4PositionTitles = true;

    @SwitchProperty({
        name: "Enable Pre Enter Titles",
        description: "Show titles when someone announce Pre Enter positions in your party.",
        category: "F7/M7",
        subcategory: "P3 (Goldor Phase)"
    })
    PreEnterTitles = true;

    @SwitchProperty({
        name: "Pre Enter P4 Titles",
        description: "Show a title when someone Pre Enter P4.",
        category: "F7/M7",
        subcategory: "P3 (Goldor Phase)"
    })
    PreP4Titles = true;

    @SwitchProperty({
        name: "Pre Dev Title",
        description: "Show a title when someone is at SS (Simon Says).",
        category: "F7/M7",
        subcategory: "P3 (Goldor Phase)"
    })
    PreDevTitles = true;

    @SwitchProperty({
        name: "EE2 Helper",
        description: "Show a title when SS (Simon Says) is 4/5 & 5/5 done. Only shown to Archer!",
        category: "F7/M7",
        subcategory: "P3 (Goldor Phase)"
    })
    EE2Helper = true;

    @SwitchProperty({
        name: "Announce SS Progression",
        description: "Announces your SS (Simon Says) Progression in Party Chat. Only if you are standing at SS.",
        category: "F7/M7",
        subcategory: "P3 (Goldor Phase)"
    })
    announceSSProgression = true;

    @SwitchProperty({
        name: "Pre Enter P5 Titles",
        description: "Show a title when someone Pre Enter P5. Healer only!",
        category: "F7/M7",
        subcategory: "P4 (Necron Phase)"
    })
    PreP5Titles = true;

    //////////// Commands Settings //////////
    @SwitchProperty({
        name: "Enable DM Commands",
        description: "Enable or disable all DM commands.",
        category: "Commands",
        subcategory: "DM Commands"
    })
    enableDmCommands = false;

    @SwitchProperty({
        name: "Invite Command (DMs) &3!p&r",
        description: "Enable the invite command in direct messages.",
        category: "Commands",
        subcategory: "DM Commands"
    })
    partyCommand = false;

    @SwitchProperty({
        name: "Kick Command (DMs) &3!kick&r",
        description: "Enable the kick Command command in direct messages.",
        category: "Commands",
        subcategory: "DM Commands"
    })
    kickCommand = false;

    ////////// HUD Settings //////////
    @ButtonProperty({
        name: "Move HUD",
        description: "You can customize your HUD here.",
        placeholder: "Click Me!",
        category: "HUD",
        subcategory: "HUD"
    })
    openHudGui() {
        ChatLib.command("ja hud", true);
    }

    constructor() {
        this.initialize(this);

        // Set category descriptions
        this.setCategoryDescription("General", `${configHeader}\n\n${GRAY}${ITALIC}Related Commands: /ja <emote, reminder, update, help>${RESET}`);
        this.setCategoryDescription("Dungeons", `${configHeader}`);
        this.setCategoryDescription("F7/M7", `${configHeader}`);
        this.setCategoryDescription("Commands", `${configHeader}`);
        this.setCategoryDescription("HUD", `${configHeader}\n\n${GRAY}${ITALIC}Related Commands: /ja <hud>${RESET}`);
        this.setCategoryDescription("WIP", `${configHeader}\n\n${WHITE}Just some Work In Progess Stuff.${RESET}`);

        // Add dependencies for Dungeons
        this.addDependency("Crypt Reminder Time", "Enable Crypt Reminder");
        this.addDependency("Crypt Reminder Message", "Enable Crypt Reminder");
        this.addDependency("Enable Crypt Reminder Popup", "Enable Crypt Reminder");
    
        // Add dependencies for DM Commands
        this.addDependency("Invite Command (DMs) &3!p&r", "Enable DM Commands");
        this.addDependency("Kick Command (DMs) &3!kick&r", "Enable DM Commands");
    }
}

export default new Config();