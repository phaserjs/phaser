/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {Object} ColorObject
 * @property {number} r - The red color value in the range 0 to 255.
 * @property {number} g - The green color value in the range 0 to 255.
 * @property {number} b - The blue color value in the range 0 to 255.
 * @property {number} a - The alpha color value in the range 0 to 255.
 */

/**
 * Converts the given color value into an Object containing r,g,b and a properties.
 *
 * @function Phaser.Display.Color.ColorToRGBA
 * @since 3.0.0
 *
 * @param {number} color - A color value, optionally including the alpha value.
 *
 * @return {ColorObject} An object containing the parsed color values.
 */
var ColorToRGBA = function (color)
{
    var output = {
        r: color >> 16 & 0xFF,
        g: color >> 8 & 0xFF,
        b: color & 0xFF,
        a: 255
    };

    if (color > 16777215)
    {
        output.a = color >>> 24;
    }

    return output;
};

module.exports = ColorToRGBA;
