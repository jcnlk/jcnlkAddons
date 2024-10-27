import RenderLibV2 from "../../RenderLibV2";
import renderBeaconBeam from "../../BeaconBeam"
import { showGeneralJAMessage, showDebugMessage } from "./ChatUtils"
import config from "../config"

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
let BeaconRedValue = 1;
let BeaconGreenValue = 0;
let BeaconBlueValue = 0;
let BeaconAlphaValue = 0.7;
let BeaconDepthCheckValue = false;
let BeaconBeamHightValue = 250;

// Values for rendering the waypoint box
//const BoxXWidthValue = ("1");     <- Doesn't
//const BoxHightValue = ("1");      <- work
//const BoxZWidthValue = ("1");     <- idk
let BoxRedValue = 1;
let BoxGreenValue = 0;
let BoxBlueValue = 0;
let BoxAlphaValue = 1;      // DON'T lower this one otherwise box won't be visable
let BoxPhaseValue = true;     // idk what this is doing but keep it like this
let BoxLineWidthValue = 3;

// Values for rendering the text
let WaypointName = "My Waypoint";       // The name of text to render (text)
let WaypointTextColor = 16777215;       // the color of the text (integer)
let WaypointTextRenderBlackBox = true;  // render a pretty black border behind the text (true,false)
let WaypointTextScale = 1;           // the scale of the text (number)
let WaypointTextIncrease = true;       // whether to scale the text up as the player moves away (true,false)

// Renderning of the waypoint
let waypoints = [];

register("renderWorld", (x, y, z) => {
    waypoints.forEach(waypoint => {
        RenderLibV2.drawInnerEspBoxV2(waypoint.x + 0.5, waypoint.y, waypoint.z + 0.5, 1, 1, 1, BoxRedValue, BoxGreenValue, BoxBlueValue, BoxAlphaValue, BoxPhaseValue, BoxLineWidthValue);
        renderBeaconBeam(waypoint.x, waypoint.y + 1, waypoint.z, BeaconRedValue, BeaconGreenValue, BeaconBlueValue, BeaconAlphaValue, BeaconDepthCheckValue, BeaconBeamHightValue)
        Tessellator.drawString(WaypointName, waypoint.x + 0.5, waypoint.y + 2, waypoint.z + 0.5, WaypointTextColor, WaypointTextRenderBlackBox, WaypointTextScale, WaypointTextIncrease)
        //showDebugMessage(`BoxXWidthValue: ${BoxXWidthValue}\nBoxHightValue: ${BoxHightValue}\nBoxZValue: ${BoxZWidthValue}\nBoxRedValue: ${BoxRedValue}\nBoxGreenValue: ${BoxGreenValue}\nBoxBlueValue: ${BoxBlueValue}\nBoxAlphaValue: ${BoxAlphaValue}\n BoxPhaseValue: ${BoxPhaseValue}\nBoxLineWidthValue: ${BoxLineWidthValue}`)
    });
});

// Command to add a new waypoint
register("command", (x, y, z) => {
    let waypoint = { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) };
    waypoints.push(waypoint);
    if (!config.debugMode) {
        showDebugMessage(`Waypoint created at: ${x}, ${y}, ${z}!`);
        return
    }
}).setName("addWaypoint");

// Command to clear existing waypoints
register("command", () => {
    waypoints = [];
    if (!config.debugMode) {
    showDebugMessage("All waypoints cleared!");
    return
    }
}).setName("clearWaypoints");









// AU Ansatz
/**
 * Calculate the distance between 2 places in 3D Space.
 * @param {Number[3]} p1 Start Place.
 * @param {Number[3]} p2 End Place.
 * @returns {Number} The Distance between the 2 places.
 */
export function calculateDistanceQuick(p1, p2) {
    var a = p2[0] - p1[0];
    var b = p2[1] - p1[1];
    var c = p2[2] - p1[2];

    let ret = a * a + b * b + c * c

    if (ret < 0) {
        ret *= -1
    }
    return ret;
}

