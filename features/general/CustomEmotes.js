import { registerWhen } from "../../utils/Utils";
import { data } from "../../utils/Data";
import config from "../../config";

let nextMessage;

registerWhen(register("messageSent", (message, event) => {
  if (message === nextMessage) return;
  let contains = false;

  Object.keys(data.customEmotes).forEach((key) => {
    if (!message.includes(key)) return;
    const reg = new RegExp(key, "g");
    message = message.replace(reg, data.customEmotes[key]);
    contains = true;
  });

  if (!contains) return;
  nextMessage = message;
  ChatLib.say(message);
  cancel(event);
}), () => config.customEmotes);