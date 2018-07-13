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
declare var JSONFile: any;
declare var MultiFile: any;
/**
 * @typedef {object} Phaser.Loader.FileTypes.MultiAtlasFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [atlasURL] - The absolute or relative URL to load the multi atlas json file from. Or, a well formed JSON object.
 * @property {string} [atlasExtension='json'] - The default file extension to use for the atlas json if no url is provided.
 * @property {XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 * @property {string} [path] - Optional path to use when loading the textures defined in the atlas data.
 * @property {string} [baseURL] - Optional Base URL to use when loading the textures defined in the atlas data.
 * @property {XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture files.
 */
/**
 * @classdesc
 * A single Multi Texture Atlas File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#multiatlas method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#multiatlas.
 *
 * @class MultiAtlasFile
 * @extends Phaser.Loader.MultiFile
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @param {string} [atlasURL] - The absolute or relative URL to load the multi atlas json file from.
 * @param {string} [path] - Optional path to use when loading the textures defined in the atlas data.
 * @param {string} [baseURL] - Optional Base URL to use when loading the textures defined in the atlas data.
 * @param {XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 * @param {XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture files.
 */
declare var MultiAtlasFile: any;
