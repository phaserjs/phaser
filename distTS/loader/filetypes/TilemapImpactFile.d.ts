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
declare var JSONFile: any;
declare var TILEMAP_FORMATS: any;
/**
 * @typedef {object} Phaser.Loader.FileTypes.TilemapImpactFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Tilemap Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='json'] - The default file extension to use if no url is provided.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @classdesc
 * A single Impact.js Tilemap JSON File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#tilemapImpact method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#tilemapImpact.
 *
 * @class TilemapImpactFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.TilemapImpactFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
declare var TilemapImpactFile: any;
