/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Arcade Physics World Bounce Event.
 *
 * This event is dispatched by an Arcade Physics World instance if a body collides with a body or world bounds
 * _and_ it has its [onBounce]{@link Phaser.Physics.Arcade.Body#onBounce} property set to `true` while having
 * a bounce magnitude above 0.
 *
 * It provides an alternative means to handling collide events rather than using the callback approach.
 *
 * Listen to it from a Scene using: `this.physics.world.on('bounce', listener)`.
 *
 * @event Phaser.Physics.Arcade.Events#BOUNCE
 * @type {string}
 * @since 3.80.0
 *
 * @param {Phaser.Physics.Arcade.Body} body - The Arcade Physics Body that bounced.
 */
module.exports = 'bounce';
