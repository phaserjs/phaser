/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @type {integer}
 * @const
 * @since 3.0.0
 */

/**
 * Nearest Neighbor filter type.
 * 
 * @name Phaser.Textures.NEAREST
 * @type {integer}
 * @const
 * @since 3.0.0
 */

var Textures = {

    CanvasTexture: require('./CanvasTexture'),
    Events: require('./events'),
    FilterMode: FilterMode,
    Frame: require('./Frame'),
    Parsers: require('./parsers'),
    Texture: require('./Texture'),
    TextureManager: require('./TextureManager'),
    TextureSource: require('./TextureSource')

};

Textures = Extend(false, Textures, FilterMode);

module.exports = Textures;
