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
     * @typedef {object} Phaser.Loader.FileTypes.ImageFrameConfig
     *
     * @property {integer} frameWidth - The width of the frame in pixels.
     * @property {integer} [frameHeight] - The height of the frame in pixels. Uses the `frameWidth` value if not provided.
     * @property {integer} [startFrame=0] - The first frame to start parsing from.
     * @property {integer} [endFrame] - The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
     * @property {integer} [margin=0] - The margin in the image. This is the space around the edge of the frames.
     * @property {integer} [spacing=0] - The spacing between each frame in the image.
     */
    /**
     * @typedef {object} Phaser.Loader.FileTypes.ImageFileConfig
     *
     * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
     * @property {string} [url] - The absolute or relative URL to load the file from.
     * @property {string} [extension='png'] - The default file extension to use if no url is provided.
     * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the image.
     * @property {Phaser.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
     * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
     */
    /**
     * @classdesc
     * A single Image File suitable for loading by the Loader.
     *
     * These are created when you use the Phaser.Loader.LoaderPlugin#image method and are not typically created directly.
     *
     * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#image.
     *
     * @class ImageFile
     * @extends Phaser.Loader.File
     * @memberOf Phaser.Loader.FileTypes
     * @constructor
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
     * @param {(string|Phaser.Loader.FileTypes.ImageFileConfig)} key - The key to use for this file, or a file configuration object.
     * @param {string|string[]} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
     * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
     * @param {Phaser.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
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
 * @typedef {object} Phaser.Loader.FileTypes.ImageFrameConfig
 *
 * @property {integer} frameWidth - The width of the frame in pixels.
 * @property {integer} [frameHeight] - The height of the frame in pixels. Uses the `frameWidth` value if not provided.
 * @property {integer} [startFrame=0] - The first frame to start parsing from.
 * @property {integer} [endFrame] - The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
 * @property {integer} [margin=0] - The margin in the image. This is the space around the edge of the frames.
 * @property {integer} [spacing=0] - The spacing between each frame in the image.
 */
/**
 * @typedef {object} Phaser.Loader.FileTypes.ImageFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='png'] - The default file extension to use if no url is provided.
 * @property {string} [normalMap] - The filename of an associated normal map. It uses the same path and url to load as the image.
 * @property {Phaser.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
/**
 * @classdesc
 * A single Image File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#image method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#image.
 *
 * @class ImageFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.ImageFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {Phaser.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
 */
declare var ImageFile: any;
