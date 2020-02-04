/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Impact Physics World Collide Event.
 * 
 * This event is dispatched by an Impact Physics World instance if two bodies collide.
 * 
 * Listen to it from a Scene using: `this.impact.world.on('collide', listener)`.
 *
 * @event Phaser.Physics.Impact.Events#COLLIDE
 * @since 3.0.0
 * 
 * @param {Phaser.Physics.Impact.Body} bodyA - The first body involved in the collision.
 * @param {Phaser.Physics.Impact.Body} bodyB - The second body involved in the collision.
 * @param {string} axis - The collision axis. Either `x` or `y`.
 */
module.exports = 'collide';
