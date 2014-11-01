/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The ScaleManager object is responsible managing the scaling, resizing and alignment of the game and display canvas.
*
* The `width` and `height` constructor parameters can either be a number which represents pixels or a string that represents a percentage: e.g. `800` (for 800 pixels) or `"80%"` for 80%.
*
* @class Phaser.ScaleManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number|string} width - The width of the game. See above.
* @param {number|string} height - The height of the game. See above.
*/
Phaser.ScaleManager = function (game, width, height) {

    /**
    * A reference to the currently running game.
    * @property {Phaser.Game} game
    * @protected
    * @readonly
    */
    this.game = game;

    /**
    * _EXPERIMENTAL:_ A responsive grid on which you can align game objects.
    * @property {Phaser.FlexGrid} gridobjects.
    * @public
    */
    this.grid = null;

    /**
    * Width of the game after calculations that the canvas will eventually be set to.
    * @property {number} width
    */
    this.width = 0;

    /**
    * Height of the game after calculations that the canvas will eventually be set to.
    * @property {number} height
    */
    this.height = 0;

    /**
    * Minimum width the canvas should be scaled to (in pixels).
    * Change with `setMinMax`.
    * @property {number} minWidth
    * @readonly
    */
    this.minWidth = null;

    /**
    * Maximum width the canvas should be scaled to (in pixels).
    * If null it will scale to whatever width the browser can handle.
    * Change with `setMinMax`.
    * @property {number} maxWidth
    * @readonly
    */
    this.maxWidth = null;

    /**
    * Minimum height the canvas should be scaled to (in pixels).
    * Change with `setMinMax`.
    * @property {number} minHeight
    * @readonly
    */
    this.minHeight = null;

    /**
    * Maximum height the canvas should be scaled to (in pixels).
    * If null it will scale to whatever height the browser can handle.
    * Change with `setMinMax`.
    * @property {number} maxHeight
    * @readonly
    */
    this.maxHeight = null;

    /**
    * Holds the offset coordinates of the Game.canvas from the top-left of the browser window (used by Input and other classes).
    * @property {Phaser.Point} offset
    * @readonly
    * @protected
    */
    this.offset = new Phaser.Point();

    /**
    * If true, the game should only run in a landscape orientation.
    * Change with `forceOrientation`.
    * @property {boolean} forceLandscape
    * @readonly
    * @default
    */
    this.forceLandscape = false;

    /**
    * If true, the game should only run in a portrait 
    * Change with `forceOrientation`.
    * @property {boolean} forcePortrait
    * @readonly
    * @default
    */
    this.forcePortrait = false;

    /**
    * True if the `forceLandscape` or `forcePortrait` are set and do not agree with the browser orientation.
    * @property {boolean} incorrectOrientation
    * @protected
    * @readonly
    */
    this.incorrectOrientation = false;

    /**
    * @property {boolean} _pageAlignHorizontally - See `pageAlignHorizontally`.
    * @private
    */
    this._pageAlignHorizontally = false;

    /**
    * @property {boolean} _pageAlignVertically - See `pageAlignVertically`.
    * @private
    */
    this._pageAlignVertically = false;

    /**
    * The maximum number of times a canvas will be resized (in a row) in order to fill the browser.
    * @property {number} maxIterations
    * @protected
    * @default
    */
    this.maxIterations = 5;

    /**
    * This signal is dispatched when the browser enters landscape orientation, having been in portrait.
    * @property {Phaser.Signal} enterLandscape
    * @public
    */
    this.enterLandscape = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser enters portrait orientation, having been in landscape.
    * @property {Phaser.Signal} enterPortrait
    * @public
    */
    this.enterPortrait = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser enters an incorrect orientation, as defined by `forceOrientation`.
    * @property {Phaser.Signal} enterIncorrectOrientation
    * @public
    */
    this.enterIncorrectOrientation = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser leaves an incorrect orientation, as defined by `forceOrientation`.
    * @property {Phaser.Signal} leaveIncorrectOrientation - 
    * @public
    */
    this.leaveIncorrectOrientation = new Phaser.Signal();

    /**
    * This is the DOM element that will have the Full Screen mode called on it.
    * It defaults to the game canvas, but can be retargetted to any valid DOM element.
    * The target element must have the correct CSS applied and must contain the game canvas.    
    *
    * If `fullScreenScaleMode` is EXACT_FIT then the fullScreenTarget will have its width and height style set to 100%. These changes will be restored when fullscreen mode is left.
    *
    * @property {DOMElement|null} fullScreenTarget
    */
    this.fullScreenTarget = null;

    /**
    * This singal is dispatched when the browser enters full screen mode, if it supports the FullScreen API.
    * @property {Phaser.Signal} enterFullScreen
    */
    this.enterFullScreen = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser leaves full screen mode, if it supports the FullScreen API.
    * @property {Phaser.Signal} leaveFullScreen
    */
    this.leaveFullScreen = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser fails to enter full screen mode;
    * or if the device does not support fullscreen mode and `startFullScreen` is invoked.
    * @property {Phaser.Signal} leaveFullScreen
    */
    this.fullScreenFailed = new Phaser.Signal();

    /**
    * The orientation value of the game (as defined by `window.orientation` if set).
    * A value of 90 is landscape and 0 is portrait.
    * @property {number} orientation
    * @readonly
    */
    this.orientation = 0;

    if (window['orientation'])
    {
        this.orientation = window['orientation'] | 0;
    }
    else
    {
        if (window.outerWidth > window.outerHeight)
        {
            this.orientation = 90;
        }
    }

    /**
    * The scale factor based on the game dimensions vs. the scaled dimensions.
    * @property {Phaser.Point} scaleFactor
    * @public
    * @readonly
    */
    this.scaleFactor = new Phaser.Point(1, 1);

    /**
    * The inversed scale factor. The displayed dimensions divided by the game dimensions.
    * @property {Phaser.Point} scaleFactorInversed
    * @protected
    * @readonly
    */
    this.scaleFactorInversed = new Phaser.Point(1, 1);

    /**
    * If the game canvas is set to align by adjusting the margin, the margin calculation values are stored in this Point.
    * @property {Phaser.Point} margin
    * @readonly
    */
    this.margin = new Phaser.Point(0, 0);

    /**
    * The bounds of the scaled game. The x/y will match the offset of the canvas element and the width/height the scaled width and height.
    * @property {Phaser.Rectangle} bounds
    * @readonly
    */
    this.bounds = new Phaser.Rectangle();

    /**
    * The aspect ratio of the scaled game canvas.
    * @property {number} aspectRatio
    * @public
    * @readonly
    */
    this.aspectRatio = 0;

    /**
    * The aspect ratio of the original game dimensions.
    * @property {number} sourceAspectRatio
    * @public
    * @readonly
    */
    this.sourceAspectRatio = 0;

    /**
    * The native browser events from full screen API changes.
    * @property {any} event
    * @protected
    * @readonly
    */
    this.event = null;

    /**
    * Scale mode to be used when not in fullscreen.
    * @property {number} _scaleMode
    * @private
    */
    this._scaleMode = Phaser.ScaleManager.NO_SCALE;

    /*
    * Scale mode to be used in fullScreen.
    * @property {number} _fullScreenScaleMode
    * @private
    */
    this._fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

    /**
    * If the parent container of the game is the browser window (document.body), rather than a div, this is set to `true`.
    * @property {boolean} parentIsWindow
    * @readonly
    */
    this.parentIsWindow = false;

    /**
    * The DOM element for the parent of the game canvas.
    * If the parent is the browser window this will be `null`.
    * @property {object} parentNode
    * @readonly
    */
    this.parentNode = null;

    /**
    * The scale of the game in relation to its parent container.
    * @property {Phaser.Point} parentScaleFactor
    * @readonly
    */
    this.parentScaleFactor = new Phaser.Point(1, 1);

    /**
    * The interval (in ms) upon which the ScaleManager checks if the parent has changed dimensions.
    * This only applies if in a `RESIZE` scaling mode and the game is not running as `parentIsWindow`.
    * @property {number} trackParentInterval
    * @default
    */
    this.trackParentInterval = 2000;

    /**
    * The callback that will be called each time a window.resize event happens or if set, the parent container resizes.
    * @property {function} onResize
    */
    this.onResize = null;

    /**
    * The context in which the `onResize` callback will be called.
    * @property {object} onResizeContext
    */
    this.onResizeContext = null;

    /**
    * True only if fullscreen support will be used. (Changing to fullscreen still might not work.)
    * @property {boolean}
    * @protected
    * @readonly
    */
    this.supportsFullScreen = false;

    /**
    * The original width/height properties of the manager when fullscreen started.
    * Values are numbers.
    * @property {object} _restoreSize
    * @private
    */
    this._restoreSize = {width: 0, height: 0};

    /**
    * The style dimensions of the fullScreenTarget when fullscreen started.
    * The object has _string_ values in the properties `width` and `height`.
    * @property {object|null} _restoreTargetStyle
    * @private
    */
    this._restoreTargetStyle = null;

    /**
    * If true then size updates will be forced in `preUpdate`.
    * This is used when a non-immediate resize is required such as when the scale mode or alignment is changed.
    * @property {boolean} _updateSize
    * @private
    */
    this._updateSize = false;

    /**
    * The internal resize timer ID, if any.
    * @property {number} _resizeIntervalId
    * @private
    */
    this._resizeIntervalId = null;

    /**
    * The time to run the next parent bounds check.
    * @property {number} _nextParentCheck
    * @private
    */
    this._nextParentCheck = 0;

    /**
    * The cached result of the parent (possibly window) bounds.
    * @property {Phaser.Rectangle} _parentBounds
    * @private
    */
    this._parentBounds = new Phaser.Rectangle();

    if (game.config)
    {
        this.parseConfig(game.config);
    }

    this.setupScale(width, height);

};

