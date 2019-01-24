/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Change Data Key Event.
 * 
 * This event is dispatched by a Data Manager when an item in the data store is changed.
 * 
 * Game Objects with data enabled have an instance of a Data Manager under the `data` property. So, to listen for
 * the change of a specific data item from a Game Object you would use: `sprite.data.on('changedata-key', listener)`,
 * where `key` is the unique string key of the data item. For example, if you have a data item stored called `gold`
 * then you can listen for `sprite.data.on('changedata-gold')`.
 *
 * @event Phaser.Data.Events#CHANGE_DATA_KEY
 * 
 * @param {any} parent - A reference to the object that owns the instance of the Data Manager responsible for this event.
 * @param {string} key - The unique key of the data item within the Data Manager.
 * @param {any} value - The item that was updated in the Data Manager. This can be of any data type, i.e. a string, boolean, number, object or instance.
 * @param {any} previousValue - The previous item that was updated in the Data Manager. This can be of any data type, i.e. a string, boolean, number, object or instance.
 */
module.exports = 'changedata-';
