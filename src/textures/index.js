/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Extend = require('../utils/object/Extend');
var FilterMode = require('./const');

/**
 * @namespace Phaser.Textures
 */

/**
 * Linear filter type.
 * 
 * @name Phaser.Textures.LINEAR
 * @constant
 */

/**
 * Nearest Neighbor filter type.
 * 
 * @name Phaser.Textures.NEAREST
 * @constant
 */

var Textures = {

    FilterMode: FilterMode,
    Frame: require('./Frame'),
    Parsers: require('./parsers'),
    Texture: require('./Texture'),
    TextureManager: require('./TextureManager'),
    TextureSource: require('./TextureSource')

};

Textures = Extend(false, Textures, FilterMode);

module.exports = Textures;
