/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Perimeter = require('./Perimeter');
var Point = require('../point/Point');

//  Return an array of points from the perimeter of the rectangle
//  each spaced out based on the quantity or step required

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.MarchingAnts
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {number} step - [description]
 * @param {integer} quantity - [description]
 * @param {(array|Phaser.Geom.Point[])} [out] - [description]
 *
 * @return {(array|Phaser.Geom.Point[])} [description]
 */
var MarchingAnts = function (rect, step, quantity, out)
{
    if (out === undefined) { out = []; }

    if (!step && !quantity)
    {
        //  Bail out
        return out;
    }

    //  If step is a falsey value (false, null, 0, undefined, etc) then we calculate
    //  it based on the quantity instead, otherwise we always use the step value
    if (!step)
    {
        step = Perimeter(rect) / quantity;
    }
    else
    {
        quantity = Math.round(Perimeter(rect) / step);
    }

    var x = rect.x;
    var y = rect.y;
    var face = 0;

    //  Loop across each face of the rectangle

    for (var i = 0; i < quantity; i++)
    {
        out.push(new Point(x, y));

        switch (face)
        {

            //  Top face
            case 0:
                x += step;

                if (x >= rect.right)
                {
                    face = 1;
                    y += (x - rect.right);
                    x = rect.right;
                }
                break;

            //  Right face
            case 1:
                y += step;

                if (y >= rect.bottom)
                {
                    face = 2;
                    x -= (y - rect.bottom);
                    y = rect.bottom;
                }
                break;

            //  Bottom face
            case 2:
                x -= step;

                if (x <= rect.left)
                {
                    face = 3;
                    y -= (rect.left - x);
                    x = rect.left;
                }
                break;

            //  Left face
            case 3:
                y -= step;

                if (y <= rect.top)
                {
                    face = 0;
                    y = rect.top;
                }
                break;
        }
    }

    return out;
};

module.exports = MarchingAnts;
