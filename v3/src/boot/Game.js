/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Device = require('../device');
var Config = require('./Config');
var DebugHeader = require('./DebugHeader');
var CreateRenderer = require('./CreateRenderer');
var RequestAnimationFrame = require('../dom/RequestAnimationFrame');
var DOMContentLoaded = require('../dom/DOMContentLoaded');
var RandomDataGenerator = require('../math/random-data-generator/RandomDataGenerator');
var StateManager = require('../state/StateManager');
var FactoryContainer = require('../gameobjects/FactoryContainer');
var GameObjects = require ('../gameobjects/');
var TextureManager = require ('../textures/TextureManager');

var Game = function (config)
{
    this.config = new Config(config);

    //  Decide which of the following should be Game properties, or placed elsewhere ...

    this.renderer = null;
    this.canvas = null;
    this.context = null;

    /**
    * @property {string|HTMLElement} parent - The Games DOM parent.
    * @default
    */
    this.parent = parent;

    this.isBooted = false;
    this.isRunning = false;

    /**
    * @property {Phaser.RequestAnimationFrame} raf - Automatically handles the core game loop via requestAnimationFrame or setTimeout
    * @protected
    */
    this.raf = new RequestAnimationFrame(this);

    /**
    * @property {Phaser.TextureManager} textures - Reference to the Phaser Texture Manager.
    */
    this.textures = new TextureManager(this);

    /**
    * @property {Phaser.UpdateManager} updates - Reference to the Phaser Update Manager.
    */
    this.updates = null;

    /**
    * @property {Phaser.Cache} cache - Reference to the assets cache.
    */
    this.cache = null;

    /**
    * @property {Phaser.Input} input - Reference to the input manager
    */
    this.input = null;

    /**
    * @property {Phaser.StateManager} state - The StateManager. Phaser instance specific.
    */
    this.state = new StateManager(this, this.config.stateConfig);

    /**
    * @property {Phaser.Device} device - Contains device information and capabilities (singleton)
    */
    this.device = Device;

    //  More this somewhere else? Math perhaps? Doesn't need to be a Game level system.
    this.rnd;

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

        //  Probably move within Math
        this.rnd = new RandomDataGenerator(this.config.seed);

        DebugHeader(this);

        CreateRenderer(this);

        this.state.boot();

        this.isRunning = true;

        this.config.postBoot();

        this.raf.start();
    },

    //  timestamp = DOMHighResTimeStamp
    update: function (timestamp)
    {
        // console.log(timestamp);
        // this.state.step(timestamp);
    }

};

module.exports = Game;
