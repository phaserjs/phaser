var Class = require('../utils/Class');
var Config = require('./Config');
var DebugHeader = require('./DebugHeader');
var Device = require('../device');
var NOOP = require('../utils/NOOP');

var AddToDOM = require('../dom/AddToDOM');
var DOMContentLoaded = require('../dom/DOMContentLoaded');
var EventEmitter = require('eventemitter3');
var VisibilityHandler = require('./VisibilityHandler');

var AnimationManager = require('../animations/manager/AnimationManager');
var CreateRenderer = require('./CreateRenderer');
var Data = require('../data/Data');
var GlobalCache = require('../cache/GlobalCache');
var GlobalInputManager = require('../input/global/GlobalInputManager');
var GlobalSceneManager = require('../scene/global/GlobalSceneManager');
var PluginManager = require('../plugins/PluginManager');
var SoundManagerCreator = require('../sound/SoundManagerCreator');
var TextureManager = require('../textures/TextureManager');
var TimeStep = require('./TimeStep');

var Game = new Class({

    initialize:

    /**
     * [description]
     *
     * @class Game
     * @memberOf Phaser
     * @constructor
     * @since 3.0.0
     *
     * @param {object} [GameConfig] - The configuration object for your Phaser Game instance.
     */
    function Game (config)
    {
        /**
         * [description]
         *
         * @property {Phaser.Boot.Config} config
         */
        this.config = new Config(config);

        /**
         * [description]
         *
         * @property {Phaser.Renderer.CanvasRenderer|Phaser.Renderer.WebGLRenderer} renderer
         */
        this.renderer = null;

        /**
         * [description]
         *
         * @property {HTMLCanvasElement} canvas
         */
        this.canvas = null;

        /**
         * [description]
         *
         * @property {CanvasRenderingContext2D} context
         */
        this.context = null;

        /**
         * [description]
         *
         * @property {boolean} isBooted
         */
        this.isBooted = false;

        /**
         * [description]
         *
         * @property {boolean} isRunning
         */
        this.isRunning = false;

        /**
         * [description]
         *
         * @property {Phaser.Events.EventDispatcher} events
         */
        this.events = new EventEmitter();

        /**
         * [description]
         *
         * @property {Phaser.Animations.AnimationManager} anims
         */
        this.anims = new AnimationManager(this);

        /**
         * [description]
         *
         * @property {Phaser.Textures.TextureManager} textures
         */
        this.textures = new TextureManager(this);

        /**
         * [description]
         *
         * @property {Phaser.Cache.GlobalCache} cache
         */
        this.cache = new GlobalCache(this);

        /**
         * [description]
         *
         * @property {[type]} registry
         */
        this.registry = new Data(this);

        /**
         * [description]
         *
         * @property {Phaser.Input.GlobalInputManager} input
         */
        this.input = new GlobalInputManager(this, this.config);

        /**
         * [description]
         *
         * @property {Phaser.Scenes.GlobalSceneManager} scene
         */
        this.scene = new GlobalSceneManager(this, this.config.sceneConfig);

        /**
         * [description]
         *
         * @property {Phaser.Device} device
         */
        this.device = Device;

        /**
         * [description]
         *
         * @property {Phaser.BaseSoundManager} sound
         */
        this.sound = SoundManagerCreator.create(this);

        /**
         * [description]
         *
         * @property {Phaser.Boot.TimeStep} loop
         */
        this.loop = new TimeStep(this, this.config.fps);

        /**
         * [description]
         *
         * @property {Phaser.Input.GlobalInputManager} input
         */
        this.plugins = new PluginManager(this, this.config);

        /**
         * [description]
         *
         * @property {function} onStepCallback
         */
        this.onStepCallback = NOOP;

        //  Wait for the DOM Ready event, then call boot.
        DOMContentLoaded(this.boot.bind(this));

        //  For debugging only
        window.game = this;
    },

    /**
     * [description]
     *
     * @method Phaser.Game#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        this.isBooted = true;

        this.config.preBoot();

        CreateRenderer(this);

        DebugHeader(this);

        AddToDOM(this.canvas, this.config.parent);

        this.textures.boot();

        this.anims.boot(this.textures);

        this.plugins.boot();

        this.input.boot();

        this.scene.boot();

        this.isRunning = true;

        this.config.postBoot();

        this.loop.start(this.step.bind(this));

        VisibilityHandler(this.events);

        this.events.on('hidden', this.onHidden, this);
        this.events.on('visible', this.onVisible, this);
        this.events.on('blur', this.onBlur, this);
        this.events.on('focus', this.onFocus, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Game#step
     * @since 3.0.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    step: function (time, delta)
    {
        var active = this.scene.active;
        var renderer = this.renderer;

        //  Global Managers

        this.input.update(time, delta);

        this.sound.update(time, delta);

        //  Scenes

        this.onStepCallback();

        for (var i = 0; i < active.length; i++)
        {
            active[i].scene.sys.step(time, delta);
        }

        //  Render

        // var interpolation = this.frameDelta / this.timestep;

        renderer.preRender();

        this.events.emit('prerender');

        //  This uses active.length, in case scene.update removed the scene from the active list
        for (i = 0; i < active.length; i++)
        {
            active[i].scene.sys.render(0, renderer);
        }

        renderer.postRender();

        this.events.emit('postrender');
    },

    /**
     * [description]
     *
     * @method Phaser.Game#onHidden
     * @protected
     * @since 3.0.0
     */
    onHidden: function ()
    {
        this.loop.pause();

        this.events.emit('pause');
    },

    /**
     * [description]
     *
     * @method Phaser.Game#onVisible
     * @protected
     * @since 3.0.0
     */
    onVisible: function ()
    {
        this.loop.resume();

        this.events.emit('resume');
    },

    /**
     * [description]
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
     * [description]
     *
     * @method Phaser.Game#onFocus
     * @protected
     * @since 3.0.0
     */
    onFocus: function ()
    {
        this.loop.focus();
    }

});

module.exports = Game;
