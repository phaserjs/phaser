/**
 * [description]
 *
 * @function Phaser.Math.Angle.BetweenPointsY
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point|object} point1 - [description]
 * @param {Phaser.Geom.Point|object} point2 - [description]
 *
 * @return {number} [description]
 */
var BetweenPointsY = function (point1, point2)
{
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
};

module.exports = BetweenPointsY;
