/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Physics.Matter.Events.BeforeRemoveEvent
 *
 * @property {any[]} object - An array of the object(s) to be removed. May be a single body, constraint, composite or a mixture of these.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */

/**
 * The Matter Physics Before Remove Event.
 * 
 * This event is dispatched by a Matter Physics World instance at the start of the process when a 
 * Body or Constraint is being removed from the world.
 * 
 * Listen to it from a Scene using: `this.matter.world.on('beforeremove', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#BEFORE_REMOVE
 * @since 3.22.0
 * 
 * @param {Phaser.Physics.Matter.Events.BeforeRemoveEvent} event - The Remove Event object.
 */
module.exports = 'beforeremove';
