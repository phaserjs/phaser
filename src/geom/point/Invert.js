/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Swaps the X and the Y coordinate of a point.
 *
 * @function Phaser.Geom.Point.Invert
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [point,$return]
 *
 * @param {Phaser.Geom.Point} point - The Point to modify.
 *
 * @return {Phaser.Geom.Point} The modified `point`.
 */
var Invert = function (point)
{
    return point.setTo(point.y, point.x);
};

module.exports = Invert;
