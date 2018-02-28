/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var GetPhysicsPlugins = require('./GetPhysicsPlugins');
var GetScenePlugins = require('./GetScenePlugins');
var Plugins = require('../plugins');
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
 * @param {object} config - Scene specific configuration settings.
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
         * @type {object}
         * @since 3.0.0
         */
        this.config = config;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#settings
         * @type {[type]}
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
         * @type {[type]}
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
         * @type {null}
         * @since 3.0.0
         */
        this.displayList;

        /**
         * [description]
         *
         * @name Phaser.Scenes.Systems#events
         * @type {EventEmitter}
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
         * @type {[type]}
         * @since 3.0.0
         */
        this.updateList;
    },

    /**
     * [description]
     *
     * @method Phaser.Scenes.Systems#init
     * @since 3.0.0
     *
     * @param {Phaser.Game} game - A reference to the Phaser Game
     */
    init: function (game)
    {
        this.settings.status = CONST.INIT;

        this.game = game;

        this.canvas = game.canvas;
        this.context = game.context;

        var pluginManager = game.plugins;

        this.plugins = pluginManager;

        pluginManager.installGlobal(this, Plugins.Global);

        pluginManager.installLocal(this, Plugins.CoreScene);

        pluginManager.installLocal(this, GetScenePlugins(this));

        pluginManager.installLocal(this, GetPhysicsPlugins(this));

        this.events.emit('boot', this);

        this.settings.isBooted = true;
    },

    /**
     * [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.Scenes.Systems#render
     * @since 3.0.0
     *
     * @param {Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer} renderer - [description]
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
     * Resume this Scene.
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
     * A sleeping Scene doesn't run it's update step or render anything, but it also isn't destroyed,
     * or have any of its systems or children removed, meaning it can be re-activated at any point.
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
        this.settings.status = CONST.RUNNING;

        this.settings.active = true;
        this.settings.visible = true;

        this.events.emit('wake', this);

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
     * [description]
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
     * [description]
     *
     * @method Phaser.Scenes.Systems#setActive
     * @since 3.0.0
     *
     * @param {boolean} value - [description]
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
     *
     * @method Phaser.Scenes.Systems#start
     * @since 3.0.0
     *
     * @param {object} data - [description]
     */
    start: function (data)
    {
        this.settings.status = CONST.START;

        this.settings.data = data;

        this.settings.active = true;
        this.settings.visible = true;

        this.events.emit('start', this);
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
     *
     * @method Phaser.Scenes.Systems#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.settings.status = CONST.SHUTDOWN;

        this.settings.active = false;
        this.settings.visible = false;

        this.events.emit('shutdown', this);
    },

    /**
     * Destroy this Scene and send a destroy event all of its systems.
     *
     * @method Phaser.Scenes.Systems#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.settings.status = CONST.DESTROYED;

        this.settings.active = false;
        this.settings.visible = false;

        this.events.emit('destroy', this);
    }

});

module.exports = Systems;
