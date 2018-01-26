/**
 * [description]
 *
 * @function Phaser.Geom.Point.Subtract
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Subtract = function (point, x, y)
{
    point.x -= x;
    point.y -= y;

    return point;
};

module.exports = Subtract;
