/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../math/Vector2');

/**
 * Takes an array of items, such as Game Objects, or any objects with public `x` and
 * `y` properties and then iterates through them. As this function iterates, it moves
 * the position of the current element to be that of the previous entry in the array.
 * This repeats until all items have been moved.
 *
 * The direction controls the order of iteration. A value of 0 (the default) assumes
 * that the final item in the array is the 'head' item.
 *
 * A direction value of 1 assumes that the first item in the array is the 'head' item.
 *
 * The position of the 'head' item is set to the x/y values given to this function.
 * Every other item in the array is then updated, in sequence, to be that of the
 * previous (or next) entry in the array.
 *
 * The final x/y coords are returned, or set in the 'output' Vector2.
 *
 * Think of it as being like the game Snake, where the 'head' is moved and then
 * each body piece is moved into the space of the previous piece.
 *
 * @function Phaser.Actions.ShiftPosition
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items]
 * @generic {Phaser.Math.Vector2} O - [output,$return]
 *
 * @param {(Phaser.Types.Math.Vector2Like[]|Phaser.GameObjects.GameObject[])} items - An array of Game Objects, or objects with public x and y positions. The contents of this array are updated by this Action.
 * @param {number} x - The x coordinate to place the head item at.
 * @param {number} y - The y coordinate to place the head item at.
 * @param {number} [direction=0] - The iteration direction. 0 = first to last and 1 = last to first.
 * @param {Phaser.Types.Math.Vector2Like} [output] - An optional Vec2Like object to store the final position in.
 *
 * @return {Phaser.Types.Math.Vector2Like} The output vector.
 */
var ShiftPosition = function (items, x, y, direction, output)
{
    if (direction === undefined) { direction = 0; }
    if (output === undefined) { output = new Vector2(); }

    var px;
    var py;
    var len = items.length;

    if (len === 1)
    {
        px = items[0].x;
        py = items[0].y;

        items[0].x = x;
        items[0].y = y;
    }
    else
    {
        var i = 1;
        var pos = 0;

        if (direction === 0)
        {
            pos = len - 1;
            i = len - 2;
        }

        px = items[pos].x;
        py = items[pos].y;

        //  Update the head item to the new x/y coordinates
        items[pos].x = x;
        items[pos].y = y;

        for (var c = 0; c < len; c++)
        {
            if (i >= len || i === -1)
            {
                continue;
            }

            //  Current item
            var cur = items[i];

            //  Get current item x/y, to be passed to the next item in the list
            var cx = cur.x;
            var cy = cur.y;

            //  Set current item to the previous items x/y
            cur.x = px;
            cur.y = py;

            //  Set current as previous
            px = cx;
            py = cy;

            if (direction === 0)
            {
                i--;
            }
            else
            {
                i++;
            }
        }
    }

    //  Return the final set of coordinates as they're effectively lost from the shift and may be needed

    output.x = px;
    output.y = py;

    return output;
};

module.exports = ShiftPosition;
