import Config from "../../config";
import { showGeneralJAMessage } from "../../utils/ChatUtils";

let customEmotes = new Map();

function loadCustomEmotes() {
  try {
    const storedEmotes = FileLib.read("jcnlkAddons", "data/CustomEmotes.json");
    if (storedEmotes) {
      customEmotes = new Map(JSON.parse(storedEmotes));
      //showDebugMessage(`Loaded ${customEmotes.size} custom emotes`);
    }
  } catch (error) {
    console.error(`Error loading custom emotes: ${error}`);
  }
}

function saveCustomEmotes() {
  try {
    const emoteArray = Array.from(customEmotes.entries());
    FileLib.write(
      "jcnlkAddons",
      "data/CustomEmotes.json",
      JSON.stringify(emoteArray)
    );
    //showDebugMessage(`Saved ${customEmotes.size} custom emotes`);
  } catch (error) {
    console.error(`Error saving custom emotes: ${error}`);
  }
}

export function addCustomEmote(emoteName, emote) {
  if (customEmotes.has(emoteName)) {
    showGeneralJAMessage(
      `Emote ${emoteName} already exists. Use remove command first to update.`
    );
    return false;
  }
  customEmotes.set(emoteName, emote);
  saveCustomEmotes();
  showGeneralJAMessage(`Added custom emote: ${emoteName} -> ${emote}`);
  return true;
}

export function removeCustomEmote(emoteName) {
  if (customEmotes.has(emoteName)) {
    customEmotes.delete(emoteName);
    saveCustomEmotes();
    showGeneralJAMessage(`Removed custom emote: ${emoteName}`);
    return true;
  }
  showGeneralJAMessage(`Emote ${emoteName} not found.`);
  return false;
}

export function listCustomEmotes() {
  if (customEmotes.size === 0) {
    showGeneralJAMessage("No custom emotes defined.");
  } else {
    showGeneralJAMessage("Custom Emotes:");
    customEmotes.forEach((emote, name) => {
      showGeneralJAMessage(`${name} -> ${emote}`);
    });
  }
}

function replaceEmotesInMessage(message) {
  if (!Config.enableCustomEmotes) return message;

  let newMessage = message;
  customEmotes.forEach((emote, name) => {
    newMessage = newMessage.replace(new RegExp(name, "g"), emote);
  });

  return newMessage;
}

register("messageSent", (message, event) => {
  if (!Config.enableCustomEmotes) return;

  const newMessage = replaceEmotesInMessage(message);

  if (newMessage !== message) {
    cancel(event);
    ChatLib.say(newMessage);
  }
});

register("gameLoad", loadCustomEmotes);
