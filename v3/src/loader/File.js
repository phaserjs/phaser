var GetURL = require('./GetURL');
var CONST = require('./const');
var XHRLoader = require('./XHRLoader');
var XHRSettings = require('./XHRSettings');
var MergeXHRSettings = require('./MergeXHRSettings');

var File = function (type, key, url, responseType, xhrSettings, config)
{
    //  file type (image, json, etc) for sorting within the Loader
    this.type = type;

    //  unique cache key (unique within its file type)
    this.key = key;

    //  The URL of the file, not including baseURL
    this.url = url;

    //  Set when the Loader calls 'load' on this file
    this.src = '';

    this.xhrSettings = XHRSettings(responseType);

    if (xhrSettings)
    {
        this.xhrSettings = MergeXHRSettings(this.xhrSettings, xhrSettings);
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
    this.config = config || {};

    //  Multipart file? (i.e. an atlas and its json together)
    this.linkFile = undefined;
    this.linkType = '';

    this.callback = null;
};

File.prototype.constructor = File;

File.prototype = {

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
};

module.exports = File;
