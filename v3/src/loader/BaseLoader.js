
var CONST = require('./const');
var Set = require('../structs/Set');
var XHRSettings = require('./XHRSettings');
var Event = require('./events/');
var EventDispatcher = require('../events/EventDispatcher');

var BaseLoader = function ()
{
    //  To finish the loader ...
    //  
    //  3) Progress update

    this.events = new EventDispatcher();

    //  Move to a 'setURL' method?
    this.baseURL = '';
    this.path = '';

    //  Read from Game / State Config
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

    this._state = CONST.LOADER_IDLE;
};

BaseLoader.prototype.contructor = BaseLoader;

BaseLoader.prototype = {

    addFile: function (file)
    {
        if (!this.isReady())
        {
            return -1;
        }

        file.path = this.path;

        this.list.set(file);

        return this;
    },

    //  Is the Loader actively loading (or processing loaded files)
    isLoading: function ()
    {
        return (this._state === CONST.LOADER_LOADING || this._state === CONST.LOADER_PROCESSING);
    },

    //  Is the Loader ready to start a new load?
    isReady: function ()
    {
        return (this._state === CONST.LOADER_IDLE || this._state === CONST.LOADER_COMPLETE || this._state === CONST.LOADER_FAILED);
    },

    start: function ()
    {
        console.log(this.state.settings.key, '- BaseLoader start. Files to load:', this.list.size);

        if (!this.isReady())
        {
            return;
        }

        this.events.dispatch(new Event.LOADER_START_EVENT(this));

        if (this.list.size === 0)
        {
            this.finishedLoading();
        }
        else
        {
            this._state = CONST.LOADER_LOADING;

            this.failed.clear();
            this.inflight.clear();
            this.queue.clear();

            this.queue.debug = true;

            this.updateProgress();

            this.processLoadQueue();
        }
    },

    updateProgress: function ()
    {

    },

    processLoadQueue: function ()
    {
        // console.log('======== BaseLoader processLoadQueue');
        // console.log('List size', this.list.size);
        // console.log(this.inflight.size, 'items still in flight. Can load another', (this.maxParallelDownloads - this.inflight.size));

        var _this = this;

        this.list.each(function (file)
        {
            if (file.state === CONST.FILE_PENDING && _this.inflight.size < _this.maxParallelDownloads)
            {
                _this.inflight.set(file);

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
        // console.log('LOADING', file.key);

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
        // console.log('LOADED:', previousFile.src, success);

        //  Move the file that just loaded from the inflight list to the queue or failed Set

        if (success)
        {
            this.queue.set(previousFile);
        }
        else
        {
            this.failed.set(previousFile);
        }

        this.inflight.delete(previousFile);

        if (this.list.size > 0)
        {
            // console.log('nextFile - still something in the list');
            this.processLoadQueue();
        }
        else if (this.inflight.size === 0)
        {
            // console.log('nextFile calling finishedLoading');
            this.finishedLoading();
        }
    },

    finishedLoading: function ()
    {
        // console.log('---> BaseLoader.finishedLoading PROCESSING', this.queue.size, 'files');

        this._state = CONST.LOADER_PROCESSING;

        this.storage.clear();

        var _this = this;

        this.queue.each(function (file)
        {
            // console.log('%c Calling process on ' + file.key, 'color: #000000; background: #ffff00;');

            file.onProcess(_this.processUpdate.bind(_this));
        });
    },

    //  Called automatically by the File when it has finished processing
    processUpdate: function (file)
    {
        // console.log('-> processUpdate', file.key, file.state);

        //  This file has failed to load, so move it to the failed Set
        if (file.state === CONST.FILE_ERRORED)
        {
            this.failed.set(file);

            if (file.linkFile)
            {
                this.queue.delete(file.linkFile);
            }

            return this.removeFromQueue(file);
        }

        //  If we got here, then the file loaded

        //  Special handling for multi-part files

        if (file.linkFile)
        {
            if (file.state === CONST.FILE_COMPLETE && file.linkFile.state === CONST.FILE_COMPLETE)
            {
                //  Partner has loaded, so add them both to Storage

                this.storage.set({ type: file.linkType, fileA: file, fileB: file.linkFile });

                this.queue.delete(file.linkFile);

                this.removeFromQueue(file);
            }
        }
        else
        {
            this.storage.set(file);

            this.removeFromQueue(file);
        }
    },

    removeFromQueue: function (file)
    {
        this.queue.delete(file);

        if (this.queue.size === 0 && this._state === CONST.LOADER_PROCESSING)
        {
            //  We've processed all the files we loaded
            this.processComplete();
        }
    },

    processComplete: function ()
    {
        console.log(this.state.settings.key, '- Loader Complete. Loaded:', this.storage.size, 'Failed:', this.failed.size);

        this.list.clear();
        this.inflight.clear();
        this.queue.clear();

        if (this.processCallback)
        {
            this.processCallback();
        }

        this._state = CONST.LOADER_COMPLETE;

        this.events.dispatch(new Event.LOADER_COMPLETE_EVENT(this));
    },

    reset: function ()
    {
        this.list.clear();
        this.inflight.clear();
        this.failed.clear();
        this.queue.clear();
        this.storage.clear();

        this.events.removeAll('LOADER_START_EVENT');
        this.events.removeAll('LOADER_COMPLETE_EVENT');

        this.tag = '';
        this.path = '';
        this.baseURL = '';

        this._state = CONST.LOADER_IDLE;
    },

    destroy: function ()
    {
        this.reset();
        this._state = CONST.LOADER_DESTROYED;
    }

};

module.exports = BaseLoader;
