import RenderLibV2 from "../../RenderLibV2";
import renderBeaconBeam from "../../BeaconBeam"
import { showGeneralJAMessage, showDebugMessage } from "./ChatUtils"

//const Color = Java.type("java.awt.Color");

//register("renderWorld", () => {
//    let x = Player.getX();
//    let y = Player.getY();
//    let z = Player.getZ();

    //(x: number, y: number, z: number, wx: number, h: number, wz: number, red: number, green: number, blue: number, alpha: number, phase: boolean, lineWidth: number (optional))
//    RenderLibV2.drawEspBoxV2(x + 2 , y, z + 8, 1, 1, 1, 1, 0, 0, 1, true, 3);
//    RenderLibV2.drawInnerEspBoxV2(x - 2, y, z + 8, 1, 1, 1, 0, 1, 0, 1, true);
    //RenderLibV2.drawBaritoneEspBoxV2(x + 2, y, z + 8, 1, 1, 10, 0, 0, 1, 1, true, 2);
    //RenderLibV2.drawInnerBaritoneEspBoxV2(x + 6, y, z + 8, 1, 1, 10, 0, 1, 1, 1, true);

    // Calculate the box by using 2 coordinate
    //const centerObject = RenderLibV2.calculateCenter(x - 6.5, y, z + 13.5, x + 6.5, y + 5, z + 18.5);

    // Work with both Color.red, "#FF000000", "#FF0000", [255, 0, 0, 1], [255, 0, 0] into render color object
    //const renderColor = RenderLibV2.getColor(Color.yellow);
        //RenderLibV2.drawEspBoxV2(
        //centerObject.cx, centerObject.cy, centerObject.cz,
        //centerObject.wx, centerObject.h, centerObject.wz,
        //renderColor.red, renderColor.green, renderColor.blue, renderColor.alpha,
        //true, 10
    //);

    //RenderLibV2.drawLine(
    //    x - 6.5, y, z + 13.5,
    //    x + 6.5, y + 5, z + 18.5,
    //    renderColor.red, renderColor.green, renderColor.blue, renderColor.alpha,
    //    true, 10
    //);
//});


// Values for rendering the waypoint beacon
const BeaconRedValue = ("1");
const BeaconGreenValue = ("0");
const BeaconBlueValue = ("0");


// Values for rendering the waypoint box
//const BoxXWidthValue = ("1");  <- Doesn't
//const BoxHightValue = ("1");   <- work
//const BoxZWidthValue = ("1");  <- idk
const BoxRedValue = ("1");
const BoxGreenValue = ("0");
const BoxBlueValue = ("0");
const BoxAlphaValue = ("1"); // DON'T lower this one otherwise box won't be visable
const BoxPhaseValue = ("true"); // idk what this is doing but keep it like this
const BoxLineWidthValue = ("3");

// Renderning of the waypoint
let waypoints = [];

register("renderWorld", (x, y, z) => {
    waypoints.forEach(waypoint => {
        RenderLibV2.drawEspBoxV2(waypoint.x + 0.5, waypoint.y, waypoint.z + 0.5, 1, 1, 1, BoxRedValue, BoxGreenValue, BoxBlueValue, BoxAlphaValue, BoxPhaseValue, BoxLineWidthValue);
        renderBeaconBeam(waypoint.x, waypoint.y, waypoint.z, BeaconRedValue, BeaconGreenValue, BeaconBlueValue, 1, false, 250)
        //showDebugMessage(`BoxXWidthValue: ${BoxXWidthValue}\nBoxHightValue: ${BoxHightValue}\nBoxZValue: ${BoxZWidthValue}\nBoxRedValue: ${BoxRedValue}\nBoxGreenValue: ${BoxGreenValue}\nBoxBlueValue: ${BoxBlueValue}\nBoxAlphaValue: ${BoxAlphaValue}\n BoxPhaseValue: ${BoxPhaseValue}\nBoxLineWidthValue: ${BoxLineWidthValue}`)
    });
});

// Command to add a new waypoint
register("command", (x, y, z) => {
    let waypoint = { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) };
    waypoints.push(waypoint);
    showDebugMessage(`Waypoint created at: ${x}, ${y}, ${z}!`); // Add check for debug mode idiot!
}).setName("addWaypoint");

// Command to clear existing waypoints
register("command", () => {
    waypoints = [];
    showDebugMessage("All waypoints cleared!"); // Here as well!
}).setName("clearWaypoints");