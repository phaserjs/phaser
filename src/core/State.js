/**
* State
*
* This is a base State class which can be extended if you are creating your game with TypeScript.
* It provides quick access to common functions such as the camera, cache, input, match, sound and more.
*
* @package    Phaser.State
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/

Phaser.State = function () {

    this.game = null;
    this.add = null;
    this.camera = null;
    this.cache = null;
    this.input = null;
    this.load = null;
    // this.math = null;
    this.sound = null;
    this.stage = null;
    this.time = null;
    this.tweens = null;
    this.world = null;
    this.particles = null;
    this.physics = null;

};

Phaser.State.prototype = {

    link: function (game) {

        this.game = game;
        this.add = game.add;
        this.camera = game.camera;
        this.cache = game.cache;
        this.input = game.input;
        this.load = game.load;
        // this.math = game.math;
        this.sound = game.sound;
        this.stage = game.stage;
        this.time = game.time;
        this.tweens = game.tweens;
        this.world = game.world;
        this.particles = game.particles;
        this.physics = game.physics;

    },

    /**
    * Override this method to add some load operations.
    * If you need to use the loader, you may need to use them here.
    */
    preload: function () {
    },

    /**
    * This method is called after the game engine successfully switches states.
    * Feel free to add any setup code here.(Do not load anything here, override init() instead)
    */
    create: function () {
    },

    /**
    * Put update logic here.
    */
    update: function () {
    },

    /**
    * Put render operations here.
    */
    render: function () {
    },

    /**
    * This method will be called when game paused.
    */
    paused: function () {
    },

    /**
    * This method will be called when the state is destroyed
    */
    destroy: function () {
    }

};
