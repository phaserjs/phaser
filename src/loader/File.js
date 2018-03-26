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
 * @callback FileProcessCallback
 *
 * @param {Phaser.Loader.File} file - [description]
 */

/**
 * @typedef {object} FileConfig
 *
 * @property {(string|false)} [type=false] - The file type string (image, json, etc) for sorting within the Loader.
 * @property {(string|false)} [key=false] - Unique cache key (unique within its file type)
 * @property {string} [url] - The URL of the file, not including baseURL.
 * @property {string} [path=''] - [description]
 * @property {string} [extension=''] - [description]
 * @property {XMLHttpRequestResponseType} [responseType] - [description]
 * @property {(XHRSettingsObject|false)} [xhrSettings=false] - [description]
 * @property {object} [config] - A config object that can be used by file types to store transitional data.
 */

/**
 * @classdesc
 * [description]
 *
 * @class File
 * @memberOf Phaser.Loader
 * @constructor
 * @since 3.0.0
 *
 * @param {FileConfig} fileConfig - [description]
 */
var File = new Class({

    initialize:

    function File (fileConfig)
    {
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

        if (!this.type || !this.key)
        {
            throw new Error('Error calling \'Loader.' + this.type + '\' invalid key provided.');
        }

        /**
         * The URL of the file, not including baseURL.
         *
         * @name Phaser.Loader.File#url
         * @type {string}
         * @since 3.0.0
         */
        this.url = GetFastValue(fileConfig, 'url');

        if (this.url === undefined)
        {
            this.url = GetFastValue(fileConfig, 'path', '') + this.key + '.' + GetFastValue(fileConfig, 'extension', '');
        }
        else if (typeof(this.url) !== 'function')
        {
            this.url = GetFastValue(fileConfig, 'path', '').concat(this.url);
        }

        /**
         * Set when the Loader calls 'load' on this file.
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
         * The LoaderPlugin instance that is loading this file.
         *
         * @name Phaser.Loader.File#loader
         * @type {?Phaser.Loader.LoaderPlugin}
         * @since 3.0.0
         */
        this.loader = null;

        /**
         * The XHR Loader instance that is loading this File.
         *
         * @name Phaser.Loader.File#xhrLoader
         * @type {?Phaser.Loader.XHRLoader}
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
        this.state = typeof(this.url) === 'function' ? CONST.FILE_POPULATED : CONST.FILE_PENDING;

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
         * @type {float}
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
         * The processed file data, stored in here after the file has loaded.
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
         * @type {object}
         * @since 3.0.0
         */
        this.config = GetFastValue(fileConfig, 'config', {});

        /**
         * If this is a multipart file, i.e. an atlas and its json together, then this is a reference
         * to the linked file. Set and used internally by the Loader.
         *
         * @name Phaser.Loader.File#linkFile
         * @type {?Phaser.Loader.File}
         * @since 3.0.0
         */
        this.linkFile = undefined;

        /**
         * If this is a multipart file, i.e. an atlas and its json together, then this is a reference
         * to the type of linked association. Set and used internally by the Loader.
         *
         * @name Phaser.Loader.File#linkType
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.linkType = '';

        /**
         * If this is a link file, is this the parent or the sibbling?
         *
         * @name Phaser.Loader.File#linkParent
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.linkParent = false;
    },

    /**
     * If this is a multipart file, i.e. an atlas and its json together, then this is a reference
     * to the linked file. Set and used internally by the Loader.
     *
     * @method Phaser.Loader.File#setLinkFile
     * @since 3.0.0
     *
     * @param {Phaser.Loader.File} fileB - The linked file.
     * @param {string} linkType - The type of association.
     */
    setLinkFile: function (fileB, linkType)
    {
        this.linkFile = fileB;
        fileB.linkFile = this;

        this.linkType = linkType;
        fileB.linkType = linkType;

        this.linkParent = true;
    },

    /**
     * Resets the XHRLoader instance.
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
     * During the load the methods onLoad, onProgress, etc are called based on the XHR events.
     *
     * @method Phaser.Loader.File#load
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - The Loader that will load this File.
     */
    load: function (loader)
    {
        this.loader = loader;

        if (this.state === CONST.FILE_POPULATED)
        {
            this.onComplete();

            loader.nextFile(this);
        }
        else
        {
            this.src = GetURL(this, loader.baseURL);

            if (this.src.indexOf('data:') === 0)
            {
                console.warn('Local data URIs are not supported: ' + this.key);
            }
            else
            {
                this.xhrLoader = XHRLoader(this, loader.xhr);
            }
        }
    },

    /**
     * Called when the file finishes loading, is sent a DOM ProgressEvent.
     *
     * @method Phaser.Loader.File#onLoad
     * @since 3.0.0
     *
     * @param {ProgressEvent} event - The DOM ProgressEvent that resulted from this load.
     */
    onLoad: function (event)
    {
        this.resetXHR();

        if (event.target && event.target.status !== 200)
        {
            this.loader.nextFile(this, false);
        }
        else
        {
            this.loader.nextFile(this, true);
        }
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

            // console.log(this.percentComplete + '% (' + this.bytesLoaded + ' bytes)');
            this.loader.emit('fileprogress', this, this.percentComplete);
        }
    },

    /**
     * Usually overridden by the FileTypes and is called by Loader.finishedLoading.
     * The callback is Loader.processUpdate
     *
     * @method Phaser.Loader.File#onProcess
     * @since 3.0.0
     *
     * @param {FileProcessCallback} callback - The callback to invoke to process this File.
     */
    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.onComplete();

        callback(this);
    },

    /**
     * Called with the File has completed loading.
     * Checks on the state of its linkfile, if set.
     *
     * @method Phaser.Loader.File#onComplete
     * @since 3.0.0
     */
    onComplete: function ()
    {
        if (this.linkFile)
        {
            if (this.linkFile.state === CONST.FILE_WAITING_LINKFILE)
            {
                //  The linkfile has finished processing, and is waiting for this file, so let's do them both
                this.state = CONST.FILE_COMPLETE;
                this.linkFile.state = CONST.FILE_COMPLETE;
            }
            else
            {
                //  The linkfile still hasn't finished loading and/or processing yet
                this.state = CONST.FILE_WAITING_LINKFILE;
            }
        }
        else
        {
            this.state = CONST.FILE_COMPLETE;
        }
    }

});

/**
 * Static method for creating object URL using URL API and setting it as image 'src' attribute.
 * If URL API is not supported (usually on old browsers) it falls back to creating Base64 encoded url using FileReader.
 *
 * @method Phaser.Loader.File.createObjectURL
 * @static
 * @param {Image} image - Image object which 'src' attribute should be set to object URL.
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
 * @param {Image} image - Image object which 'src' attribute should be revoked.
 */
File.revokeObjectURL = function (image)
{
    if (typeof URL === 'function')
    {
        URL.revokeObjectURL(image.src);
    }
};

module.exports = File;
