/**
 * The returned value updates the property for the duration of the particle's life.
 * 
 * @callback Phaser.Types.GameObjects.Particles.EmitterOpOnUpdateCallback
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Particles.Particle} particle - The particle.
 * @param {string} key - The name of the property.
 * @param {number} t - The normalized lifetime of the particle, between 0 (start) and 1 (end).
 * @param {number} value - The current value of the property.
 *
 * @return {number} The new value of the property.
 */
