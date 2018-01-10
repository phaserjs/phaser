var Contains = require('./Contains');

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {boolean} [description]
 */
var ContainsPoint = function (rect, point)
{
    return Contains(rect, point.x, point.y);
};

module.exports = ContainsPoint;
