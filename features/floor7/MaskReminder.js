import { Render2D } from "../../../tska/rendering/Render2D";
import { playSound, registerWhen } from "../../utils/Utils";
import { inFloor } from "../../utils/Dungeon";
import config from "../../config";

registerWhen(register("chat", () => {
  if ((!inFloor("F7") && !inFloor("M7"))) return;
  const helmet = Player.armor?.getHelmet()?.getName()

  if (helmet.includes("Bonzo Mask") || helmet.includes("Spirit Mask")) return;
  Render2D.showTitle(`&c⚠ MASK NOT EQUIPPED! ⚠`, null, 3000);
  playSound("random.orb", 1, 1); 
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance."), () => config.MaskReminder);