import {   
    DARK_RED, 
    GOLD, 
    GRAY, 
    DARK_GRAY, 
    GREEN, 
    AQUA, 
    RED,  
    YELLOW, 
    WHITE, 
    BOLD, 
    ITALIC, 
    RESET,
    ModuleVersion,   
    Creator         } from "./utils/Constants";
import { 
    @Vigilant, 
    @SwitchProperty, 
    @DecimalSliderProperty, 
    @TextProperty, 
    @SliderProperty, 
    @SelectorProperty, 
    @ColorProperty, 
    @ButtonProperty,    
    @CheckboxProperty   } from 'Vigilance';

const ConfigHeader = `${DARK_GRAY}[${GOLD}jcnlkAddons${DARK_GRAY}]${RESET} ${YELLOW}v${ModuleVersion} \nMade by ${Creator}${RESET}`

@Vigilant("jcnlkAddons", "jcnlkAddons", {
    getCategoryComparator: () => (a, b) => {
        const order = ["General", "Dungeons", "Party Commands", "DM Commands", "Miscellaneous", "HUD", "WIP", "Dev Stuff"];
        return order.indexOf(a.name) - order.indexOf(b.name);
    }
})

class Config {
    //General Settings
    @SwitchProperty({
        name: "Enable Attribute Abbreviations",
        description: "Show attribute abbreviations on items in inventory.",
        category: "General",
        subcategory: "Attributes"
    })
    enableAttributeAbbreviations = true;

    @SwitchProperty({
        name: "Enable Custom Emotes",
        description: `Enable the use of custom emotes in chat. \nAdd custom emotes with ${AQUA}/ja emote${RESET}.`,
        category: "General",
        subcategory: "Chat"
    })
    enableCustomEmotes = true;

    //Reminder Settings
    @SwitchProperty({
        name: "Enable Reminders",
        description: "Enable the reminder feature.",
        category: "General",
        subcategory: "Reminders"
    })
    enableReminders = true;

    @SelectorProperty({
        name: "Reminder Popup Color",
        description: "Choose the color for reminder popups.",
        category: "General",
        subcategory: "Reminders",
        options: ["§cRed§r", "§aGreen§r", "§bCyan§r", "§eYellow§r", "§fWhite§r", "§dLight Pink§r"]
    })
    reminderPopupColor = 0;

    @SelectorProperty({
        name: "Reminder Sound",
        description: "Choose the sound for reminders.",
        category: "General",
        subcategory: "Reminders",
        options: ["Orb", "Level Up", "Pop", "Note Pling", "Ender Dragon Growl"]
    })
    reminderSound = 0;

    @DecimalSliderProperty({
        name: "Reminder Sound Volume",
        description: `Volume of the reminder sound \n(0 to turn it ${RED}OFF${RESET}).`,
        category: "General",
        subcategory: "Reminders",
        minF: 0,
        maxF: 2.0,
        decimalPlaces: 1
    })
    reminderSoundVolume = 0.5;

    @SwitchProperty({
        name: "Enable Todos",
        description: `Enable the todo feature. \nAdd Todos with ${AQUA}/todo${RESET}.`,
        category: "General",
        subcategory: "Todo"
    })
    enableTodos = true;

    @SwitchProperty({
        name: "Show Todos on Skyblock Join",
        description: "Automatically shows your todo list when joining Skyblock.",
        category: "General",
        subcategory: "Todo"
    })
    showTodosOnJoin = true;

    @SwitchProperty({
        name: "Clear Completed Todos",
        description: "Automatically remove todos when marked as completed.",
        category: "General",
        subcategory: "Todo"
    })
    clearCompletedTodos = true;

    @SwitchProperty({
        name: "Save Todos",
        description: "Save todos between game sessions.",
        category: "General",
        subcategory: "Todo"
    })
    saveTodos = true;

    // Dungeons
    @SwitchProperty({
        name: "Enable Crypt Reminder",
        description: "Enable the crypt reminder feature in dungeons.",
        category: "Dungeons",
        subcategory: "Crypt Reminder"
    })
    enableCryptReminder = true;

