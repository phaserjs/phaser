/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compute a random unit vector.
 *
 * Computes random values for the given vector between -1 and 1 that can be used to represent a direction.
 *
 * Optionally accepts a scale value to scale the resulting vector by.
 *
 * @function Phaser.Math.RandomXY
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} vector - The Vector to compute random values for.
 * @param {number} [scale=1] - The scale of the random values.
 *
 * @return {Phaser.Math.Vector2} The given Vector.
 */
var RandomXY = function (vector, scale)
{
    if (scale === undefined) { scale = 1; }

    var r = Math.random() * 2 * Math.PI;

    vector.x = Math.cos(r) * scale;
    vector.y = Math.sin(r) * scale;

    return vector;
};

module.exports = RandomXY;
