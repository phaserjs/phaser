/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Color = require('./Color');
var HueToComponent = require('./HueToComponent');

/**
 * Converts HSL (hue, saturation and lightness) values to a Phaser Color object.
 *
 * @function Phaser.Display.Color.HSLToColor
 * @since 3.0.0
 *
 * @param {number} h - The hue value in the range 0 to 1.
 * @param {number} s - The saturation value in the range 0 to 1.
 * @param {number} l - The lightness value in the range 0 to 1.
 *
 * @return {Phaser.Display.Color} A Color object created from the results of the h, s and l values.
 */
var HSLToColor = function (h, s, l)
{
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

    var color = new Color();

    return color.setGLTo(r, g, b, 1);
};

module.exports = HSLToColor;
