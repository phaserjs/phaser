var Class = require('../utils/Class');
var CONST = require('./const');
var CustomSet = require('../structs/Set');
var EventEmitter = require('eventemitter3');
var FileTypesManager = require('./FileTypesManager');
var GetFastValue = require('../utils/object/GetFastValue');
var ParseXMLBitmapFont = require('../gameobjects/bitmaptext/ParseXMLBitmapFont');
var PluginManager = require('../plugins/PluginManager');
var XHRSettings = require('./XHRSettings');

//  Phaser.Loader.LoaderPlugin

var LoaderPlugin = new Class({

    Extends: EventEmitter,

    initialize:

    function LoaderPlugin (scene)
    {
        EventEmitter.call(this);

        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        this._multilist = {};

        //  Inject the available filetypes into the Loader
        FileTypesManager.install(this);

        var gameConfig = this.systems.game.config;
        var sceneConfig = this.systems.settings.loader;

        this.path = '';
        this.baseURL = '';

        this.setBaseURL(GetFastValue(sceneConfig, 'baseURL', gameConfig.loaderBaseURL));
        this.setPath(GetFastValue(sceneConfig, 'path', gameConfig.loaderPath));

        this.enableParallel = GetFastValue(sceneConfig, 'enableParallel', gameConfig.loaderEnableParallel);
        this.maxParallelDownloads = GetFastValue(sceneConfig, 'maxParallelDownloads', gameConfig.loaderMaxParallelDownloads);

        //  xhr specific global settings (can be overridden on a per-file basis)
        this.xhr = XHRSettings(
            GetFastValue(sceneConfig, 'responseType', gameConfig.loaderResponseType),
            GetFastValue(sceneConfig, 'async', gameConfig.loaderAsync),
            GetFastValue(sceneConfig, 'user', gameConfig.loaderUser),
            GetFastValue(sceneConfig, 'password', gameConfig.loaderPassword),
            GetFastValue(sceneConfig, 'timeout', gameConfig.loaderTimeout)
        );

        this.crossOrigin = GetFastValue(sceneConfig, 'crossOrigin', gameConfig.loaderCrossOrigin);

        this.totalToLoad = 0;
        this.progress = 0;

        this.list = new CustomSet();
        this.inflight = new CustomSet();
        this.failed = new CustomSet();
        this.queue = new CustomSet();
        this.storage = new CustomSet();

        this.state = CONST.LOADER_IDLE;
    },

    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    setBaseURL: function (url)
    {
        if (url !== '' && url.substr(-1) !== '/')
        {
            url = url.concat('/');
        }

        this.baseURL = url;

        return this;
    },

    setPath: function (path)
    {
        if (path !== '' && path.substr(-1) !== '/')
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
        // console.log(this.scene.sys.settings.key, '- Loader start. Files to load:', this.list.size);

        if (!this.isReady())
        {
            return;
        }

        this.progress = 0;
        this.totalToLoad = this.list.size;

        this.emit('start', this);

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
        this.progress = 1 - (this.list.size / this.totalToLoad);

        // console.log(this.progress);

        this.emit('progress', this.progress);
    },

    processLoadQueue: function ()
    {
        // console.log('======== LoaderPlugin processLoadQueue');
        // console.log('List size', this.list.size);
        // console.log(this.inflight.size, 'items still in flight. Can load another', (this.maxParallelDownloads - this.inflight.size));

        this.list.each(function (file)
        {
            if (file.state === CONST.FILE_POPULATED || (file.state === CONST.FILE_PENDING && this.inflight.size < this.maxParallelDownloads))
            {
                this.inflight.set(file);

                this.list.delete(file);

                this.loadFile(file);
            }

            if (this.inflight.size === this.maxParallelDownloads)
            {
                //  Tells the Set iterator to abort
                return false;
            }

        }, this);
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

        file.load(this.nextFile.bind(this), this.baseURL, this.xhr);
    },

    nextFile: function (previousFile, success)
    {
        // console.log('LOADED:', previousFile.src, success);

        //  Move the file that just loaded from the inflight list to the queue or failed Set

        if (success)
        {
            this.emit('load', previousFile);
            this.queue.set(previousFile);
        }
        else
        {
            this.emit('loaderror', previousFile);
            this.failed.set(previousFile);
        }

        this.inflight.delete(previousFile);

        this.updateProgress();

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
        // console.log('---> LoaderPlugin.finishedLoading PROCESSING', this.queue.size, 'files');

        if (this.state === CONST.LOADER_PROCESSING)
        {
            return;
        }

        this.progress = 1;

        this.state = CONST.LOADER_PROCESSING;

        this.storage.clear();

        if (this.queue.size === 0)
        {
            //  Everything failed, so nothing to process
            this.processComplete();
        }
        else
        {
            this.queue.each(function (file)
            {
                // console.log('%c Calling process on ' + file.key, 'color: #000000; background: #ffff00;');
                file.onProcess(this.processUpdate.bind(this));
            }, this);
        }
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
        // console.log(this.scene.sys.settings.key, '- Loader Complete. Loaded:', this.storage.size, 'Failed:', this.failed.size);

        this.list.clear();
        this.inflight.clear();
        this.queue.clear();

        this.processCallback();

        this.state = CONST.LOADER_COMPLETE;

        this.emit('complete', this, this.storage.size, this.failed.size);
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

                case 'obj':
                    cache.obj.add(file.key, file.data);
                    break;

                case 'binary':
                    cache.binary.add(file.key, file.data);
                    break;

                case 'audio':
                    cache.audio.add(file.key, file.data);
                    break;

                case 'audioSprite':

                    var files = [ file.fileA, file.fileB ];

                    files.forEach(function (file)
                    {
                        cache[file.type].add(file.key, file.data);
                    });

                    break;

                case 'glsl':
                    cache.shader.add(file.key, file.data);
                    break;

                case 'tilemapCSV':
                case 'tilemapJSON':
                    cache.tilemap.add(file.key, { format: file.tilemapFormat, data: file.data });
                    break;
            }
        });

        animJSON.forEach(function (file)
        {
            anims.fromJSON(file.data);
        });

        this.storage.clear();
    },

    saveJSON: function (data, filename)
    {
        return this.save(JSON.stringify(data), filename);
    },

    save: function (data, filename, filetype)
    {
        if (filename === undefined) { filename = 'file.json'; }
        if (filetype === undefined) { filetype = 'application/json'; }

        var blob = new Blob([ data ], { type: filetype });

        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');

        a.download = filename;
        a.textContent = 'Download ' + filename;
        a.href = url;
        a.click();

        return this;
    },

    reset: function ()
    {
        this.list.clear();
        this.inflight.clear();
        this.failed.clear();
        this.queue.clear();
        this.storage.clear();

        this.removeAllListeners('start');
        this.removeAllListeners('load');
        this.removeAllListeners('loaderror');
        this.removeAllListeners('complete');

        var gameConfig = this.systems.game.config;
        var sceneConfig = this.systems.settings.loader;

        this.setBaseURL(GetFastValue(sceneConfig, 'baseURL', gameConfig.loaderBaseURL));
        this.setPath(GetFastValue(sceneConfig, 'path', gameConfig.loaderPath));

        this.state = CONST.LOADER_IDLE;
    },

    shutdown: function ()
    {
        this.reset();
        this.state = CONST.LOADER_SHUTDOWN;
    },

    destroy: function ()
    {
        this.reset();
        this.state = CONST.LOADER_DESTROYED;
    }

});

PluginManager.register('Loader', LoaderPlugin, 'load');

module.exports = LoaderPlugin;
