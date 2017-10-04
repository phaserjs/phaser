/**
 * [description]
 *
 * @function Phaser.Geom.Circle.OffsetPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - [description]
 * @param {Phaser.Geom.Point|object} point - [description]
 * @return {Phaser.Geom.Circle} [description]
 */
var OffsetPoint = function (circle, point)
{
    circle.x += point.x;
    circle.y += point.y;

    return circle;
};

module.exports = OffsetPoint;
