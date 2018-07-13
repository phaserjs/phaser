/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Actions.SetTint
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {number} topLeft - [description]
 * @param {number} [topRight] - [description]
 * @param {number} [bottomLeft] - [description]
 * @param {number} [bottomRight] - [description]
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
