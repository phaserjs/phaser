/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Checks if the given `width` and `height` are a power of two.
 * Useful for checking texture dimensions.
 *
 * @function Phaser.Math.Pow2.IsSizePowerOfTwo
 * @since 3.0.0
 *
 * @param {number} width - The width.
 * @param {number} height - The height.
 *
 * @return {boolean} `true` if `width` and `height` are a power of two, otherwise `false`.
 */
var IsSizePowerOfTwo = function (width, height)
{
    return (width > 0 && (width & (width - 1)) === 0 && height > 0 && (height & (height - 1)) === 0);
};

module.exports = IsSizePowerOfTwo;
