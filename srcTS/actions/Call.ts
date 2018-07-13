/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @callback CallCallback
 *
 * @param {Phaser.GameObjects.GameObject} item - [description]
 */

/**
 * Takes an array of objects and passes each of them to the given callback.
 *
 * @function Phaser.Actions.Call
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {CallCallback} callback - The callback to be invoked. It will be passed just one argument: the item from the array.
 * @param {*} context - The scope in which the callback will be invoked.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that was passed to this Action.
 */
var Call = function (items, callback, context)
{
    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        callback.call(context, item);
    }

    return items;
};

module.exports = Call;
