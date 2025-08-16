import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import { registerWhen } from "../../utils/Utils";
import config from "../../config";

const hideGeneralMessages = [
  /Your radio is weak. Find another enjoyer to boost it./,
  /Creeper Veil (Activated|De-activated)!(?: \(Expired\))?/,
  /.*Skytils-SC.*/,
  /Warping you to your SkyBlock island.../,
  /You earned .+ Event EXP from playing SkyBlock!/,
  /Warping\.\.\./,
  /Watchdog has banned .+ players in the last 7 days./,
  /You are playing on profile\: .+/,
  /Profile ID\:.+/,
  /Whow! Slow down there!/,
  /Woah slow down, you're doing that too fast!/,
  /Command Failed: This command is on cooldown! Try again in about a second!/,
  /Someone has already activated this lever!/,
  /A mystical force in this room prevents you from (?:using that ability|doing that)!/,
  /It isn't your turn!/,
  /That chest is locked!/,
  /Don't move diagonally! Bad!/,
  /Oops! You stepped on the wrong block!/,
  /Your Auto Recombobulator recombobulated/,
  /You cannot use abilities in this room!/,
  /A shiver runs down your spine.../,
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
  /\[NPC\] (Hugo)/,
  /You summoned your.+/,
  /\[Sacks\] .+ item.+/,
  /.+has obtained.+/,
  /There are blocks in the way!/,
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
  /Your .+ hit .+ for [\d,.]+ damage./,
  /You do not have enough mana to do this!/,
  /.+Kill Combo+/,
  /.+ healed you for .+ health!/,
  /You earned .+ GEXP .*/,
  /This menu is disabled here!/,
  /This item is on cooldown.+/,
  /This ability is on cooldown.+/,
  /Please wait a few seconds between refreshing!/,
  /Your Kill Combo has expired! You reached a .+ Kill Combo!/,
  /This creature is immune to this kind of magic!/,
  /Error initializing players: undefined(?: Hidden)?/,
  /.*?YouTube Premier .+ https:\/\/youtu.be\/.+/,
  /Your radio lost signal\. There's too many enjoyers on this channel\./,
  /Your radio signal is strong!/,
  /^\s*Link looks suspicious\? - Don't click it!$|^\s*Clicking sketchy links can result in your account$|^\s*being stolen!$/
];

const hideDungeonMessages = [ // only hide inside of dungeon
  /RARE DROP!.+/,
  /(?:Healer|Archer|Mage|Tank|Berserk) Milestone.+/,
  /.+ has obtained Blood Key!/,
  /Your active Potion Effects have been paused and stored. They will be restored when you leave Dungeons! You are not allowed to use existing Potion Effects while in Dungeons./,
  /.+ found a Wither Essence! Everyone gains an extra essence!/,
  /.+ unlocked .+ Essence(?: x\d+)?!/,
  /.+Mimic Killed!/,
  /\$SKYTILS-DUNGEON-SCORE-MIMIC\$/,
  /ESSENCE! .+ found .+ Essence!/,
  /(?:Ragnarok|Thunderstorm) is ready to use! Press DROP to activate it!/,
  /Your CLASS stats are doubled because you are the only player using this class!/,
  /PUZZLE SOLVED!.+/,
  /DUNGEON BUFF! .+/,
  /A Crypt Wither Skull exploded, hitting you for .+ damage./,
  /.+ opened a WITHER door!/,
  /Your Berserk ULTIMATE Ragnarok is now available!/,
  /A Blessing of .+/,
  /The Flamethrower hit you for .+ damage!/,
  /Throwing Axe is now available!/,
  /Used Throwing Axe!/,
  /A (?:Blood|Wither) Key was picked up!/,
  /You do not have the key for this door!/,
  /The Stormy .+ struck you for .+ damage!/,
  /.+ Mort: .+/,
  /RIGHT CLICK on .+ to open it. .+/,
  /The .+ Trap hit you for .+ damage!/,
  /FISHING FESTIVAL The festival is now underway! Break out your fishing rods and watch out for sharks!/,
  /The BLOOD DOOR has been opened!/,
  /Giga Lightning.+/,
  /⚠ Storm is enraged! ⚠/,
  /Necron's Nuclear Frenzy hit you for .+ damage./,
  /This Terminal doesn't seem to be responsive at the moment./,
  /The (?:Frozen|Lost) Adventurer used (?:Ice Spray|Dragon's Breath) on you!/,
  /Used Ragnarok!/,
  /Your Ultimate is currently on cooldown for .+ more seconds./,
  /A Blessing of .+ was picked up!/,
  /You cannot move the silverfish in that direction!/,
  /You cannot hit the silverfish while it's moving!/,
  /(?:\[SKULL\]|\[STATUE\]).+/,
  /(?:.*)?(?:Also )?Granted you.+/,
  /Maxor's (?:Wither TNT|Frenzy|Shadow Wave) hit you for [\d,\.]+ damage\./,
  /Storm's (?:Lightning Fireball|Static Field|Frenzy) hit you for [\d,\.]+ (?:true )?damage\./,
  /Goldor's (?:TNT Trap|Greatsword|Frenzy) hit you for [\d,\.]+ (?:true )?damage\./,
  /You hear something open\.\.\./
];

hideGeneralMessages.forEach((msg) => {
  registerWhen(register("chat", (event) => cancel(event)).setCriteria(msg), () => config.hideUselessMessages);
});

hideDungeonMessages.forEach((msg) => {
  if (!config.hideUselessMessages) return;
  Dungeon.registerWhenInDungeon(register("chat", (event) => cancel(event)).setCriteria(msg));
});

registerWhen(register("chat", (event) => cancel(event)).setCriteria("UwUaddons »").setContains(), () => config.hideUwUAddons);
registerWhen(register("chat", (player, event) => {
  if (player.includes("[")) return;
  cancel(event);
}).setCriteria("${player} has invited you to join their party!\nYou have 60 seconds to accept. Click here to join!${*}"), () => config.hideNonRankInvites);