/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HexStringToColor = require('./HexStringToColor');
var IntegerToColor = require('./IntegerToColor');
var ObjectToColor = require('./ObjectToColor');
var RGBStringToColor = require('./RGBStringToColor');

/**
 * Converts the given source color value into an instance of a Color class.
 * The value can be either a string, prefixed with `rgb` or a hex string, a number or an Object.
 *
 * @function Phaser.Display.Color.ValueToColor
 * @since 3.0.0
 *
 * @param {(string|number|Phaser.Types.Display.InputColorObject)} input - The source color value to convert.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
var ValueToColor = function (input)
{
    var t = typeof input;

    switch (t)
    {
        case 'string':

            if (input.substr(0, 3).toLowerCase() === 'rgb')
            {
                return RGBStringToColor(input);
            }
            else
            {
                return HexStringToColor(input);
            }

        case 'number':

            return IntegerToColor(input);

        case 'object':

            return ObjectToColor(input);
    }
};

module.exports = ValueToColor;
