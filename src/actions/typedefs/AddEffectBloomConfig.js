/**
 * @typedef {object} Phaser.Types.Actions.AddEffectBloomConfig
 * @since 4.0.0
 *
 * @property {number} [threshold=0.5] - The lower brightness threshold for channels to contribute to the bloom, in the range 0-1.
 * @property {number} [blurRadius=2] - The radius of light blur in the bloom.
 * @property {number} [blurSteps=4] - The number of steps to run the blur in the bloom. This value should always be an integer.
 * @property {number} [blurQuality=0] - The quality of the light blur: 0 (low), 1 (medium) or 2 (high).
 * @property {number} [blendAmount=1] - The amount by which to blend the bloom over the original image. 0 is none, 1 is 100%. Higher values are allowed.
 * @property {Phaser.BlendModes} [blendMode=Phaser.BlendModes.ADD] - The blend mode to use when applying the bloom.
 * @property {boolean} [useInternal] - Whether to add filters to the internal filter list of the effect target. By default, filters are added to the external filter list, so they run relative to the screen.
 */
