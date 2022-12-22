/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Particle Emitter Complete Event.
 *
 * This event is dispatched when a Particle Emitter, that has a flow duration set, finishes.
 *
 * Listen for it on an emitter instance using `ParticleEmitter.on('emittercomplete', listener)`.
 *
 * @event Phaser.GameObjects.Particles.Events#COMPLETE
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - A reference to the Particle Emitter that just completed.
 */
module.exports = 'emittercomplete';
