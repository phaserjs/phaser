/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Textures
 */

var Textures = {

    Parsers: require('./parsers'),

    Frame: require('./Frame'),
    Texture: require('./Texture'),
    TextureManager: require('./TextureManager'),
    TextureSource: require('./TextureSource')

};

//   Merge in the consts
Textures = Extend(false, Textures, CONST);

module.exports = Textures;
