import { configHeader } from "./utils/Utils";
import { 
    @Vigilant, 
    @SwitchProperty, 
    @TextProperty, 
    @SliderProperty, 
    @ButtonProperty, 
    @SelectorProperty } from "Vigilance";

@Vigilant("jcnlkAddons", "jcnlkAddons", {
    getCategoryComparator: () => (a, b) => {
        const order = ["General", "Dungeons", "F7/M7", "HUD"];
        return order.indexOf(a.name) - order.indexOf(b.name);
    }
})

class Config {
    ////////// General Settings //////////
    @SwitchProperty({
        name: "Show Autopet Rule Title",
        description: "Show a title when an Autopet Rule gets triggered.",
        category: "General",
        subcategory: "Autopet Rule Title"
    })
    autopetRuleTitle = false;

    @SwitchProperty({
        name: "Enable Custom Emotes",
        description: `Enable custom emotes in chat. \nAdd custom emotes with &b/ja emote&r.`,
        category: "General",
        subcategory: "Chat"
    })
    customEmotes = false;

    @SwitchProperty({
        name: "UwUAddons Hider",
        description: "Hide messages sent by UwUAddons.",
        category: "General",
        subcategory: "Chat Filters"
    })
    hideUwUAddons = false;

    @SwitchProperty({
        name: "Hide Non-Rank Invites",
        description: "Hides party invites sent by players without a rank.",
        category: "General",
        subcategory: "Chat Filters"
    })
    hideNonRankInvites = false;

    @SwitchProperty({
        name: "Hide Useless Messages",
        description: "Hides useless or spammy messages in your chat.",
        category: "General",
        subcategory: "Chat Filters"
    })
    hideUselessMessages = false;

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
    enableReminders = false;

    ////////// Dungeons Settings //////////
    @SwitchProperty({
        name: "Crypt Reminder",
        description: "Enable the crypt reminder feature in dungeons.",
        category: "Dungeons",
        subcategory: "Crypt Reminder"
    })
    cryptReminder = false;

    @SliderProperty({
        name: "Trigger Time",
        description: `Time in seconds to remind about missing crypts \n(0 to turn it &cOFF&r).`,
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        min: 0,
        max: 120,
    })
    cryptReminderTime = 60;

    @SwitchProperty({
        name: "Announce Crypts",
        description: "Announce the amount of missing crypts in party chat.",
        category: "Dungeons",
        subcategory: "Crypt Reminder",
    })
    cryptReminderAnnounce = false;

    @SwitchProperty({
        name: "Missing Crypts Title",
        description: "Show a title with the amount of missing crypts.",
        category: "Dungeons",
        subcategory: "Crypt Reminder"
    })
    cryptReminderPopup = false;

    @SwitchProperty({
        name: "Enable Dungeon Chest Highlighting",
        description: `Highlight loot in dungeon chests based on profit. \n(&aGood Loot&r, &eMid Loot&r, &cBad Loot&r).`,
        category: "Dungeons",
        subcategory: "Chest Highlighting"
    })
    dungeonChestHighlighting = false;

    @SwitchProperty({
        name: "Auto Open Potionbag On Start",
        description: "Auto opens potionbag on dungeon start. ",
        category: "Dungeons",
        subcategory: "General"
    })
    autoOpenPotionbag = false;

    @SwitchProperty({
        name: "Fire Freeze Notification",
        description: "Shows a notification for when to use Fire Freeze Staff in M3.",
        category: "Dungeons",
        subcategory: "M3 Features"
    })
    FireFreezeNotifier = false;

    @SwitchProperty({
        name: "Quiz Timer",
        description: "Show a timer indicating how long you need to wait before you can answer the quiz.",
        category: "Dungeons",
        subcategory: "Puzzles"
    })
    quizTimer = false;

    @SwitchProperty({
        name: "Leap Announce",
        description: "Announce in party chat who you are leaping to.",
        category: "Dungeons",
        subcategory: "Leaping"
    })
    leapAnnounce = false;

    @SelectorProperty({
        name: "Hide Leap Messages",
        description: "Hides leap messages when:",
        category: "Dungeons",
        subcategory: "Leaping",
        options: ["Never", "Hide Own", "Doesn't include self", "Always"]
    })
    hideLeapMessage = 0;

