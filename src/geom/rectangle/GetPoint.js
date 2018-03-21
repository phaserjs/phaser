/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Perimeter = require('./Perimeter');
var Point = require('../point/Point');

/**
 * Position is a value between 0 and 1 where 0 = the top-left of the rectangle and 0.5 = the bottom right.
 *
 * @function Phaser.Geom.Rectangle.GetPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectangle - [description]
 * @param {float} position - [description]
 * @param {(Phaser.Geom.Point|object)} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var GetPoint = function (rectangle, position, out)
{
    if (out === undefined) { out = new Point(); }

    if (position <= 0 || position >= 1)
    {
        out.x = rectangle.x;
        out.y = rectangle.y;

        return out;
    }

    var p = Perimeter(rectangle) * position;

    if (position > 0.5)
    {
        p -= (rectangle.width + rectangle.height);

        if (p <= rectangle.width)
        {
            //  Face 3
            out.x = rectangle.right - p;
            out.y = rectangle.bottom;
        }
        else
        {
            //  Face 4
            out.x = rectangle.x;
            out.y = rectangle.bottom - (p - rectangle.width);
        }
    }
    else if (p <= rectangle.width)
    {
        //  Face 1
        out.x = rectangle.x + p;
        out.y = rectangle.y;
    }
    else
    {
        //  Face 2
        out.x = rectangle.right;
        out.y = rectangle.y + (p - rectangle.width);
    }

    return out;
};

module.exports = GetPoint;
