/**
 * @typedef {object} Phaser.Types.Actions.AddEffectBloomReturn
 * @since 4.0.0
 *
 * @property {Phaser.Cameras.Scene2D.Camera|Phaser.GameObjects.GameObject} item - The object or camera to which the bloom is applied.
 * @property {Phaser.Filters.ParallelFilters} parallelFilters - The ParallelFilters filter which blends the blurred light with the original image.
 * @property {Phaser.Filters.Threshold} threshold - The Threshold filter which cuts off darker light from the image.
 * @property {Phaser.Filters.Blur} blur - The Blur filter which spreads out bright light from the image.
 */
