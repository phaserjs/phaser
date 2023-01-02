/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Physics.Matter.Events.AfterAddEvent
 *
 * @property {any[]} object - An array of the object(s) that have been added. May be a single body, constraint, composite or a mixture of these.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */

/**
 * The Matter Physics After Add Event.
 *
 * This event is dispatched by a Matter Physics World instance at the end of the process when a new Body
 * or Constraint has just been added to the world.
 *
 * Listen to it from a Scene using: `this.matter.world.on('afteradd', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#AFTER_ADD
 * @type {string}
 * @since 3.22.0
 *
 * @param {Phaser.Physics.Matter.Events.AfterAddEvent} event - The Add Event object.
 */
module.exports = 'afteradd';
