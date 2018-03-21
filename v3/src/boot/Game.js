/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Config = require('./Config');
var DebugHeader = require('./DebugHeader');
var Device = require('../device');

var AddToDOM = require('../dom/AddToDOM');
var DOMContentLoaded = require('../dom/DOMContentLoaded');

var MainLoop = require('./MainLoop');
var CreateRenderer = require('./CreateRenderer');
var GlobalInputManager = require('../input/GlobalInputManager');
var GlobalStateManager = require('../state/GlobalStateManager');
var AnimationManager = require('../animation/AnimationManager');
var TextureManager = require('../textures/TextureManager');
var Data = require('../components/Data');
var Cache = require('../cache/Cache');

var Game = function (config)
{
    this.config = new Config(config);

    this.renderDevice = null;
    //this.renderer = null;
    this.canvas = null;
    this.context = null;

    this.isBooted = false;
    this.isRunning = false;

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
    this.mainloop = new MainLoop(this, this.config.fps);

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

        this.state.boot();

        this.input.boot();

        this.isRunning = true;

        this.config.postBoot();

        this.mainloop.start();
    }

};

module.exports = Game;