/**
* The game display area will be _stretched_ to fill the entire canvas/screen.
* @constant
* @type {integer}
*/
Phaser.ScaleManager.EXACT_FIT = 0;

/**
* The game display area will not be scaled - even if it is too large for the canvas/screen.
* @constant
* @type {integer}
*/
Phaser.ScaleManager.NO_SCALE = 1;

/**
* Show the entire game display area while _maintaining_ the original aspect ratio.
* @constant
* @type {integer}
*/
Phaser.ScaleManager.SHOW_ALL = 2;

/**
* The dimensions of the game display area are changed to match the size of the parent container.
* That is, this mode _changes the game size_ to match the display size.
* @constant
* @type {integer}
*/
Phaser.ScaleManager.RESIZE = 3;

Phaser.ScaleManager.prototype = {

    /**
    * Load configuration settings.
    * 
    * @method Phaser.ScaleManager#parseConfig
    * @protected
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
    * This should _not_ be called when in fullscreen mode.
    * 
    * @method Phaser.ScaleManager#setupScale
    * @protected
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
            else if (this.game.parent && this.game.parent.nodeType === 1)
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

            this.offset.set(0, 0);
        }
        else
        {
            this.parentNode = target;
            this.parentIsWindow = false;

            this.getParentBounds(undefined, this._parentBounds);

            rect.width = this._parentBounds.width;
            rect.height = this._parentBounds.height;

            this.offset.set(this._parentBounds.x, this._parentBounds.y);
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
    * This is used internally.
    * 
    * @method Phaser.ScaleManager#boot
    * @protected
    */
    boot: function () {

        this.supportsFullScreen = this.game.device.fullscreen && !this.game.device.cocoonJS;

        //  Now the canvas has been created we can target it
        this.fullScreenTarget = this.game.canvas;

        var _this = this;

        this._orientationChange = function(event) {
            return _this.orientationChange(event);
        };

        this._windowResize = function(event) {
            return _this.windowResize(event);
        };

        window.addEventListener('orientationchange', this._orientationChange, false);
        window.addEventListener('resize', this._windowResize, false);

        if (this.supportsFullScreen)
        {
            this._fullScreenChange = function(event) {
                return _this.fullScreenChange(event);
            };

            this._fullScreenError = function(event) {
                return _this.fullScreenError(event);
            };

            document.addEventListener('webkitfullscreenchange', this._fullScreenChange, false);
            document.addEventListener('mozfullscreenchange', this._fullScreenChange, false);
            document.addEventListener('MSFullscreenChange', this._fullScreenChange, false);
            document.addEventListener('fullscreenchange', this._fullScreenChange, false);

            document.addEventListener('webkitfullscreenerror', this._fullScreenError, false);
            document.addEventListener('mozfullscreenerror', this._fullScreenError, false);
            document.addEventListener('MSFullscreenError', this._fullScreenError, false);
            document.addEventListener('fullscreenerror', this._fullScreenError, false);
        }

        this.updateDimensions(this.width, this.height, true);

        Phaser.Canvas.getOffset(this.game.canvas, this.offset);

        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

    },

    /**
    * Sets the callback that will be called when the window resize event occurs, or if set the parent container changes dimensions.
    * Use this to handle responsive game layout options.
    *
    * This callback will _only_ be called if `scaleMode` is set to `RESIZE`.
    * 
    * @method Phaser.ScaleManager#setResizeCallback
    * @public
    * @param {function} callback - The callback that will be called each time a window.resize event happens or if set, the parent container resizes.
    * @param {object} context - The context in which the callback will be called.
    */
    setResizeCallback: function (callback, context) {

        this.onResize = callback;
        this.onResizeContext = context;

    },

    /**
    * Set the min and max dimensions for the game object.
    *
    * @method setMinMax
    * @public
    * @param {number} minWidth - The minimum width the game is allowed to scale down to.
    * @param {number} minHeight - The minimum height the game is allowed to scale down to.
    * @param {number} [maxWidth] - The maximum width the game is allowed to scale up to; only changed if specified.
    * @param {number} [maxHeight] - The maximum height the game is allowed to scale up to; only changed if specified.
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

        if (!this._updateSize &&
            this.game.time.now < this._nextParentCheck)
        {
            return;
        }

        if (this._updateSize)
        {
            this._updateSize = false;
            this.setScreenSize(true);
        }

        if (!this.parentIsWindow)
        {
            Phaser.Canvas.getOffset(this.game.canvas, this.offset);
           
            if (this.currentScaleMode === Phaser.ScaleManager.RESIZE)
            {
                // If the old or the new bounds differ then the dimensions need to be updated
                // (Allows an update even the current bounds are same: ie. mode change.)
                var bounds = this._parentBounds;

                var boundsMismatch = bounds.width !== this.width || bounds.height !== this.height;

                this.getParentBounds(undefined, bounds);

                boundsMismatch = boundsMismatch || (bounds.width !== this.width || bounds.height !== this.height);

                if (boundsMismatch)
                {
                    this.updateDimensions(bounds.width, bounds.height, true);
                }
            }
        }
        
        // This could probably be moved into the parentIsWindow guard..
        this._nextParentCheck = this.game.time.now + this.trackParentInterval;

    },

    /**
    * Update the dimensions taking the parent scaling factor into account.
    *
    * This should only be called on boot or when the mode is `RESIZE` as changing the game width/height here can be a problematic side-effects with other modes.
    *
    * @method Phaser.ScaleManager#updateDimensions
    * @private
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
    * Force the game to run in only one orientation.
    * 
    * @method Phaser.ScaleManager#forceOrientation
    * @public
    * @param {boolean} forceLandscape - true if the game should run in landscape mode only.
    * @param {boolean} [forcePortrait=false] - true if the game should run in portrait mode only.
    */
    forceOrientation: function (forceLandscape, forcePortrait) {

        if (typeof forcePortrait === 'undefined') { forcePortrait = false; }

        this.forceLandscape = forceLandscape;
        this.forcePortrait = forcePortrait;

        this._updateSize = true;

    },

    /**
    * Checks if the browser is in the correct orientation for the game, dependent upon `forceLandscape` and `forcePortrait`, and updates the state.
    *
    * The appropriate event is dispatched if the orientation became valid or invalid.
    * 
    * @method Phaser.ScaleManager#updateOrientationState
    * @private
    * @return {boolean} True if the orientation state changed (consider a refresh)
    */
    updateOrientationState: function () {

        //  They are in the wrong orientation
        if (this.incorrectOrientation)
        {
            if ((this.forceLandscape && window.innerWidth > window.innerHeight) ||
                (this.forcePortrait && window.innerHeight > window.innerWidth))
            {
                //  Back to normal
                this.incorrectOrientation = false;
                this.leaveIncorrectOrientation.dispatch();

                return true;
            }
        }
        else
        {
            if ((this.forceLandscape && window.innerWidth < window.innerHeight) ||
                (this.forcePortrait && window.innerHeight < window.innerWidth))
            {
                //  Show orientation screen
                this.incorrectOrientation = true;
                this.enterIncorrectOrientation.dispatch();

                return true;
            }
        }

        return false;

    },

    /**
    * window.orientationchange event handler.
    * 
    * @method Phaser.ScaleManager#orientationChange
    * @private
    * @param {Event} event - The orientationchange event data.
    */
    orientationChange: function (event) {

        this.event = event;

        var scaleMode = this.currentScaleMode;

        this.orientation = window['orientation'] | 0;

        if (this.isLandscape)
        {
            this.enterLandscape.dispatch(this.orientation, true, false);
        }
        else
        {
            this.enterPortrait.dispatch(this.orientation, false, true);
        }

        if (scaleMode !== Phaser.ScaleManager.NO_SCALE)
        {
            this.refresh();
        }

    },

    /**
    * window.resize event handler.
    * 
    * @method Phaser.ScaleManager#windowResize
    * @private
    * @param {Event} event - The resize event data.
    */
    windowResize: function (event) {

        this.event = event;

        var scaleMode = this.currentScaleMode;

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

        if (scaleMode === Phaser.ScaleManager.RESIZE)
        {
            if (this.parentIsWindow)
            {
                //  The window has changed size, so we need to adapt
                this.updateDimensions(window.innerWidth, window.innerHeight, true);
            }
            else
            {
                //  (preUpdate is used for RESIZE mode when the parent is not the window)
                this._nextParentCheck = 0;
            }
        }
        else if (scaleMode === Phaser.ScaleManager.EXACT_FIT ||
            scaleMode === Phaser.ScaleManager.SHOW_ALL)
        {
            this.refresh();
    
            if (this.onResize)
            {
                this.onResize.call(this.onResizeContext, this.width, this.height);
            }
        }

        if (this.updateOrientationState() &&
            (scaleMode !== Phaser.ScaleManager.NO_SCALE))
        {
            this.refresh();
        }

    },

    /**
    * Re-calculate scale mode and update screen size.
    * This only applies if `currentScaleMode` is not set to `RESIZE`.
    *
    * This starts the resize interval checker; setScreenSize may be called multiple times as a result.
    * 
    * @method Phaser.ScaleManager#refresh
    * @protected
    */
    refresh: function () {

        var scaleMode = this.currentScaleMode;

        //  Not needed for RESIZE
        if (scaleMode === Phaser.ScaleManager.RESIZE)
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

        if (this._resizeIntervalId === null && this.maxIterations > 0)
        {
            this._iterations = this.maxIterations;

            var _this = this;

            this._resizeIntervalId = window.setInterval(function () {
                return _this.setScreenSize();
            }, 10);

            this.setScreenSize();
        }

    },

    /**
    * Set screen (game canvas) size automatically based on the scaleMode.
    * This is only needed if `currentScaleMode` is not set to `RESIZE`.
    * 
    * @param {boolean} force - If force is true the resize will be forced immediately instead of waiting for a pending recomputation/callback.
    * @protected
    */
    setScreenSize: function (force) {

        var scaleMode = this.currentScaleMode;

        if (scaleMode === Phaser.ScaleManager.RESIZE)
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
            else
            {
                if (scaleMode === Phaser.ScaleManager.EXACT_FIT)
                {
                    this.setExactFit();
                }
                else if (scaleMode === Phaser.ScaleManager.SHOW_ALL)
                {
                    this.setShowAll();
                }
                else if (scaleMode === Phaser.ScaleManager.NO_SCALE)
                {
                    this.width = this.game.width;
                    this.height = this.game.height;
                }
            }

            this.reflowCanvas();

            this._updateSize = false;
            clearInterval(this._resizeIntervalId);
            this._resizeIntervalId = null;
        }

    },

    /**
    * Returns the bounds of the parent.
    *
    * If fullscreen or without parent, this is the bounds of the screen itself.
    *
    * @method Phaser.ScaleManager#getParentBounds
    * @protected
    * @param {boolean} [fullscreen=(isFullScreen)] - Is fullscreen.
    * @param {Phaser.Rectangle} [target=(new Rectangle)] - The rectangle to update; a new one is created as needed.
    */
    // Not to be confused with `_parentBounds` which is used for RESIZE support and tracking.
    getParentBounds: function (fullscreen, target) {

        if (typeof fullscreen === 'undefined') { fullscreen = this.isFullScreen; }

        var bounds = target || new Phaser.Rectangle();
        
        if (fullscreen || this.parentIsWindow || !this.parentNode)
        {
            bounds.setTo(0, 0, window.outerWidth, window.outerHeight);
        }
        else
        {
            var clientRect = this.parentNode.getBoundingClientRect();
            bounds.setTo(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
        }

        return bounds;

    },

    /**
    * Update the canvas position/margins - for alignment within the parent container.
    *
    * @method Phaser.ScaleManager#alignCanvas
    * @private
    */
    alignCanvas: function () {

        // For fullscreen where the fullScreenTarget is the canvas it
        // is may be possible to set the margins to 0 and avoid a wee bit of math.

        var parentBounds = this.getParentBounds();

        if (this.pageAlignHorizontally)
        {
            if (this.width < parentBounds.width && !this.incorrectOrientation)
            {
                //  Reset margin and create new margin based on delta.
                this.game.canvas.style.marginLeft = '0px';
                var currentEdge = Phaser.Canvas.getOffset(this.game.canvas).x - parentBounds.x;
                var targetEdge = (parentBounds.width / 2) - (this.width / 2);
                var offset = Math.round(targetEdge - currentEdge);

                this.margin.x = offset;
                this.game.canvas.style.marginLeft = offset + 'px';
            }
            else
            {
                this.margin.x = 0;
                this.game.canvas.style.marginLeft = '0px';
            }
        }

        if (this.pageAlignVertically)
        {
            if (this.height < parentBounds.height && !this.incorrectOrientation)
            {
                this.game.canvas.style.marginTop = '0px';
                var currentEdge = Phaser.Canvas.getOffset(this.game.canvas).y - parentBounds.y;
                var targetEdge = (parentBounds.height / 2) - (this.height / 2);
                var offset = Math.round(targetEdge - currentEdge);

                this.margin.y = offset;
                this.game.canvas.style.marginTop = offset + 'px';
            }
            else
            {
                this.margin.y = 0;
                this.game.canvas.style.marginTop = '0px';
            }
        }


    },

    /**
    * Updates the size/position of the canvas based on internal state.
    * 
    * @method Phaser.ScaleManager#reflowCanvas
    * @private
    */
    reflowCanvas: function () {

        var scaleMode = this.currentScaleMode;

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

        if (this.pageAlignHorizontally || this.pageAlignVertically)
        {
            this.alignCanvas();
        }

        Phaser.Canvas.getOffset(this.game.canvas, this.offset);
        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

        this.aspectRatio = this.width / this.height;

        this.scaleFactor.x = this.game.width / this.width;
        this.scaleFactor.y = this.game.height / this.height;
        this.game.input.scale.setTo(this.scaleFactor.x, this.scaleFactor.y);

        this.scaleFactorInversed.x = this.width / this.game.width;
        this.scaleFactorInversed.y = this.height / this.game.height;

        if (this.updateOrientationState() &&
            (scaleMode !== Phaser.ScaleManager.NO_SCALE))
        {
            this.refresh();
        }

    },

    /**
    * Reset internal data/state.
    *
    * @method Phaser.ScaleManager#reset
    * @private
    */
    reset: function (clearWorld) {

        if (clearWorld)
        {
            this.grid.reset();
        }

    },

    /**
    * Updates the width/height to that of the window.
    * 
    * @method Phaser.ScaleManager#setMaximum
    * @private
    */
    setMaximum: function () {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    },

    /**
    * Updates the width/height such that the game is scaled proportionally.
    * 
    * @method Phaser.ScaleManager#setShowAll
    * @private
    */
    setShowAll: function () {

        var bounds = this.getParentBounds();
        var width = bounds.width;
        var height = bounds.height;

        var multiplier = Math.min((height / this.game.height), (width / this.game.width));

        this.width = Math.round(this.game.width * multiplier);
        this.height = Math.round(this.game.height * multiplier);

    },

    /**
    * Updates the width/height such that the game is stretched to the available size.
    * Honors `maxWidth` and `maxHeight`.
    *
    * @method Phaser.ScaleManager#setExactFit
    * @private
    */
    setExactFit: function () {

        // This preserves exactFit semantics from earlier code - difference unknown.
        if (this.isFullScreen) {
            this.width = window.outerWidth;
            this.height = window.outerHeight;
            return;
        }

        var bounds = this.getParentBounds();
        var availableWidth = bounds.width;
        var availableHeight = bounds.height;

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
    *
    * Fullscreen mode needs to be supported by the browser. It is _not_ the same as setting the game size to fill the browser window.
    *
    * The `fullScreenDailed` signal will be dispatched if the fullscreen change request failed or the game does not support the Fullscreen API.
    * 
    * @method Phaser.ScaleManager#startFullScreen
    * @public
    * @param {boolean} [antialias] - Changes the anti-alias feature of the canvas before jumping in to full screen (false = retain pixel art, true = smooth art). If not specified then no change is made. Only works in CANVAS mode.
    * @return {boolean} Returns true if the device supports fullscreen mode and fullscreen mode was attempted to be started. (It might not actually start, wait for the signals.)
    */
    startFullScreen: function (antialias) {

        if (this.isFullScreen)
        {
            return false;
        }

        if (!this.supportsFullScreen)
        {
            var _this = this;
            setTimeout(function () {
                _this.fullScreenError();
            }, 10, this);
            return;
        }

        if (typeof antialias !== 'undefined' && this.game.renderType === Phaser.CANVAS)
        {
            this.game.stage.smoothed = antialias;
        }

        if (this.game.device.fullscreenKeyboard)
        {
            this.fullScreenTarget[this.game.device.requestFullscreen](Element.ALLOW_KEYBOARD_INPUT);
        }
        else
        {
            this.fullScreenTarget[this.game.device.requestFullscreen]();
        }

        return true;

    },

    /**
    * Stops full screen mode if the browser is in it.
    *
    * @method Phaser.ScaleManager#stopFullScreen
    * @public
    * @return {boolean} Returns true if the browser supports fullscreen mode and fullscreen mode will be exited.
    */
    stopFullScreen: function () {

        if (!this.isFullScreen || !this.supportsFullScreen)
        {
            return false;
        }

        document[this.game.device.cancelFullscreen]();

        return true;

    },

    /**
    * Used to prepare/restore extra fullscreen mode settings.
    *
    * @method Phaser.ScaleManager#prepScreenMode
    * @private
    * @param {boolean} fullscreen - True if _entering_ fullscreen, false if _leaving_.
    */
    prepScreenMode: function (fullscreen) {

        var fsTarget = this.fullScreenTarget;

        if (fullscreen)
        {
            this._restoreSize.width = this.width;
            this._restoreSize.height = this.height;

            if (this.fullScreenScaleMode === Phaser.ScaleManager.EXACT_FIT)
            {
                this._restoreTargetStyle = {
                    width: fsTarget.style['width'],
                    height: fsTarget.style['height']
                };

                fsTarget.style['width'] = '100%';
                fsTarget.style['height'] = '100%';
            }
            else if (this.fullScreenScaleMode === Phaser.ScaleManager.RESIZE)
            {
                // Allow/force recheck for resize
                if (this.scaleMode === Phaser.ScaleManager.RESIZE)
                {
                    this._parentBounds.width = 0;
                    this._parentBounds.height = 0;
                    this._nextParentCheck = 0;
                }
            }
        }
        else
        {
            // Have restore information, and it looks like we set it..
            if (this._restoreTargetStyle)
            {
                if (fsTarget.style['width'] === '100%')
                {
                    fsTarget.style['width'] = this._restoreTargetStyle.width;
                }
                if (fsTarget.style['height'] === '100%')
                {
                    fsTarget.style['height'] = this._restoreTargetStyle.height;
                }

                this._restoreTargetStyle = null;
            }

            // Will be changed by scaling modes, if applicable
            this.width = this._restoreSize.width;
            this.height = this._restoreSize.height;

            // Wee hack to reset/fix if we bumped up parent container sizes
            this.game.canvas.style.width = this.width + 'px';
            this.game.canvas.style.height = this.height + 'px';

            // Allow/force recheck for resize
            if (this.scaleMode === Phaser.ScaleManager.RESIZE)
            {
                this._parentBounds.width = 0;
                this._parentBounds.height = 0;
                this._nextParentCheck = 0;
            }
        }

    },

    /**
    * Called automatically when the browser enters of leaves full screen mode.
    *
    * @method Phaser.ScaleManager#fullScreenChange
    * @protected
    * @param {Event} [event=undefined] - The fullscreenchange event
    */
    fullScreenChange: function (event) {

        this.event = event;

        if (this.isFullScreen)
        {
            this.prepScreenMode(true);

            this.setScreenSize(true);

            this.enterFullScreen.dispatch(this.width, this.height);
        }
        else
        {
            this.prepScreenMode(false);

            this.setScreenSize(true);

            this.leaveFullScreen.dispatch(this.width, this.height);
        }

    },

    /**
    * Called automatically when the browser fullscreen request fails;
    * or called when a fullscreen request is made on a device for which it is not supported.
    *
    * @method Phaser.ScaleManager#fullScreenError
    * @protected
    * @param {Event} [event=undefined] - The fullscreenerror event; undefined if invoked on a device that does not support the Fullscreen API.
    */
    fullScreenError: function (event) {

        this.event = event;

        console.warn("Phaser.ScaleManager: requestFullscreen failed or device does not support the Fullscreen API");
        this.fullScreenFailed.dispatch();

    },

    /**
    * Destroys the ScaleManager and removes any event listeners.
    * This should probably only be called when the game is destroyed.
    *
    * @method destroy
    * @protected
    */
    destroy: function () {

        window.removeEventListener('orientationchange', this._orientationChange, false);
        window.removeEventListener('resize', this._windowResize, false);

        if (this.supportsFullScreen)
        {
            document.removeEventListener('webkitfullscreenchange', this._fullScreenChange, false);
            document.removeEventListener('mozfullscreenchange', this._fullScreenChange, false);
            document.removeEventListener('MSFullscreenChange', this._fullScreenChange, false);
            document.removeEventListener('fullscreenchange', this._fullScreenChange, false);

            document.removeEventListener('webkitfullscreenerror', this._fullScreenError, false);
            document.removeEventListener('mozfullscreenerror', this._fullScreenError, false);
            document.removeEventListener('MSFullscreenError', this._fullScreenError, false);
            document.removeEventListener('fullscreenerror', this._fullScreenError, false);
        }

    }

};

Phaser.ScaleManager.prototype.constructor = Phaser.ScaleManager;

/**
* window.resize event handler.
* @method checkResize
* @memberof Phaser.ScaleManager
* @protected
* @deprecated 2.1.4 - Internal. _Do not use_
*/
Phaser.ScaleManager.prototype.checkResize = Phaser.ScaleManager.prototype.windowResize;

/**
* window.orientationchange event handler.
* @method checkOrientation
* @memberof Phaser.ScaleManager
* @protected
* @deprecated 2.1.4 - Internal. _Do not use_
*/
Phaser.ScaleManager.prototype.checkOrientation = Phaser.ScaleManager.prototype.orientationChange;

/**
* Updates the size/position of the canvas based on internal state.
* @method setSize
* @memberof Phaser.ScaleManager
* @protected
* @deprecated 2.1.4 - Internal. Use `refresh` if needed.
*/
Phaser.ScaleManager.prototype.setSize = Phaser.ScaleManager.prototype.reflowCanvas;

/**
* Checks if the browser is in the correct orientation for the game, dependent upon `forceLandscape` and `forcePortrait`, and updates the state.
*
* The appropriate event is dispatched if the orientation became valid or invalid.
* 
* @method checkOrientationState
* @memberof Phaser.ScaleManager
* @protected
* @return {boolean} True if the orientation state changed (consider a refresh)
* @deprecated 2.1.4 - This is only for backward compatibility of user code.
*/
Phaser.ScaleManager.prototype.checkOrientationState = function () {

    if (this.updateOrientationState() &&
        (this.currentScaleMode !== Phaser.ScaleManager.NO_SCALE))
    {
        this.refresh();
    }

};

/**
* The scaling method used by the ScaleManager.
*
* @name Phaser.ScaleManager#scaleMode
* @property {number} scaleMode
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "scaleMode", {

    get: function () {

        return this._scaleMode;

    },

    set: function (value) {

        if (value !== this._scaleMode)
        {
            this._scaleMode = value;

            if (value === Phaser.ScaleManager.RESIZE)
            {
                this.getParentBounds(undefined, this._parentBounds);
                this._nextParentCheck = 0;
            }
            this._updateSize = true;
        }

        return this._scaleMode;

    }

});

/**
* The scaling method used by the ScaleManager in fullscreen.
*
* @name Phaser.ScaleManager#fullScreenScaleMode
* @property {number} fullScreenScaleMode
* @public
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "fullScreenScaleMode", {

    get: function () {

        return this._fullScreenScaleMode;

    },

    set: function (value) {

        if (value !== this._fullScreenScaleMode)
        {
            // If in fullscreen then need a wee bit more work
            if (this.isFullScreen)
            {
                this.prepScreenMode(false);
                this._fullScreenScaleMode = value;
                this.prepScreenMode(true);
            }
            else
            {
                this._fullScreenScaleMode = value;
            }

            if (value === Phaser.ScaleManager.RESIZE)
            {
                this.getParentBounds(undefined, this._parentBounds);
                this._nextParentCheck = 0;
            }
            this._updateSize = true;
        }

        return this._fullScreenScaleMode;

    }

});

/**
* Returns the current scale mode - for normal or fullscreen operation.
*
* @name Phaser.ScaleManager#currentScaleMode
* @property {number} currentScaleMode
* @protected
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "currentScaleMode", {

    get: function () {

        return this.isFullScreen ? this._fullScreenScaleMode : this._scaleMode;

    }

});

/**
* If true then the game canvas will be horizontally-aligned _in the parent container_.
*
* To align across the page the game canvas should be added directly to page;
* or the parent container should itself be aligned.
*
* This is not applicable for the `RESIZE` scaling mode.
*
* @name Phaser.ScaleManager#pageAlignHorizontally
* @property {boolean} pageAlignHorizontally
* @default false
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "pageAlignHorizontally", {

    get: function () {

        return this._pageAlignHorizontally;

    },

    set: function (value) {

        if (value !== this._pageAlignHorizontally)
        {
            this._pageAlignHorizontally = value;
            this._updateSize = true;
        }

    }

});

/**
* If true then the game canvas will be vertically-aligned _in the parent container_.
*
* To align across the page the game canvas should be added directly to page;
* or the parent container should itself be aligned.
*
* This is not applicable for the `RESIZE` scaling mode.
*
* @name Phaser.ScaleManager#pageAlignVertically
* @property {boolean} pageAlignVertically
* @default false
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "pageAlignVertically", {

    get: function () {

        return this._pageAlignVertically;

    },

    set: function (value) {

        if (value !== this._pageAlignVertically)
        {
            this._pageAlignVertically = value;
            this._updateSize = true;
        }

    }

});

/**
* Returns true if the browser is in full screen mode, otherwise false.
* @name Phaser.ScaleManager#isFullScreen
* @property {boolean} isFullScreen
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "isFullScreen", {

    get: function () {
        return !!(document['fullscreenElement'] ||
            document['webkitFullscreenElement'] ||
            document['mozFullScreenElement'] ||
            document['msFullscreenElement']);
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
