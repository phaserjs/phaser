/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Converts the given color value into an object containing r, g, b and a properties.
 *
 * The color value can be a 24-bit RGB integer (e.g. `0xRRGGBB`) or a 32-bit ARGB integer
 * (e.g. `0xAARRGGBB`). If the value is 24-bit (i.e. does not exceed `0xFFFFFF`), the alpha
 * component of the returned object defaults to 255 (fully opaque). Otherwise, the alpha is
 * extracted from the upper 8 bits of the value.
 *
 * @function Phaser.Display.Color.ColorToRGBA
 * @since 3.0.0
 *
 * @param {number} color - A 24-bit RGB or 32-bit ARGB color integer, optionally including an alpha component in the most-significant byte.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the parsed color values.
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
