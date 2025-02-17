import config from "../../config";
import { getIsInDungeon, getIsInM3 } from "../../utils/Dungeon";
import { showTitle } from "../../utils/Title";
import { RED, YELLOW, DARK_RED } from "../../utils/Utils";
import { registerWhen } from "../../utils/Register";

registerWhen(register("chat", (key) => {
  if (!World.isLoaded) return;

  const isInDungeon = getIsInDungeon();
  if (!isInDungeon) return;
  
  const isInM3 = getIsInM3();
  if (!isInM3) return;

  new Thread(() => {
    Thread.sleep(1000);
    showTitle(`${RED}In 4 sec`, 3000, true, `${YELLOW}Get Ready!`);

    World.playSound("random.burp", 2, 1);
    Thread.sleep(4000);
    World.playSound("random.burp", 2, 1);
    Thread.sleep(4000);

    showTitle(
      `${DARK_RED}NOW!`,
      1000,
      true,
      `${YELLOW}USE THE Fire Freeze Staff`
    );
    World.playSound("random.anvil_land", 2, 1);
  }).start();
}).setCriteria(
  "[BOSS] The Professor: Oh? You found my Guardians' one weakness?"
), () => config.FireFreezeNotifier);