    @SwitchProperty({
        name: "Hide Players After Leap",
        description: "Hide nearby players after using a Spirit Leap for better visibility.",
        category: "Dungeons",
        subcategory: "Leaping"
    })
    enablePlayerHiding = false;

    @SliderProperty({
        name: "Player Hide Duration",
        description: "Time in seconds to hide players for after leaping.",
        category: "Dungeons",
        subcategory: "Leaping",
        min: 1,
        max: 10,
    })
    hidePlayerTime = 3;

    ////////// F7/M7 Settings //////////
    @SwitchProperty({
        name: "Core Times",
        description: "Track the time players needed to enter core.",
        category: "F7/M7",
        subcategory: "Core"
    })
    coreTimes = false;
    
    @SwitchProperty({
        name: "Announce Core Times To Party",
        description: "Announce the core times in party chat.",
        category: "F7/M7",
        subcategory: "Core"
    })
    coreTimesAnnounce = false;
    
    @SwitchProperty({
        name: "Show Core Times in Chat",
        description: "Shows the core times in your chat.",
        category: "F7/M7",
        subcategory: "Core"
    })
    coreTimesChat = false;

    @SwitchProperty({
        name: "Mask Timer",
        description: "Displays a tick-accurate HUD for mask and Phoenix cooldowns, accounting for Mage cooldown reduction and class level.",
        category: "F7/M7",
        subcategory: "General"
    })
    maskTimer = false;

    @SwitchProperty({
        name: "Mask Reminder",
        description: "Reminds you to equip Bonzo/Spirit Mask before P3 has started.",
        category: "F7/M7",
        subcategory: "General"
    })
    MaskReminder = false;

    @SwitchProperty({
        name: "Melody Warning",
        description: "Displays a warning when a player has Melody terminal in Goldor phase.",
        category: "F7/M7",
        subcategory: "General"
    })
    melodyWarning = false;

    @SwitchProperty({
        name: "Toggle Positional Messages",
        description: "Announce your position to party chat at specific spots (At P2, At SS, EE2, High EE2, EE2 Safespot, EE3, EE3 Safespot, At Core, Inside Goldor Tunnel, At Mid, At Pre4 Entry, At P5).",
        category: "F7/M7",
        subcategory: "General"
    })
    togglePosMsg = false;

    @SwitchProperty({
        name: "Toggle Positional Titles",
        description: "Show a title when your team is at a specific spots (At P2, At SS, EE2, High EE2, EE2 Safespot, EE3, EE3 Safespot, At Core, Inside Goldor Tunnel, At Mid, At Pre4 Entry, At P5).",
        category: "F7/M7",
        subcategory: "General"
    })
    togglePosTitles = false;

    @SwitchProperty({
    name: "Leap Notifier",
    description: "Show how many players have leaped and notify when everyone has leaped.",
    category: "F7/M7",
    subcategory: "Leaping"
    })
    leapNotifier = false;

    @SwitchProperty({
        name: "Show Title When All Leaped",
        description: "Display a title when everyone has leaped.",
        category: "F7/M7",
        subcategory: "Leaping"
    })
    leapNotifierTitle = true;

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

        this.setCategoryDescription("General", `${configHeader}\n\n&7&oRelated Commands: /ja <emote, reminder, update, help>`);
        this.setCategoryDescription("Dungeons", `${configHeader}`);
        this.setCategoryDescription("F7/M7", `${configHeader}`);
        this.setCategoryDescription("HUD", `${configHeader}\n\n&7&oRelated Commands: /ja <hud>`);

        this.addDependency("Trigger Time", "Crypt Reminder");
        this.addDependency("Announce Crypts", "Crypt Reminder");
        this.addDependency("Missing Crypts Title", "Crypt Reminder");
        this.addDependency("Player Hide Duration", "Hide Players After Leap");
        this.addDependency("Announce Core Times To Party", "Core Times");
        this.addDependency("Show Core Times in Chat", "Core Times");
        this.addDependency("Show Title When All Leaped", "Leap Notifier");
    }
}

export default new Config();