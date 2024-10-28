import Config from "../../config";
import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";

let customEmotes = new Map();

// Load custom emotes from storage
function loadCustomEmotes() {
    try {
        const storedEmotes = FileLib.read("jcnlkAddons", "data/CustomEmotes.json");
        if (storedEmotes) {
            customEmotes = new Map(JSON.parse(storedEmotes));
            showDebugMessage(`Loaded ${customEmotes.size} custom emotes`);
        }
    } catch (error) {
        showDebugMessage(`Error loading custom emotes: ${error}`, 'error');
    }
}

// Save custom emotes to storage
function saveCustomEmotes() {
    try {
        const emoteArray = Array.from(customEmotes.entries());
        FileLib.write("jcnlkAddons", "data/CustomEmotes.json", JSON.stringify(emoteArray));
        showDebugMessage(`Saved ${customEmotes.size} custom emotes`);
    } catch (error) {
        showDebugMessage(`Error saving custom emotes: ${error}`, 'error');
    }
}

// Add a custom emote
function addCustomEmote(emoteName, emote) {
    if (customEmotes.has(emoteName)) {
        showGeneralJAMessage(`Emote ${emoteName} already exists. Use remove command first to update.`);
        return false;
    }
    customEmotes.set(emoteName, emote);
    saveCustomEmotes();
    showGeneralJAMessage(`Added custom emote: ${emoteName} -> ${emote}`);
    return true;
}

// Remove a custom emote
function removeCustomEmote(emoteName) {
    if (customEmotes.has(emoteName)) {
        customEmotes.delete(emoteName);
        saveCustomEmotes();
        showGeneralJAMessage(`Removed custom emote: ${emoteName}`);
        return true;
    }
    showGeneralJAMessage(`Emote ${emoteName} not found.`);
    return false;
}

// List all custom emotes
function listCustomEmotes() {
    if (customEmotes.size === 0) {
        showGeneralJAMessage("No custom emotes defined.");
    } else {
        showGeneralJAMessage("Custom Emotes:");
        customEmotes.forEach((emote, name) => {
            showGeneralJAMessage(`${name} -> ${emote}`);
        });
    }
}

// Replace custom emotes in outgoing messages
function replaceEmotesInMessage(message) {
    if (!Config.enableCustomEmotes) return message;
    
    let newMessage = message;
    customEmotes.forEach((emote, name) => {
        newMessage = newMessage.replace(new RegExp(name, 'g'), emote);
    });
    
    return newMessage;
}

// Intercept outgoing chat messages
register("messageSent", (message, event) => {
    if (!Config.enableCustomEmotes) return;
    
    const newMessage = replaceEmotesInMessage(message);
    
    if (newMessage !== message) {
        cancel(event);
        ChatLib.say(newMessage);
    }
});

// Initialize the module
function initialize() {
    loadCustomEmotes();
}

// Export functions and initialize
export {
    initialize,
    addCustomEmote,
    removeCustomEmote,
    listCustomEmotes
};