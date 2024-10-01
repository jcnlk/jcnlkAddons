import { @Vigilant, @SwitchProperty, @DecimalSliderProperty, @TextProperty, @SliderProperty, @SelectorProperty } from 'Vigilance';

@Vigilant("jcnlkAddons", "jcnlkAddons", {
    getCategoryComparator: () => (a, b) => {
        const order = ["General", "Dungeons", "Party Commands", "DM Commands", "Spam Protection", "WIP", "Dev Stuff"];
        return order.indexOf(a.name) - order.indexOf(b.name);
    }
})
class Config {
    //General Settings
    @SwitchProperty({
        name: "Enable Attribute Abbreviations",
        description: "Show attribute abbreviations on items in inventory",
        category: "General",
        subcategory: "Attributes"
    })
    enableAttributeAbbreviations = true;

    //Reminder Settings
    @SwitchProperty({
        name: "Enable Reminders",
        description: "Enable the reminder feature",
        category: "General",
        subcategory: "Reminders"
    })
    enableReminders = true;

    @SelectorProperty({
        name: "Reminder Popup Color",
        description: "Choose the color for reminder popups",
        category: "General",
        subcategory: "Reminders",
        options: ["§cRed§r", "§aGreen§r", "§bBlue§r", "§eYellow§r", "§fWhite§r", "§dPink§r"]
    })
    reminderPopupColor = 0;

    @SelectorProperty({
        name: "Reminder Sound",
        description: "Choose the sound for reminders",
        category: "General",
        subcategory: "Reminders",
        options: ["Orb", "Level Up", "Pop", "Note Pling", "Ender Dragon Growl"]
    })
    reminderSound = 0;

    @DecimalSliderProperty({
        name: "Reminder Sound Volume",
        description: "Volume of the reminder sound (0 to turn it §cOFF§r)",
        category: "General",
        subcategory: "Reminders",
        minF: 0,
        maxF: 2.0,
        decimalPlaces: 1
    })
    reminderSoundVolume = 0.5;

    // Dungeons
    @SwitchProperty({
        name: "Enable Crypt Reminder",
        description: "Enable the crypt reminder feature in dungeons",
        category: "Dungeons",
        subcategory: "Crypt Reminder"
    })
    enableCryptReminder = true;

    @DecimalSliderProperty({
        name: "Crypt Reminder Time",
        description: "Time in minutes to remind about crypts (0 to turn it §cOFF§r)",
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        minF: 0.0,
        maxF: 5.0,
        decimalPlaces: 1
    })
    cryptReminderTime = 1.5;

    @TextProperty({
        name: "Crypt Reminder Message",
        description: "Message to send as a crypt reminder. Use §b{count}§r for the number of needed crypts.",
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        placeholder: "We need {count} more crypts!"
    })
    cryptReminderMessage = "Crypt Reminder: We need {count} more Crypts!";

