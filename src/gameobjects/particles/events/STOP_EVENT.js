/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Particle Emitter Stop Event.
 *
 * This event is dispatched when a Particle Emitter is stopped. This can happen either
 * when you directly call the `ParticleEmitter.stop` method, or if the emitter has
 * been configured to stop after a set time via the `duration` property, or after a
 * set number of particles via the `stopAfter` property.
 *
 * Listen for it on a Particle Emitter instance using `ParticleEmitter.on('stop', listener)`.
 *
 * Note that just because the emitter has stopped, that doesn't mean there aren't still
 * particles alive and rendering. It just means the emitter has stopped emitting particles.
 *
 * If you wish to know when the final particle is killed, see the `COMPLETE` event.
 *
 * @event Phaser.GameObjects.Particles.Events#STOP
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - A reference to the Particle Emitter that just completed.
 */
module.exports = 'stop';
