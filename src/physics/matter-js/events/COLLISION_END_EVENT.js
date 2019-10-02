/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Physics.Matter.Events.CollisionEndEvent
 *
 * @property {array} pairs - A list of all affected pairs in the collision.
 * @property {number} timestamp - The Matter Engine `timing.timestamp` value for the event.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */

/**
 * The Matter Physics Collision End Event.
 * 
 * This event is dispatched by a Matter Physics World instance after the engine has updated.
 * It provides a list of all pairs that have finished colliding in the current tick (if any).
 * 
 * Listen to it from a Scene using: `this.matter.world.on('collisionend', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#COLLISION_END
 * @since 3.0.0
 * 
 * @param {Phaser.Physics.Matter.Events.CollisionEndEvent} event - The Collision Event object.
 * @param {MatterJS.Body} bodyA - The first body of the first colliding pair. The `event.pairs` array may contain more colliding bodies.
 * @param {MatterJS.Body} bodyB - The second body of the first colliding pair. The `event.pairs` array may contain more colliding bodies.
 */
module.exports = 'collisionend';
