/// <reference path="../_definitions.ts" />
/**
* Phaser - Sprite
*/
var Phaser;
(function (Phaser) {
    var Sprite = (function () {
        /**
        * Create a new <code>Sprite</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param [x] {number} the initial x position of the sprite.
        * @param [y] {number} the initial y position of the sprite.
        * @param [key] {string} Key of the graphic you want to load for this sprite.
        */
        function Sprite(game, x, y, key, frame) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof key === "undefined") { key = null; }
            if (typeof frame === "undefined") { frame = null; }
            /**
            * A boolean representing if the Sprite has been modified in any way via a scale, rotate, flip or skew.
            */
            this.modified = false;
            /**
            * x value of the object.
            */
            this.x = 0;
            /**
            * y value of the object.
            */
            this.y = 0;
            /**
            * z order value of the object.
            */
            this.z = -1;
            /**
            * Render iteration counter
            */
            this.renderOrderID = 0;
            this.game = game;
            this.type = Phaser.Types.SPRITE;

            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;

            this.x = x;
            this.y = y;
            this.z = -1;
            this.group = null;
            this.name = '';

            this.events = new Phaser.Components.Events(this);
            this.animations = new Phaser.Components.AnimationManager(this);
            this.input = new Phaser.Components.InputHandler(this);
            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);

            if (key !== null) {
                this.texture.loadImage(key, false);
            } else {
                this.texture.opaque = true;
            }

            if (frame !== null) {
                if (typeof frame == 'string') {
                    this.frameName = frame;
                } else {
                    this.frame = frame;
                }
            }

            this.worldView = new Phaser.Rectangle(x, y, this.width, this.height);
            this.cameraView = new Phaser.Rectangle(x, y, this.width, this.height);

            this.transform.setCache();

            this.outOfBounds = false;
            this.outOfBoundsAction = Phaser.Types.OUT_OF_BOUNDS_PERSIST;

            //  Handy proxies
            this.scale = this.transform.scale;
            this.alpha = this.texture.alpha;
            this.origin = this.transform.origin;
            this.crop = this.texture.crop;
        }
        Object.defineProperty(Sprite.prototype, "rotation", {
            get: /**
            * The rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
            */
            function () {
                return this.transform.rotation;
            },
            set: /**
            * Set the rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
            * The value is automatically wrapped to be between 0 and 360.
            */
            function (value) {
                this.transform.rotation = this.game.math.wrap(value, 360, 0);

                if (this.body) {
                    //this.body.angle = this.game.math.degreesToRadians(this.game.math.wrap(value, 360, 0));
                }
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Brings this Sprite to the top of its current Group, if set.
        */
        Sprite.prototype.bringToTop = function () {
            if (this.group) {
                //this.group.bringToTop(this);
            }
        };


        Object.defineProperty(Sprite.prototype, "alpha", {
            get: /**
            * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
            */
            function () {
                return this.texture.alpha;
            },
            set: /**
            * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
            */
            function (value) {
                this.texture.alpha = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Sprite.prototype, "frame", {
            get: /**
            * Get the animation frame number.
            */
            function () {
                return this.animations.frame;
            },
            set: /**
            * Set the animation frame by frame number.
            */
            function (value) {
                this.animations.frame = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Sprite.prototype, "frameName", {
            get: /**
            * Get the animation frame name.
            */
            function () {
                return this.animations.frameName;
            },
            set: /**
            * Set the animation frame by frame name.
            */
            function (value) {
                this.animations.frameName = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Sprite.prototype, "width", {
            get: function () {
                return this.texture.width * this.transform.scale.x;
            },
            set: function (value) {
                this.transform.scale.x = value / this.texture.width;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Sprite.prototype, "height", {
            get: function () {
                return this.texture.height * this.transform.scale.y;
            },
            set: function (value) {
                this.transform.scale.y = value / this.texture.height;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Pre-update is called right before update() on each object in the game loop.
        */
        Sprite.prototype.preUpdate = function () {
            this.transform.update();

            if (this.transform.scrollFactor.x != 1 && this.transform.scrollFactor.x != 0) {
                this.worldView.x = (this.x * this.transform.scrollFactor.x) - (this.width * this.transform.origin.x);
            } else {
                this.worldView.x = this.x - (this.width * this.transform.origin.x);
            }

            if (this.transform.scrollFactor.y != 1 && this.transform.scrollFactor.y != 0) {
                this.worldView.y = (this.y * this.transform.scrollFactor.y) - (this.height * this.transform.origin.y);
            } else {
                this.worldView.y = this.y - (this.height * this.transform.origin.y);
            }

            this.worldView.width = this.width;
            this.worldView.height = this.height;

            if (this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY)) {
                this.modified = true;
            }
        };

        /**
        * Override this function to update your sprites position and appearance.
        */
        Sprite.prototype.update = function () {
        };

        /**
        * Automatically called after update() by the game loop for all 'alive' objects.
        */
        Sprite.prototype.postUpdate = function () {
            this.animations.update();

            this.checkBounds();

            if (this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false) {
                this.modified = false;
            }
        };

        Sprite.prototype.checkBounds = function () {
            if (Phaser.RectangleUtils.intersects(this.worldView, this.game.world.bounds)) {
                this.outOfBounds = false;
            } else {
                if (this.outOfBounds == false) {
                    this.events.onOutOfBounds.dispatch(this);
                }

                this.outOfBounds = true;

                if (this.outOfBoundsAction == Phaser.Types.OUT_OF_BOUNDS_KILL) {
                    this.kill();
                } else if (this.outOfBoundsAction == Phaser.Types.OUT_OF_BOUNDS_DESTROY) {
                    this.destroy();
                }
            }
        };

        /**
        * Clean up memory.
        */
        Sprite.prototype.destroy = function () {
            this.input.destroy();
        };

        /**
        * Handy for "killing" game objects.
        * Default behavior is to flag them as nonexistent AND dead.
        * However, if you want the "corpse" to remain in the game,
        * like to animate an effect or whatever, you should override this,
        * setting only alive to false, and leaving exists true.
        */
        Sprite.prototype.kill = function (removeFromGroup) {
            if (typeof removeFromGroup === "undefined") { removeFromGroup = false; }
            this.alive = false;
            this.exists = false;

            if (removeFromGroup && this.group) {
                //this.group.remove(this);
            }

            this.events.onKilled.dispatch(this);
        };

        /**
        * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
        * In practice, this is most often called by <code>Object.reset()</code>.
        */
        Sprite.prototype.revive = function () {
            this.alive = true;
            this.exists = true;

            this.events.onRevived.dispatch(this);
        };
        return Sprite;
    })();
    Phaser.Sprite = Sprite;
})(Phaser || (Phaser = {}));
