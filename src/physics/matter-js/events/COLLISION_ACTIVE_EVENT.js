/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Physics.Matter.Events.CollisionActiveEvent
 *
 * @property {Phaser.Types.Physics.Matter.MatterCollisionPair[]} pairs - A list of all affected pairs in the collision.
 * @property {number} timestamp - The Matter Engine `timing.timestamp` value for the event.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */

/**
 * The Matter Physics Collision Active Event.
 *
 * This event is dispatched by a Matter Physics World instance after the engine has updated.
 * It provides a list of all pairs that are colliding in the current tick (if any).
 *
 * Listen to it from a Scene using: `this.matter.world.on('collisionactive', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#COLLISION_ACTIVE
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Matter.Events.CollisionActiveEvent} event - The Collision Event object.
 * @param {MatterJS.BodyType} bodyA - The first body of the first colliding pair. The `event.pairs` array may contain more colliding bodies.
 * @param {MatterJS.BodyType} bodyB - The second body of the first colliding pair. The `event.pairs` array may contain more colliding bodies.
 */
module.exports = 'collisionactive';
