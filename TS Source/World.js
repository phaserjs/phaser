/// <reference path="_definitions.ts" />
/**
* World
*
* "This world is but a canvas to our imagination." - Henry David Thoreau
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size. You look into the world via cameras. All game objects live within
* the world at world-based coordinates. By default a world is created the same size as your Stage.
*
* @package    Phaser.World
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var World = (function () {
        /**
        * World constructor
        * Create a new <code>World</code> with specific width and height.
        *
        * @param width {number} Width of the world bound.
        * @param height {number} Height of the world bound.
        */
        function World(game, width, height) {
            /**
            * Object container stores every object created with `create*` methods.
            * @type {Group}
            */
            this._groupCounter = 0;
            this.game = game;
            this.cameras = new Phaser.CameraManager(this.game, 0, 0, width, height);
            this.bounds = new Phaser.Rectangle(0, 0, width, height);
        }
        World.prototype.getNextGroupID = function () {
            return this._groupCounter++;
        };
        World.prototype.boot = /**
        * Called once by Game during the boot process.
        */
        function () {
            this.group = new Phaser.Group(this.game, 0);
        };
        World.prototype.update = /**
        * This is called automatically every frame, and is where main logic happens.
        */
        function () {
            this.group.update();
            this.cameras.update();
        };
        World.prototype.postUpdate = /**
        * This is called automatically every frame, and is where main logic happens.
        */
        function () {
            this.group.postUpdate();
            this.cameras.postUpdate();
        };
        World.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            this.group.destroy();
            this.cameras.destroy();
        };
        World.prototype.setSize = /**
        * Updates the size of this world.
        *
        * @param width {number} New width of the world.
        * @param height {number} New height of the world.
        * @param [updateCameraBounds] {bool} Update camera bounds automatically or not. Default to true.
        */
        function (width, height, updateCameraBounds) {
            if (typeof updateCameraBounds === "undefined") { updateCameraBounds = true; }
            this.bounds.width = width;
            this.bounds.height = height;
            if(updateCameraBounds == true) {
                this.game.camera.setBounds(0, 0, width, height);
            }
            // dispatch world resize event
                    };
        Object.defineProperty(World.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            set: function (value) {
                this.bounds.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            set: function (value) {
                this.bounds.height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "centerX", {
            get: function () {
                return this.bounds.halfWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "centerY", {
            get: function () {
                return this.bounds.halfHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "randomX", {
            get: function () {
                return Math.round(Math.random() * this.bounds.width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "randomY", {
            get: function () {
                return Math.round(Math.random() * this.bounds.height);
            },
            enumerable: true,
            configurable: true
        });
        World.prototype.getAllCameras = /**
        * Get all the cameras.
        *
        * @returns {array} An array contains all the cameras.
        */
        function () {
            return this.cameras.getAll();
        };
        return World;
    })();
    Phaser.World = World;    
})(Phaser || (Phaser = {}));
