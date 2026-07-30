/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Offsets the Circle by the values given in the `x` and `y` properties of the Vector2 object.
 *
 * @function Phaser.Geom.Circle.OffsetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Circle} O - [circle,$return]
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to be offset (translated.)
 * @param {Phaser.Math.Vector2} vec - The Vector2 object containing the values to offset the Circle by.
 *
 * @return {Phaser.Geom.Circle} The Circle that was offset.
 */
var OffsetPoint = function (circle, vec)
{
    circle.x += vec.x;
    circle.y += vec.y;

    return circle;
};

module.exports = OffsetPoint;
