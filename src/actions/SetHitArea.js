/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Actions.SetHitArea
 * @since 3.0.0
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {*} hitArea - [description]
 * @param {HitAreaCallback} hitAreaCallback - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var SetHitArea = function (items, hitArea, hitAreaCallback)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].setInteractive(hitArea, hitAreaCallback);
    }

    return items;
};

module.exports = SetHitArea;
