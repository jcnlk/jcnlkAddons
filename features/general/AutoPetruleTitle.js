import { registerWhen, showTitleV2 } from "../../utils/Utils";
import config from "../../config";

registerWhen(register("chat", (color, pet) => {
  showTitleV2(`${color}${pet}`, 400, 0.5, -20, 4, null, `&cAutopet`, 2, 0, 4);
}).setCriteria(/&.Autopet &.equipped your &.\[Lvl \d+\] (&.)([A-z ]+)(?:&. ✦)?&.! &.&.VIEW RULE&./).setStart(), () => config.autopetRuleTitle);