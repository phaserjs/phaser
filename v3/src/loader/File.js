var GetURL = require('./GetURL');
var FILE_CONST = require('./const');
var XHRLoader = require('./XHRLoader');
var XHRSettings = require('./XHRSettings');

var File = function (type, key, url, responseType)
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

    this.xhrLoader = null;

    this.state = FILE_CONST.PENDING;

    //  Set by onProgress
    this.bytesTotal = 0;
    this.bytesLoaded = -1;
    this.percentComplete = -1;

    //  For CORs based loading.
    //  If this is undefined then the File will check BaseLoader.crossOrigin and use that (if set)
    this.crossOrigin = undefined;

    //  The actual processed file data
    this.data = undefined;

    //  Multipart file? (i.e. an atlas and its json)
    this.multipart = undefined;
    this.linkFile = undefined;

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
        console.log('image loaded');
        console.log(event);

        // this.onStateChange(LOADING);

        this.resetXHR();

        this.callback(this, true);
    },

    onError: function (event)
    {
        console.log('image error');
        console.log(event);

        this.resetXHR();

        this.callback(this, false);
    },

    onProgress: function (event)
    {
        this.bytesLoaded = event.loaded;
        this.bytesTotal = event.total;

        this.percentComplete = Math.min((this.bytesLoaded / this.bytesTotal), 1);

        console.log(this.percentComplete + '% (' + this.bytesLoaded + ' bytes)');
    },

    onProcess: function ()
    {
        console.log('process the image');
    },

    onComplete: function ()
    {
        console.log('image completed and added to the loader store');
    },

    //  Called by the Loader, starts the actual file downloading
    load: function (callback, baseURL, globalXHR)
    {
        if (baseURL === undefined) { baseURL = ''; }

        this.callback = callback;

        this.src = GetURL(this, baseURL);

        console.log('LOADING2', this.src);

        this.xhrLoader = XHRLoader(this, globalXHR);
    }
};

module.exports = File;
