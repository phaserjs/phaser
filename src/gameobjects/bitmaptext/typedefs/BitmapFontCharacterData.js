/**
 * The font data for an individual character of a Bitmap Font.
 *
 * Describes the character's position, size, offset and kerning.
 *
 * As of version 3.50 it also includes the WebGL texture uv data.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData
 * @since 3.0.0
 *
 * @property {number} x - The x position of the character.
 * @property {number} y - The y position of the character.
 * @property {number} width - The width of the character.
 * @property {number} height - The height of the character.
 * @property {number} centerX - The center x position of the character.
 * @property {number} centerY - The center y position of the character.
 * @property {number} xOffset - The x offset of the character.
 * @property {number} yOffset - The y offset of the character.
 * @property {number} u0 - WebGL texture u0.
 * @property {number} v0 - WebGL texture v0.
 * @property {number} u1 - WebGL texture u1.
 * @property {number} v1 - WebGL texture v1.
 * @property {object} data - Extra data for the character.
 * @property {Object.<number>} kerning - Kerning values, keyed by character code.
 */
