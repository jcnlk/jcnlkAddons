import config from "../../config";

/**
 * Full credit to AsuAddons: https://www.chattriggers.com/modules/v/AsuAddons
 *
 * Draws a title on the screen cuz I don't trust the vanilla one
 * @param {String} text The title that is displayed (supports formatting)
 * @param {Number} duration The duration how long it is displayed in ms
 * @param {Boolean} shadow Add shadow to the text
 * @param {String} subtitle The subtitle that is displayed (supports formatting)
 */
let titles = [];

export function showTitle(title, duration, shadow = false, subtitle = "") {
  if (titles.length > 0) {
    for (let i = 0; i < titles.length; i++) {
      if (titles[i] != undefined) titles[i].unregister();
      titles.splice(i, 1);
    }
  }
  let overlay = register("renderOverlay", () => {
    Renderer.translate(
      Renderer.screen.getWidth() / 2,
      Renderer.screen.getHeight() / 2
    );
    Renderer.scale(4, 4);
    Renderer.drawString(
      title,
      -Renderer.getStringWidth(title) / 2,
      -10,
      shadow
    );

    if (subtitle != "") {
      Renderer.translate(
        Renderer.screen.getWidth() / 2,
        Renderer.screen.getHeight() / 2
      );
      Renderer.scale(2, 2);
      Renderer.drawString(
        subtitle,
        -Renderer.getStringWidth(subtitle) / 2,
        -3,
        shadow
      );
    }
  });
  titles.push(overlay);
  setTimeout(() => {
    if (overlay != undefined) overlay.unregister();
    titles.splice(titles.indexOf(overlay), 1);
  }, duration);
}

register("chat", (color, pet) => {
  if (config.autopetRuleTitle)
    showTitle(`${color}${pet}`, 400, true, "§cAutopet");
})
  .setCriteria(
    /&.Autopet &.equipped your &.\[Lvl \d+\] (&.)([A-z ]+)(?:&. ✦)?&.! &.&.VIEW RULE&./
  )
  .setStart();
