/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Tests if the start and end indexes are a safe range for the given array.
 * 
 * @function Phaser.Utils.Array.SafeRange
 * @since 3.4.0
 *
 * @param {array} array - The array to check.
 * @param {integer} startIndex - The start index.
 * @param {integer} endIndex - The end index.
 * @param {boolean} [throwError=true] - Throw an error if the range is out of bounds.
 *
 * @return {boolean} True if the range is safe, otherwise false.
 */
var SafeRange = function (array, startIndex, endIndex, throwError)
{
    var len = array.length;

    if (startIndex < 0 ||
        startIndex > len ||
        startIndex >= endIndex ||
        endIndex > len ||
        startIndex + endIndex > len)
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
