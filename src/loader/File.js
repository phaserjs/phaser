var Class = require('../utils/Class');
var CONST = require('./const');
var GetFastValue = require('../utils/object/GetFastValue');
var GetURL = require('./GetURL');
var MergeXHRSettings = require('./MergeXHRSettings');
var XHRLoader = require('./XHRLoader');
var XHRSettings = require('./XHRSettings');

var File = new Class({

    initialize:

    // old signature: type, key, url, responseType, xhrSettings, config
    /**
     * [description]
     *
     * @class File
     * @memberOf Phaser.Loader
     * @constructor
     * @since 3.0.0
     *
     * @param {object} fileConfig - [description]
     */
    function File (fileConfig)
    {
        /**
         * The file type (image, json, etc) for sorting within the Loader.
         *
         * @property {string} type
         * @since 3.0.0
         */
        this.type = GetFastValue(fileConfig, 'type', false);

        /**
         * Unique cache key (unique within its file type)
         *
         * @property {string} key
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
         * @property {string} url
         * @since 3.0.0
         */
        this.url = GetFastValue(fileConfig, 'url');

        if (this.url === undefined)
        {
            this.url = GetFastValue(fileConfig, 'path', '') + this.key + '.' + GetFastValue(fileConfig, 'extension', '');
        }
        else
        {
            this.url = GetFastValue(fileConfig, 'path', '').concat(this.url);
        }

        /**
         * Set when the Loader calls 'load' on this file.
         *
         * @property {string} src
         * @default ''
         * @since 3.0.0
         */
        this.src = '';

        /**
         * [description]
         *
         * @property {object} xhrSettings
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
         * @property {Phaser.Loader.LoaderPlugin} loader
         * @default null
         * @since 3.0.0
         */
        this.loader = null;

        /**
         * [description]
         *
         * @property {Phaser.Loader.XHRLoader} xhrLoader
         * @default null
         * @since 3.0.0
         */
        this.xhrLoader = null;

        /**
         * [description]
         *
         * @property {integer} state
         * @since 3.0.0
         */
        this.state = CONST.FILE_PENDING;

        /**
         * Set by onProgress (only if loading via XHR)
         *
         * @property {number} bytesTotal
         * @default 0
         * @since 3.0.0
         */
        this.bytesTotal = 0;

        /**
         * [description]
         *
         * @property {number} bytesLoaded
         * @default -1
         * @since 3.0.0
         */
        this.bytesLoaded = -1;

        /**
         * [description]
         *
         * @property {float} percentComplete
         * @default -1
         * @since 3.0.0
         */
        this.percentComplete = -1;

        /**
         * For CORs based loading.
         * If this is undefined then the File will check BaseLoader.crossOrigin and use that (if set)
         *
         * @property {string|undefined} crossOrigin
         * @since 3.0.0
         */
        this.crossOrigin = undefined;

        /**
         * The processed file data, stored in here after the file has loaded.
         *
         * @property {any} data
         * @since 3.0.0
         */
        this.data = undefined;

        /**
         * A config object that can be used by file types to store transitional data.
         *
         * @property {[type]} config
         * @since 3.0.0
         */
        this.config = GetFastValue(fileConfig, 'config', {});

        /**
         * Multipart file? i.e. an atlas and its json together.
         *
         * @property {?Phaser.Loader.File} linkFile
         * @since 3.0.0
         */
        this.linkFile = undefined;

        /**
         * [description]
         *
         * @property {string} linkType
         * @default ''
         * @since 3.0.0
         */
        this.linkType = '';

        /**
         * [description]
         *
         * @property {boolean} linkParent
         * @default false
         * @since 3.0.0
         */
        this.linkParent = false;
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.File#setLinkFile
     * @since 3.0.0
     * 
     * @param {Phaser.Loader.File} fileB - [description]
     * @param {string} linkType - [description]
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
     * [description]
     *
     * @method Phaser.Loader.File#resetXHR
     * @since 3.0.0
     */
    resetXHR: function ()
    {
        this.xhrLoader.onload = undefined;
        this.xhrLoader.onerror = undefined;
        this.xhrLoader.onprogress = undefined;
    },

    /**
     * Called by the Loader, starts the actual file downloading.
     * During the load the methods onLoad, onProgress, etc are called based on the XHR events.
     *
     * @method Phaser.Loader.File#load
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - [description]
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
                console.log('Local data URI');
            }
            else
            {
                this.xhrLoader = XHRLoader(this, loader.xhr);
            }
        }
    },

    /**
     * Called when the file finishes loading, is sent a DOM ProgressEvent
     *
     * @method Phaser.Loader.File#onLoad
     * @since 3.0.0
     *
     * @param {ProgressEvent} event - [description]
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

    //  
    /**
     * Called if the file errors while loading, is sent a DOM ProgressEvent
     *
     * @method Phaser.Loader.File#onError
     * @since 3.0.0
     *
     * @param {ProgressEvent} event - [description]
     */
    onError: function (event)
    {
        this.resetXHR();

        this.loader.nextFile(this, false);
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.File#onProgress
     * @since 3.0.0
     *
     * @param {[type]} event - [description]
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
     * Usually overriden by the FileTypes and is called by Loader.finishedLoading.
     * The callback is Loader.processUpdate
     *
     * @method Phaser.Loader.File#onProcess
     * @since 3.0.0
     *
     * @param {[type]} callback - [description]
     */
    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.onComplete();

        callback(this);
    },

    /**
     * [description]
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
 * @method createObjectURL
 * @static
 * @param image {Image} Image object which 'src' attribute should be set to object URL.
 * @param blob {Blob} A Blob object to create an object URL for.
 * @param defaultType {string} Default mime type used if blob type is not available.
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
 * @method revokeObjectURL
 * @static
 * @param image {Image} Image object which 'src' attribute should be revoked.
 */
File.revokeObjectURL = function (image)
{
    if (typeof URL === 'function')
    {
        URL.revokeObjectURL(image.src);
    }
};

module.exports = File;
