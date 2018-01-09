var RotateAroundXY = require('./RotateAroundXY');
var InCenter = require('./InCenter');

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.Rotate
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {number} angle - [description]
 *
 * @return {Phaser.Geom.Triangle} [description]
 */
var Rotate = function (triangle, angle)
{
    var point = InCenter(triangle);

    return RotateAroundXY(triangle, point.x, point.y, angle);
};

module.exports = Rotate;
