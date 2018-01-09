var Contains = require('./Contains');

/**
 * [description]
 *
 * @function Phaser.Geom.Circle.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - [description]
 * @param {Phaser.Geom.Point|object} point - [description]
 *
 * @return {boolean} [description]
 */
var ContainsPoint = function (circle, point)
{
    return Contains(circle, point.x, point.y);
};

module.exports = ContainsPoint;
