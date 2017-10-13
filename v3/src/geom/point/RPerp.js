/**
 * [description]
 *
 * @function Phaser.Geom.Point.RPerp
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var RPerp = function (point)
{
    return point.setTo(point.y, -point.x);
};

module.exports = RPerp;
