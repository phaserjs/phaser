var Set = require('../structs/Set');
var XHRSettings = require('./XHRSettings');
// var ImageLoader = require('./filetypes/Image');

var Loader = function ()
{
    //  Move to a 'setURL' method?
    this.baseURL = '';
    this.path = '';

    //  Read from Game Config
    this.enableParallel = true;
    this.maxParallelDownloads = 8;

    //  xhr specific global settings (can be overridden on a per-file basis)
    this.xhr = XHRSettings();

    this.crossOrigin = undefined;

    this.list = new Set();
    this.inflight = new Set();
    this.failed = new Set();
    this.queue = new Set();
    this.storage = new Set();

    this._state = 'PENDING';
};

Loader.prototype.contructor = Loader;

Loader.prototype = {

    //  The File Loaders

    //  Add a File direct to the queue. Must extend File base object.
    add: function (file)
    {

    },

    //  Different images based on device-pixel ratio
    //  And maybe on screen resolution breakpoints

    image: function (key, url)
    {



        // return ImageLoader(this, key, url);
    }

};

module.exports = Loader;
