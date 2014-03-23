/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The ScaleManager object is responsible for helping you manage the scaling, resizing and alignment of your game within the browser.
*
* @class Phaser.ScaleManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} width - The native width of the game.
* @param {number} height - The native height of the game.
*/
Phaser.ScaleManager = function (game, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {number} width - Width of the stage after calculation.
    */
    this.width = width;

    /**
    * @property {number} height - Height of the stage after calculation.
    */
    this.height = height;

    /**
    * @property {number} minWidth - Minimum width the canvas should be scaled to (in pixels).
    */
    this.minWidth = null;

    /**
    * @property {number} maxWidth - Maximum width the canvas should be scaled to (in pixels). If null it will scale to whatever width the browser can handle.
    */
    this.maxWidth = null;

    /**
    * @property {number} minHeight - Minimum height the canvas should be scaled to (in pixels).
    */
    this.minHeight = null;

    /**
    * @property {number} maxHeight - Maximum height the canvas should be scaled to (in pixels). If null it will scale to whatever height the browser can handle.
    */
    this.maxHeight = null;

    /**
    * @property {boolean} forceLandscape - If the game should be forced to use Landscape mode, this is set to true by Game.Stage
    * @default
    */
    this.forceLandscape = false;

    /**
    * @property {boolean} forcePortrait - If the game should be forced to use Portrait mode, this is set to true by Game.Stage
    * @default
    */
    this.forcePortrait = false;

    /**
    * @property {boolean} incorrectOrientation - If the game should be forced to use a specific orientation and the device currently isn't in that orientation this is set to true.
    * @default
    */
    this.incorrectOrientation = false;

    /**
    * @property {boolean} pageAlignHorizontally - If you wish to align your game in the middle of the page then you can set this value to true.
    * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
    * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
    * @default
    */
    this.pageAlignHorizontally = false;

    /**
    * @property {boolean} pageAlignVertically - If you wish to align your game in the middle of the page then you can set this value to true.
    * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
    * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
    * @default
    */
    this.pageAlignVertically = false;

    /**
    * @property {number} maxIterations - The maximum number of times it will try to resize the canvas to fill the browser.
    * @default
    */
    this.maxIterations = 5;

    /**
    * @property {PIXI.Sprite} orientationSprite - The Sprite that is optionally displayed if the browser enters an unsupported orientation.
    */
    this.orientationSprite = null;

    /**
    * @property {Phaser.Signal} enterLandscape - The event that is dispatched when the browser enters landscape orientation.
    */
    this.enterLandscape = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} enterPortrait - The event that is dispatched when the browser enters horizontal orientation.
    */
    this.enterPortrait = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} enterIncorrectOrientation - The event that is dispatched when the browser enters an incorrect orientation, as defined by forceOrientation.
    */
    this.enterIncorrectOrientation = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} leaveIncorrectOrientation - The event that is dispatched when the browser leaves an incorrect orientation, as defined by forceOrientation.
    */
    this.leaveIncorrectOrientation = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} hasResized - The event that is dispatched when the game scale changes.
    */
    this.hasResized = new Phaser.Signal();

    /**
    * This is the DOM element that will have the Full Screen mode called on it. It defaults to the game canvas, but can be retargetted to any valid DOM element.
    * If you adjust this property it's up to you to see it has the correct CSS applied, and that you have contained the game canvas correctly.
    * Note that if you use a scale property of EXACT_FIT then fullScreenTarget will have its width and height style set to 100%.
    * @property {any} fullScreenTarget
    */
    this.fullScreenTarget = this.game.canvas;

    /**
    * @property {Phaser.Signal} enterFullScreen - The event that is dispatched when the browser enters full screen mode (if it supports the FullScreen API).
    */
    this.enterFullScreen = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} leaveFullScreen - The event that is dispatched when the browser leaves full screen mode (if it supports the FullScreen API).
    */
    this.leaveFullScreen = new Phaser.Signal();

    /**
    * @property {number} orientation - The orientation value of the game (as defined by window.orientation if set). 90 = landscape. 0 = portrait.
    */
    this.orientation = 0;

    if (window['orientation'])
    {
        this.orientation = window['orientation'];
    }
    else
    {
        if (window.outerWidth > window.outerHeight)
        {
            this.orientation = 90;
        }
    }

    /**
    * @property {Phaser.Point} scaleFactor - The scale factor based on the game dimensions vs. the scaled dimensions.
    * @readonly
    */
    this.scaleFactor = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} scaleFactorInversed - The inversed scale factor. The displayed dimensions divided by the game dimensions.
    * @readonly
    */
    this.scaleFactorInversed = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} margin - If the game canvas is seto to align by adjusting the margin, the margin calculation values are stored in this Point.
    * @readonly
    */
    this.margin = new Phaser.Point(0, 0);

    /**
    * @property {number} aspectRatio - The aspect ratio of the scaled game.
    * @readonly
    */
    this.aspectRatio = 0;

    /**
    * @property {number} sourceAspectRatio - The aspect ratio (width / height) of the original game dimensions.
    * @readonly
    */
    this.sourceAspectRatio = width / height;

    /**
    * @property {any} event- The native browser events from full screen API changes.
    */
    this.event = null;

    /**
    * @property {number} scaleMode - The current scaleMode.
    */
    this.scaleMode = Phaser.ScaleManager.NO_SCALE;

    /*
    * @property {number} fullScreenScaleMode - Scale mode to be used in fullScreen
    */
    this.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

    /**
    * @property {number} _startHeight - Internal cache var. Stage height when starting the game.
    * @private
    */
    this._startHeight = 0;

    /**
    * @property {number} _width - Cached stage width for full screen mode.
    * @private
    */
    this._width = 0;

    /**
    * @property {number} _height - Cached stage height for full screen mode.
    * @private
    */
    this._height = 0;

    var _this = this;

    window.addEventListener('orientationchange', function (event) {
        return _this.checkOrientation(event);
    }, false);

    window.addEventListener('resize', function (event) {
        return _this.checkResize(event);
    }, false);

    document.addEventListener('webkitfullscreenchange', function (event) {
        return _this.fullScreenChange(event);
    }, false);

    document.addEventListener('mozfullscreenchange', function (event) {
        return _this.fullScreenChange(event);
    }, false);

    document.addEventListener('fullscreenchange', function (event) {
        return _this.fullScreenChange(event);
    }, false);

};

