/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates the area of the circle.
 *
 * @function Phaser.Geom.Circle.Area
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to get the area of.
 *
 * @return {number} The area of the Circle.
 */
var Area = function (circle)
{
    return (circle.radius > 0) ? Math.PI * circle.radius * circle.radius : 0;
};

module.exports = Area;
