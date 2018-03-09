/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var GetValue = require('../utils/object/GetValue');
var NOOP = require('../utils/NOOP');
var Scene = require('./Scene');
var Systems = require('./Systems');

/**
 * @classdesc
 * The Scene Manager.
 *
 * The Scene Manager is a Game level system, responsible for creating, processing and updating all of the
 * Scenes in a Game instance.
 *
 *
 * @class SceneManager
 * @memberOf Phaser.Scenes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance this Scene Manager belongs to.
 * @param {object} sceneConfig - Scene specific configuration settings.
 */
var SceneManager = new Class({

    initialize:

    function SceneManager (game, sceneConfig)
    {
        /**
         * [description]
         *
         * @name Phaser.Scenes.SceneManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * An object that maps the keys to the scene so we can quickly get a scene from a key without iteration.
         *
         * @name Phaser.Scenes.SceneManager#keys
         * @type {object}
         * @since 3.0.0
         */
        this.keys = {};

        /**
         * The array in which all of the scenes are kept.
         *
         * @name Phaser.Scenes.SceneManager#scenes
         * @type {array}
         * @since 3.0.0
         */
        this.scenes = [];

        /**
         * Scenes pending to be added are stored in here until the manager has time to add it.
         *
         * @name Phaser.Scenes.SceneManager#_pending
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._pending = [];

        /**
         * An array of scenes waiting to be started once the game has booted.
         *
         * @name Phaser.Scenes.SceneManager#_start
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._start = [];

        /**
         * An operations queue, because we don't manipulate the scenes array during processing.
         *
         * @name Phaser.Scenes.SceneManager#_queue
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._queue = [];

        /**
         * The number of Scenes to process.
         *
         * @name Phaser.Scenes.SceneManager#_processing
         * @type {integer}
         * @private
         * @since 3.0.0
         */
        this._processing = 0;

        if (sceneConfig)
        {
            if (!Array.isArray(sceneConfig))
            {
                sceneConfig = [ sceneConfig ];
            }

            for (var i = 0; i < sceneConfig.length; i++)
            {
                //  The i === 0 part just autostarts the first Scene given (unless it says otherwise in its config)
                this._pending.push({
                    key: 'default',
                    scene: sceneConfig[i],
                    autoStart: (i === 0),
                    data: {}
                });
            }

            //  Only need to wait for the boot event if we've scenes to actually boot
            game.events.once('ready', this.bootQueue, this);
        }
    },

    /**
     * Internal first-time Scene boot handler.
     *
     * @method Phaser.Scenes.SceneManager#bootQueue
     * @private
     * @since 3.2.0
     */
    bootQueue: function ()
    {
        var i;
        var entry;
        var key;
        var sceneConfig;

        for (i = 0; i < this._pending.length; i++)
        {
            entry = this._pending[i];

            key = entry.key;
            sceneConfig = entry.scene;

            var newScene;

            if (sceneConfig instanceof Scene)
            {
                newScene = this.createSceneFromInstance(key, sceneConfig);
            }
            else if (typeof sceneConfig === 'object')
            {
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

            if (entry.autoStart || newScene.sys.settings.active)
            {
                this._start.push(key);
            }
        }

        //  Clear the pending lists
        this._pending.length = 0;

        //  _start might have been populated by the above
        for (i = 0; i < this._start.length; i++)
        {
            entry = this._start[i];

            this.start(entry);
        }

        this._start.length = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#processQueue
     * @since 3.0.0
     */
    processQueue: function ()
    {
        var pendingLength = this._pending.length;
        var queueLength = this._queue.length;

        if (pendingLength === 0 && queueLength === 0)
        {
            return;
        }

        var i;
        var entry;

        if (pendingLength)
        {
            for (i = 0; i < pendingLength; i++)
            {
                entry = this._pending[i];

                this.add(entry.key, entry.scene, entry.autoStart);
            }

            //  _start might have been populated by this.add
            for (i = 0; i < this._start.length; i++)
            {
                entry = this._start[i];

                this.start(entry);
            }

            //  Clear the pending lists
            this._start.length = 0;
            this._pending.length = 0;

            return;
        }

        for (i = 0; i < this._queue.length; i++)
        {
            entry = this._queue[i];

            this[entry.op](entry.keyA, entry.keyB);
        }

        this._queue.length = 0;
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
     * @method Phaser.Scenes.SceneManager#add
     * @since 3.0.0
     *
     * @param {string} key - A unique key used to reference the Scene, i.e. `MainMenu` or `Level1`.
     * @param {Phaser.Scene|object|function} sceneConfig - [description]
     * @param {boolean} [autoStart=false] - If `true` the Scene will be started immediately after being added.
     *
     * @return {Phaser.Scene|null} [description]
     */
    add: function (key, sceneConfig, autoStart)
    {
        if (autoStart === undefined) { autoStart = false; }

        //  if not booted, then put scene into a holding pattern
        if (this._processing === 1 || !this.game.isBooted)
        {
            this._pending.push({
                key: key,
                scene: sceneConfig,
                autoStart: autoStart,
                data: {}
            });

            return null;
        }

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
     * Removes a Scene from the SceneManager.
     *
     * The Scene is removed from the local scenes array, it's key is cleared from the keys
     * cache and Scene.Systems.destroy is then called on it.
     *
     * If the SceneManager is processing the Scenes when this method is called it wil
     * queue the operation for the next update sequence.
     *
     * @method Phaser.Scenes.SceneManager#remove
     * @since 3.2.0
     *
     * @param {string|Phaser.Scene} scene - The Scene to be removed.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    remove: function (key)
    {
        if (this._processing)
        {
            this._queue.push({ op: 'remove', keyA: key, keyB: null });
        }
        else
        {
            var sceneToRemove = this.getScene(key);

            if (!sceneToRemove)
            {
                return this;
            }

            var index = this.scenes.indexOf(sceneToRemove);
            var sceneKey = sceneToRemove.sys.settings.key;

            if (index > -1)
            {
                this.keys[sceneKey] = undefined;
                this.scenes.splice(index, 1);

                if (this._start.indexOf(sceneKey) > -1)
                {
                    index = this._start.indexOf(sceneKey);
                    this._start.splice(index, 1);
                }

                sceneToRemove.sys.destroy();
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#bootScene
     * @private
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

        var loader;

        if (scene.sys.load)
        {
            loader = scene.sys.load;

            loader.reset();
        }

        if (loader && scene.preload)
        {
            scene.preload.call(scene);

            //  Is the loader empty?
            if (loader.list.size === 0)
            {
                this.create(scene);
            }
            else
            {
                scene.sys.settings.status = CONST.LOADING;

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

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#loadComplete
     * @private
     * @since 3.0.0
     *
     * @param {object} loader - [description]
     */
    loadComplete: function (loader)
    {
        var scene = loader.scene;

        this.create(scene);
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#payloadComplete
     * @private
     * @since 3.0.0
     *
     * @param {object} loader - [description]
     */
    payloadComplete: function (loader)
    {
        this.bootScene(loader.scene);
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#update
     * @since 3.0.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
     */
    update: function (time, delta)
    {
        this.processQueue();

        this._processing = 1;

        //  Loop through the active scenes in reverse order
        for (var i = this.scenes.length - 1; i >= 0; i--)
        {
            var sys = this.scenes[i].sys;

            if (sys.settings.status === CONST.RUNNING)
            {
                sys.step(time, delta);
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#resize
     * @since 3.2.0
     *
     * @param {number} width - The new width of the game.
     * @param {number} height - The new height of the game.
     */
    resize: function (width, height)
    {
        //  Loop through the scenes in forward order
        for (var i = 0; i < this.scenes.length; i++)
        {
            var sys = this.scenes[i].sys;

            sys.resize(width, height);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#render
     * @since 3.0.0
     *
     * @param {any} renderer - [description]
     */
    render: function (renderer)
    {
        //  Loop through the scenes in forward order
        for (var i = 0; i < this.scenes.length; i++)
        {
            var sys = this.scenes[i].sys;

            if (sys.settings.visible && sys.settings.status >= CONST.LOADING && sys.settings.status < CONST.SLEEPING)
            {
                sys.render(renderer);
            }
        }

        this._processing = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#create
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     */
    create: function (scene)
    {
        if (scene.create)
        {
            scene.sys.settings.status = CONST.CREATING;

            scene.create.call(scene, scene.sys.settings.data);
        }

        scene.sys.settings.status = CONST.RUNNING;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromFunction
     * @private
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

            if (!newScene.update)
            {
                newScene.update = NOOP;
            }

            return newScene;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromInstance
     * @private
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

        return newScene;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromObject
     * @private
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

        //  Extract callbacks

        var defaults = [ 'init', 'preload', 'create', 'update', 'render', 'shutdown', 'destroy' ];

        for (var i = 0; i < defaults.length; i++)
        {
            var sceneCallback = GetValue(sceneConfig, defaults[i], null);

            //  Must always have an update function, no matter what (the rest are optional)
            if (defaults[i] === 'update' && !sceneCallback)
            {
                sceneCallback = NOOP;
            }

            if (sceneCallback)
            {
                newScene[defaults[i]] = sceneCallback;
            }
        }

        //  Now let's move across any other functions or properties that may exist in the extend object:

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
                newScene[propertyKey] = sceneConfig.extend[propertyKey];
            }
        }

        return newScene;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#getKey
     * @private
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
     * @method Phaser.Scenes.SceneManager#getScene
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Scene|null} [description]
     */
    getScene: function (key)
    {
        if (typeof key === 'string')
        {
            if (this.keys[key])
            {
                return this.keys[key];
            }
        }
        else
        {
            for (var i = 0; i < this.scenes.length; i++)
            {
                if (key === this.scenes[i])
                {
                    return key;
                }
            }
        }

        return null;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#isActive
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {boolean} [description]
     */
    isActive: function (key)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            return scene.sys.isActive();
        }

        return null;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#isVisible
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {boolean} [description]
     */
    isVisible: function (key)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            return scene.sys.isVisible();
        }

        return null;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#isSleeping
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {boolean} [description]
     */
    isSleeping: function (key)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            return scene.sys.isSleeping();
        }

        return null;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#pause
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    pause: function (key)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.pause();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#resume
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    resume: function (key)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.resume();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#sleep
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    sleep: function (key)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.sleep();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#wake
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    wake: function (key)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.wake();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#start
     * @since 3.0.0
     *
     * @param {string} key - [description]
     * @param {object} [data] - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
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

            return this;
        }

        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.start(data);

            var loader;

            if (scene.sys.load)
            {
                loader = scene.sys.load;
            }

            //  Files payload?
            if (loader && Array.isArray(scene.sys.settings.files))
            {
                loader.reset();

                if (loader.loadArray(scene.sys.settings.files))
                {
                    scene.sys.settings.status = CONST.LOADING;

                    loader.once('complete', this.payloadComplete, this);

                    loader.start();

                    return this;
                }
            }

            this.bootScene(scene);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#stop
     * @since 3.0.0
     *
     * @param {string} key - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    stop: function (key)
    {
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.shutdown();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#switch
     * @since 3.0.0
     *
     * @param {string} from - [description]
     * @param {string} to - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    switch: function (from, to)
    {
        var sceneA = this.getScene(from);
        var sceneB = this.getScene(to);

        if (sceneA && sceneB && sceneA !== sceneB)
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
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#getAt
     * @since 3.0.0
     *
     * @param {integer} index - [description]
     *
     * @return {Phaser.Scene|undefined} [description]
     */
    getAt: function (index)
    {
        return this.scenes[index];
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#getIndex
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} key - [description]
     *
     * @return {integer} [description]
     */
    getIndex: function (key)
    {
        var scene = this.getScene(key);

        return this.scenes.indexOf(scene);
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#bringToTop
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} key - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    bringToTop: function (key)
    {
        if (this._processing)
        {
            this._queue.push({ op: 'bringToTop', keyA: key, keyB: null });
        }
        else
        {
            var index = this.getIndex(key);

            if (index !== -1 && index < this.scenes.length)
            {
                var scene = this.getScene(key);

                this.scenes.splice(index, 1);
                this.scenes.push(scene);
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#sendToBack
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} key - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    sendToBack: function (key)
    {
        if (this._processing)
        {
            this._queue.push({ op: 'sendToBack', keyA: key, keyB: null });
        }
        else
        {
            var index = this.getIndex(key);

            if (index !== -1 && index > 0)
            {
                var scene = this.getScene(key);

                this.scenes.splice(index, 1);
                this.scenes.unshift(scene);
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#moveDown
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} key - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    moveDown: function (key)
    {
        if (this._processing)
        {
            this._queue.push({ op: 'moveDown', keyA: key, keyB: null });
        }
        else
        {
            var indexA = this.getIndex(key);

            if (indexA > 0)
            {
                var indexB = indexA - 1;
                var sceneA = this.getScene(key);
                var sceneB = this.getAt(indexB);

                this.scenes[indexA] = sceneB;
                this.scenes[indexB] = sceneA;
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#moveUp
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} key - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    moveUp: function (key)
    {
        if (this._processing)
        {
            this._queue.push({ op: 'moveUp', keyA: key, keyB: null });
        }
        else
        {
            var indexA = this.getIndex(key);

            if (indexA < this.scenes.length - 1)
            {
                var indexB = indexA + 1;
                var sceneA = this.getScene(key);
                var sceneB = this.getAt(indexB);

                this.scenes[indexA] = sceneB;
                this.scenes[indexB] = sceneA;
            }
        }

        return this;
    },

    /**
     * Moves a Scene so it is immediately above another Scene in the Scenes list.
     * This means it will render over the top of the other Scene.
     *
     * @method Phaser.Scenes.SceneManager#moveAbove
     * @since 3.2.0
     *
     * @param {string|Phaser.Scene} keyA - The Scene that Scene B will be moved above.
     * @param {string|Phaser.Scene} keyB - The Scene to be moved.
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    moveAbove: function (keyA, keyB)
    {
        if (keyA === keyB)
        {
            return this;
        }

        if (this._processing)
        {
            this._queue.push({ op: 'moveAbove', keyA: keyA, keyB: keyB });
        }
        else
        {
            var indexA = this.getIndex(keyA);
            var indexB = this.getIndex(keyB);

            if (indexA > indexB && indexA !== -1 && indexB !== -1)
            {
                var tempScene = this.getAt(indexB);

                //  Remove
                this.scenes.splice(indexB, 1);

                //  Add in new location
                this.scenes.splice(indexA, 0, tempScene);
            }
        }

        return this;
    },

    /**
     * Moves a Scene so it is immediately below another Scene in the Scenes list.
     * This means it will render behind the other Scene.
     *
     * @method Phaser.Scenes.SceneManager#moveBelow
     * @since 3.2.0
     *
     * @param {string|Phaser.Scene} keyA - The Scene that Scene B will be moved above.
     * @param {string|Phaser.Scene} keyB - The Scene to be moved.
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    moveBelow: function (keyA, keyB)
    {
        if (keyA === keyB)
        {
            return this;
        }

        if (this._processing)
        {
            this._queue.push({ op: 'moveBelow', keyA: keyA, keyB: keyB });
        }
        else
        {
            var indexA = this.getIndex(keyA);
            var indexB = this.getIndex(keyB);

            if (indexA < indexB && indexA !== -1 && indexB !== -1)
            {
                var tempScene = this.getAt(indexB);

                //  Remove
                this.scenes.splice(indexB, 1);

                //  Add in new location
                this.scenes.splice(indexA, 0, tempScene);
            }
        }

        return this;
    },

    queueOp: function (op, keyA, keyB)
    {
        this._queue.push({ op: op, keyA: keyA, keyB: keyB });

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#swapPosition
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} keyA - [description]
     * @param {string|Phaser.Scene} keyB - [description]
     *
     * @return {Phaser.Scenes.SceneManager} [description]
     */
    swapPosition: function (keyA, keyB)
    {
        if (keyA === keyB)
        {
            return this;
        }

        if (this._processing)
        {
            this._queue.push({ op: 'swapPosition', keyA: keyA, keyB: keyB });
        }
        else
        {
            var indexA = this.getIndex(keyA);
            var indexB = this.getIndex(keyB);

            if (indexA !== indexB && indexA !== -1 && indexB !== -1)
            {
                var tempScene = this.getAt(indexA);

                this.scenes[indexA] = this.scenes[indexB];
                this.scenes[indexB] = tempScene;
            }
        }

        return this;
    },

    dump: function ()
    {
        var out = [];
        var map = [ 'pending', 'init', 'start', 'loading', 'creating', 'running', 'paused', 'sleeping', 'shutdown', 'destroyed' ];

        for (var i = 0; i < this.scenes.length; i++)
        {
            var sys = this.scenes[i].sys;

            var key = (sys.settings.visible && (sys.settings.status === CONST.RUNNING || sys.settings.status === CONST.PAUSED)) ? '[*] ' : '[-] ';
            key += sys.settings.key + ' (' + map[sys.settings.status] + ')';

            out.push(key);
        }

        console.log(out.join('\n'));
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.SceneManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        for (var i = this.scenes.length - 1; i >= 0; i--)
        {
            var sys = this.scenes[i].sys;

            sys.destroy();
        }

        this.scenes = [];

        this._pending = [];
        this._start = [];
        this._queue = [];

        this.game = null;
    }

});

module.exports = SceneManager;
