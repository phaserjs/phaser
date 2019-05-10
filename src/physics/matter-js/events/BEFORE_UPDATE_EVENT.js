/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Physics.Matter.Events.BeforeUpdateEvent
 *
 * @property {number} timestamp - The Matter Engine `timing.timestamp` value for the event.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */

/**
 * The Matter Physics Before Update Event.
 * 
 * This event is dispatched by a Matter Physics World instance right before all the collision processing takes place.
 * 
 * Listen to it from a Scene using: `this.matter.world.on('beforeupdate', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#BEFORE_UPDATE
 * @since 3.0.0
 * 
 * @param {Phaser.Physics.Matter.Events.BeforeUpdateEvent} event - The Update Event object.
 */
module.exports = 'beforeupdate';
