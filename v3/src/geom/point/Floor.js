/**
 * [description]
 *
 * @function Phaser.Geom.Point.Floor
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Floor = function (point)
{
    return point.setTo(Math.floor(point.x), Math.floor(point.y));
};

module.exports = Floor;
