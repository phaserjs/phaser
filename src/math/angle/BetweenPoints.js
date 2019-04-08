/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
 *
 * Calculates the angle of the vector from the first point to the second point.
 *
 * @function Phaser.Math.Angle.BetweenPoints
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|object)} point1 - The first point.
 * @param {(Phaser.Geom.Point|object)} point2 - The second point.
 *
 * @return {number} The angle in radians.
 */
var BetweenPoints = function (point1, point2)
{
    return Math.atan2(point2.y - point1.y, point2.x - point1.x);
};

module.exports = BetweenPoints;
