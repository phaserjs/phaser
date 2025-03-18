/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetColor = require('./GetColor');

/**
 * RGB space conversion.
 *
 * @ignore
 *
 * @param {number} n - The value to convert.
 * @param {number} h - The h value.
 * @param {number} s - The s value.
 * @param {number} v - The v value.
 *
 * @return {number} The converted value.
 */
function ConvertValue (n, h, s, v)
{
    var k = (n + h * 6) % 6;

    var min = Math.min(k, 4 - k, 1);

    return Math.round(255 * (v - v * s * Math.max(0, min)));
}

/**
 * Converts a HSV (hue, saturation and value) color set to RGB.
 *
 * Conversion formula from https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * Assumes HSV values are contained in the set [0, 1].
 *
 * @function Phaser.Display.Color.HSVToRGB
 * @since 3.0.0
 *
 * @param {number} h - The hue, in the range 0 - 1. This is the base color.
 * @param {number} s - The saturation, in the range 0 - 1. This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
 * @param {number} v - The value, in the range 0 - 1. This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
 * @param {(Phaser.Types.Display.ColorObject|Phaser.Display.Color)} [out] - A Color object to store the results in. If not given a new ColorObject will be created.
 *
 * @return {(Phaser.Types.Display.ColorObject|Phaser.Display.Color)} An object with the red, green and blue values set in the r, g and b properties.
 */
var HSVToRGB = function (h, s, v, out)
{
    if (s === undefined) { s = 1; }
    if (v === undefined) { v = 1; }

    var r = ConvertValue(5, h, s, v);
    var g = ConvertValue(3, h, s, v);
    var b = ConvertValue(1, h, s, v);

    if (!out)
    {
        return { r: r, g: g, b: b, color: GetColor(r, g, b) };
    }
    else if (out.setTo)
    {
        return out.setTo(r, g, b, out.alpha, true);
    }
    else
    {
        out.r = r;
        out.g = g;
        out.b = b;
        out.color = GetColor(r, g, b);

        return out;
    }
};

module.exports = HSVToRGB;
