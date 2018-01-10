/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.OffsetPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var OffsetPoint = function (rect, point)
{
    rect.x += point.x;
    rect.y += point.y;

    return rect;
};

module.exports = OffsetPoint;
