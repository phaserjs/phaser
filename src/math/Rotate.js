/**
 * [description]
 *
 * @function Phaser.Math.Rotate
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point|object} point - [description]
 * @param {number} angle - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Rotate = function (point, angle)
{
    var x = point.x;
    var y = point.y;

    point.x = (x * Math.cos(angle)) - (y * Math.sin(angle));
    point.y = (x * Math.sin(angle)) + (y * Math.cos(angle));

    return point;
};

module.exports = Rotate;
