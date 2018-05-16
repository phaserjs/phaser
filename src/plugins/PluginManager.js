/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var FileTypesManager = require('../loader/FileTypesManager');
var GameObjectCreator = require('../gameobjects/GameObjectCreator');
var GameObjectFactory = require('../gameobjects/GameObjectFactory');
var GetFastValue = require('../utils/object/GetFastValue');
var PluginCache = require('./PluginCache');
var Remove = require('../utils/array/Remove');

/**
 * @typedef {object} GlobalPlugin
 *
 * @property {string} key - The unique name of this plugin within the plugin cache.
 * @property {function} plugin - An instance of the plugin.
 * @property {boolean} [active] - Is the plugin active or not?
 */

/**
 * @classdesc
 * The PluginManager is responsible for installing and adding plugins to Phaser.
 *
 * It is a global system and therefore belongs to the Game instance, not a specific Scene.
 *
 * It works in conjunction with the PluginCache. Core internal plugins automatically register themselves 
 * with the Cache, but it's the Plugin Manager that is responsible for injecting them into the Scenes.
 *
 * There are two types of plugin:
 *
 * 1) A Global Plugin
 * 2) A Scene Plugin
 *
 * A Global Plugin is a plugin that lives within the Plugin Manager rather than a Scene. You can get
 * access to it by calling `PluginManager.get` and providing a key. Any Scene that requests a plugin in
 * this way will all get access to the same plugin instance, allowing you to use a single plugin across
 * multiple Scenes.
 *
 * A Scene Plugin is a plugin dedicated to running within a Scene. These are different to Global Plugins
 * in that their instances do not live within the Plugin Manager, but within the Scene Systems class instead.
 * And that every Scene created is given its own unique instance of a Scene Plugin. Examples of core Scene
 * Plugins include the Input Plugin, the Tween Plugin and the physics Plugins.
 *
 * You can add a plugin to Phaser in three different ways:
 *
 * 1) Preload it
 * 2) Include it in your source code and install it via the Game Config
 * 3) Include it in your source code and install it within a Scene
 *
 * For examples of all of these approaches please see the Phaser 3 Examples Repo `plugins` folder.
 *
 * For information on creating your own plugin please see the Phaser 3 Plugin Template.
 *
 * @class PluginManager
 * @memberOf Phaser.Plugins
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The game instance that owns this Plugin Manager.
 */
