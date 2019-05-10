/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Change Data Event.
 * 
 * This event is dispatched by a Data Manager when an item in the data store is changed.
 * 
 * Game Objects with data enabled have an instance of a Data Manager under the `data` property. So, to listen for
 * a change data event from a Game Object you would use: `sprite.data.on('changedata', listener)`.
 * 
 * This event is dispatched for all items that change in the Data Manager.
 * To listen for the change of a specific item, use the `CHANGE_DATA_KEY_EVENT` event.
 *
 * @event Phaser.Data.Events#CHANGE_DATA
 * @since 3.0.0
 * 
 * @param {any} parent - A reference to the object that the Data Manager responsible for this event belongs to.
 * @param {string} key - The unique key of the data item within the Data Manager.
 * @param {any} value - The new value of the item in the Data Manager.
 * @param {any} previousValue - The previous value of the item in the Data Manager.
 */
module.exports = 'changedata';
