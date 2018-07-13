/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Polygon.Reverse
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
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