var PluginManager = new Class({

    Extends: EventEmitter,

    initialize:

    function PluginManager (game)
    {
        EventEmitter.call(this);

        /**
         * The game instance that owns this Plugin Manager.
         *
         * @name Phaser.Plugins.PluginManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * The global plugins currently running and managed by this Plugin Manager.
         * A plugin must have been started at least once in order to appear in this list.
         *
         * @name Phaser.Plugins.PluginManager#plugins
         * @type {GlobalPlugin[]}
         * @since 3.8.0
         */
        this.plugins = [];

        /**
         * A list of plugin keys that should be installed into Scenes as well as the Core Plugins.
         *
         * @name Phaser.Plugins.PluginManager#scenePlugins
         * @type {string[]}
         * @since 3.8.0
         */
        this.scenePlugins = [];

        /**
         * A temporary list of plugins to install when the game has booted.
         *
         * @name Phaser.Plugins.PluginManager#_pendingGlobal
         * @private
         * @type {array}
         * @since 3.8.0
         */
        this._pendingGlobal = [];

        /**
         * A temporary list of scene plugins to install when the game has booted.
         *
         * @name Phaser.Plugins.PluginManager#_pendingScene
         * @private
         * @type {array}
         * @since 3.8.0
         */
        this._pendingScene = [];

        if (game.isBooted)
        {
            this.boot();
        }
        else
        {
            game.events.once('boot', this.boot, this);
        }
    },

    /**
     * Run once the game has booted and installs all of the plugins configured in the Game Config.
     *
     * @method Phaser.Plugins.PluginManager#boot
     * @protected
     * @since 3.0.0
     */
    boot: function ()
    {
        var i;
        var entry;
        var key;
        var plugin;
        var start;
        var mapping;
        var config = this.game.config;

        //  Any plugins to install?
        var list = config.installGlobalPlugins;

        //  Any plugins added outside of the game config, but before the game booted?
        list = list.concat(this._pendingGlobal);

        for (i = 0; i < list.length; i++)
        {
            entry = list[i];

            // { key: 'TestPlugin', plugin: TestPlugin, start: true }

            key = GetFastValue(entry, 'key', null);
            plugin = GetFastValue(entry, 'plugin', null);
            start = GetFastValue(entry, 'start', false);

            if (key && plugin)
            {
                this.install(key, plugin, start);
            }
        }

        //  Any scene plugins to install?
        list = config.installScenePlugins;

        //  Any plugins added outside of the game config, but before the game booted?
        list = list.concat(this._pendingScene);

        for (i = 0; i < list.length; i++)
        {
            entry = list[i];

            // { key: 'moveSpritePlugin', plugin: MoveSpritePlugin, , mapping: 'move' }

            key = GetFastValue(entry, 'key', null);
            plugin = GetFastValue(entry, 'plugin', null);
            mapping = GetFastValue(entry, 'mapping', null);

            if (key && plugin)
            {
                this.installScenePlugin(key, plugin, mapping);
            }
        }

        this._pendingGlobal = [];
        this._pendingScene = [];

        this.game.events.once('destroy', this.destroy, this);
    },

    /**
     * Called by the Scene Systems class. Tells the plugin manager to install all Scene plugins into it.
     *
     * @method Phaser.Plugins.PluginManager#addToScene
     * @protected
     * @since 3.8.0
     *
     * @param {Phaser.Scenes.Systems} sys - The Scene Systems class to install all the plugins in to.
     * @param {array} globalPlugins - An array of global plugins to install.
     * @param {array} scenePlugins - An array of scene plugins to install.
     */
    addToScene: function (sys, globalPlugins, scenePlugins)
    {
        var i;
        var pluginKey;
        var game = this.game;
        var scene = sys.scene;
        var map = sys.settings.map;
        var isBooted = sys.settings.isBooted;

        //  Reference the GlobalPlugins from Game into Scene.Systems
        for (i = 0; i < globalPlugins.length; i++)
        {
            pluginKey = globalPlugins[i];
           
            if (game[pluginKey])
            {
                sys[pluginKey] = game[pluginKey];

                //  Scene level injection
                if (map.hasOwnProperty(pluginKey))
                {
                    scene[map[pluginKey]] = sys[pluginKey];
                }
            }
        }

        for (var s = 0; s < scenePlugins.length; s++)
        {
            var pluginList = scenePlugins[s];

            for (i = 0; i < pluginList.length; i++)
            {
                pluginKey = pluginList[i];

                if (!PluginCache.hasCore(pluginKey))
                {
                    continue;
                }

                var source = PluginCache.getCore(pluginKey);

                var plugin = new source.plugin(scene, this);
                
                sys[source.mapping] = plugin;

                //  Scene level injection
                if (source.custom)
                {
                    scene[source.mapping] = plugin;
                }
                else if (map.hasOwnProperty(source.mapping))
                {
                    scene[map[source.mapping]] = plugin;
                }

                //  Scene is already booted, usually because this method is being called at run-time, so boot the plugin
                if (isBooted)
                {
                    plugin.boot();
                }
            }
        }
    },

    /**
     * Called by the Scene Systems class. Returns a list of plugins to be installed.
     *
     * @method Phaser.Plugins.PluginManager#getDefaultScenePlugins
     * @protected
     * @since 3.8.0
     *
     * @return {string[]} A list keys of all the Scene Plugins to install.
     */
    getDefaultScenePlugins: function ()
    {
        var list = this.game.config.defaultPlugins;

        //  Merge in custom Scene plugins
        list = list.concat(this.scenePlugins);

        return list;
    },

    /**
     * Installs a new Scene Plugin into the Plugin Manager and optionally adds it
     * to the given Scene as well. A Scene Plugin added to the manager in this way
     * will be automatically installed into all new Scenes using the key and mapping given.
     *
     * The `key` property is what the plugin is injected into Scene.Systems as.
     * The `mapping` property is optional, and if specified is what the plugin is installed into
     * the Scene as. For example:
     *
     * ```javascript
     * this.plugins.installScenePlugin('powerupsPlugin', pluginCode, 'powerups');
     * 
     * // and from within the scene:
     * this.sys.powerupsPlugin; // key value
     * this.powerups; // mapping value
     * ```
     *
     * This method is called automatically by Phaser if you install your plugins using either the
     * Game Configuration object, or by preloading them via the Loader.
     *
     * @method Phaser.Plugins.PluginManager#installScenePlugin
     * @since 3.8.0
     *
     * @param {string} key - The property key that will be used to add this plugin to Scene.Systems.
     * @param {function} plugin - The plugin code. This should be the non-instantiated version.
     * @param {string} [mapping] - If this plugin is injected into the Phaser.Scene class, this is the property key to use.
     * @param {Phaser.Scene} [addToScene] - Optionally automatically add this plugin to the given Scene.
     */
    installScenePlugin: function (key, plugin, mapping, addToScene)
    {
        if (typeof plugin !== 'function')
        {
            console.warn('Invalid Scene Plugin: ' + key);
            return;
        }

        if (PluginCache.hasCore(key))
        {
            console.warn('Scene Plugin key in use: ' + key);
            return;
        }

        PluginCache.register(key, plugin, mapping, true);

        this.scenePlugins.push(key);

        if (addToScene)
        {
            var instance = new plugin(addToScene, this);

            addToScene.sys[key] = instance;

            if (mapping && mapping !== '')
            {
                addToScene[mapping] = instance;
            }

            instance.boot();
        }
    },

    /**
     * Installs a new Global Plugin into the Plugin Manager and optionally starts it running.
     * A global plugin belongs to the Plugin Manager, rather than a specific Scene, and can be accessed
     * and used by all Scenes in your game.
     *
     * The `key` property is what you use to access this plugin from the Plugin Manager.
     *
     * ```javascript
     * this.plugins.install('powerupsPlugin', pluginCode);
     * 
     * // and from within the scene:
     * this.plugins.get('powerupsPlugin');
     * ```
     *
     * This method is called automatically by Phaser if you install your plugins using either the
     * Game Configuration object, or by preloading them via the Loader.
     *
     * The same plugin can be installed multiple times into the Plugin Manager by simply giving each
     * instance its own unique key.
     *
     * @method Phaser.Plugins.PluginManager#install
     * @since 3.8.0
     * 
     * @param {string} key - The unique handle given to this plugin within the Plugin Manager.
     * @param {function} plugin - The plugin code. This should be the non-instantiated version.
     * @param {boolean} [start=false] - Automatically start the plugin running?
     */
    install: function (key, plugin, start)
    {
        if (start === undefined) { start = false; }

        if (typeof plugin !== 'function')
        {
            console.warn('Invalid Plugin: ' + key);
            return;
        }

        if (PluginCache.hasCustom(key))
        {
            console.warn('Plugin key in use: ' + key);
            return;
        }

        if (!this.game.isBooted)
        {
            this._pendingGlobal.push({ key: key, plugin: plugin, start: start });
        }
        else
        {
            //  Add it to the plugin store
            PluginCache.registerCustom(key, plugin);

            // gamePlugins[key] = plugin;

            if (start)
            {
                return this.start(key);
            }
        }
    },

    /**
     * Gets an index of a global plugin based on the given key.
     *
     * @method Phaser.Plugins.PluginManager#getIndex
     * @protected
     * @since 3.8.0
     *
     * @param {string} key - The unique plugin key.
     *
     * @return {integer} The index of the plugin within the plugins array.
     */
    getIndex: function (key)
    {
        var list = this.plugins;

        for (var i = 0; i < list.length; i++)
        {
            var entry = list[i];

            if (entry.key === key)
            {
                return i;
            }
        }

        return -1;
    },

    /**
     * Gets a global plugin based on the given key.
     *
     * @method Phaser.Plugins.PluginManager#getEntry
     * @protected
     * @since 3.8.0
     *
     * @param {string} key - The unique plugin key.
     *
     * @return {GlobalPlugin} The plugin entry.
     */
    getEntry: function (key)
    {
        var idx = this.getIndex(key);

        if (idx !== -1)
        {
            return this.plugins[idx];
        }
    },

    /**
     * Checks if the given global plugin, based on its key, is active or not.
     *
     * @method Phaser.Plugins.PluginManager#isActive
     * @since 3.8.0
     *
     * @param {string} key - The unique plugin key.
     *
     * @return {boolean} `true` if the plugin is active, otherwise `false`.
     */
    isActive: function (key)
    {
        var entry = this.getEntry(key);

        return (entry && entry.active);
    },

    /**
     * Starts a global plugin running.
     *
     * If the plugin was previously active then calling `start` will reset it to an active state and then
     * call its `start` method.
     *
     * If the plugin has never been run before a new instance of it will be created within the Plugin Manager,
     * its active state set and then both of its `init` and `start` methods called, in that order.
     *
     * If the plugin is already running under the given key then nothing happens.
     *
     * @method Phaser.Plugins.PluginManager#start
     * @since 3.8.0
     *
     * @param {string} key - The key of the plugin to start.
     * @param {string} [runAs] - Run the plugin under a new key. This allows you to run one plugin multiple times.
     *
     * @return {?Phaser.Plugins.BasePlugin} The plugin that was started, or `null` if invalid key given or plugin is already stopped.
     */
    start: function (key, runAs)
    {
        if (runAs === undefined) { runAs = key; }

        var entry = this.getEntry(runAs);

        //  Plugin already running under this key?
        if (entry && !entry.active)
        {
            //  It exists, we just need to start it up again
            entry.active = true;
            entry.plugin.start();
        }
        else if (!entry)
        {
            var plugin = this.getClass(key);

            if (plugin)
            {
                var instance = new plugin(this);

                entry = {
                    key: runAs,
                    plugin: instance,
                    active: true
                };

                this.plugins.push(entry);

                instance.init();
                instance.start();
            }
        }

        return (entry) ? entry.plugin : null;
    },

    /**
     * Stops a global plugin from running.
     *
     * If the plugin is active then its active state will be set to false and the plugins `stop` method
     * will be called.
     *
     * If the plugin is not already running, nothing will happen.
     *
     * @method Phaser.Plugins.PluginManager#stop
     * @since 3.8.0
     *
     * @param {string} key - The key of the plugin to stop.
     *
     * @return {Phaser.Plugins.PluginManager} The Plugin Manager.
     */
    stop: function (key)
    {
        var entry = this.getEntry(key);

        if (entry && entry.active)
        {
            entry.active = false;
            entry.plugin.stop();
        }

        return this;
    },

    /**
     * Gets a global plugin from the Plugin Manager based on the given key and returns it.
     *
     * If it cannot find an active plugin based on the key, but there is one in the Plugin Cache with the same key,
     * then it will create a new instance of the cached plugin and return that.
     *
     * @method Phaser.Plugins.PluginManager#get
     * @since 3.8.0
     *
     * @param {string} key - The key of the plugin to get.
     * @param {boolean} [autoStart=true] - Automatically start a new instance of the plugin if found in the cache, but not actively running.
     *
     * @return {?(Phaser.Plugins.BasePlugin|function)} The plugin, or `null` if no plugin was found matching the key.
     */
    get: function (key, autoStart)
    {
        if (autoStart === undefined) { autoStart = true; }

        var entry = this.getEntry(key);

        if (entry)
        {
            return entry.plugin;
        }
        else
        {
            var plugin = this.getClass(key);

            if (plugin && autoStart)
            {
                var instance = new plugin(this);

                entry = {
                    key: key,
                    plugin: instance,
                    active: true
                };

                this.plugins.push(entry);

                instance.init();
                instance.start();

                return instance;
            }
            else if (plugin)
            {
                return plugin;
            }
        }

        return null;
    },

    /**
     * Returns the plugin class from the cache.
     * Used internally by the Plugin Manager.
     *
     * @method Phaser.Plugins.PluginManager#getClass
     * @since 3.8.0
     *
     * @param {string} key - The key of the plugin to get.
     *
     * @return {Phaser.Plugins.BasePlugin} A Plugin object
     */
    getClass: function (key)
    {
        return PluginCache.getCustomClass(key);
    },

    /**
     * Removes a global plugin from the Plugin Manager and Plugin Cache.
     *
     * It is up to you to remove all references to this plugin that you may hold within your game code.
     *
     * @method Phaser.Plugins.PluginManager#removeGlobalPlugin
     * @since 3.8.0
     *
     * @param {string} key - The key of the plugin to remove.
     */
    removeGlobalPlugin: function (key)
    {
        var entry = this.getEntry(key);

        if (entry)
        {
            Remove(this.plugins, entry);
        }

        PluginCache.removeCustom(key);
    },

    /**
     * Removes a scene plugin from the Plugin Manager and Plugin Cache.
     *
     * This will not remove the plugin from any active Scenes that are already using it.
     *
     * It is up to you to remove all references to this plugin that you may hold within your game code.
     *
     * @method Phaser.Plugins.PluginManager#removeScenePlugin
     * @since 3.8.0
     *
     * @param {string} key - The key of the plugin to remove.
     */
    removeScenePlugin: function (key)
    {
        Remove(this.scenePlugins, key);

        PluginCache.remove(key);
    },

    /**
     * Registers a new type of Game Object with the global Game Object Factory and / or Creator.
     * This is usually called from within your Plugin code and is a helpful short-cut for creating
     * new Game Objects.
     *
     * The key is the property that will be injected into the factories and used to create the
     * Game Object. For example:
     *
     * ```javascript
     * this.plugins.registerGameObject('clown', clownFactoryCallback, clownCreatorCallback);
     * // later in your game code:
     * this.add.clown();
     * this.make.clown();
     * ```
     * 
     * The callbacks are what are called when the factories try to create a Game Object
     * matching the given key. It's important to understand that the callbacks are invoked within
     * the context of the GameObjectFactory. In this context there are several properties available
     * to use:
     * 
     * this.scene - A reference to the Scene that owns the GameObjectFactory.
     * this.displayList - A reference to the Display List the Scene owns.
     * this.updateList - A reference to the Update List the Scene owns.
     * 
     * See the GameObjectFactory and GameObjectCreator classes for more details.
     * Any public property or method listed is available from your callbacks under `this`.
     *
     * @method Phaser.Plugins.PluginManager#registerGameObject
     * @since 3.8.0
     *
     * @param {string} key - The key of the Game Object that the given callbacks will create, i.e. `image`, `sprite`.
     * @param {function} [factoryCallback] - The callback to invoke when the Game Object Factory is called.
     * @param {function} [creatorCallback] - The callback to invoke when the Game Object Creator is called.
     */
    registerGameObject: function (key, factoryCallback, creatorCallback)
    {
        if (factoryCallback)
        {
            GameObjectFactory.register(key, factoryCallback);
        }

        if (creatorCallback)
        {
            GameObjectCreator.register(key, creatorCallback);
        }

        return this;
    },

    /**
     * Registers a new file type with the global File Types Manager, making it available to all Loader
     * Plugins created after this.
     * 
     * This is usually called from within your Plugin code and is a helpful short-cut for creating
     * new loader file types.
     *
     * The key is the property that will be injected into the Loader Plugin and used to load the
     * files. For example:
     *
     * ```javascript
     * this.plugins.registerFileType('wad', doomWadLoaderCallback);
     * // later in your preload code:
     * this.load.wad();
     * ```
     * 
     * The callback is what is called when the loader tries to load a file  matching the given key.
     * It's important to understand that the callback is invoked within
     * the context of the LoaderPlugin. In this context there are several properties / methods available
     * to use:
     * 
     * this.addFile - A method to add the new file to the load queue.
     * this.scene - The Scene that owns the Loader Plugin instance.
     *
     * See the LoaderPlugin class for more details. Any public property or method listed is available from
     * your callback under `this`.
     *
     * @method Phaser.Plugins.PluginManager#registerFileType
     * @since 3.8.0
     *
     * @param {string} key - The key of the Game Object that the given callbacks will create, i.e. `image`, `sprite`.
     * @param {function} callback - The callback to invoke when the Game Object Factory is called.
     */
    registerFileType: function (key, callback)
    {
        FileTypesManager.register(key, callback);
    },

    /**
     * Destroys this Plugin Manager and all associated plugins.
     * It will iterate all plugins found and call their `destroy` methods.
     * Note that the PluginCache is NOT cleared by this as it doesn't hold any plugin instances.
     *
     * @method Phaser.Plugins.PluginManager#destroy
     * @since 3.8.0
     */
    destroy: function ()
    {
        for (var i = 0; i < this.plugins.length; i++)
        {
            this.plugins[i].destroy();
        }

        this.game = null;
        this.plugins = [];
        this.scenePlugins = [];
    }

});

/*
 * "Sometimes, the elegant implementation is just a function.
 * Not a method. Not a class. Not a framework. Just a function."
 *  -- John Carmack
 */

module.exports = PluginManager;
