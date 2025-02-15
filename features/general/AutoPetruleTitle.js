import config from "../../config";
import { showTitle } from "../../utils/Title";

register("chat", (color, pet) => {
  if (!config.autopetRuleTitle) return;
  showTitle(`${color}${pet}`, 400, true, "§cAutopet");
}).setCriteria(/&.Autopet &.equipped your &.\[Lvl \d+\] (&.)([A-z ]+)(?:&. ✦)?&.! &.&.VIEW RULE&./).setStart();