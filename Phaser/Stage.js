/// <reference path="_definitions.ts" />
/**
* Stage
*
* The Stage controls the canvas on which everything is displayed. It handles display within the browser,
* focus handling, game resizing, scaling and the pause, boot and orientation screens.
*
* @package    Phaser.Stage
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var Stage = (function () {
        /**
        * Stage constructor
        *
        * Create a new <code>Stage</code> with specific width and height.
        *
        * @param parent {number} ID of parent DOM element.
        * @param width {number} Width of the stage.
        * @param height {number} Height of the stage.
        */
        function Stage(game, parent, width, height) {
            var _this = this;
            /**
            * Background color of the stage (defaults to black). Set via the public backgroundColor property.
            * @type {string}
            */
            this._backgroundColor = 'rgb(0,0,0)';
            /**
            * Clear the whole stage every frame? (Default to true)
            * @type {boolean}
            */
            this.clear = true;
            /**
            * Do not use pause screen when game is paused?
            * (Default to false, aka always use PauseScreen)
            * @type {boolean}
            */
            this.disablePauseScreen = false;
            /**
            * Do not use boot screen when engine starts?
            * (Default to false, aka always use BootScreen)
            * @type {boolean}
            */
            this.disableBootScreen = false;
            /**
            * If set to true the game will never pause when the browser or browser tab loses focuses
            * @type {boolean}
            */
            this.disableVisibilityChange = false;
            this.game = game;

            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext('2d');

            Phaser.CanvasUtils.addToDOM(this.canvas, parent, true);
            Phaser.CanvasUtils.setTouchAction(this.canvas);

            this.canvas.oncontextmenu = function (event) {
                event.preventDefault();
            };

            this.css3 = new Phaser.Display.CSS3Filters(this.canvas);

            this.scaleMode = Phaser.StageScaleMode.NO_SCALE;
            this.scale = new Phaser.StageScaleMode(this.game, width, height);

            this.getOffset(this.canvas);
            this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, width, height);
            this.aspectRatio = width / height;

            document.addEventListener('visibilitychange', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('webkitvisibilitychange', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('pagehide', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('pageshow', function (event) {
                return _this.visibilityChange(event);
            }, false);
            window.onblur = function (event) {
                return _this.visibilityChange(event);
            };
            window.onfocus = function (event) {
                return _this.visibilityChange(event);
            };
        }
        /**
        * Stage boot
        */
        Stage.prototype.boot = function () {
            this.bootScreen = new Phaser.BootScreen(this.game);
            this.pauseScreen = new Phaser.PauseScreen(this.game, this.width, this.height);
            this.orientationScreen = new Phaser.OrientationScreen(this.game);

            this.scale.setScreenSize(true);
        };

        /**
        * Update stage for rendering. This will handle scaling, clearing
        * and PauseScreen/BootScreen updating and rendering.
        */
        Stage.prototype.update = function () {
            this.scale.update();

            this.context.setTransform(1, 0, 0, 1, 0, 0);

            if (this.clear || (this.game.paused && this.disablePauseScreen == false)) {
                if (this.game.device.patchAndroidClearRectBug) {
                    this.context.fillStyle = this._backgroundColor;
                    this.context.fillRect(0, 0, this.width, this.height);
                } else {
                    this.context.clearRect(0, 0, this.width, this.height);
                }
            }

            if (this.game.paused && this.scale.incorrectOrientation) {
                this.orientationScreen.update();
                this.orientationScreen.render();
                return;
            }

            if (this.game.isRunning == false && this.disableBootScreen == false) {
                this.bootScreen.update();
                this.bootScreen.render();
            }

            if (this.game.paused && this.disablePauseScreen == false) {
                this.pauseScreen.update();
                this.pauseScreen.render();
            }
        };

        /**
        * This method is called when the canvas elements visibility is changed.
        */
        Stage.prototype.visibilityChange = function (event) {
            if (this.disableVisibilityChange) {
                return;
            }

            if (event.type == 'pagehide' || event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true) {
                if (this.game.paused == false) {
                    this.pauseGame();
                }
            } else {
                if (this.game.paused == true) {
                    this.resumeGame();
                }
            }
        };

        Stage.prototype.enableOrientationCheck = function (forceLandscape, forcePortrait, imageKey) {
            if (typeof imageKey === "undefined") { imageKey = ''; }
            this.scale.forceLandscape = forceLandscape;
            this.scale.forcePortrait = forcePortrait;
            this.orientationScreen.enable(forceLandscape, forcePortrait, imageKey);

            if (forceLandscape || forcePortrait) {
                if ((this.scale.isLandscape && forcePortrait) || (this.scale.isPortrait && forceLandscape)) {
                    //  They are in the wrong orientation right now
                    this.game.paused = true;
                    this.scale.incorrectOrientation = true;
                } else {
                    this.scale.incorrectOrientation = false;
                }
            }
        };

        Stage.prototype.pauseGame = function () {
            this.game.paused = true;

            if (this.disablePauseScreen == false && this.pauseScreen) {
                this.pauseScreen.onPaused();
            }

            this.saveCanvasValues();
        };

        Stage.prototype.resumeGame = function () {
            if (this.disablePauseScreen == false && this.pauseScreen) {
                this.pauseScreen.onResume();
            }

            this.restoreCanvasValues();

            this.game.paused = false;
        };

        /**
        * Get the DOM offset values of the given element
        */
        Stage.prototype.getOffset = function (element, populateOffset) {
            if (typeof populateOffset === "undefined") { populateOffset = true; }
            var box = element.getBoundingClientRect();

            var clientTop = element.clientTop || document.body.clientTop || 0;
            var clientLeft = element.clientLeft || document.body.clientLeft || 0;
            var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
            var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;

            if (populateOffset) {
                this.offset = new Phaser.Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
                return this.offset;
            } else {
                return new Phaser.Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
            }
        };

        /**
        * Save current canvas properties (strokeStyle, lineWidth and fillStyle) for later using.
        */
        Stage.prototype.saveCanvasValues = function () {
            this.strokeStyle = this.context.strokeStyle;
            this.lineWidth = this.context.lineWidth;
            this.fillStyle = this.context.fillStyle;
        };

        /**
        * Restore current canvas values (strokeStyle, lineWidth and fillStyle) with saved values.
        */
        Stage.prototype.restoreCanvasValues = function () {
            this.context.strokeStyle = this.strokeStyle;
            this.context.lineWidth = this.lineWidth;
            this.context.fillStyle = this.fillStyle;

            if (this.game.device.patchAndroidClearRectBug) {
                this.context.fillStyle = this._backgroundColor;
                this.context.fillRect(0, 0, this.width, this.height);
            } else {
                this.context.clearRect(0, 0, this.width, this.height);
            }
        };


        Object.defineProperty(Stage.prototype, "backgroundColor", {
            get: function () {
                return this._backgroundColor;
            },
            set: function (color) {
                this.canvas.style.backgroundColor = color;
                this._backgroundColor = color;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "x", {
            get: function () {
                return this.bounds.x;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "y", {
            get: function () {
                return this.bounds.y;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "centerX", {
            get: function () {
                return this.bounds.halfWidth;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "centerY", {
            get: function () {
                return this.bounds.halfHeight;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "randomX", {
            get: function () {
                return Math.round(Math.random() * this.bounds.width);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Stage.prototype, "randomY", {
            get: function () {
                return Math.round(Math.random() * this.bounds.height);
            },
            enumerable: true,
            configurable: true
        });
        return Stage;
    })();
    Phaser.Stage = Stage;
})(Phaser || (Phaser = {}));
