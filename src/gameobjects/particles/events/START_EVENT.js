/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Particle Emitter Start Event.
 *
 * This event is dispatched when a Particle Emitter starts emission of particles.
 *
 * Listen for it on an emitter instance using `ParticleEmitter.on('emitterstart', listener)`.
 *
 * @event Phaser.GameObjects.Particles.Events#START
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - A reference to the Particle Emitter that just completed.
 */
module.exports = 'emitterstart';
