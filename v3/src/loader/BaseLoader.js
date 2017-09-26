
var CONST = require('./const');
var Set = require('../structs/Set');
var XHRSettings = require('./XHRSettings');
var Event = require('./events/');
// var EventDispatcher = require('../events/EventDispatcher');
var Class = require('../utils/Class');
var ParseXMLBitmapFont = require('../gameobjects/bitmaptext/ParseXMLBitmapFont');

//  Phaser.Loader.BaseLoader

//  To finish the loader ...
//  
//  3) Progress update

var BaseLoader = new Class({

    initialize:

    function BaseLoader (scene)
    {
        this.scene = scene;

        this.events = scene.sys.events;

        //  Move to a 'setURL' method?
        this.baseURL = '';
        this.path = '';

        //  Read from Game / Scene Config
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

        this.state = CONST.LOADER_IDLE;
    },

    setPath: function (path)
    {
        if (path.substr(-1) !== '/')
        {
            path = path.concat('/');
        }

        this.path = path;

        return this;
    },

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
        return (this.state === CONST.LOADER_LOADING || this.state === CONST.LOADER_PROCESSING);
    },

    //  Is the Loader ready to start a new load?
    isReady: function ()
    {
        return (this.state === CONST.LOADER_IDLE || this.state === CONST.LOADER_COMPLETE || this.state === CONST.LOADER_FAILED);
    },

    start: function ()
    {
        console.log('%s - BaseLoader start. Files to load: %d', this.scene.sys.settings.key, this.list.size);

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
            this.state = CONST.LOADER_LOADING;

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

        this.state = CONST.LOADER_PROCESSING;

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

        if (this.queue.size === 0 && this.state === CONST.LOADER_PROCESSING)
        {
            //  We've processed all the files we loaded
            this.processComplete();
        }
    },

    processComplete: function ()
    {
        console.log('%s - Loader Complete. Loaded: %d Failed: %d', this.scene.sys.settings.key, this.storage.size, this.failed.size);

        this.list.clear();
        this.inflight.clear();
        this.queue.clear();

        this.processCallback();

        this.state = CONST.LOADER_COMPLETE;

        this.events.dispatch(new Event.LOADER_COMPLETE_EVENT(this));
    },

    //  The Loader has finished
    processCallback: function ()
    {
        if (this.storage.size === 0)
        {
            return;
        }

        //  The global Texture Manager
        var cache = this.scene.sys.cache;
        var textures = this.scene.sys.textures;
        var anims = this.scene.sys.anims;

        //  Process multiatlas groups first

        var file;
        var fileA;
        var fileB;

        for (var key in this._multilist)
        {
            var data = [];
            var images = [];
            var keys = this._multilist[key];

            for (var i = 0; i < keys.length; i++)
            {
                file = this.storage.get('key', keys[i]);

                if (file)
                {
                    if (file.type === 'image')
                    {
                        images.push(file.data);
                    }
                    else if (file.type === 'json')
                    {
                        data.push(file.data);
                    }

                    this.storage.delete(file);
                }
            }

            //  Do we have everything needed?
            if (images.length + data.length === keys.length)
            {
                //  Yup, add them to the Texture Manager

                //  Is the data JSON Hash or JSON Array?
                if (Array.isArray(data[0].frames))
                {
                    textures.addAtlasJSONArray(key, images, data);
                }
                else
                {
                    textures.addAtlasJSONHash(key, images, data);
                }
            }
        }

        //  Process all of the files

        //  Because AnimationJSON may require images to be loaded first, we process them last
        var animJSON = [];

        this.storage.each(function (file)
        {
            switch (file.type)
            {
                case 'animationJSON':
                    animJSON.push(file);
                    break;

                case 'image':
                case 'svg':
                case 'html':
                    textures.addImage(file.key, file.data);
                    break;

                case 'atlasjson':

                    fileA = file.fileA;
                    fileB = file.fileB;

                    if (fileA.type === 'image')
                    {
                        textures.addAtlas(fileA.key, fileA.data, fileB.data);
                    }
                    else
                    {
                        textures.addAtlas(fileB.key, fileB.data, fileA.data);
                    }
                    break;

                case 'unityatlas':

                    fileA = file.fileA;
                    fileB = file.fileB;

                    if (fileA.type === 'image')
                    {
                        textures.addUnityAtlas(fileA.key, fileA.data, fileB.data);
                    }
                    else
                    {
                        textures.addUnityAtlas(fileB.key, fileB.data, fileA.data);
                    }
                    break;

                case 'bitmapfont':

                    fileA = file.fileA;
                    fileB = file.fileB;

                    if (fileA.type === 'image')
                    {
                        cache.bitmapFont.add(fileB.key, { data: ParseXMLBitmapFont(fileB.data), texture: fileA.key, frame: null });
                        textures.addImage(fileA.key, fileA.data);
                    }
                    else
                    {
                        cache.bitmapFont.add(fileA.key, { data: ParseXMLBitmapFont(fileA.data), texture: fileB.key, frame: null });
                        textures.addImage(fileB.key, fileB.data);
                    }
                    break;

                case 'spritesheet':
                    textures.addSpriteSheet(file.key, file.data, file.config);
                    break;

                case 'json':
                    cache.json.add(file.key, file.data);
                    break;

                case 'xml':
                    cache.xml.add(file.key, file.data);
                    break;

                case 'text':
                    cache.text.add(file.key, file.data);
                    break;

                case 'binary':
                    cache.binary.add(file.key, file.data);
                    break;

                case 'sound':
                    cache.sound.add(file.key, file.data);
                    break;

                case 'glsl':
                    cache.shader.add(file.key, file.data);
                    break;
            }
        });

        animJSON.forEach(function (file)
        {
            anims.fromJSON(file.data);
        });

        this.storage.clear();
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

        this.state = CONST.LOADER_IDLE;
    },

    destroy: function ()
    {
        this.reset();
        this.state = CONST.LOADER_DESTROYED;
    }

});

module.exports = BaseLoader;
