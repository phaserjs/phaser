/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('./Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Point.GetCentroid
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Point[]} points - [description]
 * @param {Phaser.Geom.Point} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var GetCentroid = function (points, out)
{
    if (out === undefined) { out = new Point(); }

    if (!Array.isArray(points))
    {
        throw new Error('GetCentroid points argument must be an array');
    }

    var len = points.length;

    if (len < 1)
    {
        throw new Error('GetCentroid points array must not be empty');
    }
    else if (len === 1)
    {
        out.x = points[0].x;
        out.y = points[0].y;
    }
    else
    {
        for (var i = 0; i < len; i++)
        {
            out.x += points[i].x;
            out.y += points[i].y;
        }

        out.x /= len;
        out.y /= len;
    }

    return out;
};

module.exports = GetCentroid;