/**
* @constant
* @type {number}
*/
Phaser.ScaleManager.EXACT_FIT = 0;

/**
* @constant
* @type {number}
*/
Phaser.ScaleManager.NO_SCALE = 1;

/**
* @constant
* @type {number}
*/
Phaser.ScaleManager.SHOW_ALL = 2;

Phaser.ScaleManager.prototype = {

    /**
    * Tries to enter the browser into full screen mode.
    * Please note that this needs to be supported by the web browser and isn't the same thing as setting your game to fill the browser.
    * @method Phaser.ScaleManager#startFullScreen
    * @param {boolean} antialias - You can toggle the anti-alias feature of the canvas before jumping in to full screen (false = retain pixel art, true = smooth art)
    */
    startFullScreen: function (antialias) {

        if (this.isFullScreen || !this.game.device.fullscreen)
        {
            return;
        }

        if (typeof antialias !== 'undefined' && this.game.renderType === Phaser.CANVAS)
        {
            this.game.stage.smoothed = antialias;
        }

        this._width = this.width;
        this._height = this.height;

        if (this.game.device.fullscreenKeyboard)
        {
            this.fullScreenTarget[this.game.device.requestFullscreen](Element.ALLOW_KEYBOARD_INPUT);
        }
        else
        {
            this.fullScreenTarget[this.game.device.requestFullscreen]();
        }

    },

    /**
    * Stops full screen mode if the browser is in it.
    * @method Phaser.ScaleManager#stopFullScreen
    */
    stopFullScreen: function () {

        this.fullScreenTarget[this.game.device.cancelFullscreen]();

    },

    /**
    * Called automatically when the browser enters of leaves full screen mode.
    * @method Phaser.ScaleManager#fullScreenChange
    * @param {Event} event - The fullscreenchange event
    * @protected
    */
    fullScreenChange: function (event) {

        this.event = event;

        if (this.isFullScreen)
        {
            if (this.fullScreenScaleMode === Phaser.ScaleManager.EXACT_FIT)
            {
                this.fullScreenTarget.style['width'] = '100%';
                this.fullScreenTarget.style['height'] = '100%';

                this.width = window.outerWidth;
                this.height = window.outerHeight;

                this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

                this.aspectRatio = this.width / this.height;
                this.scaleFactor.x = this.game.width / this.width;
                this.scaleFactor.y = this.game.height / this.height;

                this.checkResize();
            }
            else if (this.fullScreenScaleMode === Phaser.ScaleManager.SHOW_ALL)
            {
                this.setShowAll();
                this.refresh();
            }

            this.enterFullScreen.dispatch(this.width, this.height);
        }
        else
        {
            this.fullScreenTarget.style['width'] = this.game.width + 'px';
            this.fullScreenTarget.style['height'] = this.game.height + 'px';

            this.width = this._width;
            this.height = this._height;

            this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

            this.aspectRatio = this.width / this.height;
            this.scaleFactor.x = this.game.width / this.width;
            this.scaleFactor.y = this.game.height / this.height;

            this.leaveFullScreen.dispatch(this.width, this.height);
        }

    },

    /**
    * If you need your game to run in only one orientation you can force that to happen.
    * The optional orientationImage is displayed when the game is in the incorrect orientation.
    * @method Phaser.ScaleManager#forceOrientation
    * @param {boolean} forceLandscape - true if the game should run in landscape mode only.
    * @param {boolean} [forcePortrait=false] - true if the game should run in portrait mode only.
    * @param {string} [orientationImage=''] - The string of an image in the Phaser.Cache to display when this game is in the incorrect orientation.
    */
    forceOrientation: function (forceLandscape, forcePortrait, orientationImage) {

        if (typeof forcePortrait === 'undefined') { forcePortrait = false; }

        this.forceLandscape = forceLandscape;
        this.forcePortrait = forcePortrait;

        if (typeof orientationImage !== 'undefined')
        {
            if (orientationImage == null || this.game.cache.checkImageKey(orientationImage) === false)
            {
                orientationImage = '__default';
            }

            this.orientationSprite = new Phaser.Image(this.game, this.game.width / 2, this.game.height / 2, PIXI.TextureCache[orientationImage]);
            this.orientationSprite.anchor.set(0.5);

            this.checkOrientationState();

            if (this.incorrectOrientation)
            {
                this.orientationSprite.visible = true;
                this.game.world.visible = false;
            }
            else
            {
                this.orientationSprite.visible = false;
                this.game.world.visible = true;
            }

            this.game.stage.addChild(this.orientationSprite);
        }

    },

    /**
    * Checks if the browser is in the correct orientation for your game (if forceLandscape or forcePortrait have been set)
    * @method Phaser.ScaleManager#checkOrientationState
    */
    checkOrientationState: function () {

        //  They are in the wrong orientation
        if (this.incorrectOrientation)
        {
            if ((this.forceLandscape && window.innerWidth > window.innerHeight) || (this.forcePortrait && window.innerHeight > window.innerWidth))
            {
                //  Back to normal
                this.incorrectOrientation = false;
                this.leaveIncorrectOrientation.dispatch();

                if (this.orientationSprite)
                {
                    this.orientationSprite.visible = false;
                    this.game.world.visible = true;
                }

                if (this.scaleMode !== Phaser.ScaleManager.NO_SCALE)
                {
                    this.refresh();
                }
            }
        }
        else
        {
            if ((this.forceLandscape && window.innerWidth < window.innerHeight) || (this.forcePortrait && window.innerHeight < window.innerWidth))
            {
                //  Show orientation screen
                this.incorrectOrientation = true;
                this.enterIncorrectOrientation.dispatch();

                if (this.orientationSprite && this.orientationSprite.visible === false)
                {
                    this.orientationSprite.visible = true;
                    this.game.world.visible = false;
                }

                if (this.scaleMode !== Phaser.ScaleManager.NO_SCALE)
                {
                    this.refresh();
                }
            }
        }
    },

    /**
    * Handle window.orientationchange events
    * @method Phaser.ScaleManager#checkOrientation
    * @param {Event} event - The orientationchange event data.
    */
    checkOrientation: function (event) {

        this.event = event;

        this.orientation = window['orientation'];

        if (this.isLandscape)
        {
            this.enterLandscape.dispatch(this.orientation, true, false);
        }
        else
        {
            this.enterPortrait.dispatch(this.orientation, false, true);
        }

        if (this.scaleMode !== Phaser.ScaleManager.NO_SCALE)
        {
            this.refresh();
        }

    },

    /**
    * Handle window.resize events
    * @method Phaser.ScaleManager#checkResize
    * @param {Event} event - The resize event data.
    */
    checkResize: function (event) {

        this.event = event;

        if (window.outerWidth > window.outerHeight)
        {
            this.orientation = 90;
        }
        else
        {
            this.orientation = 0;
        }

        if (this.isLandscape)
        {
            this.enterLandscape.dispatch(this.orientation, true, false);
        }
        else
        {
            this.enterPortrait.dispatch(this.orientation, false, true);
        }

        if (this.scaleMode !== Phaser.ScaleManager.NO_SCALE)
        {
            this.refresh();
        }

        this.checkOrientationState();

    },

    /**
    * Re-calculate scale mode and update screen size.
    * @method Phaser.ScaleManager#refresh
    */
    refresh: function () {

        //  We can't do anything about the status bars in iPads, web apps or desktops
        if (this.game.device.iPad === false && this.game.device.webApp === false && this.game.device.desktop === false)
        {
            if (this.game.device.android && this.game.device.chrome === false)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        if (this._check == null && this.maxIterations > 0)
        {
            this._iterations = this.maxIterations;

            var _this = this;

            this._check = window.setInterval(function () {
                return _this.setScreenSize();
            }, 10);

            this.setScreenSize();
        }

    },

    /**
    * Set screen size automatically based on the scaleMode.
    * @param {boolean} force - If force is true it will try to resize the game regardless of the document dimensions.
    */
    setScreenSize: function (force) {

        if (typeof force == 'undefined')
        {
            force = false;
        }

        if (this.game.device.iPad === false && this.game.device.webApp === false && this.game.device.desktop === false)
        {
            if (this.game.device.android && this.game.device.chrome === false)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        this._iterations--;

        if (force || window.innerHeight > this._startHeight || this._iterations < 0)
        {
            // Set minimum height of content to new window height
            document.documentElement['style'].minHeight = window.innerHeight + 'px';

            if (this.incorrectOrientation === true)
            {
                this.setMaximum();
            }
            else if (!this.isFullScreen)
            {
                if (this.scaleMode == Phaser.ScaleManager.EXACT_FIT)
                {
                    this.setExactFit();
                }
                else if (this.scaleMode == Phaser.ScaleManager.SHOW_ALL)
                {
                    this.setShowAll();
                }
            }
            else
            {
                if (this.fullScreenScaleMode == Phaser.ScaleManager.EXACT_FIT)
                {
                    this.setExactFit();
                }
                else if (this.fullScreenScaleMode == Phaser.ScaleManager.SHOW_ALL)
                {
                    this.setShowAll();
                }
            }

            this.setSize();
            clearInterval(this._check);
            this._check = null;
        }

    },

    /**
    * Sets the canvas style width and height values based on minWidth/Height and maxWidth/Height.
    * @method Phaser.ScaleManager#setSize
    */
    setSize: function () {

        if (this.incorrectOrientation === false)
        {
            if (this.maxWidth && this.width > this.maxWidth)
            {
                this.width = this.maxWidth;
            }

            if (this.maxHeight && this.height > this.maxHeight)
            {
                this.height = this.maxHeight;
            }

            if (this.minWidth && this.width < this.minWidth)
            {
                this.width = this.minWidth;
            }

            if (this.minHeight && this.height < this.minHeight)
            {
                this.height = this.minHeight;
            }
        }

        this.game.canvas.style.width = this.width + 'px';
        this.game.canvas.style.height = this.height + 'px';

        this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

        if (this.pageAlignHorizontally)
        {
            if (this.width < window.innerWidth && this.incorrectOrientation === false)
            {
                this.margin.x = Math.round((window.innerWidth - this.width) / 2);
                this.game.canvas.style.marginLeft = this.margin.x + 'px';
            }
            else
            {
                this.margin.x = 0;
                this.game.canvas.style.marginLeft = '0px';
            }
        }

        if (this.pageAlignVertically)
        {
            if (this.height < window.innerHeight && this.incorrectOrientation === false)
            {
                this.margin.y = Math.round((window.innerHeight - this.height) / 2);
                this.game.canvas.style.marginTop = this.margin.y + 'px';
            }
            else
            {
                this.margin.y = 0;
                this.game.canvas.style.marginTop = '0px';
            }
        }

        Phaser.Canvas.getOffset(this.game.canvas, this.game.stage.offset);

        this.aspectRatio = this.width / this.height;

        this.scaleFactor.x = this.game.width / this.width;
        this.scaleFactor.y = this.game.height / this.height;

        this.scaleFactorInversed.x = this.width / this.game.width;
        this.scaleFactorInversed.y = this.height / this.game.height;

        this.hasResized.dispatch(this.width, this.height);

        this.checkOrientationState();

    },

    /**
    * Sets this.width equal to window.innerWidth and this.height equal to window.innerHeight
    * @method Phaser.ScaleManager#setMaximum
    */
    setMaximum: function () {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    },

    /**
    * Calculates the multiplier needed to scale the game proportionally.
    * @method Phaser.ScaleManager#setShowAll
    */
    setShowAll: function () {

        var multiplier = Math.min((window.innerHeight / this.game.height), (window.innerWidth / this.game.width));

        this.width = Math.round(this.game.width * multiplier);
        this.height = Math.round(this.game.height * multiplier);

    },

    /**
    * Sets the width and height values of the canvas, no larger than the maxWidth/Height.
    * @method Phaser.ScaleManager#setExactFit
    */
    setExactFit: function () {

        var availableWidth = window.innerWidth;
        var availableHeight = window.innerHeight;

        if (this.maxWidth && availableWidth > this.maxWidth)
        {
            this.width = this.maxWidth;
        }
        else
        {
            this.width = availableWidth;
        }

        if (this.maxHeight && availableHeight > this.maxHeight)
        {
            this.height = this.maxHeight;
        }
        else
        {
            this.height = availableHeight;
        }

    }

};

Phaser.ScaleManager.prototype.constructor = Phaser.ScaleManager;

/**
* @name Phaser.ScaleManager#isFullScreen
* @property {boolean} isFullScreen - Returns true if the browser is in full screen mode, otherwise false.
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "isFullScreen", {

    get: function () {

        return (document['fullscreenElement'] || document['mozFullScreenElement'] || document['webkitFullscreenElement']);

    }

});

/**
* @name Phaser.ScaleManager#isPortrait
* @property {boolean} isPortrait - Returns true if the browser dimensions match a portrait display.
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "isPortrait", {

    get: function () {
        return this.orientation === 0 || this.orientation == 180;
    }

});

/**
* @name Phaser.ScaleManager#isLandscape
* @property {boolean} isLandscape - Returns true if the browser dimensions match a landscape display.
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "isLandscape", {

    get: function () {
        return this.orientation === 90 || this.orientation === -90;
    }

});
