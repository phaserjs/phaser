/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Process Queue Remove Event.
 *
 * This event is dispatched by a Process Queue when a new item is successfully removed from its active list.
 *
 * You will most commonly see this used by a Scene's Update List when a Game Object has been removed.
 *
 * In that instance, listen to this event from within a Scene using: `this.sys.updateList.on('remove', listener)`.
 *
 * @event Phaser.Structs.Events#PROCESS_QUEUE_REMOVE
 * @type {string}
 * @since 3.20.0
 *
 * @param {*} item - The item that was removed from the Process Queue.
 */
module.exports = 'remove';
