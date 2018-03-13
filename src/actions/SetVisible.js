/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Actions.SetVisible
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {boolean} value - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var SetVisible = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].visible = value;
    }

    return items;
};

module.exports = SetVisible;
