/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH = require('../../math');
var GetValue = require('./GetValue');

/**
 * Retrieves a value from an object. Extends `GetValue` with support for dynamic and randomized
 * value types, making it useful for configuration objects where values may be fixed, procedural,
 * or randomly selected at the point of use (for example, particle emitter configs or group configs).
 *
 * The following value types are supported for the retrieved property:
 *
 * Explicit value:
 * {
 *     x: 4
 * }
 *
 * Function — invoked with the property key as its argument; its return value is used:
 * {
 *     x: function (key) { return 4; }
 * }
 *
 * Array — one element is picked at random from the array:
 * {
 *     x: [a, b, c, d, e, f]
 * }
 *
 * Random integer between min and max (inclusive):
 * {
 *     x: { randInt: [min, max] }
 * }
 *
 * Random float between min and max:
 * {
 *     x: { randFloat: [min, max] }
 * }
 *
 *
 * @function Phaser.Utils.Objects.GetAdvancedValue
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`) - `banner.hideBanner` would return the value of the `hideBanner` property from the object stored in the `banner` property of the `source` object.
 * @param {*} defaultValue - The value to return if the `key` isn't found in the `source` object.
 *
 * @return {*} The value of the requested key.
 */
var GetAdvancedValue = function (source, key, defaultValue)
{
    var value = GetValue(source, key, null);

    if (value === null)
    {
        return defaultValue;
    }
    else if (Array.isArray(value))
    {
        return MATH.RND.pick(value);
    }
    else if (typeof value === 'object')
    {
        if (value.hasOwnProperty('randInt'))
        {
            return MATH.RND.integerInRange(value.randInt[0], value.randInt[1]);
        }
        else if (value.hasOwnProperty('randFloat'))
        {
            return MATH.RND.realInRange(value.randFloat[0], value.randFloat[1]);
        }
    }
    else if (typeof value === 'function')
    {
        return value(key);
    }

    return value;
};

module.exports = GetAdvancedValue;
