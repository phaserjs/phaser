/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns the nearest power of 2 to the given `value`.
 *
 * @function Phaser.Math.Pow2.GetPowerOfTwo
 * @since 3.0.0
 *
 * @param {number} value - The value.
 *
 * @return {integer} The nearest power of 2 to `value`.
 */
var GetPowerOfTwo = function (value)
{
    var index = Math.log(value) / 0.6931471805599453;

    return (1 << Math.ceil(index));
};

module.exports = GetPowerOfTwo;
