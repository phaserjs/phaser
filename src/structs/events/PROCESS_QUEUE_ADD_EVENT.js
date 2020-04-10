/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Process Queue Add Event.
 * 
 * This event is dispatched by a Process Queue when a new item is successfully moved to its active list.
 * 
 * You will most commonly see this used by a Scene's Update List when a new Game Object has been added.
 * 
 * In that instance, listen to this event from within a Scene using: `this.sys.updateList.on('add', listener)`.
 *
 * @event Phaser.Structs.Events#PROCESS_QUEUE_ADD
 * @since 3.20.0
 * 
 * @param {*} item - The item that was added to the Process Queue.
 */
module.exports = 'add';
