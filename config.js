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

    @SwitchProperty({
        name: "Enable Crypt Reminder Popup",
        description: "Show a popup for crypt reminders",
        category: "Dungeons",
        subcategory: "Crypt Reminder"
    })
    enableCryptReminderPopup = true;

    @SelectorProperty({
        name: "Crypt Reminder Popup Color",
        description: "Choose the color for crypt reminder popups",
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        options: ["§cRed§r", "§aGreen§r", "§bBlue§r", "§eYellow§r", "§fWhite§r", "§dPink§r"]
    })
    cryptReminderPopupColor = 0;
    
    @SelectorProperty({
        name: "Crypt Reminder Sound",
        description: "Choose the sound for crypt reminders",
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        options: ["Orb", "Level Up", "Pop", "Note Pling", "Ender Dragon Growl"]
    })
    cryptReminderSound = 0;
    
    @DecimalSliderProperty({
        name: "Crypt Reminder Sound Volume",
        description: "Volume of the crypt reminder sound (0 to turn it §cOFF§r)",
        category: "Dungeons",
        subcategory: "Crypt Reminder",
        minF: 0,
        maxF: 2.0,
        decimalPlaces: 1
    })
    cryptReminderSoundVolume = 0.5;

    @SwitchProperty({
        name: "Enable Puzzle State Tracking",
        description: "Track and display the state of puzzles in dungeons",
        category: "Dungeons",
        subcategory: "Puzzle Tracking"
    })
    enablePuzzleStateTracking = true;

    // Party Commands
    @SwitchProperty({
        name: "Enable Party Commands",
        description: "Enable or disable all party commands",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    enablePartyCommands = true;

    @SwitchProperty({
        name: "RNG Command &3!rng&r",
        description: "Enable the rng command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    rngCommand = true;

    @SwitchProperty({
        name: "Coinflip Command &3!cf&r",
        description: "Enable the coinflip command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    coinFlipCommand = true;

    @SwitchProperty({
        name: "8ball Command &3!8ball&r",
        description: "Enable the 8ball command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    eightBallCommand = true;

    @SwitchProperty({
        name: "Throw Command &3!throw&r",
        description: "Enable the throw command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    throwCommand = true;

    @SwitchProperty({
        name: "Dice Command &3!dice&r",
        description: "Enable the dice command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    diceCommand = true;

    @SwitchProperty({
        name: "Pet Command &3!pet&r",
        description: "Enable the pet command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    petCommand = true;

    @SwitchProperty({
        name: "Joke Command &3!joke&r",
        description: "Enable the joke command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    jokeCommand = true;

    @SwitchProperty({
        name: "Help Command &3!commands help&r",
        description: "Enable the help command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    commandsHelpCommand = true;

    @SwitchProperty({
        name: "Mod Command &3!mod&r",
        description: "Enable the mod command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    modCommand = true;

    @SwitchProperty({
        name: "Simp Command &3!simp&r",
        description: "Enable the simp command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    simpCommand = true;

    @SwitchProperty({
        name: "Sweat Command &3!sweat&r",
        description: "Enable the sweat command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    sweatCommand = true;

    @SwitchProperty({
        name: "Sus Command &3!sus&r",
        description: "Enable the sus command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    susCommand = true;

    @SwitchProperty({
        name: "Kick Command (Party) &3!<kick, pk>&r",
        description: "Enable the kick command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    partyKickCommand = true;

    @SwitchProperty({
        name: "Invite Command (Party) &3!p&r ",
        description: "Enable the invite command in Party Chat",
        category: "Party Commands",
        subcategory: "Party Commands"
    })
    partyInviteCommand = true;

    @SwitchProperty({
        name: "Reminder Command &3!reminder&r",
        description: "Enable the reminder command in Party Chat",
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
        name: "Invite Command (DMs) &3!p&r",
        description: "Enable the invite command in DMs",
        category: "DM Commands",
        subcategory: "DM Commands"
    })
    partyCommand = true;

    @SwitchProperty({
        name: "Kick Command (DMs) &3!kick&r",
        description: "Enable the kick Command command in DMs",
        category: "DM Commands",
        subcategory: "DM Commands"
    })
    kickCommand = true;

    //WIP Stuff
    @SwitchProperty({
        name: "Enable Chest Highlighting",
        description: "Highlights loot in different colors according to their value (God Roll, Good Roll, Bad Roll)",
        category: "WIP",
        subcategory: "Kuudra Loot Highlight (§aSHOULD WORK§r)"
    })
    enableChestScanning = true;

    @SwitchProperty({
        name: "Enable Chat Output of Chest Content",
        description: "Output your loot in Chat",
        category: "WIP",
        subcategory: "Kuudra Loot Highlight (§aSHOULD WORK§r)"
    })
    enableAttributeChatOutput = true;

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
        const partyCommands = ["RNG Command &3!rng&r", "Coinflip Command &3!cf&r", "8ball Command &3!8ball&r", "Throw Command &3!throw&r", "Dice Command &3!dice&r", "Pet Command &3!pet&r", "Joke Command &3!joke&r", "Help Command &3!commands help&r", "Mod Command &3!mod&r", "Simp Command &3!simp&r", "Sweat Command &3!sweat&r", "Sus Command &3!sus&r", "Kick Command (Party) &3!<kick, pk>&r", "Invite Command (Party) &3!p&r ", "Reminder Command &3!reminder&r"];
        partyCommands.forEach(command => this.addDependency(command, "Enable Party Commands"));

        // Add dependencies for DM Commands
        this.addDependency("Test Command", "Enable DM Commands");
        this.addDependency("Invite Command (DMs) &3!p&r", "Enable DM Commands");
        this.addDependency("Kick Command (DMs) &3!kick&r", "Enable DM Commands");

        // Add dependencies for Dungeons
        this.addDependency("Crypt Reminder Time", "Enable Crypt Reminder");
        this.addDependency("Crypt Reminder Message", "Enable Crypt Reminder");
        this.addDependency("Crypt Reminder Popup Color", "Enable Crypt Reminder Popup");
        this.addDependency("Crypt Reminder Sound", "Enable Crypt Reminder Popup");
        this.addDependency("Crypt Reminder Sound Volume", "Enable Crypt Reminder Popup");


        // Add dependencies for WIP
        this.addDependency("Enable Chat Output of Chest Content", "Enable Chest Highlighting")
    }
}

export default new Config();