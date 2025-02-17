import config from "../../config";
import { showTitle } from "../../utils/Title";
import { registerWhen } from "../../utils/Register";

registerWhen(register("chat", (color, pet) => {
  showTitle(`${color}${pet}`, 400, true, "§cAutopet");
}).setCriteria(/&.Autopet &.equipped your &.\[Lvl \d+\] (&.)([A-z ]+)(?:&. ✦)?&.! &.&.VIEW RULE&./).setStart(), () => config.autopetRuleTitle);