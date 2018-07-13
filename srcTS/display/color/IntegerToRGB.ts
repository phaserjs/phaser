/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Return the component parts of a color as an Object with the properties alpha, red, green, blue.
 *
 * Alpha will only be set if it exists in the given color (0xAARRGGBB)
 *
 * @function Phaser.Display.Color.IntegerToRGB
 * @since 3.0.0
 *
 * @param {integer} input - The color value to convert into a Color object.
 *
 * @return {ColorObject} An object with the red, green and blue values set in the r, g and b properties.
 */
var IntegerToRGB = function (color)
{
    if (color > 16777215)
    {
        //  The color value has an alpha component
        return {
            a: color >>> 24,
            r: color >> 16 & 0xFF,
            g: color >> 8 & 0xFF,
            b: color & 0xFF
        };
    }
    else
    {
        return {
            a: 255,
            r: color >> 16 & 0xFF,
            g: color >> 8 & 0xFF,
            b: color & 0xFF
        };
    }
};

module.exports = IntegerToRGB;
