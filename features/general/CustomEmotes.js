import { data } from "../../utils/Data";
import { registerWhen } from "../../utils/Register";
import config from "../../config";
import { showGeneralJAMessage } from "../../utils/ChatUtils";

if (typeof data.customEmotes !== "object" || data.customEmotes === null) {
  data.customEmotes = {};
}

let nextMessage;

registerWhen(
  register("messageSent", (message, event) => {
    if (message === nextMessage) return;
    let contains = false;

    Object.keys(data.customEmotes).forEach((key) => {
      if (message.includes(key)) {
        const reg = new RegExp(key, "g");
        message = message.replace(reg, data.customEmotes[key]);
        contains = true;
      }
    });

    if (contains) {
      nextMessage = message;
      ChatLib.say(message);
      cancel(event);
    }
  }),
  () => config.customEmotes
);

register("command", (subCommand, ...args) => {
  subCommand = subCommand ? subCommand.toLowerCase() : "list";

  if (subCommand === "list") {
    const keys = Object.keys(data.customEmotes);
    if (keys.length === 0) {
      showGeneralJAMessage("No custom emotes defined.");
    } else {
      showGeneralJAMessage("Custom Emotes:");
      keys.forEach((key) => {
        showGeneralJAMessage(`${key} -> ${data.customEmotes[key]}`);
      });
    }
    return;
  }

  if (subCommand === "add") {
    if (args.length < 2) {
      showGeneralJAMessage("Usage: /emote add [emotename] [emote]");
      return;
    }
    const emotename = args[0];
    const emote = args.slice(1).join(" ");
    if (data.customEmotes[emotename]) {
      showGeneralJAMessage(
        `Emote "${emotename}" already exists. Remove it first to update it.`
      );
    } else {
      data.customEmotes[emotename] = emote;
      data.save();
      showGeneralJAMessage(`Added: ${emotename} -> ${emote}`);
    }
    return;
  }

  if (subCommand === "remove") {
    if (args.length !== 1) {
      showGeneralJAMessage("Usage: /emote remove [emotename]");
      return;
    }
    const emotename = args[0];
    if (data.customEmotes[emotename]) {
      delete data.customEmotes[emotename];
      data.save();
      showGeneralJAMessage(`Removed: ${emotename}`);
    } else {
      showGeneralJAMessage(`Emote "${emotename}" not found.`);
    }
    return;
  }

  showGeneralJAMessage("Usage: /emote [list|add|remove]");
}).setName("emote").setAliases("emotes");
