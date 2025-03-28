import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { registerWhen } from "../../utils/Utils";
import config from "../../config";

const hideGeneralMessages = [
  /Your radio is weak. Find another enjoyer to boost it./,
  /Creeper Veil (Activated|De-activated)!/,
  /.*Skytils-SC.*/,
  /Warping.*/,
  /You earned .+ Event EXP from playing SkyBlock!/,
  /Watchdog has banned .+ players in the last 7 days./,
  /RARE REWARD!.+/,
  /Error initializing players\: undefined/,
  /You are playing on profile\: .+/,
  /Profile ID\:.+/,
  /(Whow|Woah) slow down.+/,
  /Command Failed: This command is on cooldown! Try again in about a second!/,
  /Someone has already activated this lever!/,
  /It isn't your turn!/,
  /That chest is locked!/,
  /Don't move diagonally! Bad!/,
  /Oops! You stepped on the wrong block!/,
  /Your Auto Recombobulator recombobulated/,
  /You cannot use abilities in this room!/,
  /A shiver runs down your spine.../,
  /(Granted|Also granted) you.+/,
  /Blacklisted modifications are a bannable offense!/,
  /\[WATCHDOG ANNOUNCEMENT\]/,
  /Staff have banned an additional .+/,
  /This lever has already been used./,
  /You hear the sound of something opening.../,
  /This chest has already been searched!/,
  /You sold .+ x.* for .+/,
  /You don't have enough space in your inventory to pick up this item!.*/,
  /Inventory full\? Don't forget to check out your Storage inside the SkyBlock Menu!/,
  /This item's ability is temporarily disabled!/,
  /You are not allowed to use Potion Effects.+/,
  /\[(STATUE|NPC|SKULL)\].+/,
  /You summoned your.+/,
  /\[Sacks\] .+ item.+/,
  /.+has obtained.+/,
  /There are blocks in the way!/,
  /Error initializing players: undefined Hidden/,
  /Moved .+ Ender Pearl from your Sacks to your inventory./,
  /Skytils.+Something isn't right! .*/,
  /You have .+ unclaimed .+/,
  /Click here to view them!/,
  /.+ joined the lobby! .*/,
  /Welcome to Hypixel SkyBlock!/,
  /Latest update: SkyBlock .+/,
  /BONUS! Temporarily earn 5% more skill experience!/,
  /.+ is now ready!/,
  /Sending to server .+/,
  /Queuing... .+/,
  /RIGHT CLICK on .+ to open it. .+/,
  /Your .+ hit .+ for [\d,.]+ damage./,
  /You do not have enough mana to do this!/,
  /.+Kill Combo+/,
  /.+ healed you for .+ health!/,
  /You earned .+ GEXP .*/,
  /This menu is disabled here!/,
  /This (item|ability) is on cooldown.+/,
  /Please wait a few seconds between refreshing!/,
  /Your Kill Combo has expired! You reached a .+ Kill Combo!/,
  /This creature is immune to this kind of magic!/,
];

const hideDungeonMessages = [
  /RARE DROP!.+/,
  /\$SKYTILS-DUNGEON-SCORE-MIMIC\$/,
  /.*Mimic Killed!/,
  /Goldor's TNT Trap hit you for 1,788.9 true damage./,
  /A Blood Key was picked up/,
  /This Terminal doesn't seem to be responsive at the moment./,
  /⚠ Storm is enraged! ⚠/,
  /Giga Lightning.+/,
  /(Necron's Nuclear Frenzy|Goldor's Greatsword|The Flamethrower|The Stormy .+|The .+ Trap) hit you for .+ damage./,
  /A mystical force in this room prevents you from using that ability!/,
  /The Frozen Adventurer used Ice Spray on you!/,
  /Used (Ragnarok|Throwing Axe)!/,
  /The BLOOD DOOR has been opened!/,
  /.+ has obtained Blood Key!/,
  /Your Ultimate is currently on cooldown for .+ more seconds./,
  /(Ragnarok|Thunderstorm) is ready to use! Press DROP to activate it!/,
  /.+ found a Wither Essence! Everyone gains an extra essence!/,
  /Your active Potion Effects have been paused and stored. They will be restored when you leave Dungeons! You are not allowed to use existing Potion Effects while in Dungeons./,
  /You cannot hit the silverfish while it's moving!/,
  /You cannot move the silverfish in that direction!/,
  /You do not have the key for this door!/,
  /.+ unlocked .+ Essence( x\d+)?!/,
  /.+ Mort: .+/,
  /Your (CLASS|.+) stats are doubled because you are the only player using this class!/,
  /.+ Milestone .+:.+ /,
  /(Healer|Archer|Mage|Tank|Berserk) Milestone.+/,
  /\[[Tank|Healer|Mage|Archer|Berserk]+\] .+/,
  /ESSENCE! .+ found .+ Essence!/,
  /A Blessing of .+ was picked up!/,
  /Your Berserk ULTIMATE Ragnarok is now available!/,
  /A Wither Key was picked up!/,
  /.+ opened a WITHER door!/,
  /PUZZLE SOLVED!.+/,
  /DUNGEON BUFF! .+/,
  /A Crypt Wither Skull exploded, hitting you for .+ damage./,
  /The Lost Adventurer used Dragon's Breath on you!/,
  /A Blessing of .+/,
];

hideGeneralMessages.forEach((pattern) => {
  registerWhen(register("chat", (event) => cancel(event)).setCriteria(pattern), () => config.hideUselessMessages);
});

hideDungeonMessages.forEach((pattern) => {
  Dungeon.registerWhenInDungeon(register("chat", (event) => cancel(event)).setCriteria(pattern));
});

registerWhen(register("chat", (event) => cancel(event)).setCriteria("UwUaddons »").setContains(), () => config.hideUwUAddons);

registerWhen(register("chat", (event) => {
  const message = ChatLib.getChatMessage(event);
  if (message.includes("[")) return;
  cancel(event);
}).setCriteria("${player} has invited you to join their party!\nYou have 60 seconds to accept. Click here to join!"), () => config.hideNonRankInvites);