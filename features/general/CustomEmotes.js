import { registerWhen } from "../../utils/Utils";
import { data } from "../../utils/Data";
import config from "../../config";

if (typeof data.customEmotes !== "object" || data.customEmotes === null) data.customEmotes = {};

let nextMessage;

registerWhen(register("messageSent", (message, event) => {
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
}), () => config.customEmotes);