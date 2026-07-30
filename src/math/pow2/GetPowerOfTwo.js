/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the smallest power of 2 that is greater than or equal to the given `value`.
 * For example, a value of 7 returns 8, a value of 8 returns 8, and a value of 9 returns 16.
 *
 * @function Phaser.Math.Pow2.GetPowerOfTwo
 * @since 3.0.0
 *
 * @param {number} value - The value for which to find the next power of 2. Should be a positive number.
 *
 * @return {number} The smallest power of 2 that is greater than or equal to `value`.
 */
var GetPowerOfTwo = function (value)
{
    var index = Math.log(value) / 0.6931471805599453;

    return (1 << Math.ceil(index));
};

module.exports = GetPowerOfTwo;