    @DecimalSliderProperty({
        name: "Crypt Reminder Time",
        description: `Time in minutes to remind about crypts \n(0 to turn it ${RED}OFF${RESET}).`,
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        minF: 0.0,
        maxF: 3.0,
        decimalPlaces: 1
    })
    cryptReminderTime = 1.5;

    @TextProperty({
        name: "Crypt Reminder Message",
        description: `Message to send as a crypt reminder. \nUse ${AQUA}{count}${RESET} for the number of needed crypts.`,
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        placeholder: "We need {count} more crypts!"
    })
    cryptReminderMessage = "Crypt Reminder: We need {count} more Crypts!";

    @CheckboxProperty({
        name: "Enable Crypt Reminder Popup",
        description: "Show a popup for crypt reminders.",
        category: "Dungeons",
        subcategory: "Crypt Reminder"
    })
    enableCryptReminderPopup = true;

    @SelectorProperty({
        name: "Crypt Reminder Popup Color",
        description: "Choose the color for crypt reminder popups.",
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        options: ["§cRed§r", "§aGreen§r", "§bBlue§r", "§eYellow§r", "§fWhite§r", "§dPink§r"]
    })
    cryptReminderPopupColor = 0;
    
    @SelectorProperty({
        name: "Crypt Reminder Sound",
        description: "Choose the sound for crypt reminders.",
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        options: ["Orb", "Level Up", "Pop", "Note Pling", "Ender Dragon Growl"]
    })
    cryptReminderSound = 0;
    
    @DecimalSliderProperty({
        name: "Crypt Reminder Sound Volume",
        description: `Volume of the crypt reminder sound \n(0 to turn it ${RED}OFF${RESET}).`,
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        minF: 0,
        maxF: 2.0,
        decimalPlaces: 1
    })
    cryptReminderSoundVolume = 0.5;

    @SwitchProperty({
        name: "Enable Dungeon Chest Highlighting",
        description: "Highlights loot in dungeon chests.",
        category: "Dungeons",
        subcategory: "Dungeon Loot Highlighting"
    })
    enableDungeonChestHighlighting = true;
    
    @SwitchProperty({
        name: "Enable Dungeon Loot Chat Output",
        description: "Displays dungeon loot in the chat.",
        category: "Dungeons",
        subcategory: "Dungeon Loot Highlighting"
    })
    enableDungeonLootChatOutput = false;

