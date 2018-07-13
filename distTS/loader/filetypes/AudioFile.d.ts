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
    /**
     * @typedef {object} Phaser.Loader.FileTypes.AudioFileConfig
     *
     * @property {string} key - The key of the file. Must be unique within the Loader and Audio Cache.
     * @property {string} [urlConfig] - The absolute or relative URL to load the file from.
     * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
     * @property {AudioContext} [audioContext] - The AudioContext this file will use to process itself.
     */
    /**
     * @classdesc
     * A single Audio File suitable for loading by the Loader.
     *
     * These are created when you use the Phaser.Loader.LoaderPlugin#audio method and are not typically created directly.
     *
     * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#audio.
     *
     * @class AudioFile
     * @extends Phaser.Loader.File
     * @memberOf Phaser.Loader.FileTypes
     * @constructor
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
     * @param {(string|Phaser.Loader.FileTypes.AudioFileConfig)} key - The key to use for this file, or a file configuration object.
     * @param {any} [urlConfig] - The absolute or relative URL to load this file from in a config object.
     * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
     * @param {AudioContext} [audioContext] - The AudioContext this file will use to process itself.
     */
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
declare var HTML5AudioFile: any;
declare var IsPlainObject: any;
/**
 * @typedef {object} Phaser.Loader.FileTypes.AudioFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader and Audio Cache.
 * @property {string} [urlConfig] - The absolute or relative URL to load the file from.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @property {AudioContext} [audioContext] - The AudioContext this file will use to process itself.
 */
/**
 * @classdesc
 * A single Audio File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#audio method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#audio.
 *
 * @class AudioFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.AudioFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {any} [urlConfig] - The absolute or relative URL to load this file from in a config object.
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {AudioContext} [audioContext] - The AudioContext this file will use to process itself.
 */
declare var AudioFile: any;
