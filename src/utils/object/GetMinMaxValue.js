/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetValue = require('./GetValue');
var Clamp = require('../../math/Clamp');

/**
 * Retrieves a numerical value from a source object using the given key, then clamps it to the
 * inclusive range defined by `min` and `max`. If the property does not exist on the source object,
 * the `defaultValue` is used instead. Nested properties can be accessed by separating key names
 * with a dot. The returned value is always within the specified bounds.
 *
 * @function Phaser.Utils.Objects.GetMinMaxValue
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`).
 * @param {number} min - The minimum value which can be returned.
 * @param {number} max - The maximum value which can be returned.
 * @param {number} defaultValue - The value to return if the property doesn't exist. If not provided, defaults to `min`. It's also constrained to the given bounds.
 *
 * @return {number} The clamped value from the `source` object.
 */
var GetMinMaxValue = function (source, key, min, max, defaultValue)
{
    if (defaultValue === undefined) { defaultValue = min; }

    var value = GetValue(source, key, defaultValue);

    return Clamp(value, min, max);
};

module.exports = GetMinMaxValue;
