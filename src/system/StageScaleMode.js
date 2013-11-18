/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* An Animation instance contains a single animation and the controls to play it.
* It is created by the AnimationManager, consists of Animation.Frame objects and belongs to a single Game Object such as a Sprite.
*
* @class Phaser.StageScaleMode 
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} width - Description.
* @param {number} height - Description.
*/
Phaser.StageScaleMode = function (game, width, height) {

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
    * @default
    */
    this.minWidth = null;

    /**
    * @property {number} maxWidth - Maximum width the canvas should be scaled to (in pixels).
    * If null it will scale to whatever width the browser can handle.
    * @default
    */
    this.maxWidth = null;

    /**
    * @property {number} minHeight - Minimum height the canvas should be scaled to (in pixels).
    * @default
    */
    this.minHeight = null;

    /**
    * @property {number} maxHeight - Maximum height the canvas should be scaled to (in pixels).
    * If null it will scale to whatever height the browser can handle.
    * @default
    */
    this.maxHeight = null;

    /**
    * @property {number} _startHeight - Stage height when starting the game.
    * @default
    * @private
    */
    this._startHeight = 0;

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
    * @property {number} _width - Cached stage width for full screen mode.
    * @default
    * @private
    */
    this._width = 0;

    /**
    * @property {number} _height - Cached stage height for full screen mode.
    * @default
    * @private
    */
    this._height = 0;

    /**
    * @property {number} maxIterations - The maximum number of times it will try to resize the canvas to fill the browser.
    * @default
    */
    this.maxIterations = 5;
    

    /**
    * @property {PIXI.Sprite} orientationSprite - The Sprite that is optionally displayed if the browser enters an unsupported orientation.
    * @default
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
        else
        {
            this.orientation = 0;
        }
    }

    /**
    * @property {Phaser.Point} scaleFactor - The scale factor based on the game dimensions vs. the scaled dimensions.
    */
    this.scaleFactor = new Phaser.Point(1, 1);

    /**
    * @property {number} aspectRatio - Aspect ratio.
    * @default
    */
    this.aspectRatio = 0;

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
Phaser.StageScaleMode.EXACT_FIT = 0;

/**
* @constant
* @type {number}
*/
Phaser.StageScaleMode.NO_SCALE = 1;

/**
* @constant
* @type {number}
*/
Phaser.StageScaleMode.SHOW_ALL = 2;

Phaser.StageScaleMode.prototype = {

    /**
    * Tries to enter the browser into full screen mode.
    * Please note that this needs to be supported by the web browser and isn't the same thing as setting your game to fill the browser.
    * @method Phaser.StageScaleMode#startFullScreen
    * @param {boolean} antialias - You can toggle the anti-alias feature of the canvas before jumping in to full screen (false = retain pixel art, true = smooth art)
    */
    startFullScreen: function (antialias) {

        if (this.isFullScreen)
        {
            return;
        }

        if (typeof antialias !== 'undefined')
        {
            Phaser.Canvas.setSmoothingEnabled(this.game.context, antialias);
        }

        var element = this.game.canvas;
        
        this._width = this.width;
        this._height = this.height;

        console.log('startFullScreen', this._width, this._height);

        if (element['requestFullScreen'])
        {
            element['requestFullScreen']();
        }
        else if (element['mozRequestFullScreen'])
        {
            element['mozRequestFullScreen']();
        }
        else if (element['webkitRequestFullScreen'])
        {
            element['webkitRequestFullScreen'](Element.ALLOW_KEYBOARD_INPUT);
        }

    },

    /**
    * Stops full screen mode if the browser is in it.
    * @method Phaser.StageScaleMode#stopFullScreen
    */
    stopFullScreen: function () {

        if (document['cancelFullScreen'])
        {
            document['cancelFullScreen']();
        }
        else if (document['mozCancelFullScreen'])
        {
            document['mozCancelFullScreen']();
        }
        else if (document['webkitCancelFullScreen'])
        {
            document['webkitCancelFullScreen']();
        }

    },

    /**
    * Called automatically when the browser enters of leaves full screen mode.
    * @method Phaser.StageScaleMode#fullScreenChange
    * @param {Event} event - The fullscreenchange event
    * @protected
    */
    fullScreenChange: function (event) {

        if (this.isFullScreen)
        {
            this.game.stage.canvas.style['width'] = '100%';
            this.game.stage.canvas.style['height'] = '100%';

            this.setMaximum();

            this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

            this.aspectRatio = this.width / this.height;
            this.scaleFactor.x = this.game.width / this.width;
            this.scaleFactor.y = this.game.height / this.height;
        }
        else
        {
            this.game.stage.canvas.style['width'] = this.game.width + 'px';
            this.game.stage.canvas.style['height'] = this.game.height + 'px';

            this.width = this._width;
            this.height = this._height;

            this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

            this.aspectRatio = this.width / this.height;
            this.scaleFactor.x = this.game.width / this.width;
            this.scaleFactor.y = this.game.height / this.height;
        }

    },

    /**
    * If you need your game to run in only one orientation you can force that to happen.
    * The optional orientationImage is displayed when the game is in the incorrect orientation.
    * @method Phaser.StageScaleMode#forceOrientation
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
            if (orientationImage == null || this.game.cache.checkImageKey(orientationImage) == false)
            {
                orientationImage = '__default';
            }

            this.orientationSprite = new PIXI.Sprite(PIXI.TextureCache[orientationImage]);
            this.orientationSprite.anchor.x = 0.5;
            this.orientationSprite.anchor.y = 0.5;
            this.orientationSprite.position.x = this.game.width / 2;
            this.orientationSprite.position.y = this.game.height / 2;

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

            this.game.stage._stage.addChild(this.orientationSprite);
        }

    },

    /**
    * Checks if the browser is in the correct orientation for your game (if forceLandscape or forcePortrait have been set)
    * @method Phaser.StageScaleMode#checkOrientationState
    */
    checkOrientationState: function () {

        //  They are in the wrong orientation
        if (this.incorrectOrientation)
        {
            if ((this.forceLandscape && window.innerWidth > window.innerHeight) || (this.forcePortrait && window.innerHeight > window.innerWidth))
            {
                //  Back to normal
                this.game.paused = false;
                this.incorrectOrientation = false;

                if (this.orientationSprite)
                {
                    this.orientationSprite.visible = false;
                    this.game.world.visible = true;
                }

                this.refresh();
            }
        }
        else
        {
            if ((this.forceLandscape && window.innerWidth < window.innerHeight) || (this.forcePortrait && window.innerHeight < window.innerWidth))
            {
                //  Show orientation screen
                this.game.paused = true;
                this.incorrectOrientation = true;

                if (this.orientationSprite && this.orientationSprite.visible == false)
                {
                    this.orientationSprite.visible = true;
                    this.game.world.visible = false;
                }

                this.refresh();
            }
        }
    },

    /**
    * Handle window.orientationchange events
    * @method Phaser.StageScaleMode#checkOrientation
    * @param {Event} event - The orientationchange event data.
    */
    checkOrientation: function (event) {

        this.orientation = window['orientation'];

        if (this.isLandscape)
        {
            this.enterLandscape.dispatch(this.orientation, true, false);
        }
        else
        {
            this.enterPortrait.dispatch(this.orientation, false, true);
        }

        if (this.game.stage.scaleMode !== Phaser.StageScaleMode.NO_SCALE)
        {
            this.refresh();
        }

    },

    /**
    * Handle window.resize events
    * @method Phaser.StageScaleMode#checkResize
    * @param {Event} event - The resize event data.
    */
    checkResize: function (event) {

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

        if (this.game.stage.scaleMode !== Phaser.StageScaleMode.NO_SCALE)
        {
            this.refresh();
        }

        this.checkOrientationState();

    },

    /**
    * Re-calculate scale mode and update screen size.
    * @method Phaser.StageScaleMode#refresh
    */
    refresh: function () {

        var _this = this;
        
        //  We can't do anything about the status bars in iPads, web apps or desktops
        if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false)
        {
            // document.documentElement['style'].minHeight = '2000px';
            // this._startHeight = window.innerHeight;

            if (this.game.device.android && this.game.device.chrome == false)
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
        
        if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false) 
        {
            if (this.game.device.android && this.game.device.chrome == false)
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
        
            if (this.incorrectOrientation == true)
            {
                this.setMaximum();
            }
            else if (this.game.stage.scaleMode == Phaser.StageScaleMode.EXACT_FIT)
            {
                this.setExactFit();
            }
            else if (this.game.stage.scaleMode == Phaser.StageScaleMode.SHOW_ALL)
            {
                this.setShowAll();
            }

            this.setSize();
            clearInterval(this._check);
            this._check = null;
        }

    },

    /**
    * Sets the canvas style width and height values based on minWidth/Height and maxWidth/Height.
    * @method Phaser.StageScaleMode#setSize
    */
    setSize: function () {

        if (this.incorrectOrientation == false)
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
            if (this.width < window.innerWidth && this.incorrectOrientation == false)
            {
                this.game.canvas.style.marginLeft = Math.round((window.innerWidth - this.width) / 2) + 'px';
            }
            else
            {
                this.game.canvas.style.marginLeft = '0px';
            }
        }

        if (this.pageAlignVertically)
        {
            if (this.height < window.innerHeight && this.incorrectOrientation == false)
            {
                this.game.canvas.style.marginTop = Math.round((window.innerHeight - this.height) / 2) + 'px';
            }
            else
            {
                this.game.canvas.style.marginTop = '0px';
            }
        }

        Phaser.Canvas.getOffset(this.game.canvas, this.game.stage.offset);
        
        this.aspectRatio = this.width / this.height;
        
        this.scaleFactor.x = this.game.width / this.width;
        this.scaleFactor.y = this.game.height / this.height;

        this.checkOrientationState();

    },

    /**
    * Sets this.width equal to window.innerWidth and this.height equal to window.innerHeight
    * @method Phaser.StageScaleMode#setMaximum
    */
    setMaximum: function () {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    },

    /**
    * Calculates the multiplier needed to scale the game proportionally.
    * @method Phaser.StageScaleMode#setShowAll
    */
    setShowAll: function () {

        var multiplier = Math.min((window.innerHeight / this.game.height), (window.innerWidth / this.game.width));

        this.width = Math.round(this.game.width * multiplier);
        this.height = Math.round(this.game.height * multiplier);

    },

    /**
    * Sets the width and height values of the canvas, no larger than the maxWidth/Height.
    * @method Phaser.StageScaleMode#setExactFit
    */
    setExactFit: function () {

        var availableWidth = window.innerWidth;
        var availableHeight = window.innerHeight;

        // console.log('available', availableWidth, availableHeight);

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

/**
* @name Phaser.StageScaleMode#isFullScreen
* @property {boolean} isFullScreen - Returns true if the browser is in full screen mode, otherwise false.
* @readonly
*/
Object.defineProperty(Phaser.StageScaleMode.prototype, "isFullScreen", {

    get: function () {

        return (document['fullscreenElement'] || document['mozFullScreenElement'] || document['webkitFullscreenElement'])

    }

});

/**
* @name Phaser.StageScaleMode#isPortrait
* @property {boolean} isPortrait - Returns true if the browser dimensions match a portrait display.
* @readonly
*/
Object.defineProperty(Phaser.StageScaleMode.prototype, "isPortrait", {

    get: function () {
        return this.orientation == 0 || this.orientation == 180;
    }

});

/**
* @name Phaser.StageScaleMode#isLandscape
* @property {boolean} isLandscape - Returns true if the browser dimensions match a landscape display.
* @readonly
*/
Object.defineProperty(Phaser.StageScaleMode.prototype, "isLandscape", {

    get: function () {
        return this.orientation === 90 || this.orientation === -90;
    }

});
