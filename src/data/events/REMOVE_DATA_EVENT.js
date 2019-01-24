/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Remove Data Event.
 * 
 * This event is dispatched by a Data Manager when an item is removed from it.
 * 
 * Game Objects with data enabled have an instance of a Data Manager under the `data` property. So, to listen for
 * the removal of a data item on a Game Object you would use: `sprite.data.on('removedata', listener)`.
 *
 * @event Phaser.Data.Events#REMOVE_DATA
 * 
 * @param {any} parent - A reference to the object that owns the instance of the Data Manager responsible for this event.
 * @param {string} key - The unique key of the data item within the Data Manager.
 * @param {any} data - The item that was removed from the Data Manager. This can be of any data type, i.e. a string, boolean, number, object or instance.
 */
module.exports = 'removedata';
