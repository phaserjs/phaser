/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ComponentToHex = require('./ComponentToHex');

/**
 * Converts the given red, green, blue, and alpha color component values into a hex color string.
 *
 * When using the `#` prefix the result is a 6-character CSS-compatible hex string in `#rrggbb` format.
 * The alpha value is not included in this format.
 *
 * When using the `0x` prefix the result is an 8-character ARGB hex string in `0xaarrggbb` format,
 * which includes the alpha component as the most significant byte.
 *
 * @function Phaser.Display.Color.RGBToString
 * @since 3.0.0
 *
 * @param {number} r - The red color value. A number between 0 and 255.
 * @param {number} g - The green color value. A number between 0 and 255.
 * @param {number} b - The blue color value. A number between 0 and 255.
 * @param {number} [a=255] - The alpha value. A number between 0 and 255.
 * @param {string} [prefix=#] - The prefix of the string. Either `#` or `0x`.
 *
 * @return {string} A hex color string in either `#rrggbb` or `0xaarrggbb` format, depending on the prefix.
 */
var RGBToString = function (r, g, b, a, prefix)
{
    if (a === undefined) { a = 255; }
    if (prefix === undefined) { prefix = '#'; }

    if (prefix === '#')
    {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
    }
    else
    {
        return '0x' + ComponentToHex(a) + ComponentToHex(r) + ComponentToHex(g) + ComponentToHex(b);
    }
};

module.exports = RGBToString;
