/**
 * [description]
 *
 * @function Phaser.Geom.Circle.Offset
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Geom.Circle} [description]
 */
var Offset = function (circle, x, y)
{
    circle.x += x;
    circle.y += y;

    return circle;
};

module.exports = Offset;
