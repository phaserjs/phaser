/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var DefaultPlugins = require('../plugins/DefaultPlugins');
var GetPhysicsPlugins = require('./GetPhysicsPlugins');
var GetScenePlugins = require('./GetScenePlugins');
var Settings = require('./Settings');

/**
 * @classdesc
 * The Scene Systems class.
 *
 * This class is available from within a Scene under the property `sys`.
 * It is responsible for managing all of the plugins a Scene has running, including the display list, and
 * handling the update step and renderer. It also contains references to global systems belonging to Game.
 *
 * @class Systems
 * @memberOf Phaser.Scenes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that owns this Systems instance.
 * @param {(string|Phaser.Scenes.Settings.Config)} config - Scene specific configuration settings.
 */
var Systems = new Class({

    initialize:

    function Systems (scene, config)
    {
        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#config
         * @type {(string|Phaser.Scenes.Settings.Config)}
         * @since 3.0.0
         */
        this.config = config;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#settings
         * @type {Phaser.Scenes.Settings.Object}
         * @since 3.0.0
         */
        this.settings = Settings.create(config);

        /**
         * A handy reference to the Scene canvas / context.
         *
         * @name Phaser.Scenes.Systems#canvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvas;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#context
         * @type {CanvasRenderingContext2D}
         * @since 3.0.0
         */
        this.context;

        //  Global Systems - these are single-instance global managers that belong to Game

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#anims
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.anims;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#cache
         * @type {Phaser.Cache.CacheManager}
         * @since 3.0.0
         */
        this.cache;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#plugins
         * @type {Phaser.Plugins.PluginManager}
         * @since 3.0.0
         */
        this.plugins;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#registry
         * @type {Phaser.Data.DataManager}
         * @since 3.0.0
         */
        this.registry;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#sound
         * @type {Phaser.Sound.BaseSoundManager}
         * @since 3.0.0
         */
        this.sound;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#textures
         * @type {Phaser.Textures.TextureManager}
         * @since 3.0.0
         */
        this.textures;

        //  Core Plugins - these are non-optional Scene plugins, needed by lots of the other systems

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#add
         * @type {Phaser.GameObjects.GameObjectFactory}
         * @since 3.0.0
         */
        this.add;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#cameras
         * @type {Phaser.Cameras.Scene2D.CameraManager}
         * @since 3.0.0
         */
        this.cameras;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#displayList
         * @type {Phaser.GameObjects.DisplayList}
         * @since 3.0.0
         */
        this.displayList;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#make
         * @type {Phaser.GameObjects.GameObjectCreator}
         * @since 3.0.0
         */
        this.make;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#scenePlugin
         * @type {Phaser.Scenes.ScenePlugin}
         * @since 3.0.0
         */
        this.scenePlugin;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#updateList
         * @type {Phaser.GameObjects.UpdateList}
         * @since 3.0.0
         */
        this.updateList;
    },

    /**
     * This method is called only once by the Scene Manager when the Scene is instantiated.
     * It is responsible for setting up all of the Scene plugins and references.
     * It should never be called directly.
     *
     * @method Phaser.Scenes.Systems#init
     * @protected
     * @since 3.0.0
     *
     * @param {Phaser.Game} game - A reference to the Phaser Game instance.
     */
    init: function (game)
    {
        this.settings.status = CONST.INIT;

        this.game = game;

        this.canvas = game.canvas;
        this.context = game.context;

        var pluginManager = game.plugins;

        this.plugins = pluginManager;

        pluginManager.addToScene(this, DefaultPlugins.Global, [ DefaultPlugins.CoreScene, GetScenePlugins(this), GetPhysicsPlugins(this) ]);

        // pluginManager.installSceneGlobal(this, DefaultPlugins.Global);
        // pluginManager.installSceneLocal(this, DefaultPlugins.CoreScene);
        // pluginManager.installSceneLocal(this, GetScenePlugins(this));
        // pluginManager.installSceneLocal(this, GetPhysicsPlugins(this));

        this.events.emit('boot', this);

        this.settings.isBooted = true;
    },

    /**
     * Called by a plugin, it tells the System to install the plugin locally.
     *
     * @method Phaser.Scenes.Systems#install
     * @private
     * @since 3.0.0
     *
     * @param {array} plugin - An array of plugins to install into this Scene.
     */
    install: function (plugin)
    {
        if (!Array.isArray(plugin))
        {
            plugin = [ plugin ];
        }

        this.plugins.installLocal(this, plugin);
    },

    /**
     * A single game step. Called automatically by the Scene Manager as a result of a Request Animation
     * Frame or Set Timeout call to the main Game instance.
     *
     * @method Phaser.Scenes.Systems#step
     * @since 3.0.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
     */
    step: function (time, delta)
    {
        this.events.emit('preupdate', time, delta);

        this.events.emit('update', time, delta);

        this.scene.update.call(this.scene, time, delta);

        this.events.emit('postupdate', time, delta);
    },

    /**
     * Called automatically by the Scene Manager. Instructs the Scene to render itself via
     * its Camera Manager to the renderer given.
     *
     * @method Phaser.Scenes.Systems#render
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - [description]
     */
    render: function (renderer)
    {
        var displayList = this.displayList;

        displayList.depthSort();

        this.cameras.render(renderer, displayList);

        this.events.emit('render', renderer);
    },

    /**
     * Force a sort of the display list on the next render.
     *
     * @method Phaser.Scenes.Systems#queueDepthSort
     * @since 3.0.0
     */
    queueDepthSort: function ()
    {
        this.displayList.queueDepthSort();
    },

    /**
     * Immediately sorts the display list if the flag is set.
     *
     * @method Phaser.Scenes.Systems#depthSort
     * @since 3.0.0
     */
    depthSort: function ()
    {
        this.displayList.depthSort();
    },

    /**
     * Pause this Scene.
     * A paused Scene still renders, it just doesn't run ANY of its update handlers or systems.
     *
     * @method Phaser.Scenes.Systems#pause
     * @since 3.0.0
     *
     * @return {Phaser.Scenes.Systems} This Systems object.
     */
    pause: function ()
    {
        if (this.settings.active)
        {
            this.settings.status = CONST.PAUSED;

            this.settings.active = false;

            this.events.emit('pause', this);
        }

        return this;
    },

    /**
     * Resume this Scene from a paused state.
     *
     * @method Phaser.Scenes.Systems#resume
     * @since 3.0.0
     *
     * @return {Phaser.Scenes.Systems} This Systems object.
     */
    resume: function ()
    {
        if (!this.settings.active)
        {
            this.settings.status = CONST.RUNNING;

            this.settings.active = true;

            this.events.emit('resume', this);
        }

        return this;
    },

    /**
     * Send this Scene to sleep.
     *
     * A sleeping Scene doesn't run it's update step or render anything, but it also isn't shut down
     * or have any of its systems or children removed, meaning it can be re-activated at any point and
     * will carry on from where it left off. It also keeps everything in memory and events and callbacks
     * from other Scenes may still invoke changes within it, so be careful what is left active.
     *
     * @method Phaser.Scenes.Systems#sleep
     * @since 3.0.0
     *
     * @return {Phaser.Scenes.Systems} This Systems object.
     */
    sleep: function ()
    {
        this.settings.status = CONST.SLEEPING;

        this.settings.active = false;
        this.settings.visible = false;

        this.events.emit('sleep', this);

        return this;
    },

    /**
     * Wake-up this Scene if it was previously asleep.
     *
     * @method Phaser.Scenes.Systems#wake
     * @since 3.0.0
     *
     * @return {Phaser.Scenes.Systems} This Systems object.
     */
    wake: function ()
    {
        var settings = this.settings;

        settings.status = CONST.RUNNING;

        settings.active = true;
        settings.visible = true;

        this.events.emit('wake', this);

        if (settings.isTransition)
        {
            this.events.emit('transitionwake', settings.transitionFrom, settings.transitionDuration);
        }

        return this;
    },

    /**
     * Is this Scene sleeping?
     *
     * @method Phaser.Scenes.Systems#isSleeping
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isSleeping: function ()
    {
        return (this.settings.status === CONST.SLEEPING);
    },

    /**
     * Is this Scene active?
     *
     * @method Phaser.Scenes.Systems#isActive
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isActive: function ()
    {
        return (this.settings.status === CONST.RUNNING);
    },

    /**
     * Is this Scene currently transitioning out to, or in from another Scene?
     *
     * @method Phaser.Scenes.Systems#isTransitioning
     * @since 3.5.0
     *
     * @return {boolean} `true` if this Scene is currently transitioning, otherwise `false`.
     */
    isTransitioning: function ()
    {
        return (this.settings.isTransition || this.scenePlugin._target !== null);
    },

    /**
     * Is this Scene currently transitioning out from itself to another Scene?
     *
     * @method Phaser.Scenes.Systems#isTransitionOut
     * @since 3.5.0
     *
     * @return {boolean} `true` if this Scene is in transition to another Scene, otherwise `false`.
     */
    isTransitionOut: function ()
    {
        return (this.scenePlugin._target !== null && this.scenePlugin._duration > 0);
    },

    /**
     * Is this Scene currently transitioning in from another Scene?
     *
     * @method Phaser.Scenes.Systems#isTransitionIn
     * @since 3.5.0
     *
     * @return {boolean} `true` if this Scene is transitioning in from another Scene, otherwise `false`.
     */
    isTransitionIn: function ()
    {
        return (this.settings.isTransition);
    },

    /**
     * Is this Scene visible and rendering?
     *
     * @method Phaser.Scenes.Systems#isVisible
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isVisible: function ()
    {
        return this.settings.visible;
    },

    /**
     * Sets the visible state of this Scene.
     * An invisible Scene will not render, but will still process updates.
     *
     * @method Phaser.Scenes.Systems#setVisible
     * @since 3.0.0
     *
     * @param {boolean} value - [description]
     *
     * @return {Phaser.Scenes.Systems} This Systems object.
     */
    setVisible: function (value)
    {
        this.settings.visible = value;

        return this;
    },

    /**
     * Set the active state of this Scene.
     * An active Scene will run its core update loop.
     *
     * @method Phaser.Scenes.Systems#setActive
     * @since 3.0.0
     *
     * @param {boolean} value - If `true` the Scene will be resumed, if previously paused. If `false` it will be paused.
     *
     * @return {Phaser.Scenes.Systems} This Systems object.
     */
    setActive: function (value)
    {
        if (value)
        {
            return this.resume();
        }
        else
        {
            return this.pause();
        }
    },

    /**
     * Start this Scene running and rendering.
     * Called automatically by the SceneManager.
     *
     * @method Phaser.Scenes.Systems#start
     * @since 3.0.0
     *
     * @param {object} data - Optional data object that may have been passed to this Scene from another.
     */
    start: function (data)
    {
        if (data)
        {
            this.settings.data = data;
        }

        this.settings.status = CONST.START;

        this.settings.active = true;
        this.settings.visible = true;

        //  For plugins to listen out for
        this.events.emit('start', this);

        //  For user-land code to listen out for
        this.events.emit('ready', this);
    },

    /**
     * Called automatically by the SceneManager if the Game resizes.
     * Dispatches an event you can respond to in your game code.
     *
     * @method Phaser.Scenes.Systems#resize
     * @since 3.2.0
     *
     * @param {number} width - The new width of the game.
     * @param {number} height - The new height of the game.
     */
    resize: function (width, height)
    {
        this.events.emit('resize', width, height);
    },

    /**
     * Shutdown this Scene and send a shutdown event to all of its systems.
     * A Scene that has been shutdown will not run its update loop or render, but it does
     * not destroy any of its plugins or references. It is put into hibernation for later use.
     * If you don't ever plan to use this Scene again, then it should be destroyed instead
     * to free-up resources.
     *
     * @method Phaser.Scenes.Systems#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.events.off('transitioninit');
        this.events.off('transitionstart');
        this.events.off('transitioncomplete');
        this.events.off('transitionout');

        this.settings.status = CONST.SHUTDOWN;

        this.settings.active = false;
        this.settings.visible = false;

        this.events.emit('shutdown', this);
    },

    /**
     * Destroy this Scene and send a destroy event all of its systems.
     * A destroyed Scene cannot be restarted.
     * You should not call this directly, instead use `SceneManager.remove`.
     *
     * @method Phaser.Scenes.Systems#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.settings.status = CONST.DESTROYED;

        this.settings.active = false;
        this.settings.visible = false;

        this.events.emit('destroy', this);

        this.events.removeAllListeners();

        var props = [ 'scene', 'game', 'anims', 'cache', 'plugins', 'registry', 'sound', 'textures', 'add', 'camera', 'displayList', 'events', 'make', 'scenePlugin', 'updateList' ];

        for (var i = 0; i < props.length; i++)
        {
            this[props[i]] = null;
        }
    }

});

module.exports = Systems;
