/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array of Game Objects, or any objects that have the public method setTint(), and then updates the tint of each to the given value(s). You can specify a tint color per corner or provide only one color value for the `topLeft` parameter, in which case the whole item will be tinted with that color.
 *
 * @function Phaser.Actions.SetTint
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {number} topLeft - The tint to be applied to the top-left corner of each item. If the other parameters are omitted, this tint will be applied to the whole item.
 * @param {number} [topRight] - The tint to be applied to top-right corner of item.
 * @param {number} [bottomLeft] - The tint to be applied to the bottom-left corner of item.
 * @param {number} [bottomRight] - The tint to be applied to the bottom-right corner of item.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var SetTint = function (items, topLeft, topRight, bottomLeft, bottomRight)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].setTint(topLeft, topRight, bottomLeft, bottomRight);
    }

    return items;
};

module.exports = SetTint;
