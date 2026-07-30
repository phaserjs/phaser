/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ImageFile = require('./ImageFile');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var MultiFile = require('../MultiFile');
var PCTDecode = require('../../textures/parsers/PCTDecode');

//  Internal File class used by PCTAtlasFile to load and decode a `.pct` data file into its
//  structured representation. Unlike the generic TextFile this parses the loaded text as a
//  Phaser Compact Texture Atlas and stores the decoded object (containing `pages`, `folders`,
//  and `frames`) as `this.data`, which is later written to the atlas cache by the parent
//  MultiFile. This type is not registered with the Loader and is not part of the public API.
var PCTDataFile = new Class({

    Extends: File,

    initialize:

    function PCTDataFile (loader, key, url, xhrSettings)
    {
        var fileConfig = {
            type: 'pct',
            cache: loader.cacheManager.atlas,
            extension: 'pct',
            responseType: 'text',
            key: key,
            url: url,
            xhrSettings: xhrSettings
        };

        File.call(this, loader, fileConfig);
    },

    //  Called automatically by Loader.nextFile. Decodes the loaded PCT text into its structured
    //  object form via Phaser.Textures.Parsers.PCTDecode and stores it as this.data.
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        var decoded = PCTDecode(this.xhrLoader.responseText);

        if (!decoded)
        {
            this.onProcessError();
            return;
        }

        this.data = decoded;

        this.onProcessComplete();
    }

});

/**
 * @classdesc
 * A PCT Atlas File is a composite file type that loads a Phaser Compact Texture Atlas (`.pct`)
 * data file along with all of the texture image files it references. A single PCT file can
 * describe one or multiple atlas pages; each page is declared by a `P:` record and is loaded as
 * a separate image. Phaser parses the PCT data, extracts the filenames listed in its page
 * records, and automatically queues and loads each texture before adding the complete atlas to
 * the Texture Manager under a single key. The decoded PCT data is also stored in the global
 * Atlas Cache, keyed by the file key.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#atlasPCT method and are not
 * typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see
 * Phaser.Loader.LoaderPlugin#atlasPCT.
 *
 * @class PCTAtlasFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 4.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.PCTAtlasFileConfig)} key - The key of the file. Must be unique within both the Loader and the Texture Manager. Or a config object.
 * @param {string} [atlasURL] - The absolute or relative URL to load the PCT data file from.
 * @param {string} [path] - Optional path to use when loading the textures defined in the PCT data.
 * @param {string} [baseURL] - Optional Base URL to use when loading the textures defined in the PCT data.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the PCT data file.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture files.
 */
