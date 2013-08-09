/// <reference path="../_definitions.ts" />
/**
* Phaser - StageScaleMode
*
* This class controls the scaling of your game. On mobile devices it will also remove the URL bar and allow
* you to maintain proportion and aspect ratio.
* The resizing method is based on a technique taken from Viewporter v2.0 by Zynga Inc. http://github.com/zynga/viewporter
*/
var Phaser;
(function (Phaser) {
    var StageScaleMode = (function () {
        /**
        * StageScaleMode constructor
        */
        function StageScaleMode(game, width, height) {
            var _this = this;
            /**
            * Stage height when start the game.
            * @type {number}
            */
            this._startHeight = 0;
            /**
            * If the game should be forced to use Landscape mode, this is set to true by Game.Stage
            * @type {Boolean}
            */
            this.forceLandscape = false;
            /**
            * If the game should be forced to use Portrait mode, this is set to true by Game.Stage
            * @type {Boolean}
            */
            this.forcePortrait = false;
            /**
            * If the game should be forced to use a specific orientation and the device currently isn't in that orientation this is set to true.
            * @type {Boolean}
            */
            this.incorrectOrientation = false;
            /**
            * If you wish to align your game in the middle of the page then you can set this value to true.
            * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
            * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
            * @type {Boolean}
            */
            this.pageAlignHorizontally = false;
            /**
            * If you wish to align your game in the middle of the page then you can set this value to true.
            * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
            * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
            * @type {Boolean}
            */
            this.pageAlignVeritcally = false;
            /**
            * Minimum width the canvas should be scaled to (in pixels)
            * @type {number}
            */
            this.minWidth = null;
            /**
            * Maximum width the canvas should be scaled to (in pixels).
            * If null it will scale to whatever width the browser can handle.
            * @type {number}
            */
            this.maxWidth = null;
            /**
            * Minimum height the canvas should be scaled to (in pixels)
            * @type {number}
            */
            this.minHeight = null;
            /**
            * Maximum height the canvas should be scaled to (in pixels).
            * If null it will scale to whatever height the browser can handle.
            * @type {number}
            */
            this.maxHeight = null;
            /**
            * Width of the stage after calculation.
            * @type {number}
            */
            this.width = 0;
            /**
            * Height of the stage after calculation.
            * @type {number}
            */
            this.height = 0;
            /**
            * The maximum number of times it will try to resize the canvas to fill the browser (default is 10)
            * @type {number}
            */
            this.maxIterations = 10;
            this.game = game;

            this.enterLandscape = new Phaser.Signal();
            this.enterPortrait = new Phaser.Signal();

            if (window['orientation']) {
                this.orientation = window['orientation'];
            } else {
                if (window.outerWidth > window.outerHeight) {
                    this.orientation = 90;
                } else {
                    this.orientation = 0;
                }
            }

            this.scaleFactor = new Phaser.Vec2(1, 1);
            this.aspectRatio = 0;
            this.minWidth = width;
            this.minHeight = height;
            this.maxWidth = width;
            this.maxHeight = height;

            window.addEventListener('orientationchange', function (event) {
                return _this.checkOrientation(event);
            }, false);
            window.addEventListener('resize', function (event) {
                return _this.checkResize(event);
            }, false);
        }
        Object.defineProperty(StageScaleMode.prototype, "isFullScreen", {
            get: //  Full Screen API calls
            function () {
                if (document['fullscreenElement'] === null || document['mozFullScreenElement'] === null || document['webkitFullscreenElement'] === null) {
                    return false;
                }

                return true;
            },
            enumerable: true,
            configurable: true
        });

        StageScaleMode.prototype.startFullScreen = function () {
            if (this.isFullScreen) {
                return;
            }

            var element = this.game.stage.canvas;

            if (element['requestFullScreen']) {
                element['requestFullScreen']();
            } else if (element['mozRequestFullScreen']) {
                element['mozRequestFullScreen']();
            } else if (element['webkitRequestFullScreen']) {
                element['webkitRequestFullScreen']();
            }
        };

        StageScaleMode.prototype.stopFullScreen = function () {
            if (document['cancelFullScreen']) {
                document['cancelFullScreen']();
            } else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if (document['webkitCancelFullScreen']) {
                document['webkitCancelFullScreen']();
            }
        };

        /**
        * The core update loop, called by Phaser.Stage
        */
        StageScaleMode.prototype.update = function () {
            if (this.game.stage.scaleMode !== Phaser.StageScaleMode.NO_SCALE && (window.innerWidth !== this.width || window.innerHeight !== this.height)) {
                this.refresh();
            }

            if (this.forceLandscape || this.forcePortrait) {
                this.checkOrientationState();
            }
        };

        StageScaleMode.prototype.checkOrientationState = function () {
            if (this.incorrectOrientation) {
                if ((this.forceLandscape && window.innerWidth > window.innerHeight) || (this.forcePortrait && window.innerHeight > window.innerWidth)) {
                    //  Back to normal
                    this.game.paused = false;
                    this.incorrectOrientation = false;
                    this.refresh();
                }
            } else {
                if ((this.forceLandscape && window.innerWidth < window.innerHeight) || (this.forcePortrait && window.innerHeight < window.innerWidth)) {
                    //  Show orientation screen
                    this.game.paused = true;
                    this.incorrectOrientation = true;
                    this.refresh();
                }
            }
        };

        Object.defineProperty(StageScaleMode.prototype, "isPortrait", {
            get: function () {
                return this.orientation == 0 || this.orientation == 180;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(StageScaleMode.prototype, "isLandscape", {
            get: function () {
                return this.orientation === 90 || this.orientation === -90;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Handle window.orientationchange events
        */
        StageScaleMode.prototype.checkOrientation = function (event) {
            this.orientation = window['orientation'];

            if (this.isLandscape) {
                this.enterLandscape.dispatch(this.orientation, true, false);
            } else {
                this.enterPortrait.dispatch(this.orientation, false, true);
            }

            if (this.game.stage.scaleMode !== StageScaleMode.NO_SCALE) {
                this.refresh();
            }
        };

        /**
        * Handle window.resize events
        */
        StageScaleMode.prototype.checkResize = function (event) {
            if (window.outerWidth > window.outerHeight) {
                this.orientation = 90;
            } else {
                this.orientation = 0;
            }

            if (this.isLandscape) {
                this.enterLandscape.dispatch(this.orientation, true, false);
            } else {
                this.enterPortrait.dispatch(this.orientation, false, true);
            }

            if (this.game.stage.scaleMode !== StageScaleMode.NO_SCALE) {
                this.refresh();
            }
        };

        /**
        * Re-calculate scale mode and update screen size.
        */
        StageScaleMode.prototype.refresh = function () {
            var _this = this;
            if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false) {
                document.documentElement['style'].minHeight = '2000px';

                this._startHeight = window.innerHeight;

                if (this.game.device.android && this.game.device.chrome == false) {
                    window.scrollTo(0, 1);
                } else {
                    window.scrollTo(0, 0);
                }
            }

            if (this._check == null && this.maxIterations > 0) {
                this._iterations = this.maxIterations;
                this._check = window.setInterval(function () {
                    return _this.setScreenSize();
                }, 10);
                this.setScreenSize();
            }
        };

        /**
        * Set screen size automatically based on the scaleMode.
        */
        StageScaleMode.prototype.setScreenSize = function (force) {
            if (typeof force === "undefined") { force = false; }
            if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false) {
                if (this.game.device.android && this.game.device.chrome == false) {
                    window.scrollTo(0, 1);
                } else {
                    window.scrollTo(0, 0);
                }
            }

            this._iterations--;

            if (force || window.innerHeight > this._startHeight || this._iterations < 0) {
                // Set minimum height of content to new window height
                document.documentElement['style'].minHeight = window.innerHeight + 'px';

                if (this.incorrectOrientation == true) {
                    this.setMaximum();
                } else if (this.game.stage.scaleMode == StageScaleMode.EXACT_FIT) {
                    this.setExactFit();
                } else if (this.game.stage.scaleMode == StageScaleMode.SHOW_ALL) {
                    this.setShowAll();
                }

                this.setSize();

                clearInterval(this._check);

                this._check = null;
            }
        };

        StageScaleMode.prototype.setSize = function () {
            if (this.incorrectOrientation == false) {
                if (this.maxWidth && this.width > this.maxWidth) {
                    this.width = this.maxWidth;
                }

                if (this.maxHeight && this.height > this.maxHeight) {
                    this.height = this.maxHeight;
                }

                if (this.minWidth && this.width < this.minWidth) {
                    this.width = this.minWidth;
                }

                if (this.minHeight && this.height < this.minHeight) {
                    this.height = this.minHeight;
                }
            }

            this.game.stage.canvas.style.width = this.width + 'px';
            this.game.stage.canvas.style.height = this.height + 'px';

            this.game.input.scale.setTo(this.game.stage.width / this.width, this.game.stage.height / this.height);

            if (this.pageAlignHorizontally) {
                if (this.width < window.innerWidth && this.incorrectOrientation == false) {
                    this.game.stage.canvas.style.marginLeft = Math.round((window.innerWidth - this.width) / 2) + 'px';
                } else {
                    this.game.stage.canvas.style.marginLeft = '0px';
                }
            }

            if (this.pageAlignVeritcally) {
                if (this.height < window.innerHeight && this.incorrectOrientation == false) {
                    this.game.stage.canvas.style.marginTop = Math.round((window.innerHeight - this.height) / 2) + 'px';
                } else {
                    this.game.stage.canvas.style.marginTop = '0px';
                }
            }

            this.game.stage.getOffset(this.game.stage.canvas);

            this.aspectRatio = this.width / this.height;
            this.scaleFactor.x = this.game.stage.width / this.width;
            this.scaleFactor.y = this.game.stage.height / this.height;
        };

        StageScaleMode.prototype.setMaximum = function () {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        };

        StageScaleMode.prototype.setShowAll = function () {
            var multiplier = Math.min((window.innerHeight / this.game.stage.height), (window.innerWidth / this.game.stage.width));

            this.width = Math.round(this.game.stage.width * multiplier);
            this.height = Math.round(this.game.stage.height * multiplier);
        };

        StageScaleMode.prototype.setExactFit = function () {
            if (this.maxWidth && window.innerWidth > this.maxWidth) {
                this.width = this.maxWidth;
            } else {
                this.width = window.innerWidth;
            }

            if (this.maxHeight && window.innerHeight > this.maxHeight) {
                this.height = this.maxHeight;
            } else {
                this.height = window.innerHeight;
            }
        };
        StageScaleMode.EXACT_FIT = 0;

        StageScaleMode.NO_SCALE = 1;

        StageScaleMode.SHOW_ALL = 2;
        return StageScaleMode;
    })();
    Phaser.StageScaleMode = StageScaleMode;
})(Phaser || (Phaser = {}));
