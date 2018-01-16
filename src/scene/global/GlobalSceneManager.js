var CanvasInterpolation = require('../../display/canvas/CanvasInterpolation');
var CanvasPool = require('../../display/canvas/CanvasPool');
var Class = require('../../utils/Class');
var CONST = require('../../const');
var GetValue = require('../../utils/object/GetValue');
var NOOP = require('../../utils/NOOP');
var Scene = require('../local/Scene');
var Systems = require('../local/Systems');

var GlobalSceneManager = new Class({

    initialize:

    function GlobalSceneManager (game, sceneConfig)
    {
        this.game = game;

        //  Everything kept in here
        this.keys = {};
        this.scenes = [];

        //  Only active scenes are kept in here. They are moved here when started, and moved out when not.
        //  All scenes are stored in the scenes array, regardless of being active or not.
        this.active = [];

        //  A scene pending to be added to the Scene Manager is stored in here until the manager has time to add it.
        this._pending = [];

        //  An array of scenes waiting to be started once the game has booted
        this._start = [];

        if (sceneConfig)
        {
            if (Array.isArray(sceneConfig))
            {
                for (var i = 0; i < sceneConfig.length; i++)
                {
                    //  The i === 0 part just starts the first Scene given
                    this._pending.push({
                        index: i,
                        key: 'default',
                        scene: sceneConfig[i],
                        autoStart: (i === 0),
                        data: {}
                    });
                }
            }
            else
            {
                this._pending.push({
                    index: 0,
                    key: 'default',
                    scene: sceneConfig,
                    autoStart: true,
                    data: {}
                });
            }
        }
    },

    /**
     * Adds a new Scene into the SceneManager.
     * You must give each Scene a unique key by which you'll identify it.
     *
     * The `sceneConfig` can be:
     *
     * * A `Phaser.Scene` object, or an object that extends it.
     * * A plain JavaScript object
     * * A JavaScript ES6 Class that extends `Phaser.Scene`
     * * A JavaScript ES5 prototype based Class
     * * A JavaScript function
     *
     * If a function is given then a new Scene will be created by calling it.
     *
     * @method Phaser.Scenes.GlobalSceneManager#add
     * @since 3.0.0
     *
     * @param {string} key - A unique key used to reference the Scene, i.e. `MainMenu` or `Level1`.
     * @param {Phaser.Scene|object|function} sceneConfig - [description]
     * @param {boolean} [autoStart=false] - If `true` the Scene will be started immediately after being added.
     *
     * @return {Phaser.Scene} [description]
     */
    add: function (key, sceneConfig, autoStart)
    {
        if (autoStart === undefined) { autoStart = false; }

        //  if not booted, then put scene into a holding pattern
        if (!this.game.isBooted)
        {
            this._pending.push({
                index: this._pending.length,
                key: key,
                scene: sceneConfig,
                autoStart: autoStart
            });

            return;
        }

        // var ok = key;
        key = this.getKey(key, sceneConfig);

        var newScene;

        if (sceneConfig instanceof Scene)
        {
            newScene = this.createSceneFromInstance(key, sceneConfig);
        }
        else if (typeof sceneConfig === 'object')
        {
            sceneConfig.key = key;

            newScene = this.createSceneFromObject(key, sceneConfig);
        }
        else if (typeof sceneConfig === 'function')
        {
            newScene = this.createSceneFromFunction(key, sceneConfig);
        }

        //  Replace key in case the scene changed it
        key = newScene.sys.settings.key;

        this.keys[key] = newScene;

        this.scenes.push(newScene);

        if (autoStart || newScene.sys.settings.active)
        {
            if (this.game.isBooted)
            {
                this.start(key);
            }
            else
            {
                this._start.push(key);
            }
        }

        return newScene;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var i;
        var entry;

        for (i = 0; i < this._pending.length; i++)
        {
            entry = this._pending[i];

            this.add(entry.key, entry.scene, entry.autoStart);
        }

        for (i = 0; i < this._start.length; i++)
        {
            entry = this._start[i];

            this.start(entry);
        }

        //  Clear the pending lists
        this._start = [];
        this._pending = [];
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#bootScene
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     */
    bootScene: function (scene)
    {
        if (scene.init)
        {
            scene.init.call(scene, scene.sys.settings.data);
        }

        var loader = scene.sys.load;
            
        loader.reset();

        if (scene.preload)
        {
            scene.preload(this.game);

            //  Is the loader empty?
            if (loader.list.size === 0)
            {
                this.create(scene);
            }
            else
            {
                //  Start the loader going as we have something in the queue

                loader.once('complete', this.loadComplete, this);

                loader.start();
            }
        }
        else
        {
            //  No preload? Then there was nothing to load either
            this.create(scene);
        }
    },

    //  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
    //  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#bringToTop
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} scene - [description]
     */
    bringToTop: function (scene)
    {
        var index = (typeof scene === 'string') ? this.getActiveSceneIndexByKey(scene) : this.getActiveSceneIndex(scene);

        if (index < this.active.length)
        {
            var i = 0;
            var entry = this.active.splice(index, 1);

            for (i = 0; i < this.active.length; i++)
            {
                this.active[i].index = i;
            }

            this.active.push({ index: i, scene: entry[0].scene });
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#create
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     */
    create: function (scene)
    {
        //  Insert at the correct index, or it just all goes wrong :)

        var i = this.getSceneIndex(scene);

        this.active.push({ index: i, scene: scene });

        //  Sort the 'active' array based on the index property
        this.active.sort(this.sortScenes);

        if (scene.create)
        {
            scene.create.call(scene, scene.sys.settings.data);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#createSceneDisplay
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     */
    createSceneDisplay: function (scene)
    {
        var settings = scene.sys.settings;

        var width = settings.width;
        var height = settings.height;

        var config = this.game.config;

        if (config.renderType === CONST.CANVAS)
        {
            if (settings.renderToTexture)
            {
                scene.sys.canvas = CanvasPool.create(scene, width, height);
                scene.sys.context = scene.sys.canvas.getContext('2d');
            }
            else
            {
                scene.sys.canvas = this.game.canvas;
                scene.sys.context = this.game.context;
            }

            //  Pixel Art mode?
            if (config.pixelArt)
            {
                CanvasInterpolation.setCrisp(scene.sys.canvas);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#createSceneFromFunction
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {function} scene - [description]
     *
     * @return {Phaser.Scene} [description]
     */
    createSceneFromFunction: function (key, scene)
    {
        var newScene = new scene();

        if (newScene instanceof Scene)
        {
            var configKey = newScene.sys.settings.key;

            if (configKey !== '')
            {
                key = configKey;
            }

            if (this.keys.hasOwnProperty(key))
            {
                throw new Error('Cannot add a Scene with duplicate key: ' + key);
            }

            return this.createSceneFromInstance(key, newScene);
        }
        else
        {
            newScene.sys = new Systems(newScene);

            newScene.sys.settings.key = key;

            newScene.sys.init(this.game);

            this.createSceneDisplay(newScene);

            //  Default required functions

            if (!newScene.init)
            {
                newScene.init = NOOP;
            }

            if (!newScene.preload)
            {
                newScene.preload = NOOP;
            }

            if (!newScene.create)
            {
                newScene.create = NOOP;
            }

            if (!newScene.shutdown)
            {
                newScene.shutdown = NOOP;
            }

            if (!newScene.update)
            {
                newScene.update = NOOP;
            }

            if (!newScene.render)
            {
                newScene.render = NOOP;
            }

            return newScene;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#createSceneFromInstance
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {Phaser.Scene} newScene - [description]
     *
     * @return {Phaser.Scene} [description]
     */
    createSceneFromInstance: function (key, newScene)
    {
        var configKey = newScene.sys.settings.key;

        if (configKey !== '')
        {
            key = configKey;
        }
        else
        {
            newScene.sys.settings.key = key;
        }

        newScene.sys.init(this.game);

        this.createSceneDisplay(newScene);

        return newScene;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#createSceneFromObject
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {object} sceneConfig - [description]
     *
     * @return {Phaser.Scene} [description]
     */
    createSceneFromObject: function (key, sceneConfig)
    {
        var newScene = new Scene(sceneConfig);

        var configKey = newScene.sys.settings.key;

        if (configKey !== '')
        {
            key = configKey;
        }
        else
        {
            newScene.sys.settings.key = key;
        }

        newScene.sys.init(this.game);

        this.createSceneDisplay(newScene);

        //  Extract callbacks or set NOOP

        var defaults = [ 'init', 'preload', 'create', 'shutdown', 'update', 'render' ];

        for (var i = 0; i < defaults.length; i++)
        {
            newScene[defaults[i]] = GetValue(sceneConfig, defaults[i], NOOP);
        }

        //  Now let's move across any other functions or properties that may exist

        /*
        scene: {
            preload: preload,
            create: create,
            extend: {
                hello: 1,
                test: 'atari',
                addImage: addImage
            }
        }
        */

        if (sceneConfig.hasOwnProperty('extend'))
        {
            for (var propertyKey in sceneConfig.extend)
            {
                if (defaults.indexOf(propertyKey) === -1)
                {
                    newScene[propertyKey] = sceneConfig.extend[propertyKey];
                }
            }
        }

        return newScene;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#getActiveScene
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Scene} [description]
     */
    getActiveScene: function (key)
    {
        var scene = this.getScene(key);

        for (var i = 0; i < this.active.length; i++)
        {
            if (this.active[i].scene === scene)
            {
                return this.active[i];
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#getActiveSceneIndex
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     *
     * @return {integer} [description]
     */
    getActiveSceneIndex: function (scene)
    {
        for (var i = 0; i < this.active.length; i++)
        {
            if (this.active[i].scene === scene)
            {
                return this.active[i].index;
            }
        }

        return -1;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#getActiveSceneIndexByKey
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {integer} [description]
     */
    getActiveSceneIndexByKey: function (key)
    {
        var scene = this.keys[key];

        for (var i = 0; i < this.active.length; i++)
        {
            if (this.active[i].scene === scene)
            {
                return this.active[i].index;
            }
        }

        return -1;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#getKey
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {Phaser.Scene|object|function} sceneConfig - [description]
     *
     * @return {string} [description]
     */
    getKey: function (key, sceneConfig)
    {
        if (!key) { key = 'default'; }

        if (typeof sceneConfig === 'function')
        {
            return key;
        }
        else if (sceneConfig instanceof Scene)
        {
            key = sceneConfig.sys.settings.key;
        }
        else if (typeof sceneConfig === 'object' && sceneConfig.hasOwnProperty('key'))
        {
            key = sceneConfig.key;
        }

        //  By this point it's either 'default' or extracted from the Scene

        if (this.keys.hasOwnProperty(key))
        {
            throw new Error('Cannot add a Scene with duplicate key: ' + key);
        }
        else
        {
            return key;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#getScene
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Scene} [description]
     */
    getScene: function (key)
    {
        return this.keys[key];
    },

    //  Gets the Active scene at the given position

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#getSceneAt
     * @since 3.0.0
     *
     * @param {integer} index - [description]
     *
     * @return {Phaser.Scene} [description]
     */
    getSceneAt: function (index)
    {
        if (this.active[index])
        {
            return this.active[index].scene;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#getSceneIndex
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     *
     * @return {integer} [description]
     */
    getSceneIndex: function (scene)
    {
        return this.scenes.indexOf(scene);
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#getSceneIndexByKey
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {integer} [description]
     */
    getSceneIndexByKey: function (key)
    {
        var scene = this.keys[key];

        return this.scenes.indexOf(scene);
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#isActive
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {boolean} [description]
     */
    isActive: function (key)
    {
        var entry = this.getActiveScene(key);

        return (entry && entry.scene.sys.settings.active);
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#isSleeping
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {boolean} [description]
     */
    isSleeping: function (key)
    {
        var entry = this.getActiveScene(key);

        if (entry)
        {
            return (!entry.scene.sys.settings.active && !entry.scene.sys.settings.visible);
        }

        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#loadComplete
     * @since 3.0.0
     *
     * @param {object} event - [description]
     */
    loadComplete: function (loader)
    {
        var scene = loader.scene;

        this.create(scene);
    },

    //  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
    //  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#moveDown
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} scene - [description]
     */
    moveDown: function (scene)
    {
        var index = (typeof scene === 'string') ? this.getActiveSceneIndexByKey(scene) : this.getActiveSceneIndex(scene);

        if (index > 0)
        {
            var sceneB = this.getSceneAt(index - 1);

            if (sceneB)
            {
                this.swapPosition(scene, sceneB);
            }
        }
    },

    //  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
    //  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#moveUp
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} scene - [description]
     */
    moveUp: function (scene)
    {
        var index = (typeof scene === 'string') ? this.getActiveSceneIndexByKey(scene) : this.getActiveSceneIndex(scene);

        if (index !== -1 && index < this.active.length - 1)
        {
            var sceneB = this.getSceneAt(index + 1);

            if (sceneB)
            {
                this.swapPosition(scene, sceneB);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#pause
     * @since 3.0.0
     *
     * @param {string} key - [description]
     */
    pause: function (key)
    {
        var entry = this.getActiveScene(key);

        if (entry)
        {
            entry.scene.sys.pause();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#payloadComplete
     * @since 3.0.0
     *
     * @param {object} event - [description]
     */
    payloadComplete: function (event)
    {
        var scene = event.loader.scene;

        this.bootScene(scene);
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#resume
     * @since 3.0.0
     *
     * @param {string} key - [description]
     */
    resume: function (key)
    {
        var entry = this.getActiveScene(key);

        if (entry)
        {
            entry.scene.sys.resume();
        }
    },

    //  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
    //  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#sendToBack
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} scene - [description]
     */
    sendToBack: function (scene)
    {
        var index = (typeof scene === 'string') ? this.getActiveSceneIndexByKey(scene) : this.getActiveSceneIndex(scene);

        if (index > 0)
        {
            var entry = this.active.splice(index, 1);

            this.active.unshift({ index: 0, scene: entry[0].scene });

            for (var i = 0; i < this.active.length; i++)
            {
                this.active[i].index = i;
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#sleep
     * @since 3.0.0
     *
     * @param {string} key - [description]
     */
    sleep: function (key)
    {
        var entry = this.getActiveScene(key);

        if (entry)
        {
            entry.scene.sys.sleep();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#sortScenes
     * @since 3.0.0
     *
     * @param {object} sceneA - [description]
     * @param {object} sceneB - [description]
     *
     * @return {integer} [description]
     */
    sortScenes: function (sceneA, sceneB)
    {
        //  Sort descending
        if (sceneA.index < sceneB.index)
        {
            return -1;
        }
        else if (sceneA.index > sceneB.index)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#start
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {object} data - [description]
     */
    start: function (key, data)
    {
        if (data === undefined) { data = {}; }

        //  if not booted, then put scene into a holding pattern
        if (!this.game.isBooted)
        {
            for (var i = 0; i < this._pending.length; i++)
            {
                var entry = this._pending[i];

                if (entry.key === key)
                {
                    entry.autoStart = true;
                    entry.data = data;
                }
            }

            return;
        }

        var scene = this.getScene(key);

        if (scene)
        {
            //  Already started? Nothing more to do here ...
            if (this.isActive(key))
            {
                return;
            }

            scene.sys.start(data);

            var loader = scene.sys.load;

            //  Files payload?
            if (loader && Array.isArray(scene.sys.settings.files))
            {
                loader.reset();

                if (loader.loadArray(scene.sys.settings.files))
                {
                    loader.once('complete', this.payloadComplete, this);

                    loader.start();
                }
                else
                {
                    this.bootScene(scene);
                }
            }
            else
            {
                this.bootScene(scene);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#stop
     * @since 3.0.0
     *
     * @param {string} key - [description]
     */
    stop: function (key)
    {
        var entry = this.getActiveScene(key);

        if (entry)
        {
            entry.scene.sys.shutdown();

            //  Remove from the active list
            var index = this.active.indexOf(entry);

            if (index !== -1)
            {
                this.active.splice(index, 1);

                this.active.sort(this.sortScenes);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#swap
     * @since 3.0.0
     *
     * @param {string} from - [description]
     * @param {string} to - [description]
     */
    swap: function (from, to)
    {
        this.sleep(from);

        if (this.isSleeping(to))
        {
            this.wake(to);
        }
        else
        {
            this.start(to);
        }
    },

    //  If the arguments are strings they are assumed to be keys, otherwise they are Scene objects
    //  You can only swap the positions of Active (rendering / updating) Scenes. If a Scene is not active it cannot be moved.

    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#swapPosition
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} scene1 - [description]
     * @param {string|Phaser.Scene} scene2 - [description]
     */
    swapPosition: function (scene1, scene2)
    {
        if (scene1 === scene2)
        {
            return;
        }

        var index1 = (typeof scene1 === 'string') ? this.getActiveSceneIndexByKey(scene1) : this.getActiveSceneIndex(scene1);
        var index2 = (typeof scene2 === 'string') ? this.getActiveSceneIndexByKey(scene2) : this.getActiveSceneIndex(scene2);

        if (index1 !== -1 && index2 !== -1 && index1 !== index2)
        {
            this.active[index1].index = index2;
            this.active[index2].index = index1;

            this.active.sort(this.sortScenes);
        }
    },
    
    /**
     * [description]
     *
     * @method Phaser.Scenes.GlobalSceneManager#wake
     * @since 3.0.0
     *
     * @param {string} key - [description]
     */
    wake: function (key)
    {
        var entry = this.getActiveScene(key);

        if (entry)
        {
            entry.scene.sys.wake();
        }
    }

});

module.exports = GlobalSceneManager;
