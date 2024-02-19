/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HSVToRGB = require('./HSVToRGB');

/**
 * Generates an HSV color wheel which is an array of 360 Color objects, for each step of the wheel.
 *
 * @function Phaser.Display.Color.HSVColorWheel
 * @since 3.0.0
 *
 * @param {number} [s=1] - The saturation, in the range 0 - 1.
 * @param {number} [v=1] - The value, in the range 0 - 1.
 *
 * @return {Phaser.Types.Display.ColorObject[]} An array containing 360 ColorObject elements, where each element contains a Color object corresponding to the color at that point in the HSV color wheel.
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
