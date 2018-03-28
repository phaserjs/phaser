/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetMagnitude = require('./GetMagnitude');

/**
 * [description]
 *
 * @function Phaser.Geom.Point.SetMagnitude
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [point,$return]
 *
 * @param {Phaser.Geom.Point} point - [description]
 * @param {number} magnitude - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var SetMagnitude = function (point, magnitude)
{
    if (point.x !== 0 || point.y !== 0)
    {
        var m = GetMagnitude(point);

        point.x /= m;
        point.y /= m;
    }

    point.x *= magnitude;
    point.y *= magnitude;

    return point;
};

module.exports = SetMagnitude;