var PCTAtlasFile = new Class({

    Extends: MultiFile,

    initialize:

    function PCTAtlasFile (loader, key, atlasURL, path, baseURL, atlasXhrSettings, textureXhrSettings)
    {
        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');

            if (GetFastValue(config, 'url', false))
            {
                atlasURL = GetFastValue(config, 'url');
            }
            else
            {
                atlasURL = GetFastValue(config, 'atlasURL');
            }

            atlasXhrSettings = GetFastValue(config, 'xhrSettings');
            path = GetFastValue(config, 'path');
            baseURL = GetFastValue(config, 'baseURL');
            textureXhrSettings = GetFastValue(config, 'textureXhrSettings');
        }

        var data = new PCTDataFile(loader, key, atlasURL, atlasXhrSettings);

        MultiFile.call(this, loader, 'pctatlas', key, [ data ]);

        this.config.path = path;
        this.config.baseURL = baseURL;
        this.config.textureXhrSettings = textureXhrSettings;
    },

    /**
     * Called by each File when it finishes loading. When the PCT data file completes, this method
     * inspects its decoded `pages` array and dynamically creates and queues an ImageFile for every
     * texture page referenced within it. The Loader's baseURL, path, and prefix are temporarily
     * overridden to those specified in the PCTAtlasFile config during this process, then restored
     * afterwards.
     *
     * @method Phaser.Loader.FileTypes.PCTAtlasFile#onFileComplete
     * @since 4.0.0
     *
     * @param {Phaser.Loader.File} file - The File that has completed processing.
     */
    onFileComplete: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.pending--;

            if (file.type === 'pct' && file.data && Array.isArray(file.data.pages))
            {
                var pages = file.data.pages;

                var config = this.config;
                var loader = this.loader;

                var currentBaseURL = loader.baseURL;
                var currentPath = loader.path;
                var currentPrefix = loader.prefix;

                var baseURL = GetFastValue(config, 'baseURL', this.baseURL);
                var path = GetFastValue(config, 'path', this.path);
                var prefix = GetFastValue(config, 'prefix', this.prefix);
                var textureXhrSettings = GetFastValue(config, 'textureXhrSettings');

                loader.setBaseURL(baseURL);
                loader.setPath(path);
                loader.setPrefix(prefix);

                for (var i = 0; i < pages.length; i++)
                {
                    //  "filename": "atlas_0.png"
                    var textureURL = pages[i].filename;

                    var imageKey = 'PCT' + this.multiKeyIndex + '_' + textureURL;

                    var image = new ImageFile(loader, imageKey, textureURL, textureXhrSettings);

                    this.addToMultiFile(image);

                    loader.addFile(image);
                }

                //  Reset the loader settings
                loader.setBaseURL(currentBaseURL);
                loader.setPath(currentPath);
                loader.setPrefix(currentPrefix);
            }
        }
    },

    /**
     * Adds this file to its target caches upon successful loading and processing. The decoded PCT
     * data is added to the Atlas Cache, and the loaded texture images together with the decoded
     * frame data are added to the Texture Manager as a single multi-source texture.
     *
     * @method Phaser.Loader.FileTypes.PCTAtlasFile#addToCache
     * @since 4.0.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var dataFile = this.files[0];
            var decoded = dataFile.data;
            var pages = decoded.pages;

            //  Build an image array in the correct page order by matching each
            //  loaded ImageFile key against the PCT{idx}_{filename} pattern used
            //  when the inner ImageFiles were created.
            var marker = 'PCT' + this.multiKeyIndex + '_';
            var imageByFilename = {};

            for (var i = 1; i < this.files.length; i++)
            {
                var file = this.files[i];
                var key = file.key;
                var markerPos = key.indexOf(marker);
                var filename = (markerPos >= 0) ? key.substring(markerPos + marker.length) : key;

                imageByFilename[filename] = file.data;
            }

            var images = [];

            for (var p = 0; p < pages.length; p++)
            {
                var pageFilename = pages[p].filename;
                var pageImage = imageByFilename[pageFilename];

                if (pageImage)
                {
                    images.push(pageImage);
                }
            }

            //  Store the decoded PCT data in the atlas cache so it can be retrieved later
            this.loader.cacheManager.atlas.add(this.key, decoded);

            //  Add the multi-source texture and its frames to the Texture Manager
            this.loader.textureManager.addAtlasPCT(this.key, images, decoded);

            this.complete = true;
        }
    }

});

/**
 * Adds a Phaser Compact Texture Atlas, or array of them, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.atlasPCT('level1', 'images/Level1.pct');
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
 * If you call this from outside of `preload` then you are responsible for starting the Loader afterwards and monitoring
 * its events to know when it's safe to use the asset. Please see the Phaser.Loader.LoaderPlugin class for more details.
 *
 * Phaser expects the atlas data to be provided in the Phaser Compact Texture format (PCT). This is a compact
 * line-oriented text format that is typically 90-95% smaller than equivalent JSON atlas descriptors while remaining
 * trivially parsable at runtime. A single `.pct` file can describe one or multiple atlas pages (texture images).
 * See the Phaser Compact Texture Atlas Format Specification for a full description of the format.
 *
 * The way it works internally is that you provide a URL to the PCT data file. Phaser loads this file, decodes it,
 * extracts which texture files it needs to load from its page records, and queues each referenced image. When all
 * images have loaded, the atlas is assembled as a single multi-source Texture in the Texture Manager, and the
 * decoded PCT data is stored in the Atlas Cache under the same key.
 *
 * The key must be a unique String. It is used to add the file to the global Texture Manager upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Texture Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Texture Manager first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.atlasPCT({
 *     key: 'level1',
 *     atlasURL: 'images/Level1.pct'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.PCTAtlasFileConfig` for more details.
 *
 * Once the atlas has finished loading you can use frames from it as textures for a Game Object by referencing its key:
 *
 * ```javascript
 * this.load.atlasPCT('level1', 'images/Level1.pct');
 * // and later in your game ...
 * this.add.image(x, y, 'level1', 'background');
 * ```
 *
 * The decoded PCT data (including page, folder and frame metadata) is also available from the Atlas Cache:
 *
 * ```javascript
 * var data = this.cache.atlas.get('level1');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `MENU.` and the key was `Background` the final key will be `MENU.Background` and
 * this is what you would use to retrieve the image from the Texture Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
 * and no URL is given then the Loader will set the URL to be "alien.pct". It will always add `.pct` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the PCT Atlas File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#atlasPCT
 * @fires Phaser.Loader.Events#ADD
 * @since 4.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.PCTAtlasFileConfig|Phaser.Types.Loader.FileTypes.PCTAtlasFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [atlasURL] - The absolute or relative URL to load the PCT data file from. If undefined or `null` it will be set to `<key>.pct`, i.e. if `key` was "alien" then the URL will be "alien.pct".
 * @param {string} [path] - Optional path to use when loading the textures defined in the PCT data.
 * @param {string} [baseURL] - Optional Base URL to use when loading the textures defined in the PCT data.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the PCT data file. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('atlasPCT', function (key, atlasURL, path, baseURL, atlasXhrSettings)
{
    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new PCTAtlasFile(this, key[i]);

            this.addFile(multifile.files);
        }
    }
    else
    {
        multifile = new PCTAtlasFile(this, key, atlasURL, path, baseURL, atlasXhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});

module.exports = PCTAtlasFile;
