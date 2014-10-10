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
* @param {number|string} width - The width of the game.
* @param {number|string} height - The height of the game.
*/
Phaser.ScaleManager = function (game, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {Phaser.FlexGrid} grid - EXPERIMENTAL: A responsive grid on which you can align game objects.
    */
    this.grid = null;

    /**
    * @property {number} width - Width of the game after calculation.
    */
    this.width = 0;

    /**
    * @property {number} height - Height of the game after calculation.
    */
    this.height = 0;

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
    * @property {Phaser.Point} offset - Holds the offset coordinates of the Game.canvas from the top-left of the browser window (used by Input and other classes)
    */
    this.offset = new Phaser.Point();

    /**
    * @property {boolean} forceLandscape - Set to `true` if the game should only run in a landscape orientation.
    * @default
    */
    this.forceLandscape = false;

    /**
    * @property {boolean} forcePortrait - Set to `true` if the game should only run in a portrait orientation.
    * @default
    */
    this.forcePortrait = false;

    /**
    * @property {boolean} incorrectOrientation - If `forceLandscape` or `forcePortrait` are true and the browser doesn't match that orientation this is set to `true`.
    * @default
    */
    this.incorrectOrientation = false;

    /**
    * @property {boolean} pageAlignHorizontally - If you wish to align your game in the middle of the page then you can set this value to true.
    * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing events.
    * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
    * @default
    */
    this.pageAlignHorizontally = false;

    /**
    * @property {boolean} pageAlignVertically - If you wish to align your game in the middle of the page then you can set this value to true.
    * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing events.
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
    * @property {Phaser.Signal} enterLandscape - The event that is dispatched when the browser enters landscape orientation having been in portrait.
    */
    this.enterLandscape = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} enterPortrait - The event that is dispatched when the browser enters portrait orientation having been in landscape.
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
    * This is the DOM element that will have the Full Screen mode called on it. It defaults to the game canvas, but can be retargetted to any valid DOM element.
    * If you adjust this property it's up to you to see it has the correct CSS applied, and that you have contained the game canvas correctly.
    * Note that if you use a scale property of EXACT_FIT then fullScreenTarget will have its width and height style set to 100%.
    * @property {any} fullScreenTarget
    */
    this.fullScreenTarget = null;

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
    * @property {Phaser.Point} margin - If the game canvas is set to align by adjusting the margin, the margin calculation values are stored in this Point.
    * @readonly
    */
    this.margin = new Phaser.Point(0, 0);

    /**
    * @property {Phaser.Rectangle} bounds - The bounds of the scaled game. The x/y will match the offset of the canvas element and the width/height the scaled width and height.
    * @readonly
    */
    this.bounds = new Phaser.Rectangle();

    /**
    * @property {number} aspectRatio - The aspect ratio of the scaled game.
    * @readonly
    */
    this.aspectRatio = 0;

    /**
    * @property {number} sourceAspectRatio - The aspect ratio (width / height) of the original game dimensions.
    * @readonly
    */
    this.sourceAspectRatio = 0;

    /**
    * @property {any} event- The native browser events from full screen API changes.
    */
    this.event = null;

    /*
    * @property {number} fullScreenScaleMode - Scale mode to be used in fullScreen
    */
    this.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

    /**
    * @property {boolean} parentIsWindow - If the parent container of the game is the browser window, rather than a div, this is set to `true`.
    * @readonly
    */
    this.parentIsWindow = false;

    /**
    * @property {object} parentNode - The fully parsed parent container of the game. If the parent is the browser window this will be `null`.
    * @readonly
    */
    this.parentNode = null;

    /**
    * @property {Phaser.Point} parentScaleFactor - The scale of the game in relation to its parent container.
    * @readonly
    */
    this.parentScaleFactor = new Phaser.Point(1, 1);

    /**
    * @property {number} trackParentInterval - The interval (in ms) upon which the ScaleManager checks if the parent has changed dimensions. Only applies if scaleMode = RESIZE and the game is contained within another html element.
    * @default
    */
    this.trackParentInterval = 2000;

    /**
    * @property {function} onResize - The callback that will be called each time a window.resize event happens or if set, the parent container resizes.
    * @default
    */
    this.onResize = null;

    /**
    * @property {object} onResizeContext - The context in which the callback will be called.
    * @default
    */
    this.onResizeContext = null;

    /**
    * @property {number} scaleMode - The current scaling method being used.
    * @private
    */
    this._scaleMode = Phaser.ScaleManager.NO_SCALE;

    /**
    * @property {number} _width - Cached game width for full screen mode.
    * @private
    */
    this._width = 0;

    /**
    * @property {number} _height - Cached game height for full screen mode.
    * @private
    */
    this._height = 0;

    /**
    * @property {number} _check - Cached size interval var.
    * @private
    */
    this._check = null;

    /**
    * @property {number} _nextParentCheck - The time to run the next parent bounds check.
    * @private
    */
    this._nextParentCheck = 0;

    /**
    * @property {object} _parentBounds - The cached result of getBoundingClientRect from the parent.
    * @private
    */
    this._parentBounds = null;

    if (game.config)
    {
        this.parseConfig(game.config);
    }

    this.setupScale(width, height);

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

