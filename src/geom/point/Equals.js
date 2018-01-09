/**
 * [description]
 *
 * @function Phaser.Geom.Point.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 * @param {Phaser.Geom.Point} toCompare - [description]
 *
 * @return {boolean} [description]
 */
var Equals = function (point, toCompare)
{
    return (point.x === toCompare.x && point.y === toCompare.y);
};

module.exports = Equals;
