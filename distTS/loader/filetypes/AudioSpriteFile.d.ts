/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var AudioFile: any;
declare var Class: any;
declare var FileTypesManager: {
    install: (loader: any) => void;
    register: (key: any, factoryFunction: any) => void;
    destroy: () => void;
};
declare var GetFastValue: any;
declare var IsPlainObject: any;
declare var JSONFile: any;
declare var MultiFile: any;
/**
 * @typedef {object} Phaser.Loader.FileTypes.AudioSpriteFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Audio Cache.
 * @property {string} jsonURL - The absolute or relative URL to load the json file from. Or a well formed JSON object to use instead.
 * @property {XHRSettingsObject} [jsonXhrSettings] - Extra XHR Settings specifically for the json file.
 * @property {string} [audioURL] - The absolute or relative URL to load the audio file from.
 * @property {any} [audioConfig] - The audio configuration options.
 * @property {XHRSettingsObject} [audioXhrSettings] - Extra XHR Settings specifically for the audio file.
 */
/**
 * @classdesc
 * An Audio Sprite File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#audioSprite method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#audioSprite.
 *
 * @class AudioSpriteFile
 * @extends Phaser.Loader.MultiFile
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.AudioSpriteFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} jsonURL - The absolute or relative URL to load the json file from. Or a well formed JSON object to use instead.
 * @param {string} [audioURL] - The absolute or relative URL to load the audio file from. If empty it will be obtained by parsing the JSON file.
 * @param {any} [audioConfig] - The audio configuration options.
 * @param {XHRSettingsObject} [audioXhrSettings] - An XHR Settings configuration object for the audio file. Used in replacement of the Loaders default XHR Settings.
 * @param {XHRSettingsObject} [jsonXhrSettings] - An XHR Settings configuration object for the json file. Used in replacement of the Loaders default XHR Settings.
 */
declare var AudioSpriteFile: any;
