/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('./Vector2');

/**
 * Returns a Vector2 containing the x and y position of the given index in a `width` x `height` sized grid.
 *
 * For example, in a 6 x 4 grid, index 16 would equal x: 4 y: 2.
 *
 * If the given index is out of range an empty Vector2 is returned.
 *
 * @function Phaser.Math.ToXY
 * @since 3.19.0
 *
 * @param {number} index - The position within the grid to get the x/y value for.
 * @param {number} width - The width of the grid.
 * @param {number} height - The height of the grid.
 * @param {Phaser.Math.Vector2} [out] - An optional Vector2 to store the result in. If not given, a new Vector2 instance will be created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 where the x and y properties contain the given grid index.
 */
var ToXY = function (index, width, height, out)
{
    if (out === undefined) { out = new Vector2(); }

    var x = 0;
    var y = 0;
    var total = width * height;

    if (index > 0 && index <= total)
    {
        if (index > width - 1)
        {
            y = Math.floor(index / width);
            x = index - (y * width);
        }
        else
        {
            x = index;
        }
    }

    return out.set(x, y);
};

module.exports = ToXY;
