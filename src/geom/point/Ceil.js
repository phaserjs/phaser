/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Apply `Math.ceil()` to each coordinate of the given Point.
 *
 * @function Phaser.Geom.Point.Ceil
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [point,$return]
 *
 * @param {Phaser.Geom.Point} point - The Point to ceil.
 *
 * @return {Phaser.Geom.Point} The Point with `Math.ceil()` applied to its coordinates.
 */
var Ceil = function (point)
{
    return point.setTo(Math.ceil(point.x), Math.ceil(point.y));
};

module.exports = Ceil;
