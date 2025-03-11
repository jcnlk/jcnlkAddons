import { registerWhen, showTitle } from "../../utils/Utils";
import config from "../../config";

registerWhen(register("chat", (color, pet) => {
  showTitle(`${color}${pet}`, 400, true, "§cAutopet");
}).setCriteria(/&.Autopet &.equipped your &.\[Lvl \d+\] (&.)([A-z ]+)(?:&. ✦)?&.! &.&.VIEW RULE&./).setStart(), () => config.autopetRuleTitle);