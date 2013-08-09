/// <reference path="_definitions.ts" />
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
var Phaser;
(function (Phaser) {
    var State = (function () {
        /**
        * State constructor
        * Create a new <code>State</code>.
        */
        function State(game) {
            this.game = game;

            this.add = game.add;
            this.camera = game.camera;
            this.cache = game.cache;
            this.input = game.input;
            this.load = game.load;
            this.math = game.math;
            this.sound = game.sound;
            this.stage = game.stage;
            this.time = game.time;
            this.tweens = game.tweens;
            this.world = game.world;
        }
        //  Override these in your own States
        /**
        * Override this method to add some load operations.
        * If you need to use the loader, you may need to use them here.
        */
        State.prototype.init = function () {
        };

        /**
        * This method is called after the game engine successfully switches states.
        * Feel free to add any setup code here.(Do not load anything here, override init() instead)
        */
        State.prototype.create = function () {
        };

        /**
        * Put update logic here.
        */
        State.prototype.update = function () {
        };

        /**
        * Put render operations here.
        */
        State.prototype.render = function () {
        };

        /**
        * This method will be called when game paused.
        */
        State.prototype.paused = function () {
        };

        /**
        * This method will be called when the state is destroyed
        */
        State.prototype.destroy = function () {
        };
        return State;
    })();
    Phaser.State = State;
})(Phaser || (Phaser = {}));
