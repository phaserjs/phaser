/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HexStringToColor = require('./HexStringToColor');
var IntegerToColor = require('./IntegerToColor');
var ObjectToColor = require('./ObjectToColor');
var RGBStringToColor = require('./RGBStringToColor');

/**
 * Converts the given source color value into an instance of a Color class.
 * The value can be a string (either prefixed with `rgb` for an RGB color string, or a hex color string),
 * a number representing a packed RGB integer, or a plain object with `r`, `g`, and `b` properties.
 *
 * @function Phaser.Display.Color.ValueToColor
 * @since 3.0.0
 *
 * @param {(string|number|Phaser.Types.Display.InputColorObject)} input - The source color value to convert.
 * @param {Phaser.Display.Color} [color] - An existing Color object to store the result in. If not provided, a new Color object is created and returned.
 *
 * @return {Phaser.Display.Color} A Color object containing the converted color value.
 */
var ValueToColor = function (input, color)
{
    var t = typeof input;

    switch (t)
    {
        case 'string':

            if (input.substr(0, 3).toLowerCase() === 'rgb')
            {
                return RGBStringToColor(input, color);
            }
            else
            {
                return HexStringToColor(input, color);
            }

        case 'number':

            return IntegerToColor(input, color);

        case 'object':

            return ObjectToColor(input, color);
    }
};

module.exports = ValueToColor;
