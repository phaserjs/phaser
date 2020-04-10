/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HSVToRGB = require('./HSVToRGB');

/**
 * Get HSV color wheel values in an array which will be 360 elements in size.
 *
 * @function Phaser.Display.Color.HSVColorWheel
 * @since 3.0.0
 *
 * @param {number} [s=1] - The saturation, in the range 0 - 1.
 * @param {number} [v=1] - The value, in the range 0 - 1.
 *
 * @return {Phaser.Types.Display.ColorObject[]} An array containing 360 elements, where each contains a single numeric value corresponding to the color at that point in the HSV color wheel.
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