    @SwitchProperty({
        name: "Announce Pre Enter P2",
        description: `Announce to Party Chat when you Pre Enter P2 (Storm Phase). \n${DARK_RED}Technically a chat macro [UAYOR]!${RESET}`,
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    announcePreEnterP2 = true;

    @SwitchProperty({
        name: "Mask Reminder",
        description: "Reminds you to equip a Bonzo/Spirit Mask before P3.",
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    MaskReminder = true;

    @SwitchProperty({
        name: "Announce Pre Enter P3",
        description: `Announce to Party Chat when you Pre Enter in Phase 3 (Terminal Phase). \n${DARK_RED}Technically a chat macro [UAYOR]!${RESET}`,
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    announcePreEnterPhase3 = true

    @SwitchProperty({
        name: "Enable Pre Enter Titles",
        description: "Show titles when players announce Pre Enter positions in party chat.",
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    PreEnterTitles = true;

    @SwitchProperty({
        name: "Announce i4 Position",
        description: `Announce your i4 position in Party Chat (i4 Entry, Moving to i4, At i4). \n${DARK_RED}Technically a chat macro [UAYOR]!${RESET}`,
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    announcei4Position = true;

    @SwitchProperty({
        name: "i4 Position Titles",
        description: "Show titles when players announce i4 positions in party chat.",
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    i4PositionTitles = true;
    
    @SwitchProperty({
        name: "Announce Pre Dev Position",
        description: `Announce your position during Pre Dev to Party Chat. \n${DARK_RED}Technically a chat macro [UAYOR]!${RESET}`,
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    announcePreDevPosition = true;

    @SwitchProperty({
        name: "Announce Pre Enter P4",
        description: `Announce your Pre Enter P4 position to Party Chat. \n${DARK_RED}Technically a chat macro [UAYOR]!${RESET}`,
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    announcePreP4 = true;

    @SwitchProperty({
        name: "Announce Pre Enter P5",
        description: `Announce your Pre Enter P5 position to Party Chat. \n${DARK_RED}Technically a chat macro [UAYOR]!${RESET}`,
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    announcePreP5 = true;

    @SwitchProperty({
        name: "Pre Enter P2 Titles",
        description: "Gives you a title when someone Pre Enter P2.",
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    PreP2Titles = true;

    @SwitchProperty({
        name: "Pre Enter P4 Titles",
        description: "Gives you a title when someone Pre Enter P4.",
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    PreP4Titles = true;

    @SwitchProperty({
        name: "Pre Enter P5 Titles",
        description: "Gives you a title when Healer Pre Enter P5.",
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    PreP5Titles = true;

    @SwitchProperty({
        name: "Pre Dev Title",
        description: "Gives you a title when someone is at SS (Simon Says).",
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    PreDevTitles = true;

    @SwitchProperty({
        name: "EE2 Helper",
        description: "Gives you a title when SS (Simon Says) is 4/5. This is Archer only!",
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    EE2Helper = true;

    @SwitchProperty({
        name: "Announce SS Progression",
        description: "Announces your SS (Simon Says) Progression to Party Chat. Only Announces if you are at SS.",
        category: "Dungeons",
        subcategory: "F7/M7"
    })
    announceSSProgression = true;

    @SwitchProperty({
        name: "Fire Freeze Notification",
        description: "Tells you when to Fire Freeze in M3.",
        category: "Dungeons",
        subcategory: "M3"
    })
    FireFreezeNotifier = true

    @SwitchProperty({
        name: "Hide Players After Leap",
        description: "Hide nearby players on after leaping to them.",
        category: "Dungeons",
        subcategory: "Miscellaneous"
    })
    enablePlayerHiding = true;

    // Party Commands
    @SwitchProperty({
        name: "Enable Party Commands",
        description: "Enable or disable all party commands.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    enablePartyCommands = true;

    @SwitchProperty({
        name: "RNG Command &3!rng&r",
        description: "Enable the rng command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    rngCommand = true;

    @SwitchProperty({
        name: "Coinflip Command &3!cf&r",
        description: "Enable the coinflip command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    coinFlipCommand = true;

    @SwitchProperty({
        name: "8ball Command &3!8ball&r",
        description: "Enable the 8ball command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    eightBallCommand = true;

    @SwitchProperty({
        name: "Throw Command &3!throw&r",
        description: "Enable the throw command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    throwCommand = true;

    @SwitchProperty({
        name: "Dice Command &3!dice&r",
        description: "Enable the dice command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    diceCommand = true;

    @SwitchProperty({
        name: "Simp Command &3!simp&r",
        description: "Enable the simp command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    simpCommand = true;

    @SwitchProperty({
        name: "Sus Command &3!sus&r",
        description: "Enable the sus command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    susCommand = true;

    @SwitchProperty({
        name: "Kick Command (Party) &3!<kick, pk>&r",
        description: "Enable the kick command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    partyKickCommand = true;

    @SwitchProperty({
        name: "Invite Command (Party) &3!p&r ",
        description: "Enable the invite command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    partyInviteCommand = true;

    @SwitchProperty({
        name: "Reminder Command &3!reminder&r",
        description: "Enable the reminder command in Party Chat.",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    reminderCommand = true;

    //DM Commands
    @SwitchProperty({
        name: "Enable DM Commands",
        description: "Enable or disable all DM commands.",
        category: "DM Commands",
        subcategory: "DM Commands"
    })
    enableDmCommands = true;

    @SwitchProperty({
        name: "Invite Command (DMs) &3!p&r",
        description: "Enable the invite command in DMs.",
        category: "DM Commands",
        subcategory: "DM Commands"
    })
    partyCommand = true;

    @SwitchProperty({
        name: "Kick Command (DMs) &3!kick&r",
        description: "Enable the kick Command command in DMs.",
        category: "DM Commands",
        subcategory: "DM Commands"
    })
    kickCommand = true;

    //Miscellaneous
    @SwitchProperty({
        name: "Enable Math Teacher Solver",
        description: "Enable the solver for Math Teacher.",
        category: "Miscellaneous",
        subcategory: "Great Spook"
    })
    enableMathTeacherSolver = true;
    
    @SwitchProperty({
        name: "Auto solve Math Teacher",
        description: `Automatically send the answer to Math Teacher questions in chat. \n${DARK_RED}Technically a chat macro [UAYOR]!${RESET}`,
        category: "Miscellaneous",
        subcategory: "Great Spook"
    })
    autoSendMathTeacherAnswer = false;
    
    @SwitchProperty({
        name: "Enable Public Speaking Demon Solver",
        description: "Enable the solver for Public Speaking Demon.",
        category: "Miscellaneous",
        subcategory: "Great Spook"
    })
    enablePublicSpeakingDemonSolver = true;
    
    @SwitchProperty({
        name: "Auto solve Public Speaking Demon",
        description: `Automatically send a response to Public Speaking Demon in chat.\n${DARK_RED}Technically a chat macro [UAYOR]!${RESET}`,
        category: "Miscellaneous",
        subcategory: "Great Spook"
    })
    autoSendPublicSpeakingResponse = false;
    
    @SwitchProperty({
        name: "Auto solve Commitment Phobia",
        description: `Automatically executes the command to solve Commitment Phobia. \n\n${RED}${BOLD}Note:${RESET} This feature ${RED}does not${RESET} simulate clicking the sign button.\nIt only executes the command sent by the game.\n\n${DARK_RED}Technically a chat macro so [UAYOR]!${RESET}`,
        category: "Miscellaneous",
        subcategory: "Great Spook"
    })
    autoSendCommitmentPhobiaResponse = false;

    @SwitchProperty({
        name: "Show Autopet Rule Title",
        description: "Show a Title when a Autopet Rule get triggered",
        category: "Miscellaneous",
        subcategory: "Autopet Rule Title"
    })
    autopetRuleTitle = true

    //HUD
    @SwitchProperty({
        name: "Enable Test HUD",
        description: "Shows a test HUD on your screen (Currently not cuz i disabled it).",    
        category: "HUD",
        subcategory: "Test HUD"
    })
    enableTestHud = true;

    @ButtonProperty({
        name: "Edit HUD Positions",
        description: "Click to open the HUD editor. Drag elements to move them and scroll to resize",
        category: "HUD",
        subcategory: "HUD Editor",
        placeholder: "Edit"
    })
    openHudEditor() {
        ChatLib.command("ja hud", true);
    }

    //WIP Stuff
    @SwitchProperty({
        name: "Enable Chest Highlighting",
        description: `Highlights loot in kuudra chests according to their value \n(${GREEN}God Roll${RESET}, ${YELLOW}Good Roll${RESET}, ${RED}Bad Roll${RESET}).`,
        category: "WIP",
        subcategory: `Kuudra Loot Highlight (${GREEN}SHOULD WORK${RESET})`
    })
    enableChestScanning = true;

    @SwitchProperty({
        name: "Enable Chat Output of Chest Content",
        description: "Displays kuudra loot in Chat.",
        category: "WIP",
        subcategory: `Kuudra Loot Highlight (${GREEN}SHOULD WORK${RESET})`
    })
    enableAttributeChatOutput = true;
    
    //Dev Stuff
    @SwitchProperty({
        name: "Debug Mode",
        description: `Enable detailed debug messages for troubleshooting. \n${GRAY}(We don't talk about the messed up debgging..)${RESET}`,
        category: "Dev Stuff",
        subcategory: "Debug"
     })
    debugMode = false;

    constructor() {
        this.initialize(this);

        // Set category descriptions
        this.setCategoryDescription("General", `${ConfigHeader}\n\n${GRAY}${ITALIC}Related Commands: /ja <emote, help>, /reminder, /todo${RESET}`);
        this.setCategoryDescription("Dungeons", `${ConfigHeader}\n\n${DARK_RED}${BOLD}CAUTION: Features marked with '[UAYOR]' are technically macros,\n${DARK_RED}${BOLD} so use at your own risk${RESET}`);
        this.setCategoryDescription("Party Commands", `${ConfigHeader}\n\n${DARK_RED}${BOLD}Technically a chat macro [UAYOR]${RESET}`);
        this.setCategoryDescription("DM Commands", `${ConfigHeader}\n\n${DARK_RED}${BOLD}Technically a chat macro [UAYOR]${RESET}`);
        this.setCategoryDescription("Miscellaneous", `${ConfigHeader}\n\n${DARK_RED}${BOLD}CAUTION: Features marked with '[UAYOR]' are technically macros,\n${DARK_RED}${BOLD} so use at your own risk${RESET}`);
        this.setCategoryDescription("HUD", `${ConfigHeader}\n\n${GRAY}${ITALIC}Related Commands: /ja <hud>${RESET}`);
        this.setCategoryDescription("WIP", `${ConfigHeader}\n\n${WHITE}Just some Work In Progess Stuff.${RESET}`);
        this.setCategoryDescription("Dev Stuff", `${ConfigHeader}\n\n${GRAY}${ITALIC}Related Commands: /ja <test>, /getcurrentarea, /getdungeoninfo, /getitemid,\n§7§o/getenchantedbookdetail§r\n\n${WHITE}No interesting Stuff for you :(${RESET}`);

        // Add dependencies for General
        this.addDependency("Reminder Popup Color", "Enable Reminders");
        this.addDependency("Reminder Sound", "Enable Reminders");
        this.addDependency("Reminder Sound Volume", "Enable Reminders");
        this.addDependency("Show Todos on Skyblock Join","Enable Todos");
        this.addDependency("Clear Completed Todos","Enable Todos");
        this.addDependency("Save Todos","Enable Todos");


        // Add dependencies for Dungeons
        this.addDependency("Crypt Reminder Time", "Enable Crypt Reminder");
        this.addDependency("Crypt Reminder Message", "Enable Crypt Reminder");
        this.addDependency("Enable Crypt Reminder Popup", "Enable Crypt Reminder");
        this.addDependency("Crypt Reminder Popup Color", "Enable Crypt Reminder");
        this.addDependency("Crypt Reminder Sound", "Enable Crypt Reminder");
        this.addDependency("Crypt Reminder Sound Volume", "Enable Crypt Reminder");
        this.addDependency("Enable Dungeon Loot Chat Output", "Enable Dungeon Chest Highlighting");

        // Add dependencies for Party Commands
        const partyCommands = ["RNG Command &3!rng&r", "Coinflip Command &3!cf&r", "8ball Command &3!8ball&r", "Throw Command &3!throw&r", "Dice Command &3!dice&r", "Simp Command &3!simp&r", "Sus Command &3!sus&r", "Kick Command (Party) &3!<kick, pk>&r", "Invite Command (Party) &3!p&r ", "Reminder Command &3!reminder&r"];
        partyCommands.forEach(command => this.addDependency(command, "Enable Party Commands"));

        // Add dependencies for DM Commands
        this.addDependency("Invite Command (DMs) &3!p&r", "Enable DM Commands");
        this.addDependency("Kick Command (DMs) &3!kick&r", "Enable DM Commands");

        // Add dependencies for Miscellaneous
        this.addDependency("Auto solve Math Teacher", "Enable Math Teacher Solver");
        this.addDependency("Auto solve Public Speaking Demon", "Enable Public Speaking Demon Solver");

        // Add dependencies for WIP
        this.addDependency("Enable Chat Output of Chest Content", "Enable Chest Highlighting");
    }
}

export default new Config();