/**
 * Lightens or Darkens a HEX colour.
 * @param {Number} num The HEX colour in number form.
 * @param {Number} amt The amount to darken (-) or lighten (+) it by.
 * @returns {Number} The new shifted colour.
 */
export function LightenDarkenColor(num, amt) {
    var r = (num >> 16) + amt;
    var b = ((num >> 8) & 0x00FF) + amt;
    var g = (num & 0x0000FF) + amt;
    var newColor = g | (b << 8) | (r << 16);
    return newColor;
}

/**
 * Draws a waypoint in 3D Space
 * @param {Number} x The x coordinate.
 * @param {Number} y The y coordinate.
 * @param {Number} z The z coordinate.
 * @param {Number} w The width of the drawn box.
 * @param {Number} h The height of the drawn box.
 * @param {Number} r The red value of the drawn box's colour.
 * @param {Number} g The green value of the drawn box's colour.
 * @param {Number} b The blue value of the drawn box's colour.
 * @param {String} name The name of the waypoint
 * @param {Number} textColour The colour of the drawn text.
 * @param {Boolean} throughWalls If the waypoint can be seen through walls.
 * @param {Boolean} beacon If it should have a beacon.
 * @param {Boolean} distance If it should display the distance to the player. (Inherits the colour of the above text but shifts it a little.) 
 */
export function drawWaypoint(x, y, z, w, h, r, g, b, name, textColour, throughWalls, beacon, distance)
{
    let distToPlayer=Math.sqrt((x-Player.getRenderX())**2+(y-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))**2+(z-Player.getRenderZ())**2);
    if (beacon) renderBeaconBeam(x,y,z,r,g,b,1,true)
    RenderLib.drawEspBox(x+0.5,y,z+0.5,w,h,r,g,b,1,throughWalls)
    Tessellator.drawString(name,x+0.5,y+2,z+0.5,textColour,false,0.09,false)
    if (distance) Tessellator.drawString("("+String(Math.round(distToPlayer))+"m)",x+0.5,y+1,z+0.5,LightenDarkenColor(textColour,+40),false,0.06,false)
}



//SBO Ansatz

function renderWaypoint(waypoints) {
    if (!waypoints.length) return;

    waypoints.forEach((waypoint) => {
        box = waypoint[0];
        beam = waypoint[1];
        rgb = waypoint[2];
        let removeAtDistance = 10;
        let alpha = 0.5;
        if (box[4] <= settings.removeGuessDistance && box[0].includes("Guess") && settings.removeGuess) return;
        if (!settings.removeGuess && box[0].includes("Guess")) {
            removeAtDistance = 0;
        }
        // RenderLibV2.drawEspBoxV2(box[1], box[2], box[3], 1, 1, 1, rgb[0], rgb[1], rgb[2], 1, true);
        RenderLibV2.drawInnerEspBoxV2(box[1], box[2], box[3], 1, 1, 1, rgb[0], rgb[1], rgb[2], alpha/2, true);
        let hexCodeString = javaColorToHex(new Color(rgb[0], rgb[1], rgb[2]));
        if (box[0] != "" && box[0] != "§7") {
            Tessellator.drawString(box[0], box[1], box[2] + 1.5, box[3], parseInt(hexCodeString, 16), true);
        }

        if (box[4] >= removeAtDistance && box[5]) {
            renderBeaconBeam(beam[0], beam[1]+1, beam[2], rgb[0], rgb[1], rgb[2], alpha, false);
        }
    });
}

function javaColorToHex(javaColor) {
    // Extract RGB components
    let red = javaColor.getRed();
    let green = javaColor.getGreen();
    let blue = javaColor.getBlue();

    // Convert RGB to hexadecimal
    let hex = "0x" + componentToHex(red) + componentToHex(green) + componentToHex(blue);

    return hex;
}

// Helper function to convert a single color component to hexadecimal
function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
