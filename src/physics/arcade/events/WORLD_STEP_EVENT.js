/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Arcade Physics World Step Event.
 * 
 * This event is dispatched by an Arcade Physics World instance whenever a physics step is run.
 * It is emitted _after_ the bodies and colliders have been updated.
 * 
 * In high framerate settings this can be multiple times per game frame.
 * 
 * Listen to it from a Scene using: `this.physics.world.on('worldstep', listener)`.
 *
 * @event Phaser.Physics.Arcade.Events#WORLD_STEP
 * @since 3.18.0
 */
module.exports = 'worldstep';
