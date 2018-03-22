/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AddToDOM = require('../dom/AddToDOM');
var AnimationManager = require('../animations/AnimationManager');
var CacheManager = require('../cache/CacheManager');
var CanvasPool = require('../display/canvas/CanvasPool');
var Class = require('../utils/Class');
var Config = require('./Config');
var CreateRenderer = require('./CreateRenderer');
var DataManager = require('../data/DataManager');
var DebugHeader = require('./DebugHeader');
var Device = require('../device');
var DOMContentLoaded = require('../dom/DOMContentLoaded');
var EventEmitter = require('eventemitter3');
var InputManager = require('../input/InputManager');
var NOOP = require('../utils/NOOP');
var PluginManager = require('./PluginManager');
var SceneManager = require('../scene/SceneManager');
var SoundManagerCreator = require('../sound/SoundManagerCreator');
var TextureManager = require('../textures/TextureManager');
var TimeStep = require('./TimeStep');
var VisibilityHandler = require('./VisibilityHandler');

/**
 * @callback GameStepCallback
 */

/**
 * @classdesc
 * The Phaser.Game instance is the main controller for the entire Phaser game. It is responsible
 * for handling the boot process, parsing the configuration values, creating the renderer,
 * and setting-up all of the global Phaser systems, such as sound and input.
 * Once that is complete it will start the Scene Manager and then begin the main game loop.
 *
 * You should generally avoid accessing any of the systems created by Game, and instead use those
 * made available to you via the Phaser.Scene Systems class instead.
 *
 * @class Game
 * @memberOf Phaser
 * @constructor
 * @since 3.0.0
 *
 * @param {object} [GameConfig] - The configuration object for your Phaser Game instance.
 */
