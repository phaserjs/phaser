/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetURL = require('../GetURL');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * A single Font File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#font method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#font.
 *
 * @class FontFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.87.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.FontFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.ttf`, i.e. if `key` was "alien" then the URL will be "alien.ttf".
 * @param {string} [format='truetype'] - The font type. Should be a string, like 'truetype' or 'opentype'.
 * @param {object} [descriptors] - An optional object containing font descriptors for the Font Face. See https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace#descriptors for more details.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var FontFile = class extends File {

    constructor(loader, key, url, format, descriptors, xhrSettings)
    {
        var extension = 'ttf';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            format = GetFastValue(config, 'format', 'truetype');
            descriptors = GetFastValue(config, 'descriptors', null);
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }
        else if (format === undefined)
        {
            format = 'truetype';
        }

        var fileConfig = {
            type: 'font',
            cache: false,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            xhrSettings: xhrSettings
        };

        super(loader, fileConfig);

        this.data = {
            format: format,
            descriptors: descriptors
        };

        this.state = CONST.FILE_POPULATED;
    }

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.FontFile#onProcess
     * @since 3.87.0
     */
    onProcess()
    {
        this.state = CONST.FILE_PROCESSING;

        this.src = GetURL(this, this.loader.baseURL);

        var font;
        var key = this.key;
        var source = 'url(' + this.src + ') format("' + this.data.format + '")';

        if (this.data.descriptors)
        {
            font = new FontFace(key, source, this.data.descriptors);
        }
        else
        {
            font = new FontFace(key, source);
        }

        var _this = this;

        font.load().then(function ()
        {
            document.fonts.add(font);
            document.body.classList.add('fonts-loaded');
            
            _this.onProcessComplete();

        }).catch(function ()
        {
            console.warn('Font failed to load', source);

            _this.onProcessComplete();
        });
    }

};

/**
 * Adds a Font file, or array of Font files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.font('Nokia', 'assets/nokia.ttf', 'truetype');
 * }
 * ```
 *
 * If the font file is open type, you can specify the format:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.font('Nokia', 'assets/nokia.otf', 'opentype');
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
 * The key must be a unique String and not already in-use by another file in the Loader.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.font({
 *     key: 'Nokia',
 *     url: 'assets/nokia.ttf',
 *     format: 'truetype',
 *     descriptors: { style: 'normal', weight: '400' }
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.FontFileConfig` for more details.
 * 
 * See the MDN documentation at https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace#descriptors for details about the descriptors.
 * 
 * When this file is handled by the Loader, it will create a new Font Face DOM element for it and add it to the document.
 * 
 * You should use the same key given for the font in your Text objects, such as:
 * 
 * ```javascript
 * this.add.text(x, y, 'Hello World', { fontFamily: 'Nokia', fontSize: 48 });
 * ```
 * 
 * See https://developer.mozilla.org/en-US/docs/Web/API/FontFace for more details.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
 * and no URL is given then the Loader will set the URL to be "alien.ttf". It will always add `.ttf` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the Font File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#font
 * @fires Phaser.Loader.Events#ADD
 * @since 3.87.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.FontFileConfig|Phaser.Types.Loader.FileTypes.FontFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.ttf`, i.e. if `key` was "alien" then the URL will be "alien.ttf".
 * @param {string} [format='truetype'] - The font type. Should be a string, like 'truetype' or 'opentype'.
 * @param {object} [descriptors] - An optional object containing font descriptors for the Font Face. See https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace#descriptors for more details.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('font', function (key, url, format, descriptors, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new FontFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new FontFile(this, key, url, format, descriptors, xhrSettings));
    }

    return this;
});

module.exports = FontFile;
