/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var CONST: {
    VERSION: string;
    BlendModes: any;
    /**
     * @typedef {object} Phaser.Loader.FileTypes.PluginFileConfig
     *
     * @property {string} key - The key of the file. Must be unique within the Loader.
     * @property {string} [url] - The absolute or relative URL to load the file from.
     * @property {string} [extension='js'] - The default file extension to use if no url is provided.
     * @property {boolean} [start=false] - Automatically start the plugin after loading?
     * @property {string} [mapping] - If this plugin is to be injected into the Scene, this is the property key used.
     * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
     */
    /**
     * @classdesc
     * A single Plugin Script File suitable for loading by the Loader.
     *
     * These are created when you use the Phaser.Loader.LoaderPlugin#plugin method and are not typically created directly.
     *
     * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#plugin.
     *
     * @class PluginFile
     * @extends Phaser.Loader.File
     * @memberOf Phaser.Loader.FileTypes
     * @constructor
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
     * @param {(string|Phaser.Loader.FileTypes.PluginFileConfig)} key - The key to use for this file, or a file configuration object.
     * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js".
     * @param {boolean} [start=false] - Automatically start the plugin after loading?
     * @param {string} [mapping] - If this plugin is to be injected into the Scene, this is the property key used.
     * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
     */
    ScaleModes: any;
    AUTO: number;
    CANVAS: number;
    WEBGL: number;
    HEADLESS: number;
    FOREVER: number;
    NONE: number;
    UP: number;
    DOWN: number;
    LEFT: number;
    RIGHT: number;
};
declare var File: {
    new (parts: (string | ArrayBuffer | Blob | ArrayBufferView)[], filename: string, properties?: FilePropertyBag): File;
    prototype: File;
};
declare var FileTypesManager: {
    install: (loader: any) => void;
    register: (key: any, factoryFunction: any) => void;
    destroy: () => void;
};
declare var GetFastValue: any;
declare var IsPlainObject: any;
/**
 * @typedef {object} Phaser.Loader.FileTypes.PluginFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='js'] - The default file extension to use if no url is provided.
 * @property {boolean} [start=false] - Automatically start the plugin after loading?
 * @property {string} [mapping] - If this plugin is to be injected into the Scene, this is the property key used.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @classdesc
 * A single Plugin Script File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#plugin method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#plugin.
 *
 * @class PluginFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.PluginFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js".
 * @param {boolean} [start=false] - Automatically start the plugin after loading?
 * @param {string} [mapping] - If this plugin is to be injected into the Scene, this is the property key used.
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
declare var PluginFile: any;
