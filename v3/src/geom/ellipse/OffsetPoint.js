/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.OffsetPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 * @param {Phaser.Geom.Point|object} point - [description]
 *
 * @return {Phaser.Geom.Ellipse} [description]
 */
var OffsetPoint = function (ellipse, point)
{
    ellipse.x += point.x;
    ellipse.y += point.y;

    return ellipse;
};

module.exports = OffsetPoint;
