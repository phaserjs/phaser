/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var BitmapText: any;
declare var Class: any;
declare var Render: any;
/**
 * @typedef {object} DisplayCallbackConfig
 *
 * @property {{topLeft:number, topRight:number, bottomLeft:number, bottomRight:number}} tint - The tint of the character being rendered.
 * @property {number} index - The index of the character being rendered.
 * @property {number} charCode - The character code of the character being rendered.
 * @property {number} x - The x position of the character being rendered.
 * @property {number} y - The y position of the character being rendered.
 * @property {number} scale - The scale of the character being rendered.
 * @property {number} rotation - The rotation of the character being rendered.
 * @property {any} data - Custom data stored with the character being rendered.
 */
/**
 * @callback DisplayCallback
 *
 * @param {DisplayCallbackConfig} display - Settings of the character that is about to be rendered.
 *
 * @return {{x:number, y:number, scale:number, rotation:number}} Altered position, scale and rotation values for the character that is about to be rendered.
 */
/**
 * @classdesc
 * [description]
 *
 * @class DynamicBitmapText
 * @extends Phaser.GameObjects.BitmapText
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. It can only belong to one Scene at any given time.
 * @param {number} x - The x coordinate of this Game Object in world space.
 * @param {number} y - The y coordinate of this Game Object in world space.
 * @param {string} font - The key of the font to use from the Bitmap Font cache.
 * @param {(string|string[])} [text] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @param {number} [size] - The font size of this Bitmap Text.
 * @param {integer} [align=0] - The alignment of the text in a multi-line BitmapText object.
 */
declare var DynamicBitmapText: any;
