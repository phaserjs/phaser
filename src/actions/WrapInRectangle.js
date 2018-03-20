/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       samme <samme.npm@gmail.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Wrap = require('../math/Wrap');

/**
 * Wrap each item's coordinates within a rectangle's area.
 *
 * @function Phaser.Actions.WrapInRectangle
 * @since 3.0.0
 * @see Phaser.Math.Wrap
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Rectangle} rect - The rectangle.
 * @param {number} [padding=0] - An amount added to each side of the rectangle during the operation.
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var WrapInRectangle = function (items, rect, padding)
{
    if (padding === undefined)
    {
        padding = 0;
    }

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        item.x = Wrap(item.x, rect.left - padding, rect.right + padding);
        item.y = Wrap(item.y, rect.top - padding, rect.bottom + padding);
    }

    return items;
};

module.exports = WrapInRectangle;
