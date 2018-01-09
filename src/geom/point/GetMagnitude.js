/**
 * [description]
 *
 * @function Phaser.Geom.Point.GetMagnitude
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {number} [description]
 */
var GetMagnitude = function (point)
{
    return Math.sqrt((point.x * point.x) + (point.y * point.y));
};

module.exports = GetMagnitude;
