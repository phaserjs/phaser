/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HSVToRGB = require('./HSVToRGB');

/**
 * Generates an HSV color wheel as an array of 360 ColorObject entries, one for each degree of hue from 0 to 359.
 *
 * @function Phaser.Display.Color.HSVColorWheel
 * @since 3.0.0
 *
 * @param {number} [s=1] - The saturation, in the range 0 - 1.
 * @param {number} [v=1] - The value, in the range 0 - 1.
 *
 * @return {Phaser.Types.Display.ColorObject[]} An array of 360 ColorObject elements, each representing the RGB color at that hue step of the HSV color wheel.
 */
var HSVColorWheel = function (s, v)
{
    if (s === undefined) { s = 1; }
    if (v === undefined) { v = 1; }

    var colors = [];

    for (var c = 0; c <= 359; c++)
    {
        colors.push(HSVToRGB(c / 359, s, v));
    }

    return colors;
};

module.exports = HSVColorWheel;
