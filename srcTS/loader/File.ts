/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var GetFastValue = require('../utils/object/GetFastValue');
var GetURL = require('./GetURL');
var MergeXHRSettings = require('./MergeXHRSettings');
var XHRLoader = require('./XHRLoader');
var XHRSettings = require('./XHRSettings');

/**
 * @typedef {object} FileConfig
 *
 * @property {string} type - The file type string (image, json, etc) for sorting within the Loader.
 * @property {string} key - Unique cache key (unique within its file type)
 * @property {string} [url] - The URL of the file, not including baseURL.
 * @property {string} [path] - The path of the file, not including the baseURL.
 * @property {string} [extension] - The default extension this file uses.
 * @property {XMLHttpRequestResponseType} [responseType] - The responseType to be used by the XHR request.
 * @property {(XHRSettingsObject|false)} [xhrSettings=false] - Custom XHR Settings specific to this file and merged with the Loader defaults.
 * @property {any} [config] - A config object that can be used by file types to store transitional data.
 */

/**
 * @classdesc
 * The base File class used by all File Types that the Loader can support.
 * You shouldn't create an instance of a File directly, but should extend it with your own class, setting a custom type and processing methods.
 *
 * @class File
 * @memberOf Phaser.Loader
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - The Loader that is going to load this File.
 * @param {FileConfig} fileConfig - The file configuration object, as created by the file type.
 */
