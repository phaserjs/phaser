/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates a linear (interpolation) value over t.
 *
 * @function Phaser.Math.Linear
 * @since 3.0.0
 *
 * @param {number} p0 - The first point.
 * @param {number} p1 - The second point.
 * @param {number} t - The percentage between p0 and p1 to return, represented as a number between 0 and 1.
 *
 * @return {number} The step t% of the way between p0 and p1.
 */
var Linear = function (p0, p1, t)
{
    return (p1 - p0) * t + p0;
};

module.exports = Linear;
