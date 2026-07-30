/**
 * @typedef {object} Phaser.Types.Display.ColorBandConfig
 * @since 4.0.0
 *
 * @property {number | string | number[] | Phaser.Display.Color} [colorStart=0x000000] - The color at the start of the band. Specify a color integer, hex string, array of RGB or RGBA in range 0-1, or a color.
 * @property {number | string | number[] | Phaser.Display.Color} [colorEnd] - The color at the end of the band. Defaults to `colorStart`.
 * @property {number} [start=0] - The start point of this band within a ColorRamp. This value should be normalized within the ramp, between 0 (ramp start) and 1 (ramp end).
 * @property {number} [middle=0.5] - The middle point of this band within a ColorRamp. This value should be normalized within the band, between 0 (band start) and 1 (band end). Middle point alters the shape of the color interpolation.
 * @property {number} [end=1] - The end point of this band within a ColorRamp. This value should be normalized within the ramp, between 0 (ramp start) and 1 (ramp end).
 * @property {number} [size] - The size of this band within a ColorRamp. This value should be normalized within the ramp, between 0 (ramp start) and 1 (ramp end). This is used if `end` is not specified. If being used to construct a ColorRamp, it can also set the `start` of the next band.
 * @property {number} [interpolation=0] - The color interpolation.
 * This can be one of the following codes:
 *
 * - 0: LINEAR - a straight blend.
 * - 1: CURVED - color changes quickly at start and end,
 *   flattening in the middle. Good for convex surfaces.
 * - 2: SINUSOIDAL - color changes quickly in the middle,
 *   flattening at start and end. Good for smooth transitions.
 * - 3: CURVE_START - color changes quickly at the start,
 *   flattening at the end.
 * - 4: CURVE_END - color changes quickly at the end,
 *   flattening at the start.
 *
 * Under the hood, these are similar to the circular easing function.
 * @property {number} [colorSpace=0] - The color space where interpolation should be done.
 * This can be one of the following codes:
 *
 * - 0: RGBA - channels are blended directly.
 *   This can be inaccurate.
 * - 1: HSVA_NEAREST - colors are blended in HSVA space,
 *   better preserving saturation and lightness.
 *   The hue is blended with the shortest angle, e.g. red and blue
 *   blend via purple, not green.
 * - 2: HSVA_PLUS - as HSVA_NEAREST, but hue angle always increases.
 * - 3: HSVA_MINUS - as HSVA_NEAREST, but hue angle always decreases.
 */
