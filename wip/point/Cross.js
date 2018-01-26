/**
 * [description]
 *
 * @function Phaser.Geom.Point.Cross
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} pointA - [description]
 * @param {Phaser.Geom.Point} pointB - [description]
 *
 * @return {number} [description]
 */
var Cross = function (pointA, pointB)
{
    return ((pointA.x * pointB.y) - (pointA.y * pointB.x));
};

module.exports = Cross;
