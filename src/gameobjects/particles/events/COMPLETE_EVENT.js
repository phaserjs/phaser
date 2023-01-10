/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Particle Emitter Complete Event.
 *
 * This event is dispatched when the final particle, emitted from a Particle Emitter that
 * has been stopped, dies. Upon receipt of this event you know that no particles are
 * still rendering at this point in time.
 *
 * Listen for it on a Particle Emitter instance using `ParticleEmitter.on('complete', listener)`.
 *
 * @event Phaser.GameObjects.Particles.Events#COMPLETE
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - A reference to the Particle Emitter that just completed.
 */
module.exports = 'complete';
