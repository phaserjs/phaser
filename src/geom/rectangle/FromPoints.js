/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Rectangle = require('./Rectangle');

//  points is an array of Point-like objects,
//  either 2 dimensional arrays, or objects with public x/y properties:
//  var points = [
//      [100, 200],
//      [200, 400],
//      { x: 30, y: 60 }
//  ]

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.FromPoints
 * @since 3.0.0
 *
 * @param {array} points - [description]
 * @param {Phaser.Geom.Rectangle} out - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var FromPoints = function (points, out)
{
    if (out === undefined) { out = new Rectangle(); }

    if (points.length === 0)
    {
        return out;
    }

    var minX = Number.MAX_VALUE;
    var minY = Number.MAX_VALUE;

    var maxX = Number.MIN_SAFE_INTEGER;
    var maxY = Number.MIN_SAFE_INTEGER;

    var p;
    var px;
    var py;

    for (var i = 0; i < points.length; i++)
    {
        p = points[i];

        if (Array.isArray(p))
        {
            px = p[0];
            py = p[1];
        }
        else
        {
            px = p.x;
            py = p.y;
        }

        minX = Math.min(minX, px);
        minY = Math.min(minY, py);

        maxX = Math.max(maxX, px);
        maxY = Math.max(maxY, py);
    }

    out.x = minX;
    out.y = minY;
    out.width = maxX - minX;
    out.height = maxY - minY;

    return out;
};

module.exports = FromPoints;
