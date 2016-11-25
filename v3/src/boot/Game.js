/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CHECKSUM = require('../checksum');

var Config = require('./Config');
var DebugHeader = require('./DebugHeader');
var RequestAnimationFrame = require('../dom/RequestAnimationFrame');
var DOMContentLoaded = require('../dom/DOMContentLoaded');

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
    this.textures = null;

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
    * @property {Phaser.StateManager} state - The StateManager.
    */
    // this.state = new Phaser.StateManager(this, stateConfig);

    /**
    * @property {Phaser.Device} device - Contains device information and capabilities.
    */
    // this.device = Phaser.Device;

    // this.rnd = new Phaser.RandomDataGenerator([ (Date.now() * Math.random()).toString() ]);

    // this.device.whenReady(this.boot, this);

    DOMContentLoaded(this.boot.bind(this));

};

Game.prototype.constructor = Game;

Game.prototype = {

    boot: function ()
    {
        DebugHeader(this);

        console.log(CHECKSUM.build);

        //  Add in ability to specify pre-init and post-init callbacks in the config

        this.raf.start();
    },

    update: function (timestamp)
    {
        // console.log(timestamp);
    }

};

module.exports = Game;
