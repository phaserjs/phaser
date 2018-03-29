/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Textures
 * @property {integer} LINEAR - Linear filter type.
 * @property {integer} NEAREST - Nearest neighbor filter type.
 */

var Textures = {

    Parsers: require('./parsers'),

    Frame: require('./Frame'),
    Texture: require('./Texture'),
    TextureManager: require('./TextureManager'),
    TextureSource: require('./TextureSource'),

    LINEAR: 0,
    NEAREST: 1

};

module.exports = Textures;
