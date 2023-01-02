/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DistanceBetween = require('../../math/distance/DistanceBetween');

/**
 * Checks if two Circles intersect.
 *
 * @function Phaser.Geom.Intersects.CircleToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circleA - The first Circle to check for intersection.
 * @param {Phaser.Geom.Circle} circleB - The second Circle to check for intersection.
 *
 * @return {boolean} `true` if the two Circles intersect, otherwise `false`.
 */
var CircleToCircle = function (circleA, circleB)
{
    return (DistanceBetween(circleA.x, circleA.y, circleB.x, circleB.y) <= (circleA.radius + circleB.radius));
};

module.exports = CircleToCircle;
