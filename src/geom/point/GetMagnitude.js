/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the magnitude of the point, which equivalent to the length of the line from the origin to this point.
 *
 * @function Phaser.Geom.Point.GetMagnitude
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - The point to calculate the magnitude for
 *
 * @return {number} The resulting magnitude
 */
var GetMagnitude = function (point)
{
    return Math.sqrt((point.x * point.x) + (point.y * point.y));
};

module.exports = GetMagnitude;
