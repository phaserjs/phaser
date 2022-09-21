/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Physics.Matter.Events.AfterRemoveEvent
 *
 * @property {any[]} object - An array of the object(s) that were removed. May be a single body, constraint, composite or a mixture of these.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */

/**
 * The Matter Physics After Remove Event.
 *
 * This event is dispatched by a Matter Physics World instance at the end of the process when a
 * Body or Constraint was removed from the world.
 *
 * Listen to it from a Scene using: `this.matter.world.on('afterremove', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#AFTER_REMOVE
 * @type {string}
 * @since 3.22.0
 *
 * @param {Phaser.Physics.Matter.Events.AfterRemoveEvent} event - The Remove Event object.
 */
module.exports = 'afterremove';
