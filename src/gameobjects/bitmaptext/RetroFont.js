/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var RETRO_FONT_CONST = require('./const');
var Extend = require('../../utils/object/Extend');

/**
 * @namespace Phaser.GameObjects.RetroFont
 * @since 3.6.0
 */

var RetroFont = { Parse: require('./ParseRetroFont') };

//   Merge in the consts
RetroFont = Extend(false, RetroFont, RETRO_FONT_CONST);

module.exports = RetroFont;
