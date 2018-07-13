/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var FileTypesManager: {
    install: (loader: any) => void;
    register: (key: any, factoryFunction: any) => void;
    destroy: () => void;
};
declare var GetFastValue: any;
declare var ImageFile: any;
declare var IsPlainObject: any;
declare var MultiFile: any;
declare var ParseXMLBitmapFont: any;
declare var XMLFile: any;
/**
 * @typedef {object} Phaser.Loader.FileTypes.BitmapFontFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [textureURL] - The absolute or relative URL to load the texture image file from.
 * @property {string} [textureExtension='png'] - The default file extension to use for the image texture if no url is provided.
 * @property {XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture image file.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the texture image.
 * @property {string} [fontDataURL] - The absolute or relative URL to load the font data xml file from.
 * @property {string} [fontDataExtension='xml'] - The default file extension to use for the font data xml if no url is provided.
 * @property {XHRSettingsObject} [fontDataXhrSettings] - Extra XHR Settings specifically for the font data xml file.
 */
/**
 * @classdesc
 * A single Bitmap Font based File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#bitmapFont method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#bitmapFont.
 *
 * @class BitmapFontFile
 * @extends Phaser.Loader.MultiFile
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.BitmapFontFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [textureURL] - The absolute or relative URL to load the font image file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {string} [fontDataURL] - The absolute or relative URL to load the font xml data file from. If undefined or `null` it will be set to `<key>.xml`, i.e. if `key` was "alien" then the URL will be "alien.xml".
 * @param {XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the font image file. Used in replacement of the Loaders default XHR Settings.
 * @param {XHRSettingsObject} [fontDataXhrSettings] - An XHR Settings configuration object for the font data xml file. Used in replacement of the Loaders default XHR Settings.
 */
declare var BitmapFontFile: any;
