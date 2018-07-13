/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var FloatBetween: any;
declare var GetEaseFunction: any;
declare var GetFastValue: any;
declare var Wrap: any;
/**
 * The returned value sets what the property will be at the START of the particle's life, on emit.
 * @callback EmitterOpOnEmitCallback
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
 * @param {string} key - The name of the property.
 * @param {number} value - The current value of the property.
 *
 * @return {number} The new value of the property.
 */
/**
 * The returned value updates the property for the duration of the particle's life.
 * @callback EmitterOpOnUpdateCallback
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
 * @param {string} key - The name of the property.
 * @param {number} t - The normalized lifetime of the particle, between 0 (start) and 1 (end).
 * @param {number} value - The current value of the property.
 *
 * @return {number} The new value of the property.
 */
/**
 * Defines an operation yielding a random value within a range.
 * @typedef {object} EmitterOpRandomConfig
 *
 * @property {number[]} random - The minimum and maximum values, as [min, max].
 */
/**
 * Defines an operation yielding a random value within a range.
 * @typedef {object} EmitterOpRandomMinMaxConfig
 *
 * @property {number} min - The minimum value.
 * @property {number} max - The maximum value.
 */
/**
 * Defines an operation yielding a random value within a range.
 * @typedef {object} EmitterOpRandomStartEndConfig
 *
 * @property {number} start - The starting value.
 * @property {number} end - The ending value.
 * @property {boolean} random - If false, this becomes {@link EmitterOpEaseConfig}.
 */
/**
 * Defines an operation yielding a value incremented continuously across a range.
 * @typedef {object} EmitterOpEaseConfig
 *
 * @property {number} start - The starting value.
 * @property {number} end - The ending value.
 * @property {string} [ease='Linear'] - The name of the easing function.
 */
/**
 * Defines an operation yielding a value incremented by steps across a range.
 * @typedef {object} EmitterOpSteppedConfig
 *
 * @property {number} start - The starting value.
 * @property {number} end - The ending value.
 * @property {number} steps - The number of steps between start and end.
 */
/**
 * @typedef {object} EmitterOpCustomEmitConfig
 *
 * @property {EmitterOpOnEmitCallback} onEmit - [description]
 */
/**
 * @typedef {object} EmitterOpCustomUpdateConfig
 *
 * @property {EmitterOpOnEmitCallback} [onEmit] - [description]
 * @property {EmitterOpOnUpdateCallback} onUpdate - [description]
 */
/**
 * @classdesc
 * A Particle Emitter property.
 *
 * Facilitates changing Particle properties as they are emitted and throughout their lifetime.
 *
 * @class EmitterOp
 * @memberOf Phaser.GameObjects.Particles
 * @constructor
 * @since 3.0.0
 *
 * @param {ParticleEmitterConfig} config - Settings for the Particle Emitter that owns this property.
 * @param {string} key - The name of the property.
 * @param {number} defaultValue - The default value of the property.
 * @param {boolean} [emitOnly=false] - Whether the property can only be modified when a Particle is emitted.
 */
declare var EmitterOp: any;
