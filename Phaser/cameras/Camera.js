/// <reference path="../_definitions.ts" />
/**
* Phaser - Camera
*
* A Camera is your view into the game world. It has a position, size, scale and rotation and renders only those objects
* within its field of view. The game automatically creates a single Stage sized camera on boot, but it can be changed and
* additional cameras created via the CameraManager.
*/
var Phaser;
(function (Phaser) {
    var Camera = (function () {
        /**
        * Instantiates a new camera at the specified location, with the specified size and zoom level.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param id {number} Unique identity.
        * @param x {number} X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param y {number} Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param width {number} The width of the camera display in pixels.
        * @param height {number} The height of the camera display in pixels.
        */
        function Camera(game, id, x, y, width, height) {
            this._target = null;
            /**
            * Camera worldBounds.
            * @type {Rectangle}
            */
            this.worldBounds = null;
            /**
            * A boolean representing if the Camera has been modified in any way via a scale, rotate, flip or skew.
            */
            this.modified = false;
            /**
            * Sprite moving inside this Rectangle will not cause camera moving.
            * @type {Rectangle}
            */
            this.deadzone = null;
            /**
            * Whether this camera is visible or not. (default is true)
            * @type {boolean}
            */
            this.visible = true;
            /**
            * The z value of this Camera. Cameras are rendered in z-index order by the Renderer.
            */
            this.z = -1;
            this.game = game;

            this.ID = id;
            this.z = id;

            width = this.game.math.clamp(width, this.game.stage.width, 1);
            height = this.game.math.clamp(height, this.game.stage.height, 1);

            //  The view into the world we wish to render (by default the full game world size)
            //  The size of this Rect is the same as screenView, but the values are all in world coordinates instead of screen coordinates
            this.worldView = new Phaser.Rectangle(0, 0, width, height);

            //  The rect of the area being rendered in stage/screen coordinates
            this.screenView = new Phaser.Rectangle(x, y, width, height);

            this.plugins = new Phaser.PluginManager(this.game, this);

            this.transform = new Phaser.Components.TransformManager(this);
            this.texture = new Phaser.Display.Texture(this);

            //  We create a hidden canvas for our camera the size of the game (we use the screenView to clip the render to the camera size)
            this._canvas = document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
            this._renderLocal = true;
            this.texture.canvas = this._canvas;
            this.texture.context = this.texture.canvas.getContext('2d');
            this.texture.backgroundColor = this.game.stage.backgroundColor;

            //  Handy proxies
            this.scale = this.transform.scale;
            this.alpha = this.texture.alpha;
            this.origin = this.transform.origin;
            this.crop = this.texture.crop;
        }

        Object.defineProperty(Camera.prototype, "alpha", {
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

        Object.defineProperty(Camera.prototype, "directToStage", {
            set: function (value) {
                if (value) {
                    this._renderLocal = false;
                    this.texture.canvas = this.game.stage.canvas;
                    Phaser.CanvasUtils.setBackgroundColor(this.texture.canvas, this.game.stage.backgroundColor);
                } else {
                    this._renderLocal = true;
                    this.texture.canvas = this._canvas;
                    Phaser.CanvasUtils.setBackgroundColor(this.texture.canvas, this.texture.backgroundColor);
                }

                this.texture.context = this.texture.canvas.getContext('2d');
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Hides an object from this Camera. Hidden objects are not rendered.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should ignore.
        */
        Camera.prototype.hide = function (object) {
            object.texture.hideFromCamera(this);
        };

        /**
        * Returns true if the object is hidden from this Camera.
        *
        * @param object {Sprite/Group} The object to check.
        */
        Camera.prototype.isHidden = function (object) {
            return object.texture.isHidden(this);
        };

        /**
        * Un-hides an object previously hidden to this Camera.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should display.
        */
        Camera.prototype.show = function (object) {
            object.texture.showToCamera(this);
        };

        /**
        * Tells this camera object what sprite to track.
        * @param target {Sprite} The object you want the camera to track. Set to null to not follow anything.
        * @param [style] {number} Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
        */
        Camera.prototype.follow = function (target, style) {
            if (typeof style === "undefined") { style = Phaser.Types.CAMERA_FOLLOW_LOCKON; }
            this._target = target;

            var helper;

            switch (style) {
                case Phaser.Types.CAMERA_FOLLOW_PLATFORMER:
                    var w = this.width / 8;
                    var h = this.height / 3;
                    this.deadzone = new Phaser.Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_TOPDOWN:
                    helper = Math.max(this.width, this.height) / 4;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_TOPDOWN_TIGHT:
                    helper = Math.max(this.width, this.height) / 8;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_LOCKON:
                default:
                    this.deadzone = null;
                    break;
            }
        };

        /**
        * Move the camera focus to this location instantly.
        * @param x {number} X position.
        * @param y {number} Y position.
        */
        Camera.prototype.focusOnXY = function (x, y) {
            x += (x > 0) ? 0.0000001 : -0.0000001;
            y += (y > 0) ? 0.0000001 : -0.0000001;

            this.worldView.x = Math.round(x - this.worldView.halfWidth);
            this.worldView.y = Math.round(y - this.worldView.halfHeight);
        };

        /**
        * Move the camera focus to this location instantly.
        * @param point {any} Point you want to focus.
        */
        Camera.prototype.focusOn = function (point) {
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;

            this.worldView.x = Math.round(point.x - this.worldView.halfWidth);
            this.worldView.y = Math.round(point.y - this.worldView.halfHeight);
        };

        /**
        * Specify the boundaries of the world or where the camera is allowed to move.
        *
        * @param x      {number} The smallest X value of your world (usually 0).
        * @param y      {number} The smallest Y value of your world (usually 0).
        * @param width  {number} The largest X value of your world (usually the world width).
        * @param height {number} The largest Y value of your world (usually the world height).
        */
        Camera.prototype.setBounds = function (x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            if (this.worldBounds == null) {
                this.worldBounds = new Phaser.Rectangle();
            }

            this.worldBounds.setTo(x, y, width, height);

            this.worldView.x = x;
            this.worldView.y = y;

            this.update();
        };

        /**
        * Update focusing and scrolling.
        */
        Camera.prototype.update = function () {
            if (this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY)) {
                this.modified = true;
            }

            this.plugins.preUpdate();

            if (this._target !== null) {
                if (this.deadzone == null) {
                    this.focusOnXY(this._target.x, this._target.y);
                } else {
                    var edge;
                    var targetX = this._target.x + ((this._target.x > 0) ? 0.0000001 : -0.0000001);
                    var targetY = this._target.y + ((this._target.y > 0) ? 0.0000001 : -0.0000001);

                    edge = targetX - this.deadzone.x;

                    if (this.worldView.x > edge) {
                        this.worldView.x = edge;
                    }

                    edge = targetX + this._target.width - this.deadzone.x - this.deadzone.width;

                    if (this.worldView.x < edge) {
                        this.worldView.x = edge;
                    }

                    edge = targetY - this.deadzone.y;

                    if (this.worldView.y > edge) {
                        this.worldView.y = edge;
                    }

                    edge = targetY + this._target.height - this.deadzone.y - this.deadzone.height;

                    if (this.worldView.y < edge) {
                        this.worldView.y = edge;
                    }
                }
            }

            if (this.worldBounds !== null) {
                if (this.worldView.x < this.worldBounds.left) {
                    this.worldView.x = this.worldBounds.left;
                }

                if (this.worldView.x > this.worldBounds.right - this.width) {
                    this.worldView.x = (this.worldBounds.right - this.width) + 1;
                }

                if (this.worldView.y < this.worldBounds.top) {
                    this.worldView.y = this.worldBounds.top;
                }

                if (this.worldView.y > this.worldBounds.bottom - this.height) {
                    this.worldView.y = (this.worldBounds.bottom - this.height) + 1;
                }
            }

            this.worldView.floor();

            this.plugins.update();
        };

        /**
        * Update focusing and scrolling.
        */
        Camera.prototype.postUpdate = function () {
            if (this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false) {
                this.modified = false;
            }

            if (this.worldBounds !== null) {
                if (this.worldView.x < this.worldBounds.left) {
                    this.worldView.x = this.worldBounds.left;
                }

                if (this.worldView.x > this.worldBounds.right - this.width) {
                    this.worldView.x = this.worldBounds.right - this.width;
                }

                if (this.worldView.y < this.worldBounds.top) {
                    this.worldView.y = this.worldBounds.top;
                }

                if (this.worldView.y > this.worldBounds.bottom - this.height) {
                    this.worldView.y = this.worldBounds.bottom - this.height;
                }
            }

            this.worldView.floor();

            this.plugins.postUpdate();
        };

        /**
        * Destroys this camera, associated FX and removes itself from the CameraManager.
        */
        Camera.prototype.destroy = function () {
            this.game.world.cameras.removeCamera(this.ID);
            this.plugins.destroy();
        };

        Object.defineProperty(Camera.prototype, "x", {
            get: function () {
                return this.worldView.x;
            },
            set: function (value) {
                this.worldView.x = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Camera.prototype, "y", {
            get: function () {
                return this.worldView.y;
            },
            set: function (value) {
                this.worldView.y = value;
            },
            enumerable: true,
            configurable: true
        });



        Object.defineProperty(Camera.prototype, "width", {
            get: function () {
                return this.screenView.width;
            },
            set: function (value) {
                this.screenView.width = value;
                this.worldView.width = value;

                if (value !== this.texture.canvas.width) {
                    this.texture.canvas.width = value;
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Camera.prototype, "height", {
            get: function () {
                return this.screenView.height;
            },
            set: function (value) {
                this.screenView.height = value;
                this.worldView.height = value;

                if (value !== this.texture.canvas.height) {
                    this.texture.canvas.height = value;
                }
            },
            enumerable: true,
            configurable: true
        });



        Camera.prototype.setPosition = function (x, y) {
            this.screenView.x = x;
            this.screenView.y = y;
        };

        Camera.prototype.setSize = function (width, height) {
            this.screenView.width = width * this.transform.scale.x;
            this.screenView.height = height * this.transform.scale.y;
            this.worldView.width = width;
            this.worldView.height = height;

            if (width !== this.texture.canvas.width) {
                this.texture.canvas.width = width;
            }

            if (height !== this.texture.canvas.height) {
                this.texture.canvas.height = height;
            }
        };

        Object.defineProperty(Camera.prototype, "rotation", {
            get: /**
            * The angle of the Camera in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
            */
            function () {
                return this.transform.rotation;
            },
            set: /**
            * Set the angle of the Camera in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
            * The value is automatically wrapped to be between 0 and 360.
            */
            function (value) {
                this.transform.rotation = this.game.math.wrap(value, 360, 0);
            },
            enumerable: true,
            configurable: true
        });

        return Camera;
    })();
    Phaser.Camera = Camera;
})(Phaser || (Phaser = {}));
