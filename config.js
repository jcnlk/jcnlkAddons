import { 
    @Vigilant, 
    @SwitchProperty, 
    @DecimalSliderProperty, 
    @TextProperty, 
    @SliderProperty,  
    @ButtonProperty,    
    @CheckboxProperty   } from "Vigilance";

const moduleVersion = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).version;
const moduleAuthor = JSON.parse(FileLib.read("jcnlkAddons", "metadata.json")).author;
const configHeader = `&8[&6jcnlkAddons&8] &ev${moduleVersion} \nMade by ${moduleAuthor}`

@Vigilant("jcnlkAddons", "jcnlkAddons", {
    getCategoryComparator: () => (a, b) => {
        const order = ["General", "Dungeons", "F7/M7", "Commands", "HUD"];
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
        description: `Enable custom emotes in chat. \nAdd custom emotes with &b/ja emote&r.`,
        category: "General",
        subcategory: "Chat"
    })
    customEmotes = true;

    @SwitchProperty({
        name: "UwUAddons Hider",
        description: "Hide messages sent by UwUAddons.",
        category: "General",
        subcategory: "Chat"
    })
    hideUwUAddons = true;

    @SwitchProperty({
        name: "Hide Non-Rank Invites",
        description: "Hides party invites sent by player without rank.",
        category: "General",
        subcategory: "Chat"
    })
    hideNonRankInvites = true;

    @SwitchProperty({
        name: "Hide Useless Messages",
        description: "Hides useless or spammy messages in your chat.",
        category: "General",
        subcategory: "Chat"
    })
    hideUselessMessages = true;

    @SwitchProperty({
        name: "Check for Updates",
        description: `Automatically checks if you run an outdated version.\nManually check for updates with &b/ja update&r.`,
        category: "General",
        subcategory: "Check for Updates"
    })
    updateChecker = true;

    @SwitchProperty({
        name: "Enable Reminders",
        description: `Enable the reminder feature. \nAdd reminder with &b/ja reminder&r.`,
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
        description: `Time in minutes to remind about missing crypts \n(0 to turn it &cOFF&r).`,
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        minF: 0.0,
        maxF: 3.0,
        decimalPlaces: 1
    })
    cryptReminderTime = 1.0;

    @TextProperty({
        name: "Crypt Reminder Message",
        description: `Message to send as crypt reminder. \nUse &b{count}&r for the number of needed crypts.`,
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        placeholder: "Crypt Reminder: We need {count} more crypts!"
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
        description: `Highlight loot in dungeon chests. \n(&aGood Loot&r, &eMid Loot&r, &cBad Loot&r).`,
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
        subcategory: "General"
    })
    maskTimer = true;

    @SwitchProperty({
        name: "Mask Reminder",
        description: "Reminds you to equip Bonzo/Spirit Mask before P3 has started.",
        category: "F7/M7",
        subcategory: "General"
    })
    MaskReminder = true;

    @SwitchProperty({
        name: "Toggle Positional Messages",
        description: "Announce your position at specific spots (P2, EE2, EE3, At Core, In Core, At Mid, At P5).",
        category: "F7/M7",
        subcategory: "Positional Messages"
    })
    togglePosMsg = true;

    @SwitchProperty({
        name: "Toggle Positional Titles",
        description: "Show a title when your team is at a specific spots (P2, EE2, EE3, At Core, In Core, At Mid, At P5).",
        category: "F7/M7",
        subcategory: "Positional Titles"
    })
    togglePosTitles = true;

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
        this.setCategoryDescription("General", `${configHeader}\n\n&7&oRelated Commands: /ja <emote, reminder, update, help>`);
        this.setCategoryDescription("Dungeons", `${configHeader}`);
        this.setCategoryDescription("F7/M7", `${configHeader}`);
        this.setCategoryDescription("Commands", `${configHeader}`);
        this.setCategoryDescription("HUD", `${configHeader}\n\n&7&oRelated Commands: /ja <hud>`);

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