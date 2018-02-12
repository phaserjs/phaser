/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Actions.Call
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {function} callback - [description]
 * @param {object} thisArg - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var Call = function (items, callback, thisArg)
{
    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        callback.call(thisArg, item);
    }

    return items;
};

module.exports = Call;
