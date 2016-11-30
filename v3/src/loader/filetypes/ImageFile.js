var FILE_CONST = require('../const');
var XHRSettings = require('../XHRSettings');
var XHRLoader = require('../XHRLoader');

var getURL = function (file, baseURL)
{
    if (!file.url)
    {
        return false;
    }

    if (file.url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/))
    {
        return file.url;
    }
    else
    {
        return baseURL + file.path + file.url;
    }
};

//  Different images based on device-pixel ratio
//  And maybe on screen resolution breakpoints

//  2 options - can either return the File object, so they can listen to it specifically
//  Or can return the Loader, so they can chain calls?

var ImageFile = function (key, url, path)
{
    //  Following can probably be put into a function somewhere

    if (path === undefined)
    {
        path = '';
    }

    if (!key)
    {
        console.warn('Loader: You tried to load an Image, but no key was given');
        return;
    }

    if (!url)
    {
        url = key + '.png';
    }

    //  Belongs to a Loader instance - if we remove this requirement
    //  then the file could be self-loading, and never actually need a Loader
    // this.loader = loader;

    this.type = 'image'; // internal file type (move to a const?)
    this.key = key; // unique cache key
    this.url = url; // The path to just the file, not including base url or pre-set path
    this.path = path; // Set when the file is created by the Loader
    this.src = ''; // Set when the Loader calls 'load' on this file

    this.xhr = XHRSettings('arraybuffer');
    this.xhrLoader = null;

    this.state = FILE_CONST.PENDING;

    //  Set by XHR
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

    // After a successful request, the xhr.response property will contain the 
    // requested data as a DOMString, ArrayBuffer, Blob, or Document (depending on 
    // what was set for responseType.)

    this._callback = null;

    //  Called when the Image loads

    //  ProgressEvent
    this.onLoad = function (event)
    {
        console.log('image loaded');
        console.log(arguments);

        this.xhrLoader.onload = undefined;
        this.xhrLoader.onerror = undefined;
        this.xhrLoader.onprogress = undefined;

        if (this._callback)
        {
            this._callback(this, true);
        }
    };

    this.onError = function ()
    {
        console.log('error');
        console.log(arguments);

        this.xhrLoader.onload = undefined;
        this.xhrLoader.onerror = undefined;
        this.xhrLoader.onprogress = undefined;

        if (this._callback)
        {
            this._callback(this, false);
        }
    };

    this.onProgress = function (event)
    {
        this.bytesLoaded = event.loaded;
        this.bytesTotal = event.total;

        this.percentComplete = Math.min((this.bytesLoaded / this.bytesTotal), 1);

        console.log(this.percentComplete + '% (' + this.bytesLoaded + ' bytes)');
    };

    this.onProcess = function ()
    {
        console.log('process the image');
    };

    this.processCallback = null;

    this.onComplete = function ()
    {
        console.log('image completed and added to the loader store');
    };

    //  Called by the Loader, starts the actual file downloading
    this.load = function (callback, baseURL, globalXHR)
    {
        if (baseURL === undefined) { baseURL = ''; }

        this._callback = callback;

        this.src = getURL(this, baseURL);

        console.log('LOADING2', this.src);

        this.xhrLoader = XHRLoader(this, globalXHR);
    };

};

module.exports = ImageFile;
