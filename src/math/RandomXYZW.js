/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compute a random four-dimensional vector.
 *
 * @function Phaser.Math.RandomXYZW
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector4} vec4 - The Vector to compute random values for.
 * @param {number} [scale=1] - The scale of the random values.
 *
 * @return {Phaser.Math.Vector4} The given Vector.
 */
var RandomXYZW = function (vec4, scale)
{
    if (scale === undefined) { scale = 1; }

    vec4.x = (Math.random() * 2 - 1) * scale;
    vec4.y = (Math.random() * 2 - 1) * scale;
    vec4.z = (Math.random() * 2 - 1) * scale;
    vec4.w = (Math.random() * 2 - 1) * scale;

    return vec4;
};

module.exports = RandomXYZW;
