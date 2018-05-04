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
         * The Game that this SceneManager belongs to.
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
         * Boot time data to merge.
         *
         * @name Phaser.Scenes.SceneManager#_data
         * @type {object}
         * @private
         * @since 3.4.0
         */
        this._data = {};

        /**
         * Is the Scene Manager actively processing the Scenes list?
         *
         * @name Phaser.Scenes.SceneManager#isProcessing
         * @type {boolean}
         * @default false
         * @readOnly
         * @since 3.0.0
         */
        this.isProcessing = false;

        /**
         * Has the Scene Manager properly started?
         *
         * @name Phaser.Scenes.SceneManager#isBooted
         * @type {boolean}
         * @default false
         * @readOnly
         * @since 3.4.0
         */
        this.isBooted = false;

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
        }
        
        game.events.once('ready', this.bootQueue, this);
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
        if (this.isBooted)
        {
            return;
        }

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

            //  Any data to inject?
            if (this._data[key])
            {
                newScene.sys.settings.data = this._data[key].data;

                if (this._data[key].autoStart)
                {
                    entry.autoStart = true;
                }
            }

            if (entry.autoStart || newScene.sys.settings.active)
            {
                this._start.push(key);
            }
        }

        //  Clear the pending lists
        this._pending.length = 0;

        this._data = {};

        this.isBooted = true;

        //  _start might have been populated by the above
        for (i = 0; i < this._start.length; i++)
        {
            entry = this._start[i];

            this.start(entry);
        }

        this._start.length = 0;
    },

    /**
     * Process the Scene operations queue.
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

                this.add(entry.key, entry.scene, entry.autoStart, entry.data);
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
     * @param {(Phaser.Scene|Phaser.Scenes.Settings.Config|function)} sceneConfig - The config for the Scene
     * @param {boolean} [autoStart=false] - If `true` the Scene will be started immediately after being added.
     * @param {object} [data] - Optional data object. This will be set as Scene.settings.data and passed to `Scene.init`.
     *
     * @return {?Phaser.Scene} The added Scene, if it was added immediately, otherwise `null`.
     */
    add: function (key, sceneConfig, autoStart, data)
    {
        if (autoStart === undefined) { autoStart = false; }
        if (data === undefined) { data = {}; }

        //  If processing or not booted then put scene into a holding pattern
        if (this.isProcessing || !this.isBooted)
        {
            this._pending.push({
                key: key,
                scene: sceneConfig,
                autoStart: autoStart,
                data: data
            });

            if (!this.isBooted)
            {
                this._data[key] = { data: data };
            }

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

        //  Any data to inject?
        newScene.sys.settings.data = data;

        //  Replace key in case the scene changed it
        key = newScene.sys.settings.key;

        this.keys[key] = newScene;

        this.scenes.push(newScene);

        if (autoStart || newScene.sys.settings.active)
        {
            if (this._pending.length)
            {
                this._start.push(key);
            }
            else
            {
                this.start(key);
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
     * @param {(string|Phaser.Scene)} scene - The Scene to be removed.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    remove: function (key)
    {
        if (this.isProcessing)
        {
            this._queue.push({ op: 'remove', keyA: key, keyB: null });
        }
        else
        {
            var sceneToRemove = this.getScene(key);

            if (!sceneToRemove || sceneToRemove.sys.isTransitioning())
            {
                return this;
            }

            var index = this.scenes.indexOf(sceneToRemove);
            var sceneKey = sceneToRemove.sys.settings.key;

            if (index > -1)
            {
                delete this.keys[sceneKey];
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
     * Boot the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#bootScene
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene to boot.
     */
    bootScene: function (scene)
    {
        var sys = scene.sys;
        var settings = sys.settings;

        if (scene.init)
        {
            scene.init.call(scene, settings.data);

            if (settings.isTransition)
            {
                sys.events.emit('transitioninit', settings.transitionFrom, settings.transitionDuration);
            }
        }

        var loader;

        if (sys.load)
        {
            loader = sys.load;

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
                settings.status = CONST.LOADING;

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
     * Handles load completion for a Scene's Loader.
     *
     * Starts the Scene that the Loader belongs to.
     *
     * @method Phaser.Scenes.SceneManager#loadComplete
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - The loader that has completed loading.
     */
    loadComplete: function (loader)
    {
        var scene = loader.scene;

        // Try to unlock HTML5 sounds every time any loader completes
        if (this.game.sound.onBlurPausedSounds)
        {
            this.game.sound.unlock();
        }

        this.create(scene);
    },

    /**
     * Handle payload completion for a Scene.
     *
     * @method Phaser.Scenes.SceneManager#payloadComplete
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - The loader that has completed loading its Scene's payload.
     */
    payloadComplete: function (loader)
    {
        this.bootScene(loader.scene);
    },

    /**
     * Updates the Scenes.
     *
     * @method Phaser.Scenes.SceneManager#update
     * @since 3.0.0
     *
     * @param {number} time - Time elapsed.
     * @param {number} delta - Delta time from the last update.
     */
    update: function (time, delta)
    {
        this.processQueue();

        this.isProcessing = true;

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
     * Informs the Scenes of the Game being resized.
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
     * Renders the Scenes.
     *
     * @method Phaser.Scenes.SceneManager#render
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The renderer to use.
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

        this.isProcessing = false;
    },

    /**
     * Calls the given Scene's {@link Phaser.Scene#create} method and updates its status.
     *
     * @method Phaser.Scenes.SceneManager#create
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene to create.
     */
    create: function (scene)
    {
        var sys = scene.sys;
        var settings = sys.settings;

        if (scene.create)
        {
            scene.sys.settings.status = CONST.CREATING;

            scene.create.call(scene, scene.sys.settings.data);

            if (settings.isTransition)
            {
                sys.events.emit('transitionstart', settings.transitionFrom, settings.transitionDuration);
            }
        }

        settings.status = CONST.RUNNING;
    },

    /**
     * Creates and initializes a Scene from a function.
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromFunction
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key of the Scene.
     * @param {function} scene - The function to create the Scene from.
     *
     * @return {Phaser.Scene} The created Scene.
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
     * Creates and initializes a Scene instance.
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromInstance
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key of the Scene.
     * @param {Phaser.Scene} newScene - The Scene instance.
     *
     * @return {Phaser.Scene} The created Scene.
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
     * Creates and initializes a Scene from an Object definition.
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromObject
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key of the Scene.
     * @param {(string|Phaser.Scenes.Settings.Config)} sceneConfig - The Scene config.
     *
     * @return {Phaser.Scene} The created Scene.
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

        var defaults = [ 'init', 'preload', 'create', 'update', 'render' ];

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
                var value = sceneConfig.extend[propertyKey];

                if (propertyKey === 'data' && newScene.hasOwnProperty('data') && typeof value === 'object')
                {
                    //  Populate the DataManager
                    newScene.data.merge(value);
                }
                else if (propertyKey !== 'sys')
                {
                    newScene[propertyKey] = value;
                }
            }
        }

        return newScene;
    },

    /**
     * Retrieves the key of a Scene from a Scene config.
     *
     * @method Phaser.Scenes.SceneManager#getKey
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key to check in the Scene config.
     * @param {(Phaser.Scene|Phaser.Scenes.Settings.Config|function)} sceneConfig - The Scene config.
     *
     * @return {string} The Scene key.
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
     * Retrieves a Scene.
     *
     * @method Phaser.Scenes.SceneManager#getScene
     * @since 3.0.0
     *
     * @param {string|Phaser.Scene} key - The Scene to retrieve.
     *
     * @return {?Phaser.Scene} The Scene.
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
     * Determines whether a Scene is active.
     *
     * @method Phaser.Scenes.SceneManager#isActive
     * @since 3.0.0
     *
     * @param {string} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is active.
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
     * Determines whether a Scene is visible.
     *
     * @method Phaser.Scenes.SceneManager#isVisible
     * @since 3.0.0
     *
     * @param {string} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is visible.
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
     * Determines whether a Scene is sleeping.
     *
     * @method Phaser.Scenes.SceneManager#isSleeping
     * @since 3.0.0
     *
     * @param {string} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is sleeping.
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
     * Pauses the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#pause
     * @since 3.0.0
     *
     * @param {string} key - The Scene to pause.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
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
     * Resumes the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#resume
     * @since 3.0.0
     *
     * @param {string} key - The Scene to resume.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
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
     * Puts the given Scene to sleep.
     *
     * @method Phaser.Scenes.SceneManager#sleep
     * @since 3.0.0
     *
     * @param {string} key - The Scene to put to sleep.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    sleep: function (key)
    {
        var scene = this.getScene(key);

        if (scene && !scene.sys.isTransitioning())
        {
            scene.sys.sleep();
        }

        return this;
    },

    /**
     * Awakens the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#wake
     * @since 3.0.0
     *
     * @param {string} key - The Scene to wake up.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
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
     * Starts the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#start
     * @since 3.0.0
     *
     * @param {string} key - The Scene to start.
     * @param {object} [data] - Optional data object to pass to Scene.Settings and Scene.init.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    start: function (key, data)
    {
        //  If the Scene Manager is not running, then put the Scene into a holding pattern
        if (!this.isBooted)
        {
            this._data[key] = {
                autoStart: true,
                data: data
            };

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
            if (loader && scene.sys.settings.hasOwnProperty('pack'))
            {
                loader.reset();

                if (loader.addPack({ payload: scene.sys.settings.pack }))
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
     * Stops the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#stop
     * @since 3.0.0
     *
     * @param {string} key - The Scene to stop.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    stop: function (key)
    {
        var scene = this.getScene(key);

        if (scene && !scene.sys.isTransitioning())
        {
            scene.sys.shutdown();
        }

        return this;
    },

    /**
     * Sleeps one one Scene and starts the other.
     *
     * @method Phaser.Scenes.SceneManager#switch
     * @since 3.0.0
     *
     * @param {string} from - The Scene to sleep.
     * @param {string} to - The Scene to start.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
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
     * Retrieves a Scene by numeric index.
     *
     * @method Phaser.Scenes.SceneManager#getAt
     * @since 3.0.0
     *
     * @param {integer} index - The index of the Scene to retrieve.
     *
     * @return {(Phaser.Scene|undefined)} The Scene.
     */
    getAt: function (index)
    {
        return this.scenes[index];
    },

    /**
     * Retrieves the numeric index of a Scene.
     *
     * @method Phaser.Scenes.SceneManager#getIndex
     * @since 3.0.0
     *
     * @param {(string|Phaser.Scene)} key - The key of the Scene.
     *
     * @return {integer} The index of the Scene.
     */
    getIndex: function (key)
    {
        var scene = this.getScene(key);

        return this.scenes.indexOf(scene);
    },

    /**
     * Brings a Scene to the top of the Scenes list.
     *
     * This means it will render above all other Scenes.
     *
     * @method Phaser.Scenes.SceneManager#bringToTop
     * @since 3.0.0
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    bringToTop: function (key)
    {
        if (this.isProcessing)
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
     * Sends a Scene to the back of the Scenes list.
     *
     * This means it will render below all other Scenes.
     *
     * @method Phaser.Scenes.SceneManager#sendToBack
     * @since 3.0.0
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    sendToBack: function (key)
    {
        if (this.isProcessing)
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
     * Moves a Scene down one position in the Scenes list.
     *
     * @method Phaser.Scenes.SceneManager#moveDown
     * @since 3.0.0
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    moveDown: function (key)
    {
        if (this.isProcessing)
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
     * Moves a Scene up one position in the Scenes list.
     *
     * @method Phaser.Scenes.SceneManager#moveUp
     * @since 3.0.0
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    moveUp: function (key)
    {
        if (this.isProcessing)
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
     *
     * This means it will render over the top of the other Scene.
     *
     * @method Phaser.Scenes.SceneManager#moveAbove
     * @since 3.2.0
     *
     * @param {(string|Phaser.Scene)} keyA - The Scene that Scene B will be moved above.
     * @param {(string|Phaser.Scene)} keyB - The Scene to be moved.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    moveAbove: function (keyA, keyB)
    {
        if (keyA === keyB)
        {
            return this;
        }

        if (this.isProcessing)
        {
            this._queue.push({ op: 'moveAbove', keyA: keyA, keyB: keyB });
        }
        else
        {
            var indexA = this.getIndex(keyA);
            var indexB = this.getIndex(keyB);

            if (indexA !== -1 && indexB !== -1)
            {
                var tempScene = this.getAt(indexB);

                //  Remove
                this.scenes.splice(indexB, 1);

                //  Add in new location
                this.scenes.splice(indexA + 1, 0, tempScene);
            }
        }

        return this;
    },

    /**
     * Moves a Scene so it is immediately below another Scene in the Scenes list.
     *
     * This means it will render behind the other Scene.
     *
     * @method Phaser.Scenes.SceneManager#moveBelow
     * @since 3.2.0
     *
     * @param {(string|Phaser.Scene)} keyA - The Scene that Scene B will be moved above.
     * @param {(string|Phaser.Scene)} keyB - The Scene to be moved.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    moveBelow: function (keyA, keyB)
    {
        if (keyA === keyB)
        {
            return this;
        }

        if (this.isProcessing)
        {
            this._queue.push({ op: 'moveBelow', keyA: keyA, keyB: keyB });
        }
        else
        {
            var indexA = this.getIndex(keyA);
            var indexB = this.getIndex(keyB);

            if (indexA !== -1 && indexB !== -1)
            {
                var tempScene = this.getAt(indexB);

                //  Remove
                this.scenes.splice(indexB, 1);

                if (indexA === 0)
                {
                    this.scenes.unshift(tempScene);
                }
                else
                {
                    //  Add in new location
                    this.scenes.splice(indexA, 0, tempScene);
                }
            }
        }

        return this;
    },

    /**
     * Queue a Scene operation for the next update.
     *
     * @method Phaser.Scenes.SceneManager#queueOp
     * @private
     * @since 3.0.0
     *
     * @param {string} op - The operation to perform.
     * @param {(string|Phaser.Scene)} keyA - Scene A.
     * @param {(string|Phaser.Scene)} [keyB] - Scene B.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    queueOp: function (op, keyA, keyB)
    {
        this._queue.push({ op: op, keyA: keyA, keyB: keyB });

        return this;
    },

    /**
     * Swaps the positions of two Scenes in the Scenes list.
     *
     * @method Phaser.Scenes.SceneManager#swapPosition
     * @since 3.0.0
     *
     * @param {(string|Phaser.Scene)} keyA - The first Scene to swap.
     * @param {(string|Phaser.Scene)} keyB - The second Scene to swap.
     *
     * @return {Phaser.Scenes.SceneManager} This SceneManager.
     */
    swapPosition: function (keyA, keyB)
    {
        if (keyA === keyB)
        {
            return this;
        }

        if (this.isProcessing)
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

    /**
     * Dumps debug information about each Scene to the developer console.
     *
     * @method Phaser.Scenes.SceneManager#dump
     * @since 3.2.0
     */
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
     * Destroy the SceneManager and all of its Scene's systems.
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

        this.update = NOOP;

        this.scenes = [];

        this._pending = [];
        this._start = [];
        this._queue = [];

        this.game = null;
    }

});

module.exports = SceneManager;
