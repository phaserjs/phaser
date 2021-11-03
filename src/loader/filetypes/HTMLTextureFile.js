/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * A single HTML File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#htmlTexture method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#htmlTexture.
 *
 * @class HTMLTextureFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.12.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.HTMLTextureFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {number} [width] - The width of the texture the HTML will be rendered to.
 * @param {number} [height] - The height of the texture the HTML will be rendered to.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var HTMLTextureFile = new Class({

    Extends: File,

    initialize:

    function HTMLTextureFile (loader, key, url, width, height, xhrSettings)
    {
        if (width === undefined) { width = 512; }
        if (height === undefined) { height = 512; }

        var extension = 'html';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
            width = GetFastValue(config, 'width', width);
            height = GetFastValue(config, 'height', height);
        }

        var fileConfig = {
            type: 'html',
            cache: loader.textureManager,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            xhrSettings: xhrSettings,
            config: {
                width: width,
                height: height
            }
        };

        File.call(this, loader, fileConfig);
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.HTMLTextureFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        var w = this.config.width;
        var h = this.config.height;

        var data = [];

        data.push('<svg width="' + w + 'px" height="' + h + 'px" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">');
        data.push('<foreignObject width="100%" height="100%">');
        data.push('<body xmlns="http://www.w3.org/1999/xhtml">');
        data.push(this.xhrLoader.responseText);
        data.push('</body>');
        data.push('</foreignObject>');
        data.push('</svg>');

        var svg = [ data.join('\n') ];
        var _this = this;

        try
        {
            var blob = new window.Blob(svg, { type: 'image/svg+xml;charset=utf-8' });
        }
        catch (e)
        {
            _this.state = CONST.FILE_ERRORED;

            _this.onProcessComplete();

            return;
        }

        this.data = new Image();

        this.data.crossOrigin = this.crossOrigin;

        this.data.onload = function ()
        {
            File.revokeObjectURL(_this.data);

            _this.onProcessComplete();
        };

        this.data.onerror = function ()
        {
            File.revokeObjectURL(_this.data);

            _this.onProcessError();
        };

        File.createObjectURL(this.data, blob, 'image/svg+xml');
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.HTMLTextureFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        this.cache.addImage(this.key, this.data);
    }

});

/**
 * Adds an HTML File, or array of HTML Files, to the current load queue. When the files are loaded they
 * will be rendered to textures and stored in the Texture Manager.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.htmlTexture('instructions', 'content/intro.html', 256, 512);
 * }
 * ```
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 *
 * The key must be a unique String. It is used to add the file to the global Texture Manager upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Texture Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Texture Manager first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.htmlTexture({
 *     key: 'instructions',
 *     url: 'content/intro.html',
 *     width: 256,
 *     height: 512
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.HTMLTextureFileConfig` for more details.
 *
 * Once the file has finished loading you can use it as a texture for a Game Object by referencing its key:
 *
 * ```javascript
 * this.load.htmlTexture('instructions', 'content/intro.html', 256, 512);
 * // and later in your game ...
 * this.add.image(x, y, 'instructions');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `MENU.` and the key was `Background` the final key will be `MENU.Background` and
 * this is what you would use to retrieve the image from the Texture Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
 * and no URL is given then the Loader will set the URL to be "alien.html". It will always add `.html` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * The width and height are the size of the texture to which the HTML will be rendered. It's not possible to determine these
 * automatically, so you will need to provide them, either as arguments or in the file config object.
 * When the HTML file has loaded a new SVG element is created with a size and viewbox set to the width and height given.
 * The SVG file has a body tag added to it, with the HTML file contents included. It then calls `window.Blob` on the SVG,
 * and if successful is added to the Texture Manager, otherwise it fails processing. The overall quality of the rendered
 * HTML depends on your browser, and some of them may not even support the svg / blob process used. Be aware that there are
 * limitations on what HTML can be inside an SVG. You can find out more details in this
 * [Mozilla MDN entry](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas).
 *
 * Note: The ability to load this type of file will only be available if the HTMLTextureFile File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#htmlTexture
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.12.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.HTMLTextureFileConfig|Phaser.Types.Loader.FileTypes.HTMLTextureFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.html`, i.e. if `key` was "alien" then the URL will be "alien.html".
 * @param {number} [width=512] - The width of the texture the HTML will be rendered to.
 * @param {number} [height=512] - The height of the texture the HTML will be rendered to.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('htmlTexture', function (key, url, width, height, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new HTMLTextureFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new HTMLTextureFile(this, key, url, width, height, xhrSettings));
    }

    return this;
});

module.exports = HTMLTextureFile;
