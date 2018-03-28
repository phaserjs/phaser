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
    TextureSource: require('./TextureSource'),

    /**
     * Linear filter type.
     * 
     * @name Phaser.Textures.LINEAR
     * @type {integer}
     * @since 3.0.0
     */
    LINEAR: 0,

    /**
     * Nearest neighbor filter type.
     * 
     * @name Phaser.Textures.NEAREST
     * @type {integer}
     * @since 3.0.0
     */
    NEAREST: 1

};

module.exports = Textures;
