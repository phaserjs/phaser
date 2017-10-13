/**
 * [description]
 *
 * @function Phaser.Geom.Point.Ceil
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Ceil = function (point)
{
    return point.setTo(Math.ceil(point.x), Math.ceil(point.y));
};

module.exports = Ceil;
