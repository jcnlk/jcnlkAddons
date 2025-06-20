import { isInBox, isInBox, registerWhen, showChatMessage } from "../../utils/Utils";
import { Render2D } from "../../../tska/rendering/Render2D";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { getStage } from "../../utils/Dungeon";
import HudManager from "../../utils/Hud";
import { data } from "../../utils/Data";
import { Hud } from "../../utils/Hud";
import config from "../../config";

const leapNotifierHud = new Hud("leapNotifierHud", "&eLeaped: &b3/5", HudManager, data);

let notified = false;
let lastLeapedCount = 0;

function getSection(entity) {
  let section = 0;

  if (isInBox(89, 113, 100, 160, 48, 122, entity)) section = 1;
  if (isInBox(19, 91, 100, 160, 121, 145, entity)) section = 2;
  if (isInBox(-6, 19, 100, 160, 50, 123, entity)) section = 3;
  if (isInBox(17, 90, 100, 160, 27, 50, entity)) section = 4;

  return section;
}

function playLeapSound() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => World.playSound("random.anvil_land", 2.5, 1.5), i * 100);
  }
}

registerWhen(register("renderOverlay", () => {
  if (!World.isLoaded() || HudManager.isEditing) return;
  if (Dungeon.floor !== "F7" && Dungeon.floor !== "M7" || Dungeon.bossEntry === null) return;

  const currentStage = getStage();
  const currentSection = getSection(Player);
  
  if (!currentSection || currentSection <= currentStage) return;
  
  const partyMembers = [...Dungeon.party];
  const leapedPlayers = [];
  const waitingPlayers = [];
  
  partyMembers.forEach((member) => {
    const player = World.getPlayerByName(member);
    if (!player || player.isInvisible()) return;
    
    const section = getSection(player);
    if (!section) return;
    
    if (section === currentSection) leapedPlayers.push(member);
    else waitingPlayers.push(member);
  });
  
  const leapedCount = leapedPlayers.length;
  const totalPlayers = partyMembers.length;
  
  if (leapedCount > 0) {
    const hudText = `&eLeaped: &b${leapedCount}/${totalPlayers}`;
    leapNotifierHud.draw(hudText);
  }
  
  const allLeaped = leapedCount === totalPlayers && waitingPlayers.length === 0;
  
  if (allLeaped && !notified) {
    notified = true;
    playLeapSound();
    
    if (config.leapNotifierTitle) Render2D.showTitle("&aEveryone leaped!", null, 30)
    
    showChatMessage("&aEveryone leaped!");
    
    if (config.leapNotifierAnnounce) {
      ChatLib.command("party chat Everyone leaped!");
      showChatMessage("Announcing -> Everyone leaped!");
    }
  }
  
  if (!allLeaped) notified = false;
  
  lastLeapedCount = leapedCount;
}), () => config.leapNotifier);

register("worldUnload", () => {
  notified = false;
  lastLeapedCount = 0;
});