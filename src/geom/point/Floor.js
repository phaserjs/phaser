/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Apply `Math.ceil()` to each coordinate of the given Point.
 *
 * @function Phaser.Geom.Point.Floor
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [point,$return]
 *
 * @param {Phaser.Geom.Point} point - The Point to floor.
 *
 * @return {Phaser.Geom.Point} The Point with `Math.floor()` applied to its coordinates.
 */
var Floor = function (point)
{
    return point.setTo(Math.floor(point.x), Math.floor(point.y));
};

module.exports = Floor;
