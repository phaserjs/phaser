/**
 * [description]
 *
 * @function Phaser.Geom.Polygon.Reverse
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - [description]
 *
 * @return {Phaser.Geom.Polygon} [description]
 */
var Reverse = function (polygon)
{
    polygon.points.reverse();

    return polygon;
};

module.exports = Reverse;
