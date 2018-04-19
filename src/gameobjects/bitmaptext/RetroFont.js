/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var RETRO_FONT_CONST = require('./const');
var Extend = require('../../utils/object/Extend');

/**
 * @typedef {object} Phaser.GameObjects.RetroFont.Config
 * 
 * @property {string} image - [description]
 * @property {number} offset.x - If the font set doesn't start at the top left of the given image, specify the X coordinate offset here.
 * @property {number} offset.y - If the font set doesn't start at the top left of the given image, specify the Y coordinate offset here.
 * @property {number} width - The width of each character in the font set.
 * @property {number} height - The height of each character in the font set.
 * @property {string} chars - The characters used in the font set, in display order. You can use the TEXT_SET consts for common font set arrangements.
 * @property {number} charsPerRow - The number of characters per row in the font set. If not given charsPerRow will be the image width / characterWidth.
 * @property {number} spacing.x - If the characters in the font set have horizontal spacing between them set the required amount here.
 * @property {number} spacing.y - If the characters in the font set have vertical spacing between them set the required amount here.
*/

/**
 * @namespace Phaser.GameObjects.RetroFont
 * @since 3.6.0
 */

var RetroFont = { Parse: require('./ParseRetroFont') };

//   Merge in the consts
RetroFont = Extend(false, RetroFont, RETRO_FONT_CONST);

module.exports = RetroFont;
