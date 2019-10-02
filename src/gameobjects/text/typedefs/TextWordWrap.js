/**
 * A Text Word Wrap configuration object as used by the Text Style configuration.
 *
 * @typedef {object} Phaser.Types.GameObjects.Text.TextWordWrap
 * @since 3.0.0
 *
 * @property {number} [width] - The width at which text should be considered for word-wrapping.
 * @property {TextStyleWordWrapCallback} [callback] - Provide a custom callback when word wrapping is enabled.
 * @property {any} [callbackScope] - The context in which the word wrap callback is invoked.
 * @property {boolean} [useAdvancedWrap=false] - Use basic or advanced word wrapping?
 */

/**
 * A custom function that will be responsible for wrapping the text.
 * @callback TextStyleWordWrapCallback
 *
 * @param {string} text - The string to wrap.
 * @param {Phaser.GameObjects.Text} textObject - The Text instance.
 *
 * @return {(string|string[])} Should return the wrapped lines either as an array of lines or as a string with
 * newline characters in place to indicate where breaks should happen.
 */
