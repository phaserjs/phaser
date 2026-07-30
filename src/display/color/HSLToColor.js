/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Color = require('./Color');
var HueToComponent = require('./HueToComponent');

/**
 * Converts HSL (hue, saturation and lightness) values to a Phaser Color object.
 *
 * All three input values should be in the range 0 to 1. If the saturation is 0
 * the color is treated as achromatic (greyscale). Otherwise the standard HSL-to-RGB
 * algorithm is applied, using the lightness value to derive the intermediate q and p
 * coefficients before delegating each channel to `HueToComponent`.
 *
 * @function Phaser.Display.Color.HSLToColor
 * @since 3.0.0
 *
 * @param {number} h - The hue value in the range 0 to 1.
 * @param {number} s - The saturation value in the range 0 to 1.
 * @param {number} l - The lightness value in the range 0 to 1.
 * @param {Phaser.Display.Color} [color] - An optional Color object to populate with the converted values. If not provided, a new Color object is created and returned.
 *
 * @return {Phaser.Display.Color} The Color object populated with the RGB values derived from the given h, s and l inputs. This is either the `color` argument (if provided) or a newly created Color object.
 */
var HSLToColor = function (h, s, l, color)
{
    if (!color) { color = new Color(); }

    // achromatic by default
    var r = l;
    var g = l;
    var b = l;

    if (s !== 0)
    {
        var q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = HueToComponent(p, q, h + 1 / 3);
        g = HueToComponent(p, q, h);
        b = HueToComponent(p, q, h - 1 / 3);
    }

    return color.setGLTo(r, g, b, 1);
};

module.exports = HSLToColor;
