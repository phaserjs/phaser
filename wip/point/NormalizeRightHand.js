/**
 * [description]
 *
 * @function Phaser.Geom.Point.NormalizeRightHand
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var NormalizeRightHand = function (point)
{
    return point.setTo(point.y * -1, point.x);
};

module.exports = NormalizeRightHand;
