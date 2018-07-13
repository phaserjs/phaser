/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var CONST: {
    VERSION: string;
    BlendModes: any;
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
declare var FileTypesManager: {
    install: (loader: any) => void;
    register: (key: any, factoryFunction: any) => void;
    destroy: () => void;
};
declare var JSONFile: any;
/**
 * @typedef {object} Phaser.Loader.FileTypes.PackFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the JSON Cache.
 * @property {string|any} [url] - The absolute or relative URL to load the file from. Or can be a ready formed JSON object, in which case it will be directly processed.
 * @property {string} [extension='json'] - The default file extension to use if no url is provided.
 * @property {string} [dataKey] - If specified instead of the whole JSON file being parsed, only the section corresponding to this property key will be added. If the property you want to extract is nested, use periods to divide it.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @classdesc
 * A single JSON Pack File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#pack method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#pack.
 *
 * @class PackFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.JSONFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {string} [dataKey] - When the JSON file loads only this property will be stored in the Cache.
 */
declare var PackFile: any;
