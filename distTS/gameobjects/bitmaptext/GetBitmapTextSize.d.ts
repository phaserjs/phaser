/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * @typedef {object} BitmapTextSize
 *
 * @property {GlobalBitmapTextSize} global - The position and size of the BitmapText, taking into account the position and scale of the Game Object.
 * @property {LocalBitmapTextSize} local - The position and size of the BitmapText, taking just the font size into account.
 */
/**
 * The position and size of the Bitmap Text in global space, taking into account the Game Object's scale and world position.
 *
 * @typedef {object} GlobalBitmapTextSize
 *
 * @property {number} x - The x position of the BitmapText, taking into account the x position and scale of the Game Object.
 * @property {number} y - The y position of the BitmapText, taking into account the y position and scale of the Game Object.
 * @property {number} width - The width of the BitmapText, taking into account the x scale of the Game Object.
 * @property {number} height - The height of the BitmapText, taking into account the y scale of the Game Object.
 */
/**
 * The position and size of the Bitmap Text in local space, taking just the font size into account.
 *
 * @typedef {object} LocalBitmapTextSize
 *
 * @property {number} x - The x position of the BitmapText.
 * @property {number} y - The y position of the BitmapText.
 * @property {number} width - The width of the BitmapText.
 * @property {number} height - The height of the BitmapText.
 */
/**
 * Calculate the position, width and height of a BitmapText Game Object.
 *
 * Returns a BitmapTextSize object that contains global and local variants of the Game Objects x and y coordinates and
 * its width and height.
 *
 * The global position and size take into account the Game Object's position and scale.
 *
 * The local position and size just takes into account the font data.
 *
 * @function GetBitmapTextSize
 * @since 3.0.0
 * @private
 *
 * @param {(Phaser.GameObjects.DynamicBitmapText|Phaser.GameObjects.BitmapText)} src - The BitmapText to calculate the position, width and height of.
 * @param {boolean} [round] - Whether to round the results to the nearest integer.
 * @param {object} [out] - Optional object to store the results in, to save constant object creation.
 *
 * @return {BitmapTextSize} The calculated position, width and height of the BitmapText.
 */
declare var GetBitmapTextSize: (src: any, round: any, out: any) => any;
