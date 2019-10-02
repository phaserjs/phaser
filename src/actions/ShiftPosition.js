/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../math/Vector2');

/**
 * Iterate through the items array changing the position of each element to be that of the element that came before
 * it in the array (or after it if direction = 1)
 * 
 * The first items position is set to x/y.
 * 
 * The final x/y coords are returned
 *
 * @function Phaser.Actions.ShiftPosition
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items]
 * @generic {Phaser.Math.Vector2} O - [output,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {number} x - The x coordinate to place the first item in the array at.
 * @param {number} y - The y coordinate to place the first item in the array at.
 * @param {integer} [direction=0] - The iteration direction. 0 = first to last and 1 = last to first.
 * @param {(Phaser.Math.Vector2|object)} [output] - An optional objec to store the final objects position in.
 *
 * @return {Phaser.Math.Vector2} The output vector.
 */
var ShiftPosition = function (items, x, y, direction, output)
{
    if (direction === undefined) { direction = 0; }
    if (output === undefined) { output = new Vector2(); }

    var px;
    var py;

    if (items.length > 1)
    {
        var i;
        var cx;
        var cy;
        var cur;

        if (direction === 0)
        {
            //  Bottom to Top

            var len = items.length - 1;

            px = items[len].x;
            py = items[len].y;

            for (i = len - 1; i >= 0; i--)
            {
                //  Current item
                cur = items[i];

                //  Get current item x/y, to be passed to the next item in the list
                cx = cur.x;
                cy = cur.y;

                //  Set current item to the previous items x/y
                cur.x = px;
                cur.y = py;

                //  Set current as previous
                px = cx;
                py = cy;
            }

            //  Update the head item to the new x/y coordinates
            items[len].x = x;
            items[len].y = y;
        }
        else
        {
            //  Top to Bottom

            px = items[0].x;
            py = items[0].y;

            for (i = 1; i < items.length; i++)
            {
                //  Current item
                cur = items[i];

                //  Get current item x/y, to be passed to the next item in the list
                cx = cur.x;
                cy = cur.y;

                //  Set current item to the previous items x/y
                cur.x = px;
                cur.y = py;

                //  Set current as previous
                px = cx;
                py = cy;
            }

            //  Update the head item to the new x/y coordinates
            items[0].x = x;
            items[0].y = y;
        }
    }
    else
    {
        px = items[0].x;
        py = items[0].y;

        items[0].x = x;
        items[0].y = y;
    }

    //  Return the final set of coordinates as they're effectively lost from the shift and may be needed

    output.x = px;
    output.y = py;

    return output;
};

module.exports = ShiftPosition;
