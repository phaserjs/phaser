/**
 * @callback Phaser.Types.GameObjects.Particles.EdgeZoneSourceCallback
 * @since 3.0.0
 *
 * @param {number} quantity - The number of particles to place on the source edge. If 0, `stepRate` should be used instead.
 * @param {number} [stepRate] - The distance between each particle. When set, `quantity` is implied and should be set to `0`.
 *
 * @return {Phaser.Geom.Point[]} - The points placed on the source edge.
 */
