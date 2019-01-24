/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Set Data Event.
 * 
 * This event is dispatched by a Data Manager when a new item is added to the data store.
 * 
 * Game Objects with data enabled have an instance of a Data Manager under the `data` property. So, to listen for
 * the addition of a new data item on a Game Object you would use: `sprite.data.on('setdata', listener)`.
 *
 * @event Phaser.Data.Events#SET_DATA
 * 
 * @param {any} parent - A reference to the object that owns the instance of the Data Manager responsible for this event.
 * @param {string} key - The unique key of the data item within the Data Manager.
 * @param {any} data - The item that was added to the Data Manager. This can be of any data type, i.e. a string, boolean, number, object or instance.
 */
module.exports = 'setdata';
