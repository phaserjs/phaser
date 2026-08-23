/**
 * A run of characters sharing one style, used for rich text on a `BitmapText`.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.Segment
 * @since 4.3.0
 *
 * @property {string} text - The segment's text. May contain newlines.
 * @property {string} [style] - The name of a style registered via `addTextStyle`.
 * @property {string} [font] - The key of a Bitmap Font in the cache. Overrides the style's font.
 * @property {number} [size] - Font size for this run. Overrides the style's size.
 * @property {number} [color] - Tint color for this run (0xRRGGBB). Overrides the style's color.
 */
