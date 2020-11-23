/**
 * @typedef {object} Phaser.Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig
 * @since 3.0.0
 *
 * @property {Phaser.Types.GameObjects.Particles.EdgeZoneSource} source - A shape representing the zone. See {@link Phaser.GameObjects.Particles.Zones.EdgeZone#source}.
 * @property {string} type - 'edge'.
 * @property {number} quantity - The number of particles to place on the source edge. Set to 0 to use `stepRate` instead.
 * @property {number} [stepRate] - The distance between each particle. When set, `quantity` is implied and should be set to 0.
 * @property {boolean} [yoyo=false] - Whether particles are placed from start to end and then end to start.
 * @property {boolean} [seamless=true] - Whether one endpoint will be removed if it's identical to the other.
 */
