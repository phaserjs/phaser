/**
 * @typedef {object} Phaser.Types.GameObjects.Gradient.GradientQuadConfig
 * @since 4.0.0
 *
 * @property {(Phaser.Types.Display.ColorBandConfig | Phaser.Display.ColorBand | Array.<Phaser.Types.Display.ColorBandConfig | Phaser.Display.ColorBand>)} [bands={colorStart: 0x000000, colorEnd: 0xffffff}] - Configurations for or instances of ColorBands to use in the gradient. These are used to create a `ColorRamp`.
 * @property {number} [offset=0] - The gradient offset. This advances or withdraws the gradient along its shape.
 * @property {number} [repeatMode=0] - The repeat mode. Gradient progress is evaluated as a number, where 0 is the start of the `shape` vector and 1 is the end. Note that conic gradients never leave the range 0-1 unless offset is applied. They may look weird if you do. Repeat mode tells us how to handle that number below 0/above 1. This can be one of the following:
 *   - 0 (EXTEND): values are clamped between 0 and 1, so the ends of the gradient become flat color.
 *   - 1 (TRUNCATE): values are discarded outside 0-1, so the ends of the gradient become transparent.
 *   - 2 (SAWTOOTH): values are modulo 1, so the gradient repeats.
 *   - 3 (TRIANGULAR): values rise to 1 then fall to 0, so the gradient goes smoothly back and forth.
 * @property {number} [shapeMode=0] - The shape mode. Shapes are based on the `shape` vector. This can be one of the following:
 * - 0 (LINEAR): a ribbon where the shape points from one side to the other.
 *   Commonly use for skies etc.
 * - 1 (BILINEAR): like LINEAR, but reflected in both directions.
 *   Useful for gentle waves, reflections etc.
 * - 2 (RADIAL): gradient spreads out from the `start`,
 *   to the radius described by `shape`.
 *   Useful for glows, ripples etc.
 * - 3 (CONIC_SYMMETRIC): gradient is determined by angle to `shape`,
 *   going from 0 along the shape vector to 1 opposite it.
 *   Useful for sharp-looking features or light effects.
 * - 4 (CONIC_ASYMMETRIC): gradient is determined by angle to `shape`,
 *   going from 0 to 1 with a full rotation. This creates a seam.
 *   Good for creating colors that change with angle,
 *   like speed meters.
 * @property {Phaser.Types.Math.Vector2Like} [start={x: 0, y: 0}] - The start of the gradient, where 0 is top/left and 1 is bottom/right.
 * @property {Phaser.Types.Math.Vector2Like} [shape={x: 1, y: 0}] - The shape of the gradient, as a vector pointing from the start. By default the gradient crosses the width of its object.
 * @property {number} [length=1] - The length of the gradient. This is used if `shape` is not defined.
 * @property {number} [direction=0] - The direction of the gradient. This is used if `shape` is not defined.
 * @property {boolean} [dither] - Whether to dither the gradient. Dither can eliminate banding by introducing noise to the output. This effect can be lost when the Gradient is transformed or scaled, so it's only enabled when you want it.
 */
