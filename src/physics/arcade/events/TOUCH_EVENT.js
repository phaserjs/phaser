/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Arcade Physics World Touching Event.
 * 
 * This event is dispatched by an Arcade Physics World instance if two bodies touch _and_ at least
 * one of them has their [onTouch]{@link Phaser.Physics.Arcade.Body#onTouch} property set to `true`.
 * 
 * It provides an alternative means to handling collide events rather than using the callback approach.
 * 
 * Listen to it from a Scene using: `this.physics.world.on('touch', listener)`.
 * 
 * Please note that 'touch' and 'collide' are two different things in Arcade Physics.
 *
 * @event Phaser.Physics.Arcade.Events#TOUCH
 * @since 3.17.0
 * 
 * @param {Phaser.GameObjects.GameObject} gameObject1 - The first Game Object involved in the collision. This is the parent of `body1`.
 * @param {Phaser.GameObjects.GameObject} gameObject2 - The second Game Object involved in the collision. This is the parent of `body2`.
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body1 - The first Physics Body involved in the collision.
 * @param {Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody} body2 - The second Physics Body involved in the collision.
 */
module.exports = 'touch';
