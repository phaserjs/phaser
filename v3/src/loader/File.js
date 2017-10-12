var Class = require('../utils/Class');
var GetFastValue = require('../utils/object/GetFastValue');
var CONST = require('./const');
var GetURL = require('./GetURL');
var MergeXHRSettings = require('./MergeXHRSettings');
var XHRLoader = require('./XHRLoader');
var XHRSettings = require('./XHRSettings');

//  Phaser.Loader.File

var File = new Class({

    initialize:

    // old signature: type, key, url, responseType, xhrSettings, config
    function File (fileConfig)
    {
        //  file type (image, json, etc) for sorting within the Loader
        this.type = GetFastValue(fileConfig, 'type', false);

        //  unique cache key (unique within its file type)
        this.key = GetFastValue(fileConfig, 'key', false);

        if (!this.type || !this.key)
        {
            throw new Error('Error calling \'Loader.' + this.type + '\' invalid key provided.');
        }

        //  The URL of the file, not including baseURL
        this.url = GetFastValue(fileConfig, 'url');

        if (this.url === undefined)
        {
            this.url = GetFastValue(fileConfig, 'path', '') + this.key + '.' + GetFastValue(fileConfig, 'extension', '');
        }
        else
        {
            this.url = GetFastValue(fileConfig, 'path', '').concat(this.url);
        }

        //  Set when the Loader calls 'load' on this file
        this.src = '';

        this.xhrSettings = XHRSettings(GetFastValue(fileConfig, 'responseType', undefined));

        if (GetFastValue(fileConfig, 'xhrSettings', false))
        {
            this.xhrSettings = MergeXHRSettings(this.xhrSettings, GetFastValue(fileConfig, 'xhrSettings', {}));
        }

        this.xhrLoader = null;

        this.state = CONST.FILE_PENDING;

        //  Set by onProgress (only if loading via XHR)
        this.bytesTotal = 0;
        this.bytesLoaded = -1;
        this.percentComplete = -1;

        //  For CORs based loading.
        //  If this is undefined then the File will check BaseLoader.crossOrigin and use that (if set)
        this.crossOrigin = undefined;

        //  The actual processed file data
        this.data = undefined;

        //  A config object that can be used by file types to store transitional data
        this.config = GetFastValue(fileConfig, 'config', {});

        //  Multipart file? (i.e. an atlas and its json together)
        this.linkFile = undefined;
        this.linkType = '';

        this.callback = null;
    },

    resetXHR: function ()
    {
        this.xhrLoader.onload = undefined;
        this.xhrLoader.onerror = undefined;
        this.xhrLoader.onprogress = undefined;
    },

    //  Called when the Image loads
    //  ProgressEvent
    onLoad: function (event)
    {
        this.resetXHR();

        this.callback(this, true);
    },

    onError: function (event)
    {
        this.resetXHR();

        this.callback(this, false);
    },

    onProgress: function (event)
    {
        if (event.lengthComputable)
        {
            this.bytesLoaded = event.loaded;
            this.bytesTotal = event.total;

            this.percentComplete = Math.min((this.bytesLoaded / this.bytesTotal), 1);
        }

        // console.log(this.percentComplete + '% (' + this.bytesLoaded + ' bytes)');
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        this.onComplete();

        callback(this);
    },

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
    },

    //  Called by the Loader, starts the actual file downloading
    load: function (callback, baseURL, globalXHR)
    {
        if (baseURL === undefined) { baseURL = ''; }

        this.callback = callback;

        this.src = GetURL(this, baseURL);

        if (this.src.indexOf('data:') === 0)
        {
            console.log('Local data URI');
        }
        else
        {
            this.xhrLoader = XHRLoader(this, globalXHR);
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
    if(URL)
    {
        image.src = URL.createObjectURL(blob);
    }
    else
    {
        var reader = new FileReader();

        reader.onload = function()
        {
            delete image.crossOrigin;
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
    if(URL)
    {
        URL.revokeObjectURL(image.src);
    }
};

module.exports = File;
