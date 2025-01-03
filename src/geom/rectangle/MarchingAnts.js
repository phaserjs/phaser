/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Perimeter = require('./Perimeter');
var Point = require('../point/Point');

/**
 * Returns an array of points from the perimeter of the Rectangle, where each point is spaced out based
 * on either the `step` value, or the `quantity`.
 *
 * @function Phaser.Geom.Rectangle.MarchingAnts
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to get the perimeter points from.
 * @param {number} [step] - The distance between each point of the perimeter. Set to `null` if you wish to use the `quantity` parameter instead.
 * @param {number} [quantity] - The total number of points to return. The step is then calculated based on the length of the Rectangle, divided by this value.
 * @param {(array|Phaser.Geom.Point[])} [out] - An array in which the perimeter points will be stored. If not given, a new array instance is created.
 *
 * @return {(array|Phaser.Geom.Point[])} An array containing the perimeter points from the Rectangle.
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
