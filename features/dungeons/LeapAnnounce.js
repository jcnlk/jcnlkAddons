import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { showChatMessage } from "../../utils/Utils";
import { registerWhen } from "../../utils/Utils";
import config from "../../config";

registerWhen(register("chat", (name, event) => {
  if (Dungeon.bossEntry === null) return;
  ChatLib.command(`pc Leaped to ${name}!`);
  showChatMessage(`Annoucing -> Leaped to ${name}`);
  cancel(event);   
}).setCriteria("You have teleported to ${name}!"),() => config.leapAnnounce);

registerWhen(register("chat", (from, to, event) => {
  if (config.hideLeapMessage === 1 && from === Player.getName()) cancel(event);
  if (config.hideLeapMessage === 2 && to !== Player.getName()) cancel(event);
  if (config.hideLeapMessage === 3) cancel(event);
}).setCriteria(/Party > (?:\[.+\])? ?(.+) ?[ቾ⚒]?: Leaped to (\S+)!?/), () => config.hideLeapMessage !== 0);