    // Party Commands
    @SwitchProperty({
        name: "Enable Party Commands",
        description: "Enable or disable all party commands",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    enablePartyCommands = true;

    @SwitchProperty({
        name: "!rng",
        description: "Enable the !rng command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    rngCommand = true;

    @SwitchProperty({
        name: "!cf",
        description: "Enable the !cf command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    coinFlipCommand = true;

    @SwitchProperty({
        name: "!8ball",
        description: "Enable the !8ball command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    eightBallCommand = true;

    @SwitchProperty({
        name: "!throw",
        description: "Enable the !throw command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    throwCommand = true;

    @SwitchProperty({
        name: "!dice",
        description: "Enable the !dice command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    diceCommand = true;

    @SwitchProperty({
        name: "!pet",
        description: "Enable the !pet command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    petCommand = true;

    @SwitchProperty({
        name: "!joke",
        description: "Enable the !joke command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    jokeCommand = true;

    @SwitchProperty({
        name: "!commands help",
        description: "Enable the !commands help feature",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    commandsHelpCommand = true;

    @SwitchProperty({
        name: "!mod",
        description: "Enable the !mod command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    modCommand = true;

    @SwitchProperty({
        name: "!simp",
        description: "Enable the !simp command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    simpCommand = true;

    @SwitchProperty({
        name: "!sweat",
        description: "Enable the !sweat command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    sweatCommand = true;

    @SwitchProperty({

        name: "!sus",
        description: "Enable the !sus command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    susCommand = true;

    @SwitchProperty({
        name: "!kick/!pk",
        description: "Enable the !kick/!pk command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    partyKickCommand = true;

    @SwitchProperty({
        name: "!p (Party)",
        description: "Enable the !p command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    partyInviteCommand = true;

    @SwitchProperty({
        name: "!reminder",
        description: "Enable the !reminder command",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    reminderCommand = true;

    //DM Commands
    @SwitchProperty({
        name: "Enable DM Commands",
        description: "Enable or disable all DM commands",
        category: "DM Commands",
        subcategory: "DM Commands"
    })
    enableDmCommands = true;

    @SwitchProperty({
        name: "!p",
        description: "Enable the !p command in DMs",
        category: "DM Commands",
        subcategory: "DM Commands"
    })
    partyCommand = true;

    @SwitchProperty({
        name: "!kick",
        description: "Enable the !kick command in DMs",
        category: "DM Commands",
        subcategory: "DM Commands"
    })
    kickCommand = true;

    //WIP Stuff
    @SwitchProperty({
        name: "Enable Chest Scanning",
        description: "Automatically scan chests content when opened",
        category: "WIP",
        subcategory: "Chest Scanning (§aALMOST FINISH, SHOULD WORK§r)"
    })
    enableChestScanning = true;

    @SwitchProperty({
        name: "Enable Chest Content in Chat",
        description: "Show information about the chest content in chat",
        category: "WIP",
        subcategory: "Chest Scanning (§aALMOST FINISH, SHOULD WORK§r)"
    })
    enableAttributeChatOutput = true;

    @SwitchProperty({
        name: "Enable Per-User Cooldown",
        description: "Enable cooldown for commands per user",
        category: "WIP",
        subcategory: "Per-User Settings (§cTOTALLY NOT WORKING RN§r)"
    })
    enablePerUserCooldown = false;

    @DecimalSliderProperty({
        name: "Per-User Cooldown Duration",
        description: "How long a user must wait before executing another command (in seconds)",
        category: "WIP",
        subcategory: "Per-User Settings (§cTOTALLY NOT WORKING RN§r)",
        minF: 0.0,
        maxF: 30.0,
        decimalPlaces: 1
    })
    perUserCooldownDuration = 5.0;

    @DecimalSliderProperty({
        name: "Per-User Command Limit Period",
        description: "Time period in which the maximum number of commands per user applies (in seconds)",
        category: "WIP",
        subcategory: "Per-User Settings (§cTOTALLY NOT WORKING RN§r)",
        minF: 1.0,
        maxF: 180.0,
        decimalPlaces: 1
    })
    perUserLimitPeriod = 60.0;

    @SliderProperty({
        name: "Max Commands Per User",
        description: "Maximum number of commands a user can execute within the limit period",
        category: "WIP",
        subcategory: "Per-User Settings (§cTOTALLY NOT WORKING RN§r)",
        min: 1,
        max: 20
    })
    maxCommandsPerUser = 5;

    @SwitchProperty({
        name: "Enable Global Cooldown",
        description: "Enable a shared cooldown for all users",
        category: "WIP",
        subcategory: "Global Settings (§cTOTALLY NOT WORKING RN§r)"
    })
    enableGlobalCooldown = false;

    @DecimalSliderProperty({
        name: "Global Cooldown Duration",
        description: "How long all users must wait before a new command can be executed (in seconds)",
        category: "WIP",
        subcategory: "Global Settings (§cTOTALLY NOT WORKING RN§r)",
        minF: 0.0,
        maxF: 10.0,
        decimalPlaces: 1
    })
    globalCooldownDuration = 1.0;

    @DecimalSliderProperty({
        name: "Global Command Limit Period",
        description: "Time period in which the maximum number of global commands applies (in seconds)",
        category: "WIP",
        subcategory: "Global Settings (§cTOTALLY NOT WORKING RN§r)",
        minF: 1.0,
        maxF: 180.0,
        decimalPlaces: 1
    })
    globalLimitPeriod = 60.0;

    @SliderProperty({
        name: "Max Global Commands",
        description: "Maximum number of commands that can be executed globally within the global limit period",
        category: "WIP",
        subcategory: "Global Settings (§cTOTALLY NOT WORKING RN§r)",
        min: 1,
        max: 50
    })
    maxGlobalCommands = 20;

    //Dev Stuff
    @SwitchProperty({
        name: "Debug Mode",
        description: "Enable detailed debug messages for troubleshooting",
        category: "Dev Stuff",
        subcategory: "Debug"
     })
    debugMode = false;

    @SwitchProperty({
        name: "Test Command",
        description: "Enable the §b/ja test§r command",
        category: "Dev Stuff",
        subcategory: "Debug"
    })
    testCommand = false;

    @SwitchProperty({
        name: "Test Popup Command",
        description: "Enable the §b/testpopup§r command",
        category: "Dev Stuff",
        subcategory: "Debug"
    })
    testPopupCommand = false;

    constructor() {
        this.initialize(this);

        // Set category descriptions
        this.setCategoryDescription("General", "Configure general settings");
        this.setCategoryDescription("Dungeons", "Settings for dungeon-related features");
        this.setCategoryDescription("Party Commands", "Configure party command settings");
        this.setCategoryDescription("DM Commands", "Configure DM command settings");
        this.setCategoryDescription("WIP", "All the Stuff here is Work In Progess. Let's pray that it's working")
        this.setCategoryDescription("Dev Stuff", "No interesting Stuff for you :(");

        // Add dependencies for General
        this.addDependency("Reminder Popup Color", "Enable Reminders")
        this.addDependency("Reminder Sound", "Enable Reminders")
        this.addDependency("Reminder Sound Volume", "Enable Reminders")

        // Add dependencies for Party Commands
        const partyCommands = ["!rng", "!cf", "!8ball", "!throw", "!dice", "!pet", "!joke", "!commands help", "!mod", "!simp", "!sweat", "!sus", "!kick/!pk", "!p (Party)", "!reminder"];
        partyCommands.forEach(command => this.addDependency(command, "Enable Party Commands"));

        // Add dependencies for DM Commands
        this.addDependency("Test Command", "Enable DM Commands");
        this.addDependency("!p", "Enable DM Commands");
        this.addDependency("!kick", "Enable DM Commands");

        // Add dependencies for Dungeons
        this.addDependency("Crypt Reminder Time", "Enable Crypt Reminder");
        this.addDependency("Crypt Reminder Message", "Enable Crypt Reminder");

        // Add dependencies for WIP
        this.addDependency("Enable Chest Content in Chat", "Enable Chest Scanning")

        this.addDependency("Per-User Cooldown Duration", "Enable Per-User Cooldown");
        this.addDependency("Per-User Command Limit Period", "Enable Per-User Cooldown");
        this.addDependency("Max Commands Per User", "Enable Per-User Cooldown");

        this.addDependency("Global Cooldown Duration", "Enable Global Cooldown");
        this.addDependency("Global Command Limit Period", "Enable Global Cooldown");
        this.addDependency("Max Global Commands", "Enable Global Cooldown");
    }
}

export default new Config();