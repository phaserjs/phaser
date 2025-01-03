/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Color = require('./Color');

/**
 * Converts an object containing `r`, `g`, `b` and `a` properties into a Color class instance.
 *
 * @function Phaser.Display.Color.ObjectToColor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Display.InputColorObject} input - An object containing `r`, `g`, `b` and `a` properties in the range 0 to 255.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
var ObjectToColor = function (input)
{
    return new Color(input.r, input.g, input.b, input.a);
};

module.exports = ObjectToColor;
