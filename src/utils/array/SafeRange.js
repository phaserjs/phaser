/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Tests if the start and end indexes define a valid, safe range within the given array.
 *
 * A range is considered safe when `startIndex` is zero or greater, `startIndex` is less
 * than `endIndex`, and `endIndex` does not exceed the length of the array.
 *
 * @function Phaser.Utils.Array.SafeRange
 * @since 3.4.0
 *
 * @param {array} array - The array to check.
 * @param {number} startIndex - The inclusive start index of the range. Must be zero or greater and less than `endIndex`.
 * @param {number} endIndex - The exclusive end index of the range. Must be greater than `startIndex` and no greater than the array length.
 * @param {boolean} [throwError=false] - If `true`, a `Range Error` is thrown when the range is out of bounds instead of returning `false`.
 *
 * @return {boolean} True if the range is safe, otherwise false.
 */
var SafeRange = function (array, startIndex, endIndex, throwError)
{
    var len = array.length;

    if (startIndex < 0 ||
        startIndex >= len ||
        startIndex >= endIndex ||
        endIndex > len)
    {
        if (throwError)
        {
            throw new Error('Range Error: Values outside acceptable range');
        }

        return false;
    }
    else
    {
        return true;
    }
};

module.exports = SafeRange;
