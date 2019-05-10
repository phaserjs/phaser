/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
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
 * A single SVG File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#svg method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#svg.
 *
 * @class SVGFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.SVGFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.svg`, i.e. if `key` was "alien" then the URL will be "alien.svg".
 * @param {Phaser.Types.Loader.FileTypes.SVGSizeConfig} [svgConfig] - The svg size configuration object.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var SVGFile = new Class({

    Extends: File,

    initialize:

    function SVGFile (loader, key, url, svgConfig, xhrSettings)
    {
        var extension = 'svg';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            svgConfig = GetFastValue(config, 'svgConfig', {});
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }

        var fileConfig = {
            type: 'svg',
            cache: loader.textureManager,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            xhrSettings: xhrSettings,
            config: {
                width: GetFastValue(svgConfig, 'width'),
                height: GetFastValue(svgConfig, 'height'),
                scale: GetFastValue(svgConfig, 'scale')
            }
        };

        File.call(this, loader, fileConfig);
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.SVGFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        var text = this.xhrLoader.responseText;
        var svg = [ text ];
        var width = this.config.width;
        var height = this.config.height;
        var scale = this.config.scale;

        resize: if (width && height || scale)
        {
            var xml = null;
            var parser = new DOMParser();
            xml = parser.parseFromString(text, 'text/xml');
            var svgXML = xml.getElementsByTagName('svg')[0];

            var hasViewBox = svgXML.hasAttribute('viewBox');
            var svgWidth = parseFloat(svgXML.getAttribute('width'));
            var svgHeight = parseFloat(svgXML.getAttribute('height'));

            if (!hasViewBox && svgWidth && svgHeight)
            {
                //  If there's no viewBox attribute, set one
                svgXML.setAttribute('viewBox', '0  0 ' + svgWidth + ' ' + svgHeight);
            }
            else if (hasViewBox && !svgWidth && !svgHeight)
            {
                //  Get the w/h from the viewbox
                var viewBox = svgXML.getAttribute('viewBox').split(/\s+|,/);

                svgWidth = viewBox[2];
                svgHeight = viewBox[3];
            }

            if (scale)
            {
                if (svgWidth && svgHeight)
                {
                    width = svgWidth * scale;
                    height = svgHeight * scale;
                }
                else
                {
                    break resize;
                }
            }

            svgXML.setAttribute('width', width.toString() + 'px');
            svgXML.setAttribute('height', height.toString() + 'px');

            svg = [ (new XMLSerializer()).serializeToString(svgXML) ];
        }

        try
        {
            var blob = new window.Blob(svg, { type: 'image/svg+xml;charset=utf-8' });
        }
        catch (e)
        {
            this.onProcessError();

            return;
        }

        this.data = new Image();

        this.data.crossOrigin = this.crossOrigin;

        var _this = this;
        var retry = false;

        this.data.onload = function ()
        {
            if (!retry)
            {
                File.revokeObjectURL(_this.data);
            }

            _this.onProcessComplete();
        };

        this.data.onerror = function ()
        {
            //  Safari 8 re-try
            if (!retry)
            {
                retry = true;

                File.revokeObjectURL(_this.data);

                _this.data.src = 'data:image/svg+xml,' + encodeURIComponent(svg.join(''));
            }
            else
            {
                _this.onProcessError();
            }
        };

        File.createObjectURL(this.data, blob, 'image/svg+xml');
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.SVGFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        var texture = this.cache.addImage(this.key, this.data);

        this.pendingDestroy(texture);
    }

});

/**
 * Adds an SVG File, or array of SVG Files, to the current load queue. When the files are loaded they
 * will be rendered to bitmap textures and stored in the Texture Manager.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.svg('morty', 'images/Morty.svg');
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
 * this.load.svg({
 *     key: 'morty',
 *     url: 'images/Morty.svg'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.SVGFileConfig` for more details.
 *
 * Once the file has finished loading you can use it as a texture for a Game Object by referencing its key:
 *
 * ```javascript
 * this.load.svg('morty', 'images/Morty.svg');
 * // and later in your game ...
 * this.add.image(x, y, 'morty');
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
 * You can optionally pass an SVG Resize Configuration object when you load an SVG file. By default the SVG will be rendered to a texture
 * at the same size defined in the SVG file attributes. However, this isn't always desirable. You may wish to resize the SVG (either down
 * or up) to improve texture clarity, or reduce texture memory consumption. You can either specify an exact width and height to resize
 * the SVG to:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.svg('morty', 'images/Morty.svg', { width: 300, height: 600 });
 * }
 * ```
 * 
 * Or when using a configuration object:
 * 
 * ```javascript
 * this.load.svg({
 *     key: 'morty',
 *     url: 'images/Morty.svg',
 *     svgConfig: {
 *         width: 300,
 *         height: 600
 *     }
 * });
 * ```
 * 
 * Alternatively, you can just provide a scale factor instead:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.svg('morty', 'images/Morty.svg', { scale: 2.5 });
 * }
 * ```
 * 
 * Or when using a configuration object:
 * 
 * ```javascript
 * this.load.svg({
 *     key: 'morty',
 *     url: 'images/Morty.svg',
 *     svgConfig: {
 *         scale: 2.5
 *     }
 * });
 * ```
 * 
 * If scale, width and height values are all given, the scale has priority and the width and height values are ignored.
 *
 * Note: The ability to load this type of file will only be available if the SVG File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#svg
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.SVGFileConfig|Phaser.Types.Loader.FileTypes.SVGFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.svg`, i.e. if `key` was "alien" then the URL will be "alien.svg".
 * @param {Phaser.Types.Loader.FileTypes.SVGSizeConfig} [svgConfig] - The svg size configuration object.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('svg', function (key, url, svgConfig, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new SVGFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new SVGFile(this, key, url, svgConfig, xhrSettings));
    }

    return this;
});

module.exports = SVGFile;

