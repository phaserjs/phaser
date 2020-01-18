/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('./Rectangle');
var MATH_CONST = require('../../math/const');

//  points is an array of Point-like objects,
//  either 2 dimensional arrays, or objects with public x/y properties:
//  var points = [
//      [100, 200],
//      [200, 400],
//      { x: 30, y: 60 }
//  ]

/**
 * Constructs new Rectangle or repositions and resizes an existing Rectangle so that all of the given points are on or within its bounds.
 *
 * @function Phaser.Geom.Rectangle.FromPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {array} points - An array of points (either arrays with two elements corresponding to the X and Y coordinate or an object with public `x` and `y` properties) which should be surrounded by the Rectangle.
 * @param {Phaser.Geom.Rectangle} [out] - Optional Rectangle to adjust.
 *
 * @return {Phaser.Geom.Rectangle} The adjusted `out` Rectangle, or a new Rectangle if none was provided.
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

    var maxX = MATH_CONST.MIN_SAFE_INTEGER;
    var maxY = MATH_CONST.MIN_SAFE_INTEGER;

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
