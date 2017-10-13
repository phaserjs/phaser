/**
 * [description]
 *
 * @function Phaser.Geom.Point.Dot
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} pointA - [description]
 * @param {Phaser.Geom.Point} pointB - [description]
 *
 * @return {number} [description]
 */
var Dot = function (pointA, pointB)
{
    return ((pointA.x * pointB.x) + (pointA.y * pointB.y));
};

module.exports = Dot;
