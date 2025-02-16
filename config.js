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
    enableDungeonChestHighlighting = true;

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
        name: "Announce Pre Enter P2",
        description: "Announce in Party Chat when you Pre Enter P2.",
        category: "F7/M7",
        subcategory: "P1 (Maxor Phase)"
    })
    announcePreEnterP2 = true;

    @SwitchProperty({
        name: "Pre Enter P2 Titles",
        description: "Show a title when someone Pre Enter P2.",
        category: "F7/M7",
        subcategory: "P1 (Maxor Phase)"
    })
    PreP2Titles = true;

    @SwitchProperty({
        name: "Mask Reminder",
        description: "Reminds you to equip Bonzo/Spirit Mask before P3 has started.",
        category: "F7/M7",
        subcategory: "P2 (Storm Phase)"
    })
    MaskReminder = true;

    @SwitchProperty({
        name: "Announce i4 Position",
        description: "Announce your i4 position in Party Chat (i4 Entry, Moving to i4, At i4).",
        category: "F7/M7",
        subcategory: "P2 (Storm Phase)"
    })
    announcei4Position = true;

    @SwitchProperty({
        name: "i4 Position Titles",
        description: "Show titles when someone announce i4 positions in your party.",
        category: "F7/M7",
        subcategory: "P2 (Storm Phase)"
    })
    i4PositionTitles = true;

    @SwitchProperty({
        name: "Announce Pre Enter P3",
        description: "Announce in Party Chat when you Pre Enter in Phase 3 (EE2, EE3, EE4/Core).",
        category: "F7/M7",
        subcategory: "P3 (Goldor Phase)"
    })
    announcePreEnterPhase3 = true

    @SwitchProperty({
        name: "Enable Pre Enter Titles",
        description: "Show titles when someone announce Pre Enter positions in your party.",
        category: "F7/M7",
        subcategory: "P3 (Goldor Phase)"
    })
    PreEnterTitles = true;

    @SwitchProperty({
        name: "Announce Pre Dev Position",
        description: "Announce your position during Pre Dev in Party Chat (At SS, At Dev 2, At Dev 3).",
        category: "F7/M7",
        subcategory: "P3 (Goldor Phase)"
    })
    announcePreDevPosition = true;

    @SwitchProperty({
        name: "Announce Pre Enter P4",
        description: "Announce your Pre Enter P4 position in Party Chat.",
        category: "F7/M7",
        subcategory: "P3 (Goldor Phase)"
    })
    announcePreP4 = true;

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
        name: "Announce Pre Enter P5",
        description: "Announce your Pre Enter P5 position in Party Chat.",
        category: "F7/M7",
        subcategory: "P4 (Necron Phase)"
    })
    announcePreP5 = true;

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

    @SwitchProperty({
        name: "Enable Party Commands",
        description: "Enable or disable all party commands.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    enablePartyCommands = false;

    @SwitchProperty({
        name: "RNG Command &3!rng&r",
        description: "Enable the rng command in Party Chat.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    rngCommand = false;

    @SwitchProperty({
        name: "Coinflip Command &3!cf&r",
        description: "Enable the coinflip command in Party Chat.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    coinFlipCommand = false;

    @SwitchProperty({
        name: "8ball Command &3!8ball&r",
        description: "Enable the 8ball command in Party Chat.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    eightBallCommand = false;

    @SwitchProperty({
        name: "Throw Command &3!throw&r",
        description: "Enable the throw command in Party Chat.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    throwCommand = false;

    @SwitchProperty({
        name: "Dice Command &3!dice&r",
        description: "Enable the dice command in Party Chat.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    diceCommand = false;

    @SwitchProperty({
        name: "Simp Command &3!simp&r",
        description: "Enable the simp command in Party Chat.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    simpCommand = false;

    @SwitchProperty({
        name: "Sus Command &3!sus&r",
        description: "Enable the sus command in Party Chat.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    susCommand = false;

    @SwitchProperty({
        name: "Kick Command (Party) &3!<kick, pk>&r",
        description: "Enable the kick command in Party Chat.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    partyKickCommand = false;

    @SwitchProperty({
        name: "Invite Command (Party) &3!p&r ",
        description: "Enable the invite command in Party Chat.",
        category: "Commands",
        subcategory: "Party Commands"
    })
    partyInviteCommand = false;

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
    
    ////////// Dev Stuff Settings //////////
    @SwitchProperty({
        name: "Debug Mode",
        description: `Enable debug messages.`,
        category: "Dev Stuff",
        subcategory: "Debug"
     })
    debugMode = false;

    constructor() {
        this.initialize(this);

        // Set category descriptions
        this.setCategoryDescription("General", `${configHeader}\n\n${GRAY}${ITALIC}Related Commands: /ja <emote, reminder, update, help>${RESET}`);
        this.setCategoryDescription("Dungeons", `${configHeader}`);
        this.setCategoryDescription("F7/M7", `${configHeader}`);
        this.setCategoryDescription("Commands", `${configHeader}`);
        this.setCategoryDescription("HUD", `${configHeader}\n\n${GRAY}${ITALIC}Related Commands: /ja <hud>${RESET}`);
        this.setCategoryDescription("WIP", `${configHeader}\n\n${WHITE}Just some Work In Progess Stuff.${RESET}`);
        this.setCategoryDescription("Dev Stuff", `${configHeader}\n\n${GRAY}${ITALIC}Related Commands: /getcurrentarea, /getdungeoninfo, /getitemid, /getenchantedbookdetail\n\n${WHITE}No interesting Stuff for you :(${RESET}`);

        // Add dependencies for Dungeons
        this.addDependency("Crypt Reminder Time", "Enable Crypt Reminder");
        this.addDependency("Crypt Reminder Message", "Enable Crypt Reminder");
        this.addDependency("Enable Crypt Reminder Popup", "Enable Crypt Reminder");

        // Add dependencies for Party Commands
        const partyCommands = ["RNG Command &3!rng&r", "Coinflip Command &3!cf&r", "8ball Command &3!8ball&r", "Throw Command &3!throw&r", "Dice Command &3!dice&r", "Simp Command &3!simp&r", "Sus Command &3!sus&r", "Kick Command (Party) &3!<kick, pk>&r", "Invite Command (Party) &3!p&r "];
        partyCommands.forEach(command => this.addDependency(command, "Enable Party Commands"));

        // Add dependencies for DM Commands
        this.addDependency("Invite Command (DMs) &3!p&r", "Enable DM Commands");
        this.addDependency("Kick Command (DMs) &3!kick&r", "Enable DM Commands");
    }
}

export default new Config();