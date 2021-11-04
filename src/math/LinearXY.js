/**
 * @author       Greg McLean <GregDevProjects>
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Interpolates two given Vectors and returns a new Vector between them.
 *
 * Does not modify either of the passed Vectors.
 *
 * @function Phaser.Math.LinearXY
 * @since 3.60.0
 *
 * @param {Phaser.Math.Vector2} vector1 - Starting vector
 * @param {Phaser.Math.Vector2} vector2 - Ending vector
 * @param {number} [t=0] - The percentage between vector1 and vector2 to return, represented as a number between 0 and 1.
 *
 * @return {Phaser.Math.Vector2} The step t% of the way between vector1 and vector2.
 */
var LinearXY = function (vector1, vector2, t)
{
    if (t === undefined) { t = 0; }

    return vector1.clone().lerp(vector2, t);
};

module.exports = LinearXY;
