import { 
    @Vigilant, 
    @SwitchProperty, 
    @DecimalSliderProperty, 
    @TextProperty, 
    @SliderProperty, 
    @ButtonProperty, 
    @SelectorProperty } from "Vigilance";

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
        subcategory: "Chat Filters"
    })
    hideUwUAddons = true;

    @SwitchProperty({
        name: "Hide Non-Rank Invites",
        description: "Hides party invites sent by players without a rank.",
        category: "General",
        subcategory: "Chat Filters"
    })
    hideNonRankInvites = true;

    @SwitchProperty({
        name: "Hide Useless Messages",
        description: "Hides useless or spammy messages in your chat.",
        category: "General",
        subcategory: "Chat Filters"
    })
    hideUselessMessages = true;

    @SwitchProperty({
        name: "Check for Updates",
        description: `Automatically checks if you are running an outdated version.\nManually check for updates with &b/ja update&r.`,
        category: "General",
        subcategory: "Updates"
    })
    updateChecker = true;

    @SwitchProperty({
        name: "Enable Reminders",
        description: `Enable the reminder feature. \nAdd reminders with &b/ja reminder&r.`,
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

    @SwitchProperty({
        name: "Enable Crypt Reminder Popup",
        description: "Show a popup for crypt reminder in addition to the party chat message.",
        category: "Dungeons",
        subcategory: "Crypt Reminder"
    })
    cryptReminderPopup = true;

    @SwitchProperty({
        name: "Enable Dungeon Chest Highlighting",
        description: `Highlight loot in dungeon chests based on profit. \n(&aGood Loot&r, &eMid Loot&r, &cBad Loot&r).`,
        category: "Dungeons",
        subcategory: "Chest Highlighting"
    })
    dungeonChestHighlighting = true;

    @SwitchProperty({
        name: "Fire Freeze Notification",
        description: "Shows a notification for when to use Fire Freeze Staff in M3.",
        category: "Dungeons",
        subcategory: "M3 Features"
    })
    FireFreezeNotifier = true

    @SwitchProperty({
        name: "Quiz Timer",
        description: "Show a timer indicating how long you need to wait before you can answer the quiz.",
        category: "Dungeons",
        subcategory: "Puzzles"
    })
    quizTimer = true;

    @SwitchProperty({
        name: "Hide Players After Leap",
        description: "Hide nearby players after using a Spirit Leap for better visibility.",
        category: "Dungeons",
        subcategory: "Spirit Leap"
    })
    enablePlayerHiding = true;

    @SliderProperty({
        name: "Player Hide Duration",
        description: "Time in seconds to hide players for after leaping.",
        category: "Dungeons",
        subcategory: "Spirit Leap",
        min: 1,
        max: 10,
    })
    hidePlayerTime = 3;

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
        description: "Announce your position to party chat at specific spots (P2, EE2, EE3, At Core, In Core, At Mid, At P5).",
        category: "F7/M7",
        subcategory: "General"
    })
    togglePosMsg = true;

    @SwitchProperty({
        name: "Toggle Positional Titles",
        description: "Show a title when your team is at a specific spots (P2, EE2, EE3, At Core, In Core, At Mid, At P5).",
        category: "F7/M7",
        subcategory: "General"
    })
    togglePosTitles = true;

    //////////// Commands Settings //////////
    @SwitchProperty({
        name: "Enable DM Commands",
        description: "Enable or disable all Direct Message commands.",
        category: "Commands",
        subcategory: "DM Commands"
    })
    enableDmCommands = false;

    @SwitchProperty({
        name: "Invite Command (DMs) &3!p&r",
        description: "Enable the party invite command in direct messages.",
        category: "Commands",
        subcategory: "DM Commands"
    })
    partyCommand = false;

    @SwitchProperty({
        name: "Kick Command (DMs) &3!kick&r",
        description: "Enable the party kick command in direct messages.",
        category: "Commands",
        subcategory: "DM Commands"
    })
    kickCommand = false;

    ////////// HUD Settings //////////
    @ButtonProperty({
        name: "Edit HUD Positions",
        description: "Open the HUD editor to customize position and scale of all HUD elements.",
        placeholder: "Open Editor",
        category: "HUD",
        subcategory: "HUD Settings"
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
        this.addDependency("Player Hide Duration", "Hide Players After Leap");
    
        // Add dependencies for DM Commands
        this.addDependency("Invite Command (DMs) &3!p&r", "Enable DM Commands");
        this.addDependency("Kick Command (DMs) &3!kick&r", "Enable DM Commands");
    }
}

export default new Config();