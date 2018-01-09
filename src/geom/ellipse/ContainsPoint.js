var Contains = require('./Contains');

/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 * @param {Phaser.Geom.Point|object} point - [description]
 *
 * @return {boolean} [description]
 */
var ContainsPoint = function (ellipse, point)
{
    return Contains(ellipse, point.x, point.y);
};

module.exports = ContainsPoint;
