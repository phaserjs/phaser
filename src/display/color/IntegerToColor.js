/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Color = require('./Color');
var IntegerToRGB = require('./IntegerToRGB');

/**
 * Converts the given color value into an instance of a Color object.
 *
 * @function Phaser.Display.Color.IntegerToColor
 * @since 3.0.0
 *
 * @param {number} input - The 32-bit integer color value to convert, such as a hex value like `0xff0000` for red.
 * @param {Phaser.Display.Color} [color] - An optional Color object to store the result in. If not provided, a new Color object is created and returned.
 *
 * @return {Phaser.Display.Color} A Color object containing the red, green, blue, and alpha components extracted from the given integer.
 */
var IntegerToColor = function (input, color)
{
    var rgb = IntegerToRGB(input);

    if (!color) { return new Color(rgb.r, rgb.g, rgb.b, rgb.a); }

    return color.setTo(rgb.r, rgb.g, rgb.b, rgb.a);
};

module.exports = IntegerToColor;
