
var FILE_CONST = require('./const');
var Set = require('../structs/Set');
var XHRSettings = require('./XHRSettings');
var Events = require('./events/');

var BaseLoader = function ()
{
    //  To finish the loader ...
    //  
    //  1) Image Tag loader
    //  2) Events (or Signals?) for the various stages
    //  3) Progress update
    //  4) JSON loader
    //  5) XML Loader
    //  6) Multi File support (atlas + data)
    //  7) Atlas Loader


    //  Move to a 'setURL' method?
    this.baseURL = '';
    this.path = '';

    //  Read from Game / State Config
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

BaseLoader.prototype.contructor = BaseLoader;

BaseLoader.prototype = {

    addFile: function (file)
    {
        if (!this.isReady())
        {
            return -1;
        }

        //  Multipart file?
        if (file.multipart)
        {
            file.fileA.path = this.path;
            file.fileB.path = this.path;

            this.list.add(file.fileA);
            this.list.add(file.fileB);
        }
        else
        {
            file.path = this.path;

            this.list.add(file);
        }

        return this;
    },

    //  Is the Loader actively loading (or processing loaded files)
    isLoading: function ()
    {
        return (this._state === 'LOADING' || this._state === 'PROCESSING');
    },

    //  Is the Loader ready to start a new load?
    isReady: function ()
    {
        return (this._state === 'PENDING' || this._state === 'COMPLETE' || this._state === 'FAILED');
    },

    start: function ()
    {
        console.log('BaseLoader start. Files to load:', this.list.size);

        if (!this.isReady())
        {
            return;
        }

        this.state.sys.events.dispatch(new Events.LOADER_START_EVENT(this));

        if (this.list.size === 0)
        {
            this.finishedLoading();
        }
        else
        {
            // this.state = LOADING;

            this.failed.clear();
            this.inflight.clear();
            this.queue.clear();

            this.updateProgress();

            this.processLoadQueue();
        }
    },

    updateProgress: function ()
    {

    },

    processLoadQueue: function ()
    {
        console.log('BaseLoader processLoadQueue', this.list.size);

        var _this = this;

        this.list.each(function (file)
        {
            if (file.state === FILE_CONST.PENDING && _this.inflight.size < _this.maxParallelDownloads)
            {
                console.log('ADDED TO QUEUE:', file.key);

                _this.inflight.add(file);

                _this.list.delete(file);

                _this.loadFile(file);
            }

            if (_this.inflight.size === _this.maxParallelDownloads)
            {
                //  Tells the Set iterator to abort
                return false;
            }

        });

    },

    //  private
    loadFile: function (file)
    {
        console.log('LOADING', file.key);

        //  If the file doesn't have its own crossOrigin set,
        //  we'll use the Loaders (which is undefined by default)
        if (!file.crossOrigin)
        {
            file.crossOrigin = this.crossOrigin;
        }

        file.load(this.nextFile.bind(this), this.baseURL);
    },

    nextFile: function (previousFile, success)
    {
        console.log('LOADED:', previousFile.src, success);

        //  Move the file that just loaded from the inflight list to the queue or failed Set

        if (success)
        {
            this.queue.add(previousFile);
        }
        else
        {
            this.failed.add(previousFile);
        }

        this.inflight.delete(previousFile);

        if (this.list.size > 0)
        {
            console.log('nextFile - still something in the list');
            this.processLoadQueue();
        }
        else if (this.inflight.size === 0)
        {
            console.log('nextFile calling finishedLoading');
            this.finishedLoading();
        }
    },

    finishedLoading: function ()
    {
        console.log('BaseLoader.finishedLoading PROCESSING');

        this.state = 'PROCESSING';

        var storage = this.storage;

        storage.clear();

        //  This could be Promise based as well, allowing for async processing

        this.queue.each(function (file)
        {
            file.onProcess();

            //  The File specific process handler has run
            //  Now run any custom callbacks
            if (file.processCallback)
            {
                file.processCallback(file);
            }

            file.onComplete();

            storage.add(file);
        });

        this.list.clear();
        this.inflight.clear();
        this.queue.clear();

        console.log('Loader Complete. Loaded:', storage.size, 'Failed:', this.failed.size);

        console.log('BaseLoader COMPLETE');

        this.state = 'COMPLETE';

        //  Dispatch 'on complete' signals now
    },

    getLoadedFiles (group = '', output = []) {

        var output = [];

        //  Return an array of all files that have state = COMPLETE (which means loaded + processed)

        for (let file of this.storage)
        {
            if (file.state === FILE.COMPLETE && file.tag === group && (type !== '' && file.type === type))
            {
                output.push(file);
            }
        }

        return output;

    },

    reset: function ()
    {
        this.list.clear();
        this.inflight.clear();
        this.failed.clear();
        this.queue.clear();
        this.storage.clear();

        this.tag = '';
        this.path = '';
        this.baseURL = '';

        this.state = 'PENDING';
    },

    destroy: function ()
    {
        this.reset();
        this.state = 'DESTROYED';
    }

};

module.exports = BaseLoader;
