/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Reverses the order of the points of a Polygon.
 *
 * @function Phaser.Geom.Polygon.Reverse
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to modify.
 *
 * @return {Phaser.Geom.Polygon} The modified Polygon.
 */
var Reverse = function (polygon)
{
    polygon.points.reverse();

    return polygon;
};

module.exports = Reverse;
