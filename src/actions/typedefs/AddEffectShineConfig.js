/**
 * @typedef {object} Phaser.Types.Actions.AddEffectShineConfig
 * @since 4.0.0
*
 * @property {number} [radius=0.5] - The width of the shine, as a proportion of the size of the target.
 * @property {number} [direction=0.5] - The direction the shine travels in. 0 is to the right, increasing clockwise. Direction changes which corner of the target the shine travels from. This is the direction of the gradient shape vector.
 * @property {number} [scale=2] - The length the shine travels, as a proportion of the size of the target. This is the length of the gradient shape vector.
 * @property {number} [width=128] - The width of the gradient texture. By default, this is derived from the target.
 * @property {number} [height=128] - The height of the gradient texture. By default, this is derived from the target.
 * @property {Phaser.Display.ColorBand | Phaser.Types.Display.ColorBandConfig | Array.<(Phaser.Display.ColorBand | Phaser.Types.Display.ColorBandConfig)>} [bands] - Custom color bands to use in the gradient. If this is defined, `shineColor` does nothing.
 * @property {number[]} [colorFactor=[ 1.15, 0.85, 0.85, 1 ]] - The factor which multiplies the shiny part of the image. Must be 4 numbers (RGBA). Typical range is 0-1, but it's often useful to make them larger.
 * @property {string} [displacementMap] - A displacement map to apply to the gradient. If not defined, no displacement is applied.
 * @property {number} [displacement] - If a displacement map is applied, this is its strength.
 * @property {number} [duration = 2000] - Duration of the shine animation (via the tween), in milliseconds.
 * @property {number} [repeatDelay] - Delay between repetitions of the shine animation.
 * @property {string|function} [ease] - Ease mode for the tween.
 * @property {boolean} [yoyo] - Whether to move the shine back and forth. If not set, the shine constantly crosses the image in the same direction every time.
 * @property {boolean} [useExternal] - Whether to add the shine effect in external space, where it relates to the screen. By default, it is in internal space, where it relates to the target.
 * @property {boolean} [reveal] - Whether to use reveal mode. In reveal mode, the effect only shows the shiny part of the image; the rest is hidden. As this is simpler, there is no `parallelFilters` in the return object when reveal mode is on.
 */
