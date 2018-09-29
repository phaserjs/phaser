/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('./Point');

/**
 * Interpolate two given Point objects, based on `t` value. Return result either as new Point if `out` parameter is omitted or load result into Point passed as `out` parameter and return it. For `out` parameter you can also use any object with public x/y properties.
 *
 * @function Phaser.Geom.Point.Interpolate
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Point} pointA - [description]
 * @param {Phaser.Geom.Point} pointB - [description]
 * @param {number} [t=0] - [description]
 * @param {(Phaser.Geom.Point|object)} [out] - [description]
 *
 * @return {(Phaser.Geom.Point|object)} [description]
 */
var Interpolate = function (pointA, pointB, t, out)
{
    if (t === undefined) { t = 0; }
    if (out === undefined) { out = new Point(); }

    out.x = pointA.x + ((pointB.x - pointA.x) * t);
    out.y = pointA.y + ((pointB.y - pointA.y) * t);

    return out;
};

module.exports = Interpolate;
