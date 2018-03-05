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
var ParseXMLBitmapFont = require('../gameobjects/bitmaptext/ParseXMLBitmapFont');
var PluginManager = require('../boot/PluginManager');
var XHRSettings = require('./XHRSettings');

/**
 * @classdesc
 * [description]
 *
 * @class LoaderPlugin
 * @extends EventEmitter
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

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#_multilist
         * @type {object}
         * @private
         * @default {}
         * @since 3.0.0
         */
        this._multilist = {};

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
         * @type {Phaser.Loader.XHRSettings}
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
         * @type {Phaser.Structs.Set}
         * @since 3.0.0
         */
        this.list = new CustomSet();

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#inflight
         * @type {Phaser.Structs.Set}
         * @since 3.0.0
         */
        this.inflight = new CustomSet();

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#failed
         * @type {Phaser.Structs.Set}
         * @since 3.0.0
         */
        this.failed = new CustomSet();

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#queue
         * @type {Phaser.Structs.Set}
         * @since 3.0.0
         */
        this.queue = new CustomSet();

        /**
         * [description]
         *
         * @name Phaser.Loader.LoaderPlugin#storage
         * @type {Phaser.Structs.Set}
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
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
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
     *
     * @return {Phaser.Loader.File} [description]
     */
    addFile: function (file)
    {
        if (!this.isReady())
        {
            return -1;
        }

        file.path = this.path;

        this.list.set(file);

        return file;
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
        return (this.state === CONST.LOADER_IDLE || this.state === CONST.LOADER_COMPLETE || this.state === CONST.LOADER_FAILED);
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
        this.progress = 1 - (this.list.size / this.totalToLoad);

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

        //  Move to a User setting:
        // this.removeAllListeners();
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

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#saveJSON
     * @since 3.0.0
     *
     * @param {[type]} data - [description]
     * @param {[type]} filename - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} data - [description]
     * @param {[type]} filename - [description]
     * @param {[type]} filetype - [description]
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
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#loadArray
     * @since 3.0.0
     *
     * @param {array} files - [description]
     *
     * @return {boolean} [description]
     */
    loadArray: function (files)
    {
        if (Array.isArray(files))
        {
            for (var i = 0; i < files.length; i++)
            {
                this.file(files[i]);
            }
        }

        return (this.list.size > 0);
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#file
     * @since 3.0.0
     *
     * @param {object} file - [description]
     *
     * @return {Phaser.Loader.File} [description]
     */
    file: function (file)
    {
        var entry;
        var key = file.key;

        switch (file.type)
        {
            case 'spritesheet':
                entry = this.spritesheet(key, file.url, file.config, file.xhrSettings);
                break;

            case 'atlas':
                entry = this.atlas(key, file.textureURL, file.atlasURL, file.textureXhrSettings, file.atlasXhrSettings);
                break;

            case 'bitmapFont':
                entry = this.bitmapFont(key, file.textureURL, file.xmlURL, file.textureXhrSettings, file.xmlXhrSettings);
                break;

            case 'multiatlas':
                entry = this.multiatlas(key, file.textureURLs, file.atlasURLs, file.textureXhrSettings, file.atlasXhrSettings);
                break;

            case 'audioSprite':
                entry = this.audioSprite(key, file.urls, file.json, file.config, file.audioXhrSettings, file.jsonXhrSettings);
                break;

            //  image, json, xml, binary, text, glsl, svg, obj
            default:
                entry = this[file.type](key, file.url, file.xhrSettings);
                break;
        }

        return entry;
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.reset();
        this.state = CONST.LOADER_SHUTDOWN;
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.LoaderPlugin#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.reset();
        this.state = CONST.LOADER_DESTROYED;
    }

});

PluginManager.register('Loader', LoaderPlugin, 'load');

module.exports = LoaderPlugin;