/**
* @constant
* @type {number}
*/
Phaser.ScaleManager.RESIZE = 3;

Phaser.ScaleManager.prototype = {

    /**
    * Parses the Game configuration object.
    * 
    * @method Phaser.ScaleManager#parseConfig
    * @param {object} config - The game configuration object.
    */
    parseConfig: function (config) {

        if (config['scaleMode'])
        {
            this.scaleMode = config['scaleMode'];
        }

        if (config['fullScreenScaleMode'])
        {
            this.fullScreenScaleMode = config['fullScreenScaleMode'];
        }

        if (config['fullScreenTarget'])
        {
            this.fullScreenTarget = config['fullScreenTarget'];
        }

    },

    /**
    * Calculates and sets the game dimensions based on the given width and height.
    * 
    * @method Phaser.ScaleManager#setupScale
    * @param {number|string} width - The width of the game.
    * @param {number|string} height - The height of the game.
    */
    setupScale: function (width, height) {

        var target;
        var rect = new Phaser.Rectangle();

        if (this.game.parent !== '')
        {
            if (typeof this.game.parent === 'string')
            {
                // hopefully an element ID
                target = document.getElementById(this.game.parent);
            }
            else if (typeof this.game.parent === 'object' && this.game.parent.nodeType === 1)
            {
                // quick test for a HTMLelement
                target = this.game.parent;
            }
        }

        // Fallback, covers an invalid ID and a non HTMLelement object
        if (!target)
        {
            //  Use the full window
            this.parentNode = null;
            this.parentIsWindow = true;

            rect.width = window.innerWidth;
            rect.height = window.innerHeight;
        }
        else
        {
            this.parentNode = target;
            this.parentIsWindow = false;

            this._parentBounds = this.parentNode.getBoundingClientRect();

            rect.width = this._parentBounds.width;
            rect.height = this._parentBounds.height;

            this.offset.set(this._parentBounds.left, this._parentBounds.top);
        }

        var newWidth = 0;
        var newHeight = 0;

        if (typeof width === 'number')
        {
            newWidth = width;
        }
        else
        {
            //  Percentage based
            this.parentScaleFactor.x = parseInt(width, 10) / 100;
            newWidth = rect.width * this.parentScaleFactor.x;
        }

        if (typeof height === 'number')
        {
            newHeight = height;
        }
        else
        {
            //  Percentage based
            this.parentScaleFactor.y = parseInt(height, 10) / 100;
            newHeight = rect.height * this.parentScaleFactor.y;
        }

        this.grid = new Phaser.FlexGrid(this, newWidth, newHeight);

        this.updateDimensions(newWidth, newHeight, false);

    },

    /**
    * Calculates and sets the game dimensions based on the given width and height.
    * 
    * @method Phaser.ScaleManager#boot
    */
    boot: function () {

        //  Now the canvas has been created we can target it
        this.fullScreenTarget = this.game.canvas;

        var _this = this;

        this._checkOrientation = function(event) {
            return _this.checkOrientation(event);
        };

        this._checkResize = function(event) {
            return _this.checkResize(event);
        };

        this._fullScreenChange = function(event) {
            return _this.fullScreenChange(event);
        };

        window.addEventListener('orientationchange', this._checkOrientation, false);
        window.addEventListener('resize', this._checkResize, false);

        if (!this.game.device.cocoonJS)
        {
            document.addEventListener('webkitfullscreenchange', this._fullScreenChange, false);
            document.addEventListener('mozfullscreenchange', this._fullScreenChange, false);
            document.addEventListener('fullscreenchange', this._fullScreenChange, false);
        }

        this.updateDimensions(this.width, this.height, true);

        Phaser.Canvas.getOffset(this.game.canvas, this.offset);

        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

    },

    /**
    * Sets the callback that will be called when the window resize event occurs, or if set the parent container changes dimensions.
    * Use this to handle responsive game layout options.
    * Note that the callback will only be called if the ScaleManager.scaleMode is set to RESIZE.
    * 
    * @method Phaser.ScaleManager#setResizeCallback
    * @param {function} callback - The callback that will be called each time a window.resize event happens or if set, the parent container resizes.
    * @param {object} context - The context in which the callback will be called.
    */
    setResizeCallback: function (callback, context) {

        this.onResize = callback;
        this.onResizeContext = context;

    },

    /**
     * Set the ScaleManager min and max dimensions in one single callback.
     *
     * @method setMinMax
     * @param {number} minWidth - The minimum width the game is allowed to scale down to.
     * @param {number} minHeight - The minimum height the game is allowed to scale down to.
     * @param {number} maxWidth - The maximum width the game is allowed to scale up to.
     * @param {number} maxHeight - The maximum height the game is allowed to scale up to.
     */
    setMinMax: function (minWidth, minHeight, maxWidth, maxHeight) {

        this.minWidth = minWidth;
        this.minHeight = minHeight;

        if (typeof maxWidth !== 'undefined')
        {
            this.maxWidth = maxWidth;
        }

        if (typeof maxHeight !== 'undefined')
        {
            this.maxHeight = maxHeight;
        }

    },

    /**
    * The ScaleManager.preUpdate is called automatically by the core Game loop.
    * 
    * @method Phaser.ScaleManager#preUpdate
    * @protected
    */
    preUpdate: function () {

        if (this.game.time.now < this._nextParentCheck)
        {
            return;
        }

        if (!this.parentIsWindow)
        {
            Phaser.Canvas.getOffset(this.game.canvas, this.offset);
           
            if (this._scaleMode === Phaser.ScaleManager.RESIZE)
            {
                this._parentBounds = this.parentNode.getBoundingClientRect();

                if (this._parentBounds.width !== this.width || this._parentBounds.height !== this.height)
                {
                    //  The parent has changed size, so we need to adapt
                    this.updateDimensions(this._parentBounds.width, this._parentBounds.height, true);
                }
            }
        }
        
        this._nextParentCheck = this.game.time.now + this.trackParentInterval;

    },

    /**
     * Called automatically when the game parent dimensions change.
     *
     * @method updateDimensions
     * @param {number} width - The new width of the parent container.
     * @param {number} height - The new height of the parent container.
     * @param {boolean} resize - True if the renderer should be resized, otherwise false to just update the internal vars.
     */
    updateDimensions: function (width, height, resize) {

        this.width = width * this.parentScaleFactor.x;
        this.height = height * this.parentScaleFactor.y;

        this.game.width = this.width;
        this.game.height = this.height;

        this.sourceAspectRatio = this.width / this.height;

        this.bounds.width = this.width;
        this.bounds.height = this.height;

        if (resize)
        {
            this.game.renderer.resize(this.width, this.height);

            //  The Camera can never be smaller than the game size
            this.game.camera.setSize(this.width, this.height);

            //  This should only happen if the world is smaller than the new canvas size
            this.game.world.resize(this.width, this.height);
        }

        this.grid.onResize(width, height);

        if (this.onResize)
        {
            this.onResize.call(this.onResizeContext, this.width, this.height);
        }

        this.game.state.resize(width, height);

    },

    /**
    * If you need your game to run in only one orientation you can force that to happen.
    * 
    * @method Phaser.ScaleManager#forceOrientation
    * @param {boolean} forceLandscape - true if the game should run in landscape mode only.
    * @param {boolean} [forcePortrait=false] - true if the game should run in portrait mode only.
    */
    forceOrientation: function (forceLandscape, forcePortrait) {

        if (typeof forcePortrait === 'undefined') { forcePortrait = false; }

        this.forceLandscape = forceLandscape;
        this.forcePortrait = forcePortrait;

    },

    /**
    * Checks if the browser is in the correct orientation for your game (if forceLandscape or forcePortrait have been set)
    * 
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

                if (this.scaleMode !== Phaser.ScaleManager.NO_SCALE)
                {
                    this.refresh();
                }
            }
        }
    },

    /**
    * window.orientationchange event handler.
    * 
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
    * window.resize event handler.
    * 
    * @method Phaser.ScaleManager#checkResize
    * @param {Event} event - The resize event data.
    */
    checkResize: function (event) {

        this.event = event;

        var wasLandscape = this.isLandscape;

        if (window.outerWidth > window.outerHeight)
        {
            this.orientation = 90;
        }
        else
        {
            this.orientation = 0;
        }

        //  If it WAS in Landscape but is now in portrait ...
        if (wasLandscape && this.isPortrait)
        {
            this.enterPortrait.dispatch(this.orientation, false, true);

            if (this.forceLandscape)
            {
                this.enterIncorrectOrientation.dispatch();
            }
            else if (this.forcePortrait)
            {
                this.leaveIncorrectOrientation.dispatch();
            }
        }
        else if (!wasLandscape && this.isLandscape)
        {
            //  It WAS in portrait mode, but is now in Landscape ...
            this.enterLandscape.dispatch(this.orientation, true, false);

            if (this.forceLandscape)
            {
                this.leaveIncorrectOrientation.dispatch();
            }
            else if (this.forcePortrait)
            {
                this.enterIncorrectOrientation.dispatch();
            }
        }

        if (this._scaleMode === Phaser.ScaleManager.RESIZE && this.parentIsWindow)
        {
            //  The window has changed size, so we need to adapt
            this.updateDimensions(window.innerWidth, window.innerHeight, true);
        }
        else if (this._scaleMode === Phaser.ScaleManager.EXACT_FIT || this._scaleMode === Phaser.ScaleManager.SHOW_ALL)
        {
            this.refresh();
    
            if (this.onResize)
            {
                this.onResize.call(this.onResizeContext, this.width, this.height);
            }
        }

        this.checkOrientationState();

    },

    /**
    * Re-calculate scale mode and update screen size. This only applies if ScaleMode is not set to RESIZE.
    * 
    * @method Phaser.ScaleManager#refresh
    */
    refresh: function () {

        //  Not needed for RESIZE
        if (this.scaleMode === Phaser.ScaleManager.RESIZE)
        {
            return;
        }

        //  We can't do anything about the status bars in iPads, web apps or desktops
        if (!this.game.device.iPad && !this.game.device.webApp && !this.game.device.desktop)
        {
            if (this.game.device.android && !this.game.device.chrome)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        if (this._check === null && this.maxIterations > 0)
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
    * Set screen size automatically based on the scaleMode. This is only needed if ScaleMode is not set to RESIZE.
    * 
    * @param {boolean} force - If force is true it will try to resize the game regardless of the document dimensions.
    */
    setScreenSize: function (force) {

        if (this.scaleMode === Phaser.ScaleManager.RESIZE)
        {
            return;
        }

        if (typeof force === 'undefined')
        {
            force = false;
        }

        if (!this.game.device.iPad && !this.game.device.webApp && !this.game.device.desktop)
        {
            if (this.game.device.android && !this.game.device.chrome)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        this._iterations--;

        if (force || this._iterations < 0)
        {
            // Set minimum height of content to new window height
            document.documentElement['style'].minHeight = window.innerHeight + 'px';

            if (this.incorrectOrientation)
            {
                this.setMaximum();
            }
            else if (!this.isFullScreen)
            {
                if (this.scaleMode === Phaser.ScaleManager.EXACT_FIT)
                {
                    this.setExactFit();
                }
                else if (this.scaleMode === Phaser.ScaleManager.SHOW_ALL)
                {
                    this.setShowAll();
                }
            }
            else
            {
                if (this.fullScreenScaleMode === Phaser.ScaleManager.EXACT_FIT)
                {
                    this.setExactFit();
                }
                else if (this.fullScreenScaleMode === Phaser.ScaleManager.SHOW_ALL)
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
    * 
    * @method Phaser.ScaleManager#setSize
    */
    setSize: function () {

        if (!this.incorrectOrientation)
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
            if (this.width < window.innerWidth && !this.incorrectOrientation)
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
            if (this.height < window.innerHeight && !this.incorrectOrientation)
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

        Phaser.Canvas.getOffset(this.game.canvas, this.offset);
        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

        this.aspectRatio = this.width / this.height;

        this.scaleFactor.x = this.game.width / this.width;
        this.scaleFactor.y = this.game.height / this.height;

        this.scaleFactorInversed.x = this.width / this.game.width;
        this.scaleFactorInversed.y = this.height / this.game.height;

        this.checkOrientationState();

    },

    reset: function (clearWorld) {

        if (clearWorld)
        {
            this.grid.reset();
        }

    },

    /**
    * Sets this.width equal to window.innerWidth and this.height equal to window.innerHeight.
    * 
    * @method Phaser.ScaleManager#setMaximum
    */
    setMaximum: function () {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    },

    /**
    * Calculates the multiplier needed to scale the game proportionally.
    * 
    * @method Phaser.ScaleManager#setShowAll
    */
    setShowAll: function () {

        var multiplier = Math.min((window.innerHeight / this.game.height), (window.innerWidth / this.game.width));

        this.width = Math.round(this.game.width * multiplier);
        this.height = Math.round(this.game.height * multiplier);

    },

    /**
    * Sets the width and height values of the canvas, no larger than the maxWidth/Height.
    * 
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

    },

    /**
    * Tries to enter the browser into full screen mode.
    * Please note that this needs to be supported by the web browser and isn't the same thing as setting your game to fill the browser.
    * 
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

        document[this.game.device.cancelFullscreen]();

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
     * Destroys the ScaleManager and removes any event listeners.
     *
     * @method destroy
     */
    destroy: function () {

        window.removeEventListener('orientationchange', this._checkOrientation, false);
        window.removeEventListener('resize', this._checkResize, false);

        if (!this.game.device.cocoonJS)
        {
            document.removeEventListener('webkitfullscreenchange', this._fullScreenChange, false);
            document.removeEventListener('mozfullscreenchange', this._fullScreenChange, false);
            document.removeEventListener('fullscreenchange', this._fullScreenChange, false);
        }

    }

};

Phaser.ScaleManager.prototype.constructor = Phaser.ScaleManager;

/**
* @name Phaser.ScaleManager#scaleMode
* @property {number} scaleMode - The scaling method used by the ScaleManager.
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "scaleMode", {

    get: function () {

        return this._scaleMode;

    },

    set: function (value) {

        if (value !== this._scaleMode)
        {
            this._scaleMode = value;
        }

    }

});

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
        return (this.orientation === 0 || this.orientation === 180);
    }

});

/**
* @name Phaser.ScaleManager#isLandscape
* @property {boolean} isLandscape - Returns true if the browser dimensions match a landscape display.
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "isLandscape", {

    get: function () {
        return (this.orientation === 90 || this.orientation === -90);
    }

});
