var Contains = require('./Contains');

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {boolean} [description]
 */
var ContainsPoint = function (triangle, point)
{
    return Contains(triangle, point.x, point.y);
};

module.exports = ContainsPoint;
