/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Tests the value and returns `true` if it is a power of two.
 *
 * @function Phaser.Math.Pow2.IsValuePowerOfTwo
 * @since 3.0.0
 *
 * @param {number} value - The value to check if it's a power of two.
 *
 * @return {boolean} Returns `true` if `value` is a power of two, otherwise `false`.
 */
var IsValuePowerOfTwo = function (value)
{
    return (value > 0 && (value & (value - 1)) === 0);
};

module.exports = IsValuePowerOfTwo;
