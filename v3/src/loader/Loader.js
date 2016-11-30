var Set = require('../structs/Set');
var XHRSettings = require('./XHRSettings');

var Loader = function ()
{
    //  Move to a 'setURL' method
    this.baseURL = '';
    this.path = '';

    this.tag = '';

    this.enableParallel = true;

    this.maxParallelDownloads = 4;

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

    add: function ()
    {
        
    }

};

module.exports = Loader;