var Game = new Class({

    initialize:

    function Game (config)
    {
        /**
         * The parsed Game Configuration object.
         *
         * The values stored within this object are read-only and should not be changed at run-time.
         *
         * @name Phaser.Game#config
         * @type {Phaser.Boot.Config}
         * @readOnly
         * @since 3.0.0
         */
        this.config = new Config(config);

        /**
         * A reference to either the Canvas or WebGL Renderer that this Game is using.
         *
         * @name Phaser.Game#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.0.0
         */
        this.renderer = null;

        /**
         * A reference to the HTML Canvas Element on which the renderer is drawing.
         *
         * @name Phaser.Game#canvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvas = null;

        /**
         * A reference to the Canvas Rendering Context belonging to the Canvas Element this game is rendering to.
         *
         * @name Phaser.Game#context
         * @type {CanvasRenderingContext2D}
         * @since 3.0.0
         */
        this.context = null;

        /**
         * A flag indicating when this Game instance has finished its boot process.
         *
         * @name Phaser.Game#isBooted
         * @type {boolean}
         * @readOnly
         * @since 3.0.0
         */
        this.isBooted = false;

        /**
         * A flag indicating if this Game is currently running its game step or not.
         *
         * @name Phaser.Game#isRunning
         * @type {boolean}
         * @readOnly
         * @since 3.0.0
         */
        this.isRunning = false;

        /**
         * An Event Emitter which is used to broadcast game-level events from the global systems.
         *
         * @name Phaser.Game#events
         * @type {EventEmitter}
         * @since 3.0.0
         */
        this.events = new EventEmitter();

        /**
         * An instance of the Animation Manager.
         *
         * The Animation Manager is a global system responsible for managing all animations used within your game.
         *
         * @name Phaser.Game#anims
         * @type {Phaser.Animations.AnimationManager}
         * @since 3.0.0
         */
        this.anims = new AnimationManager(this);

        /**
         * An instance of the Texture Manager.
         *
         * The Texture Manager is a global system responsible for managing all textures being used by your game.
         *
         * @name Phaser.Game#textures
         * @type {Phaser.Textures.TextureManager}
         * @since 3.0.0
         */
        this.textures = new TextureManager(this);

        /**
         * An instance of the Cache Manager.
         *
         * The Cache Manager is a global system responsible for caching, accessing and releasing external game assets.
         *
         * @name Phaser.Game#cache
         * @type {Phaser.Cache.CacheManager}
         * @since 3.0.0
         */
        this.cache = new CacheManager(this);

        /**
         * [description]
         *
         * @name Phaser.Game#registry
         * @type {Phaser.Data.DataManager}
         * @since 3.0.0
         */
        this.registry = new DataManager(this);

        /**
         * An instance of the Input Manager.
         *
         * The Input Manager is a global system responsible for the capture of browser-level input events.
         *
         * @name Phaser.Game#input
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.input = new InputManager(this, this.config);

        /**
         * An instance of the Scene Manager.
         *
         * The Scene Manager is a global system responsible for creating, modifying and updating the Scenes in your game.
         *
         * @name Phaser.Game#scene
         * @type {Phaser.Scenes.SceneManager}
         * @since 3.0.0
         */
        this.scene = new SceneManager(this, this.config.sceneConfig);

        /**
         * A reference to the Device inspector.
         *
         * Contains information about the device running this game, such as OS, browser vendor and feature support.
         * Used by various systems to determine capabilities and code paths.
         *
         * @name Phaser.Game#device
         * @type {Phaser.DeviceConf}
         * @since 3.0.0
         */
        this.device = Device;

        /**
         * An instance of the base Sound Manager.
         *
         * The Sound Manager is a global system responsible for the playback and updating of all audio in your game.
         *
         * @name Phaser.Game#sound
         * @type {Phaser.BaseSoundManager}
         * @since 3.0.0
         */
        this.sound = SoundManagerCreator.create(this);

        /**
         * An instance of the Time Step.
         *
         * The Time Step is a global system responsible for setting-up and responding to the browser frame events, processing
         * them and calculating delta values. It then automatically calls the game step.
         *
         * @name Phaser.Game#loop
         * @type {Phaser.Boot.TimeStep}
         * @since 3.0.0
         */
        this.loop = new TimeStep(this, this.config.fps);

        /**
         * An instance of the Plugin Manager.
         *
         * The Plugin Manager is a global system that allows plugins to register themselves with it, and can then install
         * those plugins into Scenes as required.
         *
         * @name Phaser.Game#plugins
         * @type {Phaser.Boot.PluginManager}
         * @since 3.0.0
         */
        this.plugins = new PluginManager(this, this.config);

        /**
         * The `onStepCallback` is a callback that is fired each time the Time Step ticks.
         * It is set automatically when the Game boot process has completed.
         *
         * @name Phaser.Game#onStepCallback
         * @type {GameStepCallback}
         * @private
         * @since 3.0.0
         */
        this.onStepCallback = NOOP;

        //  Wait for the DOM Ready event, then call boot.
        DOMContentLoaded(this.boot.bind(this));
    },

    /**
     * Game boot event.
     *
     * This is an internal event dispatched when the game has finished booting, but before it is ready to start running.
     * The global systems use this event to know when to set themselves up, dispatching their own `ready` events as required.
     *
     * @event Phaser.Game#boot
     */

    /**
     * This method is called automatically when the DOM is ready. It is responsible for creating the renderer,
     * displaying the Debug Header, adding the game canvas to the DOM and emitting the 'boot' event.
     * It listens for a 'ready' event from the base systems and once received it will call `Game.start`.
     *
     * @method Phaser.Game#boot
     * @protected
     * @fires Phaser.Game#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        this.isBooted = true;

        this.config.preBoot(this);

        CreateRenderer(this);

        DebugHeader(this);

        AddToDOM(this.canvas, this.config.parent);

        this.events.emit('boot');

        //  The Texture Manager has to wait on a couple of non-blocking events before it's fully ready, so it will emit this event
        this.events.once('ready', this.start, this);
    },

    /**
     * Called automatically by Game.boot once all of the global systems have finished setting themselves up.
     * By this point the Game is now ready to start the main loop running.
     * It will also enable the Visibility Handler.
     *
     * @method Phaser.Game#start
     * @protected
     * @since 3.0.0
     */
    start: function ()
    {
        this.isRunning = true;

        this.config.postBoot(this);

        if (this.renderer)
        {
            this.loop.start(this.step.bind(this));
        }
        else
        {
            this.loop.start(this.headlessStep.bind(this));
        }

        VisibilityHandler(this.events);

        this.events.on('hidden', this.onHidden, this);
        this.events.on('visible', this.onVisible, this);
        this.events.on('blur', this.onBlur, this);
        this.events.on('focus', this.onFocus, this);
    },

    /**
     * Game Pre-Render event.
     *
     * This event is dispatched immediately before any of the Scenes have started to render.
     * The renderer will already have been initialized this frame, clearing itself and preparing to receive
     * the Scenes for rendering, but it won't have actually drawn anything yet.
     *
     * @event Phaser.Game#prerenderEvent
     * @param {(Phaser.Renderer.CanvasRenderer|Phaser.Renderer.WebGLRenderer)} renderer - A reference to the current renderer.
     */

    /**
     * Game Post-Render event.
     *
     * This event is dispatched right at the end of the render process.
     * Every Scene will have rendered and drawn to the canvas.
     *
     * @event Phaser.Game#postrenderEvent
     * @param {(Phaser.Renderer.CanvasRenderer|Phaser.Renderer.WebGLRenderer)} renderer - A reference to the current renderer.
     */

    /**
     * The main Game Step. Called automatically by the Time Step, once per browser frame (typically as a result of
     * Request Animation Frame, or Set Timeout on very old browsers.)
     *
     * The step will update the global managers first, then proceed to update each Scene in turn, via the Scene Manager.
     *
     * It will then render each Scene in turn, via the Renderer. This process emits `prerender` and `postrender` events.
     *
     * @method Phaser.Game#step
     * @fires Phaser.Game#prerenderEvent
     * @fires Phaser.Game#postrenderEvent
     * @since 3.0.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    step: function (time, delta)
    {
        //  Global Managers

        this.input.update(time, delta);

        this.sound.update(time, delta);

        //  Scenes

        this.onStepCallback();

        this.scene.update(time, delta);

        //  Render

        var renderer = this.renderer;

        renderer.preRender();

        this.events.emit('prerender', renderer);

        this.scene.render(renderer);

        renderer.postRender();

        this.events.emit('postrender', renderer);
    },

    /**
     * A special version of the Game Step for the HEADLESS renderer only.
     *
     * The main Game Step. Called automatically by the Time Step, once per browser frame (typically as a result of
     * Request Animation Frame, or Set Timeout on very old browsers.)
     *
     * The step will update the global managers first, then proceed to update each Scene in turn, via the Scene Manager.
     *
     * This process emits `prerender` and `postrender` events, even though nothing actually displays.
     *
     * @method Phaser.Game#headlessStep
     * @fires Phaser.Game#prerenderEvent
     * @fires Phaser.Game#postrenderEvent
     * @since 3.2.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    headlessStep: function (time, delta)
    {
        //  Global Managers

        this.input.update(time, delta);

        this.sound.update(time, delta);

        //  Scenes

        this.onStepCallback();

        this.scene.update(time, delta);

        //  Render

        this.events.emit('prerender');

        this.events.emit('postrender');
    },

    /**
     * Game Pause event.
     *
     * This event is dispatched when the game loop enters a paused state, usually as a result of the Visibility Handler.
     *
     * @event Phaser.Game#pauseEvent
     */

    /**
     * Called automatically by the Visibility Handler.
     * This will pause the main loop and then emit a pause event.
     *
     * @method Phaser.Game#onHidden
     * @protected
     * @fires Phaser.Game#pauseEvent
     * @since 3.0.0
     */
    onHidden: function ()
    {
        this.loop.pause();

        this.events.emit('pause');
    },

    /**
     * Game Resume event.
     *
     * This event is dispatched when the game loop leaves a paused state and resumes running.
     *
     * @event Phaser.Game#resumeEvent
     */

    /**
     * Called automatically by the Visibility Handler.
     * This will resume the main loop and then emit a resume event.
     *
     * @method Phaser.Game#onVisible
     * @protected
     * @fires Phaser.Game#resumeEvent
     * @since 3.0.0
     */
    onVisible: function ()
    {
        this.loop.resume();

        this.events.emit('resume');
    },

    /**
     * Called automatically by the Visibility Handler.
     * This will set the main loop into a 'blurred' state, which pauses it.
     *
     * @method Phaser.Game#onBlur
     * @protected
     * @since 3.0.0
     */
    onBlur: function ()
    {
        this.loop.blur();
    },

    /**
     * Called automatically by the Visibility Handler.
     * This will set the main loop into a 'focused' state, which resumes it.
     *
     * @method Phaser.Game#onFocus
     * @protected
     * @since 3.0.0
     */
    onFocus: function ()
    {
        this.loop.focus();
    },

    /**
     * Game Resize event.
     *
     * @event Phaser.Game#resizeEvent
     * @param {number} width - The new width of the Game.
     * @param {number} height - The new height of the Game.
     */

    /**
     * Updates the Game Config with the new width and height values given.
     * Then resizes the Renderer and Input Manager scale.
     *
     * @method Phaser.Game#resize
     * @since 3.2.0
     *
     * @param {number} width - The new width of the game.
     * @param {number} height - The new height of the game.
     */
    resize: function (width, height)
    {
        this.config.width = width;
        this.config.height = height;

        this.renderer.resize(width, height);

        this.input.resize();

        this.scene.resize(width, height);

        this.events.emit('resize', width, height);
    },

    /**
     * Destroys this Phaser.Game instance, all global systems, all sub-systems and all Scenes.
     *
     * @method Phaser.Game#destroy
     * @since 3.0.0
     */
    destroy: function (removeCanvas)
    {
        this.loop.destroy();

        this.scene.destroy();

        this.renderer.destroy();

        this.events.emit('destroy');

        this.events.removeAllListeners();

        this.onStepCallback = null;

        if (removeCanvas)
        {
            CanvasPool.remove(this.canvas);
        }
    }

});

module.exports = Game;
