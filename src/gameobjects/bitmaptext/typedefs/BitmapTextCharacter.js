/**
 * A single entry from the `BitmapTextSize` characters array.
 *
 * The position and dimensions take the font size into account,
 * but are not translated into the local space of the Game Object itself.
 *
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.BitmapTextCharacter
 * @since 3.50.0
 *
 * @property {number} x - The x position of the character in the BitmapText.
 * @property {number} y - The y position of the character in the BitmapText.
 * @property {number} w - The width of the character.
 * @property {number} h - The height of the character.
 * @property {string} char - The character.
 * @property {number} code - The character code of the character.
 * @property {number} line - The line number the character appears on.
 * @property {boolean} isTinted - Does this character have its own unique tint? (WebGL only).
 * @property {number} tintEffect - The tint effect this character uses (WebGL only).
 * @property {number} tintTL - The top-left tint color for this character (WebGL only).
 * @property {number} tintTR - The top-right tint color for this character (WebGL only).
 * @property {number} tintBL - The bottom-left tint color for this character (WebGL only).
 * @property {number} tintBR - The bottom-right tint color for this character (WebGL only).
 * @property {number} alphaTL - The top-left alpha value for this character (WebGL only).
 * @property {number} alphaTR - The top-right alpha value for this character (WebGL only).
 * @property {number} alphaBL - The bottom-left alpha value for this character (WebGL only).
 * @property {number} alphaBR - The bottom-right alpha value for this character (WebGL only).
 * @property {Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData} glyph - Reference to the glyph object this character is using.
 */
