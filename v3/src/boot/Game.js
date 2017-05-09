
var Config = require('./Config');
var DebugHeader = require('./DebugHeader');
var Device = require('../device');

var AddToDOM = require('../dom/AddToDOM');
var DOMContentLoaded = require('../dom/DOMContentLoaded');
var VisibilityHandler = require('./VisibilityHandler');
var EventDispatcher = require('../events/EventDispatcher');

var TimeStep = require('./TimeStep');
var CreateRenderer = require('./CreateRenderer');
var GlobalInputManager = require('../input/GlobalInputManager');
var GlobalStateManager = require('../state/GlobalStateManager');
var AnimationManager = require('../animation/manager/AnimationManager');
var TextureManager = require('../textures/TextureManager');
var Data = require('../components/Data');
var Cache = require('../cache/Cache');

var Game = function (config)
{
    this.config = new Config(config);

    this.renderer = null;
    this.canvas = null;
    this.context = null;

    this.isBooted = false;
    this.isRunning = false;

    /**
    * @property {EventDispatcher} events - Global / Global Game System Events
    */
    this.events = new EventDispatcher();

    /**
    * @property {Phaser.AnimationManager} anims - Reference to the Phaser Animation Manager.
    */
    this.anims = new AnimationManager(this);

    /**
    * @property {Phaser.TextureManager} textures - Reference to the Phaser Texture Manager.
    */
    this.textures = new TextureManager(this);

    /**
    * @property {Phaser.Cache} cache - Reference to the assets cache.
    */
    this.cache = new Cache();

    /**
    * @property {Phaser.Data} registry - Game wide data store.
    */
    this.registry = new Data(this);

    /**
    * @property {Phaser.Input} input - Reference to the input manager
    */
    this.input = new GlobalInputManager(this, this.config);

    /**
    * @property {Phaser.GlobalStateManager} state - The StateManager. Phaser instance specific.
    */
    this.state = new GlobalStateManager(this, this.config.stateConfig);

    /**
    * @property {Phaser.Device} device - Contains device information and capabilities (singleton)
    */
    this.device = Device;

    /**
    * @property {Phaser.MainLoop} mainloop - Main Loop handler.
    * @protected
    */
    this.loop = new TimeStep(this, this.config.fps);

    //  Wait for the DOM Ready event, then call boot.
    DOMContentLoaded(this.boot.bind(this));

    //  For debugging only
    window.game = this;
};

Game.prototype.constructor = Game;

Game.prototype = {

    boot: function ()
    {
        this.isBooted = true;

        this.config.preBoot();

        DebugHeader(this);

        CreateRenderer(this);

        AddToDOM(this.canvas, this.config.parent);

        this.anims.boot(this.textures);

        this.state.boot();

        this.input.boot();

        this.isRunning = true;

        this.config.postBoot();

        this.loop.start(this.step.bind(this));

        VisibilityHandler(this.events);

        this.events.on('HIDDEN', this.onHidden.bind(this));
        this.events.on('VISIBLE', this.onVisible.bind(this));
        this.events.on('ON_BLUR', this.onBlur.bind(this));
        this.events.on('ON_FOCUS', this.onFocus.bind(this));
    },

    step: function (time, delta)
    {
        var active = this.state.active;
        var renderer = this.renderer;

        //  Global Managers (Time, Input, etc)

        this.input.update(time, delta);

        //  States

        for (var i = 0; i < active.length; i++)
        {
            active[i].state.sys.step(time, delta);
        }

        //  Render

        // var interpolation = this.frameDelta / this.timestep;

        renderer.preRender();

        //  This uses active.length, in case state.update removed the state from the active list
        for (i = 0; i < active.length; i++)
        {
            active[i].state.sys.render(0, renderer);
        }

        renderer.postRender();
    },

    onHidden: function ()
    {
        this.loop.pause();
    },

    onVisible: function ()
    {
        this.loop.resume();
    },

    onBlur: function ()
    {
        this.loop.blur();
    },

    onFocus: function ()
    {
        this.loop.focus();
    }
};

module.exports = Game;
