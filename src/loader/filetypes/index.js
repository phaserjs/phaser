/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Loader.FileTypes
 */

/**
 * @typedef {object} XHRConfig
 *
 * @property {string} key - [description]
 * @property {string} texture - [description]
 * @property {string} [data] - [description]
 * @property {XHRConfig} [xhr] - [description]
 */

/**
 * @typedef {object} FileTypeConfig
 *
 * @property {string} key - [description]
 * @property {string} texture - [description]
 * @property {string} [data] - [description]
 * @property {string} [url] - [description]
 * @property {string} [path] - [description]
 * @property {string} [extension] - [description]
 * @property {string} [responseType] - [description]
 * @property {object} [config] - [description]
 * @property {XHRConfig} [xhr] - [description]
 */

module.exports = {

    AnimationJSONFile: require('./AnimationJSONFile'),
    AtlasJSONFile: require('./AtlasJSONFile'),
    AudioFile: require('./AudioFile'),
    AudioSprite: require('./AudioSprite'),
    BinaryFile: require('./BinaryFile'),
    BitmapFontFile: require('./BitmapFontFile'),
    GLSLFile: require('./GLSLFile'),
    HTML5AudioFile: require('./HTML5AudioFile'),
    HTMLFile: require('./HTMLFile'),
    ImageFile: require('./ImageFile'),
    JSONFile: require('./JSONFile'),
    MultiAtlas: require('./MultiAtlas'),
    PluginFile: require('./PluginFile'),
    ScriptFile: require('./ScriptFile'),
    SpriteSheetFile: require('./SpriteSheetFile'),
    SVGFile: require('./SVGFile'),
    TextFile: require('./TextFile'),
    TilemapCSVFile: require('./TilemapCSVFile'),
    TilemapJSONFile: require('./TilemapJSONFile'),
    UnityAtlasFile: require('./UnityAtlasFile'),
    XMLFile: require('./XMLFile')

};