var File = new Class({

    initialize:

    function File (loader, fileConfig)
    {
        /**
         * A reference to the Loader that is going to load this file.
         *
         * @name Phaser.Loader.File#loader
         * @type {Phaser.Loader.LoaderPlugin}
         * @since 3.0.0
         */
        this.loader = loader;

        /**
         * A reference to the Cache, or Texture Manager, that is going to store this file if it loads.
         *
         * @name Phaser.Loader.File#cache
         * @type {(Phaser.Cache.BaseCache|Phaser.Textures.TextureManager)}
         * @since 3.7.0
         */
        this.cache = GetFastValue(fileConfig, 'cache', false);

        /**
         * The file type string (image, json, etc) for sorting within the Loader.
         *
         * @name Phaser.Loader.File#type
         * @type {string}
         * @since 3.0.0
         */
        this.type = GetFastValue(fileConfig, 'type', false);

        /**
         * Unique cache key (unique within its file type)
         *
         * @name Phaser.Loader.File#key
         * @type {string}
         * @since 3.0.0
         */
        this.key = GetFastValue(fileConfig, 'key', false);

        var loadKey = this.key;

        if (loader.prefix && loader.prefix !== '')
        {
            this.key = loader.prefix + loadKey;
        }

        if (!this.type || !this.key)
        {
            throw new Error('Error calling \'Loader.' + this.type + '\' invalid key provided.');
        }

        /**
         * The URL of the file, not including baseURL.
         * Automatically has Loader.path prepended to it.
         *
         * @name Phaser.Loader.File#url
         * @type {string}
         * @since 3.0.0
         */
        this.url = GetFastValue(fileConfig, 'url');

        if (this.url === undefined)
        {
            this.url = loader.path + loadKey + '.' + GetFastValue(fileConfig, 'extension', '');
        }
        else if (typeof(this.url) !== 'function')
        {
            this.url = loader.path + this.url;
        }

        /**
         * The final URL this file will load from, including baseURL and path.
         * Set automatically when the Loader calls 'load' on this file.
         *
         * @name Phaser.Loader.File#src
         * @type {string}
         * @since 3.0.0
         */
        this.src = '';

        /**
         * The merged XHRSettings for this file.
         *
         * @name Phaser.Loader.File#xhrSettings
         * @type {XHRSettingsObject}
         * @since 3.0.0
         */
        this.xhrSettings = XHRSettings(GetFastValue(fileConfig, 'responseType', undefined));

        if (GetFastValue(fileConfig, 'xhrSettings', false))
        {
            this.xhrSettings = MergeXHRSettings(this.xhrSettings, GetFastValue(fileConfig, 'xhrSettings', {}));
        }

        /**
         * The XMLHttpRequest instance (as created by XHR Loader) that is loading this File.
         *
         * @name Phaser.Loader.File#xhrLoader
         * @type {?XMLHttpRequest}
         * @since 3.0.0
         */
        this.xhrLoader = null;

        /**
         * The current state of the file. One of the FILE_CONST values.
         *
         * @name Phaser.Loader.File#state
         * @type {integer}
         * @since 3.0.0
         */
        this.state = (typeof(this.url) === 'function') ? CONST.FILE_POPULATED : CONST.FILE_PENDING;

        /**
         * The total size of this file.
         * Set by onProgress and only if loading via XHR.
         *
         * @name Phaser.Loader.File#bytesTotal
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.bytesTotal = 0;

        /**
         * Updated as the file loads.
         * Only set if loading via XHR.
         *
         * @name Phaser.Loader.File#bytesLoaded
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.bytesLoaded = -1;

        /**
         * A percentage value between 0 and 1 indicating how much of this file has loaded.
         * Only set if loading via XHR.
         *
         * @name Phaser.Loader.File#percentComplete
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.percentComplete = -1;

        /**
         * For CORs based loading.
         * If this is undefined then the File will check BaseLoader.crossOrigin and use that (if set)
         *
         * @name Phaser.Loader.File#crossOrigin
         * @type {(string|undefined)}
         * @since 3.0.0
         */
        this.crossOrigin = undefined;

        /**
         * The processed file data, stored here after the file has loaded.
         *
         * @name Phaser.Loader.File#data
         * @type {*}
         * @since 3.0.0
         */
        this.data = undefined;

        /**
         * A config object that can be used by file types to store transitional data.
         *
         * @name Phaser.Loader.File#config
         * @type {*}
         * @since 3.0.0
         */
        this.config = GetFastValue(fileConfig, 'config', {});

        /**
         * If this is a multipart file, i.e. an atlas and its json together, then this is a reference
         * to the parent MultiFile. Set and used internally by the Loader or specific file types.
         *
         * @name Phaser.Loader.File#multiFile
         * @type {?Phaser.Loader.MultiFile}
         * @since 3.7.0
         */
        this.multiFile;

        /**
         * Does this file have an associated linked file? Such as an image and a normal map.
         * Atlases and Bitmap Fonts use the multiFile, because those files need loading together but aren't
         * actually bound by data, where-as a linkFile is.
         *
         * @name Phaser.Loader.File#linkFile
         * @type {?Phaser.Loader.File}
         * @since 3.7.0
         */
        this.linkFile;
    },

    /**
     * Links this File with another, so they depend upon each other for loading and processing.
     *
     * @method Phaser.Loader.File#setLink
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} fileB - The file to link to this one.
     */
    setLink: function (fileB)
    {
        this.linkFile = fileB;

        fileB.linkFile = this;
    },

    /**
     * Resets the XHRLoader instance this file is using.
     *
     * @method Phaser.Loader.File#resetXHR
     * @since 3.0.0
     */
    resetXHR: function ()
    {
        if (this.xhrLoader)
        {
            this.xhrLoader.onload = undefined;
            this.xhrLoader.onerror = undefined;
            this.xhrLoader.onprogress = undefined;
        }
    },

    /**
     * Called by the Loader, starts the actual file downloading.
     * During the load the methods onLoad, onError and onProgress are called, based on the XHR events.
     * You shouldn't normally call this method directly, it's meant to be invoked by the Loader.
     *
     * @method Phaser.Loader.File#load
     * @since 3.0.0
     */
    load: function ()
    {
        if (this.state === CONST.FILE_POPULATED)
        {
            //  Can happen for example in a JSONFile if they've provided a JSON object instead of a URL
            this.loader.nextFile(this, true);
        }
        else
        {
            this.src = GetURL(this, this.loader.baseURL);

            if (this.src.indexOf('data:') === 0)
            {
                console.warn('Local data URIs are not supported: ' + this.key);
            }
            else
            {
                //  The creation of this XHRLoader starts the load process going.
                //  It will automatically call the following, based on the load outcome:
                //  
                // xhr.onload = this.onLoad
                // xhr.onerror = this.onError
                // xhr.onprogress = this.onProgress

                this.xhrLoader = XHRLoader(this, this.loader.xhr);
            }
        }
    },

    /**
     * Called when the file finishes loading, is sent a DOM ProgressEvent.
     *
     * @method Phaser.Loader.File#onLoad
     * @since 3.0.0
     *
     * @param {XMLHttpRequest} xhr - The XMLHttpRequest that caused this onload event.
     * @param {ProgressEvent} event - The DOM ProgressEvent that resulted from this load.
     */
    onLoad: function (xhr, event)
    {
        var success = !(event.target && event.target.status !== 200);

        //  Handle HTTP status codes of 4xx and 5xx as errors, even if xhr.onerror was not called.
        if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status <= 599)
        {
            success = false;
        }

        this.resetXHR();

        this.loader.nextFile(this, success);
    },

    /**
     * Called if the file errors while loading, is sent a DOM ProgressEvent.
     *
     * @method Phaser.Loader.File#onError
     * @since 3.0.0
     *
     * @param {ProgressEvent} event - The DOM ProgressEvent that resulted from this error.
     */
    onError: function ()
    {
        this.resetXHR();

        this.loader.nextFile(this, false);
    },

    /**
     * Called during the file load progress. Is sent a DOM ProgressEvent.
     *
     * @method Phaser.Loader.File#onProgress
     * @since 3.0.0
     *
     * @param {ProgressEvent} event - The DOM ProgressEvent.
     */
    onProgress: function (event)
    {
        if (event.lengthComputable)
        {
            this.bytesLoaded = event.loaded;
            this.bytesTotal = event.total;

            this.percentComplete = Math.min((this.bytesLoaded / this.bytesTotal), 1);

            this.loader.emit('fileprogress', this, this.percentComplete);
        }
    },

    /**
     * Usually overridden by the FileTypes and is called by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data, for example a JSON file will parse itself during this stage.
     *
     * @method Phaser.Loader.File#onProcess
     * @since 3.0.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.onProcessComplete();
    },

    /**
     * Called when the File has completed processing.
     * Checks on the state of its multifile, if set.
     *
     * @method Phaser.Loader.File#onProcessComplete
     * @since 3.7.0
     */
    onProcessComplete: function ()
    {
        this.state = CONST.FILE_COMPLETE;

        if (this.multiFile)
        {
            this.multiFile.onFileComplete(this);
        }

        this.loader.fileProcessComplete(this);
    },

    /**
     * Called when the File has completed processing but it generated an error.
     * Checks on the state of its multifile, if set.
     *
     * @method Phaser.Loader.File#onProcessError
     * @since 3.7.0
     */
    onProcessError: function ()
    {
        this.state = CONST.FILE_ERRORED;

        if (this.multiFile)
        {
            this.multiFile.onFileFailed(this);
        }

        this.loader.fileProcessComplete(this);
    },

    /**
     * Checks if a key matching the one used by this file exists in the target Cache or not.
     * This is called automatically by the LoaderPlugin to decide if the file can be safely
     * loaded or will conflict.
     *
     * @method Phaser.Loader.File#hasCacheConflict
     * @since 3.7.0
     *
     * @return {boolean} `true` if adding this file will cause a conflict, otherwise `false`.
     */
    hasCacheConflict: function ()
    {
        return (this.cache && this.cache.exists(this.key));
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     * This method is often overridden by specific file types.
     *
     * @method Phaser.Loader.File#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        if (this.cache)
        {
            this.cache.add(this.key, this.data);
        }

        this.pendingDestroy();
    },

    /**
     * You can listen for this event from the LoaderPlugin. It is dispatched _every time_
     * a file loads and is sent 3 arguments, which allow you to identify the file:
     *
     * ```javascript
     * this.load.on('filecomplete', function (key, type, data) {
     *     // Your handler code
     * });
     * ```
     * 
     * @event Phaser.Loader.File#fileCompleteEvent
     * @param {string} key - The key of the file that just loaded and finished processing.
     * @param {string} type - The type of the file that just loaded and finished processing.
     * @param {any} data - The data of the file.
     */

    /**
     * You can listen for this event from the LoaderPlugin. It is dispatched only once per
     * file and you have to use a special listener handle to pick it up.
     * 
     * The string of the event is based on the file type and the key you gave it, split up
     * using hyphens.
     * 
     * For example, if you have loaded an image with a key of `monster`, you can listen for it
     * using the following:
     *
     * ```javascript
     * this.load.on('filecomplete-image-monster', function (key, type, data) {
     *     // Your handler code
     * });
     * ```
     *
     * Or, if you have loaded a texture atlas with a key of `Level1`:
     * 
     * ```javascript
     * this.load.on('filecomplete-atlas-Level1', function (key, type, data) {
     *     // Your handler code
     * });
     * ```
     * 
     * Or, if you have loaded a sprite sheet with a key of `Explosion` and a prefix of `GAMEOVER`:
     * 
     * ```javascript
     * this.load.on('filecomplete-spritesheet-GAMEOVERExplosion', function (key, type, data) {
     *     // Your handler code
     * });
     * ```
     * 
     * @event Phaser.Loader.File#singleFileCompleteEvent
     * @param {any} data - The data of the file.
     */

    /**
     * Called once the file has been added to its cache and is now ready for deletion from the Loader.
     * It will emit a `filecomplete` event from the LoaderPlugin.
     *
     * @method Phaser.Loader.File#pendingDestroy
     * @fires Phaser.Loader.File#fileCompleteEvent
     * @fires Phaser.Loader.File#singleFileCompleteEvent
     * @since 3.7.0
     */
    pendingDestroy: function (data)
    {
        if (data === undefined) { data = this.data; }

        var key = this.key;
        var type = this.type;

        this.loader.emit('filecomplete', key, type, data);
        this.loader.emit('filecomplete-' + type + '-' + key, key, type, data);

        this.loader.flagForRemoval(this);
    },

    /**
     * Destroy this File and any references it holds.
     *
     * @method Phaser.Loader.File#destroy
     * @since 3.7.0
     */
    destroy: function ()
    {
        this.loader = null;
        this.cache = null;
        this.xhrSettings = null;
        this.multiFile = null;
        this.linkFile = null;
        this.data = null;
    }

});

