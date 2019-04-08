/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Check if a given value is an even number using a strict type check.
 *
 * @function Phaser.Math.IsEvenStrict
 * @since 3.0.0
 *
 * @param {number} value - The number to perform the check with.
 *
 * @return {boolean} Whether the number is even or not.
 */
var IsEvenStrict = function (value)
{
    // Use strict equality === for "is number" test
    return (value === parseFloat(value)) ? !(value % 2) : void 0;
};

module.exports = IsEvenStrict;
