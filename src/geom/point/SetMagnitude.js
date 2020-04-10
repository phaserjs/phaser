/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetMagnitude = require('./GetMagnitude');

/**
 * Changes the magnitude (length) of a two-dimensional vector without changing its direction.
 *
 * @function Phaser.Geom.Point.SetMagnitude
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [point,$return]
 *
 * @param {Phaser.Geom.Point} point - The Point to treat as the end point of the vector.
 * @param {number} magnitude - The new magnitude of the vector.
 *
 * @return {Phaser.Geom.Point} The modified Point.
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
