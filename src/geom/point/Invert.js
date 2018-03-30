/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Point.Invert
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [point,$return]
 *
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Invert = function (point)
{
    return point.setTo(point.y, point.x);
};

module.exports = Invert;
