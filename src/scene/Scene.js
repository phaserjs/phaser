/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Systems = require('./Systems');

/**
 * @classdesc
 * A base Phaser.Scene class which can be extended for your own use.
 *
 * @class Scene
 * @memberof Phaser
 * @constructor
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Scenes.SettingsConfig)} config - Scene specific configuration settings.
 */
var Scene = new Class({

    initialize:

    function Scene (config)
    {
        /**
         * The Scene Systems. You must never overwrite this property, or all hell will break lose.
         *
         * @name Phaser.Scene#sys
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.sys = new Systems(this, config);

        /**
         * A reference to the Phaser.Game instance.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game;

        /**
         * A reference to the global Animation Manager.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#anims
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.anims;

        /**
         * A reference to the global Cache.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#cache
         * @type {Phaser.Cache.CacheManager}
         * @since 3.0.0
         */
        this.cache;

        /**
         * A reference to the game level Data Manager.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#registry
         * @type {Phaser.Data.DataManager}
         * @since 3.0.0
         */
        this.registry;

        /**
         * A reference to the Sound Manager.
         * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
         *
         * @name Phaser.Scene#sound
         * @type {Phaser.Sound.BaseSoundManager}
         * @since 3.0.0
         */
        this.sound;

        /**
         * A reference to the Texture Manager.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#textures
         * @type {Phaser.Textures.TextureManager}
         * @since 3.0.0
         */
        this.textures;

        /**
         * A scene level Event Emitter.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events;

        /**
         * A scene level Camera System.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#cameras
         * @type {Phaser.Cameras.Scene2D.CameraManager}
         * @since 3.0.0
         */
        this.cameras;

        /**
         * A scene level Game Object Factory.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#add
         * @type {Phaser.GameObjects.GameObjectFactory}
         * @since 3.0.0
         */
        this.add;

        /**
         * A scene level Game Object Creator.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#make
         * @type {Phaser.GameObjects.GameObjectCreator}
         * @since 3.0.0
         */
        this.make;

        /**
         * A reference to the Scene Manager Plugin.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#scene
         * @type {Phaser.Scenes.ScenePlugin}
         * @since 3.0.0
         */
        this.scene;

        /**
         * A scene level Game Object Display List.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#children
         * @type {Phaser.GameObjects.DisplayList}
         * @since 3.0.0
         */
        this.children;

        /**
         * A scene level Lights Manager Plugin.
         * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
         *
         * @name Phaser.Scene#lights
         * @type {Phaser.GameObjects.LightsManager}
         * @since 3.0.0
         */
        this.lights;

        /**
         * A scene level Data Manager Plugin.
         * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
         *
         * @name Phaser.Scene#data
         * @type {Phaser.Data.DataManager}
         * @since 3.0.0
         */
        this.data;

        /**
         * A scene level Input Manager Plugin.
         * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
         *
         * @name Phaser.Scene#input
         * @type {Phaser.Input.InputPlugin}
         * @since 3.0.0
         */
        this.input;

        /**
         * A scene level Loader Plugin.
         * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
         *
         * @name Phaser.Scene#load
         * @type {Phaser.Loader.LoaderPlugin}
         * @since 3.0.0
         */
        this.load;

        /**
         * A scene level Time and Clock Plugin.
         * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
         *
         * @name Phaser.Scene#time
         * @type {Phaser.Time.Clock}
         * @since 3.0.0
         */
        this.time;

        /**
         * A scene level Tween Manager Plugin.
         * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
         *
         * @name Phaser.Scene#tweens
         * @type {Phaser.Tweens.TweenManager}
         * @since 3.0.0
         */
        this.tweens;

        /**
         * A scene level Arcade Physics Plugin.
         * This property will only be available if defined in the Scene Injection Map, the plugin is installed and configured.
         *
         * @name Phaser.Scene#physics
         * @type {Phaser.Physics.Arcade.ArcadePhysics}
         * @since 3.0.0
         */
        this.physics;

        /**
         * A scene level Impact Physics Plugin.
         * This property will only be available if defined in the Scene Injection Map, the plugin is installed and configured.
         *
         * @name Phaser.Scene#impact
         * @type {Phaser.Physics.Impact.ImpactPhysics}
         * @since 3.0.0
         */
        this.impact;

        /**
         * A scene level Matter Physics Plugin.
         * This property will only be available if defined in the Scene Injection Map, the plugin is installed and configured.
         *
         * @name Phaser.Scene#matter
         * @type {Phaser.Physics.Matter.MatterPhysics}
         * @since 3.0.0
         */
        this.matter;

        if (typeof PLUGIN_FBINSTANT)
        {
            /**
             * A scene level Facebook Instant Games Plugin.
             * This property will only be available if defined in the Scene Injection Map, the plugin is installed and configured.
             *
             * @name Phaser.Scene#facebook
             * @type {Phaser.FacebookInstantGamesPlugin}
             * @since 3.12.0
             */
            this.facebook;
        }

        /**
         * A reference to the global Scale Manager.
         * This property will only be available if defined in the Scene Injection Map.
         *
         * @name Phaser.Scene#scale
         * @type {Phaser.Scale.ScaleManager}
         * @since 3.16.2
         */
        this.scale;

        /**
         * A reference to the Plugin Manager.
         *
         * The Plugin Manager is a global system that allows plugins to register themselves with it, and can then install
         * those plugins into Scenes as required.
         *
         * @name Phaser.Scene#plugins
         * @type {Phaser.Plugins.PluginManager}
         * @since 3.0.0
         */
        this.plugins;
    },

    /**
     * Should be overridden by your own Scenes.
     * This method is called once per game step while the scene is running.
     *
     * @method Phaser.Scene#update
     * @since 3.0.0
     *
     * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update: function ()
    {
    }

    /**
     * Can be defined on your own Scenes.
     * This method is called by the Scene Manager when the scene starts, before `preload()` and `create()`.
     *
     * @method Phaser.Scene#init
     * @since 3.0.0
     *
     * @param {object} data - Any data passed via `ScenePlugin.add()` or `ScenePlugin.start()`. Same as Scene.settings.data.
     */

    /**
     * Can be defined on your own Scenes. Use it to load assets.
     * This method is called by the Scene Manager, after `init()` and before `create()`, only if the Scene has a LoaderPlugin.
     * After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically.
     *
     * @method Phaser.Scene#preload
     * @since 3.0.0
     */

    /**
     * Can be defined on your own Scenes. Use it to create your game objects.
     * This method is called by the Scene Manager when the scene starts, after `init()` and `preload()`.
     * If the LoaderPlugin started after `preload()`, then this method is called only after loading is complete.
     *
     * @method Phaser.Scene#create
     * @since 3.0.0
     *
     * @param {object} data - Any data passed via `ScenePlugin.add()` or `ScenePlugin.start()`. Same as Scene.settings.data.
     */

});

module.exports = Scene;
