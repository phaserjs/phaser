/**
 * A resolved text style: the font data, tint color, texture frame and
 * size shared by all characters of a segment.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.Style
 * @since 4.3.0
 *
 * @property {Phaser.Types.GameObjects.BitmapText.BitmapFontData} [fontData] - The font data of the style's bitmap font; `undefined` inherits the BitmapText's font.
 * @property {Phaser.Textures.Frame} [frame] - The resolved texture frame of the style's font; `undefined` inherits the BitmapText's font.
 * @property {number} [size] - Font size overriding the BitmapText's `fontSize`.
 * @property {number} color - Text color (0xRRGGBB).
 */
