/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MarchingAnts = require('../geom/rectangle/MarchingAnts');
var RotateLeft = require('../utils/array/RotateLeft');
var RotateRight = require('../utils/array/RotateRight');

/**
 * Takes an array of Game Objects and positions them on evenly spaced points around the perimeter of a Rectangle.
 * 
 * Placement starts from the top-left of the rectangle, and proceeds in a clockwise direction.
 * If the `shift` parameter is given you can offset where placement begins.
 *
 * @function Phaser.Actions.PlaceOnRectangle
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to position the Game Objects on.
 * @param {number} [shift=0] - An optional positional offset.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlaceOnRectangle = function (items, rect, shift)
{
    if (shift === undefined) { shift = 0; }

    var points = MarchingAnts(rect, false, items.length);

    if (shift > 0)
    {
        RotateLeft(points, shift);
    }
    else if (shift < 0)
    {
        RotateRight(points, Math.abs(shift));
    }

    for (var i = 0; i < items.length; i++)
    {
        items[i].x = points[i].x;
        items[i].y = points[i].y;
    }

    return items;
};

module.exports = PlaceOnRectangle;
