/**
 * [description]
 *
 * @function Phaser.Geom.Point.Perp
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Perp = function (point)
{
    return point.setTo(-point.y, point.x);
};

module.exports = Perp;