/**
 * Static method for creating object URL using URL API and setting it as image 'src' attribute.
 * If URL API is not supported (usually on old browsers) it falls back to creating Base64 encoded url using FileReader.
 *
 * @method Phaser.Loader.File.createObjectURL
 * @static
 * @param {HTMLImageElement} image - Image object which 'src' attribute should be set to object URL.
 * @param {Blob} blob - A Blob object to create an object URL for.
 * @param {string} defaultType - Default mime type used if blob type is not available.
 */
File.createObjectURL = function (image, blob, defaultType)
{
    if (typeof URL === 'function')
    {
        image.src = URL.createObjectURL(blob);
    }
    else
    {
        var reader = new FileReader();

        reader.onload = function ()
        {
            image.removeAttribute('crossOrigin');
            image.src = 'data:' + (blob.type || defaultType) + ';base64,' + reader.result.split(',')[1];
        };

        reader.onerror = image.onerror;

        reader.readAsDataURL(blob);
    }
};

/**
 * Static method for releasing an existing object URL which was previously created
 * by calling {@link File#createObjectURL} method.
 *
 * @method Phaser.Loader.File.revokeObjectURL
 * @static
 * @param {HTMLImageElement} image - Image object which 'src' attribute should be revoked.
 */
File.revokeObjectURL = function (image)
{
    if (typeof URL === 'function')
    {
        URL.revokeObjectURL(image.src);
    }
};

module.exports = File;
