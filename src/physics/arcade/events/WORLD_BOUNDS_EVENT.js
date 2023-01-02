/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Arcade Physics World Bounds Event.
 *
 * This event is dispatched by an Arcade Physics World instance if a body makes contact with the world bounds _and_
 * it has its [onWorldBounds]{@link Phaser.Physics.Arcade.Body#onWorldBounds} property set to `true`.
 *
 * It provides an alternative means to handling collide events rather than using the callback approach.
 *
 * Listen to it from a Scene using: `this.physics.world.on('worldbounds', listener)`.
 *
 * @event Phaser.Physics.Arcade.Events#WORLD_BOUNDS
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Arcade Physics Body that hit the world bounds.
 * @param {boolean} up - Is the Body blocked up? I.e. collided with the top of the world bounds.
 * @param {boolean} down - Is the Body blocked down? I.e. collided with the bottom of the world bounds.
 * @param {boolean} left - Is the Body blocked left? I.e. collided with the left of the world bounds.
 * @param {boolean} right - Is the Body blocked right? I.e. collided with the right of the world bounds.
 */
module.exports = 'worldbounds';
