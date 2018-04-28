/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var CustomSet = require('../structs/Set');
var EventEmitter = require('eventemitter3');
var FileTypesManager = require('./FileTypesManager');
var GetFastValue = require('../utils/object/GetFastValue');
var PluginManager = require('../boot/PluginManager');
var XHRSettings = require('./XHRSettings');

/**
 * @typedef {object} LinkFileObject
 *
 * @property {string} type - [description]
 * @property {Phaser.Loader.File} fileA - [description]
 * @property {Phaser.Loader.File} fileB - [description]
 */

/**
 * @typedef {object} LoaderFileObject
 *
 * @property {string} key - [description]
 * @property {string} type - [description]
 * @property {string} [url] - [description]
 * @property {string[]} [urls] - [description]
 * @property {string} [textureURL] - [description]
 * @property {string} [atlasURL] - [description]
 * @property {string} [xmlURL] - [description]
 * @property {string[]} [textureURLs] - [description]
 * @property {string[]} [atlasURLs] - [description]
 * @property {object} [config] - [description]
 * @property {object} [json] - [description]
 * @property {XHRSettingsObject} [xhrSettings] - [description]
 * @property {XHRSettingsObject} [textureXhrSettings] - [description]
 * @property {XHRSettingsObject} [atlasXhrSettings] - [description]
 * @property {XHRSettingsObject} [xmlXhrSettings] - [description]
 * @property {XHRSettingsObject} [audioXhrSettings] - [description]
 * @property {XHRSettingsObject} [jsonXhrSettings] - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class LoaderPlugin
 * @extends Phaser.Events.EventEmitter
 * @memberOf Phaser.Loader
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var LoaderPlugin = new Class({

    Extends: EventEmitter,

    initialize:

    function LoaderPlugin (scene)
    {
        EventEmitter.call(this);

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * A reference to the global Cache Manager.
         *
         * @name Phaser.Loader.LoaderPlugin#cacheManager
         * @type {Phaser.Cache.CacheManager}
         * @since 3.7.0
         */
        this.cacheManager = scene.sys.cache;

        /**
         * A reference to the global Texture Manager.
         *
         * @name Phaser.Loader.LoaderPlugin#textureManager
         * @type {Phaser.Textures.TextureManager}
         * @since 3.7.0
         */
        this.textureManager = scene.sys.textures;

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#_multilist
         * @type {object}
         * @private
         * @default {}
         * @since 3.0.0
         */
        // this._multilist = {};

        //  Inject the available filetypes into the Loader
        FileTypesManager.install(this);

        var gameConfig = this.systems.game.config;
        var sceneConfig = this.systems.settings.loader;

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#path
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.path = '';

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#baseURL
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.baseURL = '';

        this.setBaseURL(GetFastValue(sceneConfig, 'baseURL', gameConfig.loaderBaseURL));

        this.setPath(GetFastValue(sceneConfig, 'path', gameConfig.loaderPath));

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#enableParallel
         * @type {boolean}
         * @since 3.0.0
         */
        this.enableParallel = GetFastValue(sceneConfig, 'enableParallel', gameConfig.loaderEnableParallel);

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#maxParallelDownloads
         * @type {integer}
         * @since 3.0.0
         */
        this.maxParallelDownloads = GetFastValue(sceneConfig, 'maxParallelDownloads', gameConfig.loaderMaxParallelDownloads);

        /**
         * xhr specific global settings (can be overridden on a per-file basis)
         *
         * @name Phaser.Loader.LoaderPlugin#xhr
         * @type {XHRSettingsObject}
         * @since 3.0.0
         */
        this.xhr = XHRSettings(
            GetFastValue(sceneConfig, 'responseType', gameConfig.loaderResponseType),
            GetFastValue(sceneConfig, 'async', gameConfig.loaderAsync),
            GetFastValue(sceneConfig, 'user', gameConfig.loaderUser),
            GetFastValue(sceneConfig, 'password', gameConfig.loaderPassword),
            GetFastValue(sceneConfig, 'timeout', gameConfig.loaderTimeout)
        );

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#crossOrigin
         * @type {string}
         * @since 3.0.0
         */
        this.crossOrigin = GetFastValue(sceneConfig, 'crossOrigin', gameConfig.loaderCrossOrigin);

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#totalToLoad
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalToLoad = 0;

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#progress
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#list
         * @type {Phaser.Structs.Set.<Phaser.Loader.File>}
         * @since 3.0.0
         */
        this.list = new CustomSet();

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#inflight
         * @type {Phaser.Structs.Set.<Phaser.Loader.File>}
         * @since 3.0.0
         */
        this.inflight = new CustomSet();

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#failed
         * @type {Phaser.Structs.Set.<Phaser.Loader.File>}
         * @since 3.0.0
         */
        this.failed = new CustomSet();

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#queue
         * @type {Phaser.Structs.Set.<Phaser.Loader.File>}
         * @since 3.0.0
         */
        this.queue = new CustomSet();

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#storage
         * @type {Phaser.Structs.Set.<(Phaser.Loader.File|LinkFileObject)>}
         * @since 3.0.0
         */
        this.storage = new CustomSet();

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#state
         * @type {integer}
         * @since 3.0.0
         */
        this.state = CONST.LOADER_IDLE;

        scene.sys.events.once('boot', this.boot, this);
        scene.sys.events.on('start', this.pluginStart, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Loader.LoaderPlugin#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.systems.events.once('destroy', this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Loader.LoaderPlugin#pluginStart
     * @private
     * @since 3.5.1
     */
    pluginStart: function ()
    {
        this.systems.events.once('shutdown', this.shutdown, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#setBaseURL
     * @since 3.0.0
     *
     * @param {string} url - [description]
     *
     * @return {Phaser.Loader.LoaderPlugin} This Loader object.
     */
    setBaseURL: function (url)
    {
        if (url !== '' && url.substr(-1) !== '/')
        {
            url = url.concat('/');
        }

        this.baseURL = url;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#setPath
     * @since 3.0.0
     *
     * @param {string} path - [description]
     *
     * @return {Phaser.Loader.LoaderPlugin} This Loader object.
     */
    setPath: function (path)
    {
        if (path !== '' && path.substr(-1) !== '/')
        {
            path = path.concat('/');
        }

        this.path = path;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#setCORS
     * @since 3.0.0
     *
     * @param {string} crossOrigin - [description]
     *
     * @return {Phaser.Loader.LoaderPlugin} This Loader object.
     */
    setCORS: function (crossOrigin)
    {
        this.crossOrigin = crossOrigin;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#addFile
     * @since 3.0.0
     *
     * @param {Phaser.Loader.File} file - [description]
     */
    addFile: function (file)
    {
        if (!this.isReady())
        {
            return;
        }

        if (Array.isArray(file))
        {
            for (var i = 0; i < file.length; i++)
            {
                var item = file[i];

                //  Does the file already exist in the cache or texture manager?
                if (!item.hasCacheConflict())
                {
                    item.path = this.path;

                    this.list.set(item);
                }
            }
        }
        else if (!file.hasCacheConflict())
        {
            //  Does the file already exist in the cache or texture manager?
            file.path = this.path;

            this.list.set(file);
        }
    },

    /**
     * Is the Loader actively loading (or processing loaded files)
     *
     * @method Phaser.Loader.LoaderPlugin#isLoading
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isLoading: function ()
    {
        return (this.state === CONST.LOADER_LOADING || this.state === CONST.LOADER_PROCESSING);
    },

    /**
     * Is the Loader ready to start a new load?
     *
     * @method Phaser.Loader.LoaderPlugin#isReady
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isReady: function ()
    {
        return (this.state === CONST.LOADER_IDLE || this.state === CONST.LOADER_COMPLETE);
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#start
     * @since 3.0.0
     */
    start: function ()
    {
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

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#updateProgress
     * @since 3.0.0
     */
    updateProgress: function ()
    {
        this.progress = 1 - ((this.list.size + this.inflight.size) / this.totalToLoad);

        this.emit('progress', this.progress);
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#processLoadQueue
     * @since 3.0.0
     */
    processLoadQueue: function ()
    {
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

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#loadFile
     * @since 3.0.0
     *
     * @param {Phaser.Loader.File} file - [description]
     */
    loadFile: function (file)
    {
        //  If the file doesn't have its own crossOrigin set,
        //  we'll use the Loaders (which is undefined by default)
        if (!file.crossOrigin)
        {
            file.crossOrigin = this.crossOrigin;
        }

        file.load(this);
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#nextFile
     * @since 3.0.0
     *
     * @param {Phaser.Loader.File} previousFile - [description]
     * @param {boolean} success - [description]
     */
    nextFile: function (previousFile, success)
    {
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
            this.processLoadQueue();
        }
        else if (this.inflight.size === 0)
        {
            this.finishedLoading();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#finishedLoading
     * @since 3.0.0
     */
    finishedLoading: function ()
    {
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
                file.onProcess(this.processUpdate.bind(this));
            }, this);
        }
    },

    /**
     * Called automatically by the File when it has finished processing.
     *
     * @method Phaser.Loader.LoaderPlugin#processUpdate
     * @since 3.0.0
     *
     * @param {Phaser.Loader.File} file - [description]
     */
    processUpdate: function (file)
    {
        //  This file has failed to load, so move it to the failed Set
        if (file.state === CONST.FILE_ERRORED)
        {
            this.failed.set(file);

            if (file.linkFile)
            {
                file.linkFile.onFileFailed(file);
            }

            return this.removeFromQueue(file);
        }

        //  If we got here, then the file loaded

        this.storage.set(file);

        this.removeFromQueue(file);
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#removeFromQueue
     * @since 3.0.0
     *
     * @param {Phaser.Loader.File} file - [description]
     */
    removeFromQueue: function (file)
    {
        this.queue.delete(file);

        if (this.queue.size === 0 && this.state === CONST.LOADER_PROCESSING)
        {
            //  We've processed all the files we loaded
            this.processComplete();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#processComplete
     * @since 3.0.0
     */
    processComplete: function ()
    {
        this.list.clear();
        this.inflight.clear();
        this.queue.clear();

        this.processCallback();

        this.state = CONST.LOADER_COMPLETE;

        this.emit('complete', this, this.storage.size, this.failed.size);
    },

    /**
     * The Loader has finished.
     *
     * @method Phaser.Loader.LoaderPlugin#processCallback
     * @since 3.0.0
     */
    processCallback: function ()
    {
        if (this.storage.size === 0)
        {
            return;
        }

        /*
        //  The global Texture Manager
        var cache = this.scene.sys.cache;
        var textures = this.scene.sys.textures;

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
                if (Array.isArray(data[0].textures) || Array.isArray(data[0].frames))
                {
                    textures.addAtlasJSONArray(key, images, data);
                }
                else
                {
                    textures.addAtlasJSONHash(key, images, data);
                }
            }
        }
        */

        //  Process all of the files

        this.storage.each(function (file)
        {
            if (file.linkFile)
            {
                file.linkFile.addToCache();
            }
            else
            {
                file.addToCache();
            }

            /*
            switch (file.type)
            {
                case 'dataimage':

                    fileA = file.fileA;
                    fileB = file.fileB;

                    if (fileA.linkParent)
                    {
                        textures.addImage(fileA.key, fileA.data, fileB.data);
                    }
                    else
                    {
                        textures.addImage(fileB.key, fileB.data, fileA.data);
                    }
                    break;

                case 'audioSprite':

                    var files = [ file.fileA, file.fileB ];

                    files.forEach(function (file)
                    {
                        cache[file.type].add(file.key, file.data);
                    });

                    break;
            }
            */

        });

        this.emit('processcomplete', this);

        //  Called 'destroy' on each file in storage
        this.storage.iterateLocal('destroy');

        this.storage.clear();
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#saveJSON
     * @since 3.0.0
     *
     * @param {*} data - [description]
     * @param {string} [filename=file.json] - [description]
     *
     * @return {Phaser.Loader.LoaderPlugin} This Loader plugin.
     */
    saveJSON: function (data, filename)
    {
        return this.save(JSON.stringify(data), filename);
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#save
     * @since 3.0.0
     *
     * @param {*} data - [description]
     * @param {string} [filename=file.json] - [description]
     * @param {string} [filetype=application/json] - [description]
     *
     * @return {Phaser.Loader.LoaderPlugin} This Loader plugin.
     */
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

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#reset
     * @since 3.0.0
     */
    reset: function ()
    {
        this.list.clear();
        this.inflight.clear();
        this.failed.clear();
        this.queue.clear();
        this.storage.clear();

        var gameConfig = this.systems.game.config;
        var sceneConfig = this.systems.settings.loader;

        this.setBaseURL(GetFastValue(sceneConfig, 'baseURL', gameConfig.loaderBaseURL));
        this.setPath(GetFastValue(sceneConfig, 'path', gameConfig.loaderPath));

        this.state = CONST.LOADER_IDLE;
    },

    /**
     * Called by the Scene Manager if you specify a files payload for a pre-Scene Boot.
     * Takes an array of file objects.
     *
     * @method Phaser.Loader.LoaderPlugin#loadArray
     * @since 3.0.0
     *
     * @param {LoaderFileObject[]} files - An array of files to load.
     *
     * @return {boolean} `true` if any files were successfully added to the list, otherwise `false`.
     */
    loadArray: function (files)
    {
        if (Array.isArray(files))
        {
            for (var i = 0; i < files.length; i++)
            {
                var file = files[i];

                //  Calls file-type methods like `atlas` or `image`
                this[file.type](file);
            }
        }

        return (this.list.size > 0);
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Loader.LoaderPlugin#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.reset();

        this.state = CONST.LOADER_SHUTDOWN;

        this.systems.events.off('shutdown', this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Loader.LoaderPlugin#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.state = CONST.LOADER_DESTROYED;

        this.systems.events.off('start', this.pluginStart, this);

        this.list = null;
        this.inflight = null;
        this.failed = null;
        this.queue = null;
        this.storage = null;

        this.scene = null;
        this.systems = null;
        this.textureManager = null;
        this.cacheManager = null;
    }

});

PluginManager.register('Loader', LoaderPlugin, 'load');

module.exports = LoaderPlugin;
