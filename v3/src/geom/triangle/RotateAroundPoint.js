var RotateAroundXY = require('./RotateAroundXY');

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.RotateAroundPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {Phaser.Geom.Point} point - [description]
 * @param {number} angle - [description]
 *
 * @return {Phaser.Geom.Triangle} [description]
 */
var RotateAroundPoint = function (triangle, point, angle)
{
    return RotateAroundXY(triangle, point.x, point.y, angle);
};

module.exports = RotateAroundPoint;
