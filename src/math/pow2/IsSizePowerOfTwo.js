/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks if the given `width` and `height` are a power of two.
 * Useful for checking texture dimensions.
 *
 * @function Phaser.Math.Pow2.IsSize
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
