/**
 * @typedef {object} Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig
 * @since 3.0.0
 * 
 * @property {Phaser.GameObjects.DynamicBitmapText} parent - The Dynamic Bitmap Text object that owns this character being rendered.
 * @property {Phaser.Types.GameObjects.BitmapText.TintConfig} tint - The tint of the character being rendered. Always zero in Canvas.
 * @property {number} index - The index of the character being rendered.
 * @property {number} charCode - The character code of the character being rendered.
 * @property {number} x - The x position of the character being rendered.
 * @property {number} y - The y position of the character being rendered.
 * @property {number} scale - The scale of the character being rendered.
 * @property {number} rotation - The rotation of the character being rendered.
 * @property {any} data - Custom data stored with the character being rendered.
 */

/**
 * @callback Phaser.Types.GameObjects.BitmapText.DisplayCallback
 *
 * @param {Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig} display - Settings of the character that is about to be rendered.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig} Altered position, scale and rotation values for the character that is about to be rendered.
 */
