/**
 * A single entry from the `BitmapTextSize` characters array.
 *
 * The position and dimensions take the font size into account,
 * but are not translated into the local space of the Game Object itself.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapTextCharacter
 * @since 3.50.0
 *
 * @property {number} i - The index of this character within the BitmapText text string.
 * @property {string} char - The character.
 * @property {number} code - The character code of the character.
 * @property {number} x - The x position of the character in the BitmapText.
 * @property {number} y - The y position of the character in the BitmapText.
 * @property {number} w - The width of the character.
 * @property {number} h - The height of the character.
 * @property {number} t - The top of the line this character is on.
 * @property {number} r - The right-most point of this character, including xAdvance.
 * @property {number} b - The bottom of the line this character is on.
 * @property {number} line - The line number the character appears on.
 * @property {Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData} glyph - Reference to the glyph object this character is using.
 */
