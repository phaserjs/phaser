/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Return the component parts of a color as an Object with the properties alpha, red, green, blue.
 *
 * If the color value includes an alpha component (0xAARRGGBB), it is extracted and set in the `a` property.
 * Otherwise, alpha defaults to 255 (fully opaque).
 *
 * @function Phaser.Display.Color.IntegerToRGB
 * @since 3.0.0
 *
 * @param {number} color - The color value to convert into a Color object.
 *
 * @return {Phaser.Types.Display.ColorObject} An object with the alpha, red, green, and blue values set in the a, r, g, and b properties.
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
