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
    * Target width (in pixels) of the Game canvas.
    * @property {number} width
    */
    this.width = 0;

    /**
    * Target height (in pixels) of the Game canvas.
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
    * The offset coordinates of the Game canvas from the top-left of the browser window (used by Input and other classes).
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
    * See `pageAlignHorizontally`.
    * @property {boolean} _pageAlignHorizontally
    * @private
    */
    this._pageAlignHorizontally = false;

    /**
    * See `pageAlignVertically`.
    * @property {boolean} _pageAlignVertically
    * @private
    */
    this._pageAlignVertically = false;

    /**
    * The maximum number of times a canvas will be resized (in a row) in order to fill the browser.
    * @property {number} maxIterations
    * @protected
    * @default
    * @deprecated This is not used.
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
    * It can be retargetted to any valid DOM element; the target element must have the correct CSS applied and must contain the game canvas.
    *
    * This element's style will be modified (ie. the width and height might be set to 100%)
    * but it will not be added to, removed from, or repositioned within the DOM.
    * An attempt is made to restore relevant style changes when fullscreen mode is left.
    *
    * For old behavior use: `game.scale.fullScreenTarget = game.scale.parentNode`.
    *
    * @property {DOMElement|null} fullScreenTarget
    * @default
    * @deprecated 2.1.4 - See `createFullScreenTarget` as an alternative.
    */
    this.fullScreenTarget = null;

    /**
    * A function to create a full screen target when `fullScreenTarget` is not set.
    * The Game Canvas is moved onto this element for the duration of the full screen mode
    * and restored to it's original DOM location when full screen is exited.
    *
    * The default implementation is to create a new element.
    *
    * The returned element is modified and is manipulated within the DOM; it is advisable to create a new
    * element each time. Assign a value (possibly the game canvas) to `fullScreenTarget` to avoid this
    * DOM manipulation and revert to earlier behavior.
    *
    * @public {function} createFullScreenTarget
    */
    this.createFullScreenTarget = function () {
        var fsTarget = document.createElement('div');
        fsTarget.style['margin'] = '0';
        fsTarget.style['padding'] = '0';
        fsTarget.style['background'] = '#000';
        return fsTarget;
    };

    /**
    * The full screen target, as created by `createFullScreenTarget`.
    * This is not set if `fullScreenTarget` is used and is cleared when full screen mode ends.
    * @property {DOMElement|null} _createdFullScreenTarget
    * @private
    */
    this._createdFullScreenTarget = null;

    /**
    * This singal is dispatched when the browser enters full screen mode, if it supports the FullScreen API.
    * @property {Phaser.Signal} enterFullScreen
    * @public
    */
    this.enterFullScreen = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser leaves full screen mode, if it supports the FullScreen API.
    * @property {Phaser.Signal} leaveFullScreen
    * @public
    */
    this.leaveFullScreen = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser fails to enter full screen mode;
    * or if the device does not support fullscreen mode and `startFullScreen` is invoked.
    * @property {Phaser.Signal} leaveFullScreen
    * @public
    */
    this.fullScreenFailed = new Phaser.Signal();

    /**
    * The orientation value of the game (as defined by `window.orientation` if set).
    * A value of 90 is landscape and 0 is portrait.
    * @property {number} orientation
    * @public
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
    * If true then the canvas's margins will not be updated anymore: existing margins must be manually cleared.
    * Disabling margins prevents automatic canvas alignment/centering, possibly in full screen.
    * @property {boolean} noMargins
    * @protected
    * @default
    */
    this.noMargins = false;

    /**
    * The game canvas is aligned by adjusting the margins; the last margins are stored here.
    * The margins (left, top, right, bottom) correspond to (x, y, width, height), respectively.
    * @property {Phaser.Point} margin
    * @readonly
    */
    this.margin = new Phaser.Rectangle(0, 0, 0, 0);

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
    * @private
    * @readonly
    */
    this.event = null;

    /**
    * If `true` then EXACT_FIT and SHOW_ALL will work to fit within the window bounds
    * as well as the bounds of the parent container. This preserves 2.1.3 and prior semantics.
    * @property {boolean} constrainToWindow
    * @public
    * @default
    */
    this.constrainToWindow = true;

    /**
    * Scale mode to be used when not in full screen.
    * @property {number} _scaleMode
    * @private
    */
    this._scaleMode = Phaser.ScaleManager.NO_SCALE;

    /*
    * Scale mode to be used in full screen.
    * @property {number} _fullScreenScaleMode
    * @private
    */
    this._fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

    /**
    * If the parent container of the game is the browser window (ie. document.body), rather than a div, this should set to `true`.
    * @property {boolean} parentIsWindow
    * @readonly
    */
    this.parentIsWindow = false;

    /**
    * The _original_ DOM element for the parent of the game canvas.
    * This may be different in full screen - see `createFullScreenTarget`.
    *
    * If the `parentIsWindow` is true then this should likely be `null`.
    *
    * @property {DOMElement|null} parentNode
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
    * The maximum time (in ms) between dimension update checks for the Canvas's parent element (or window).
    * Update checks normally happen quicker in response to other events.
    * @property {integer} trackParentInterval
    * @protected
    * @default
    */
    this.trackParentInterval = 2000;

    /*
    * This signal is dispatched when the size of the Game canvas changes _or_ the size of the Game changes. 
    * When invoked this is done _after_ the Canvas size/position have been updated.
    *
    * This signal is _only_ called when a change occurs and a reflow may be required.
    * For example, if the canvas does not change sizes because of CSS settings (such as min-width)
    * then this signal will _not_ be triggered.
    *
    * Use this to handle responsive game layout options.
    *
    * @property {Phaser.Signal} onSizeChange
    * @public
    * @todo Formalize the arguments, if any, supplied to this signal.
    */
    this.onSizeChange = new Phaser.Signal();

    /**
    * The callback that will be called each the parent container resizes.
    * @property {function} onResize
    * @private
    */
    this.onResize = null;

    /**
    * The context in which the `onResize` callback will be called.
    * @property {object} onResizeContext
    * @private
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
    * Information saved when full screen mode is started.
    * @property {object|null} _fullScreenRestore
    * @private
    */
    this._fullScreenRestore = null;

    /**
    * The _actual_ game dimensions, as initially set or set by `setGameSize`.
    * @property {Phaser.Rectangle} _gameSize
    * @private
    */
    this._gameSize = new Phaser.Rectangle();

    /**
    * The last time the bounds were checked in `preUpdate`.
    * @property {number} _lastSizeCheck
    * @private
    */
    this._lastSizeCheck = 0;

    /**
    * Size checks updates are delayed according to the throttle.
    * The throttle increases to `trackParentInterval` over time and is used to more
    * rapidly detect changes in certain browsers (eg. IE) while providing back-off.
    * (This also replaces the setInterval timer.)
    * @property {integer} _sizeCheckThrottle
    * @private
    */
    this._sizeThrottle = 0;

    /**
    * The reset barrier of the throttle; it will only be reset if above this limit.
    * @private
    */
    this._sizeThrottleReset = 100;

    /**
    * The cached result of the parent (possibly window) bounds; used to invalidate sizing.
    * @property {Phaser.Rectangle} _parentBounds
    * @private
    */
    this._parentBounds = new Phaser.Rectangle();

    /**
    * The bounds at which the last onResize event was triggered.
    * @property {Phaser.Rectangle} _lastResizeBounds
    * @private
    */
    this._lastResizeBounds = new Phaser.Rectangle();

    if (game.config)
    {
        this.parseConfig(game.config);
    }

    this.setupScale(width, height);

};

/**
* The Game display area will be _stretched_ to fill the entire size of the canvas's parent element and/or screen.
* Proportions are not mainted.
*
* @constant
* @type {integer}
*/
Phaser.ScaleManager.EXACT_FIT = 0;

/**
* The Game display area will not be scaled - even if it is too large for the canvas/screen.
*
* This mode _ignores_ any applied scaling factor and displays the canvas at the Game size.
*
* @constant
* @type {integer}
*/
Phaser.ScaleManager.NO_SCALE = 1;

/**
* Show the entire game display area while _maintaining_ the original aspect ratio.
*
* @constant
* @type {integer}
*/
Phaser.ScaleManager.SHOW_ALL = 2;

/**
* The dimensions of the game display area are changed to match the size of the parent container.
* That is, this mode _changes the Game size_ to match the display size.
*
* Any manually set Game size (see `setGameSize`) is ignored while in effect.
*
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

            this.getParentBounds(this._parentBounds);

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
    * Start the ScaleManager.
    * 
    * @method Phaser.ScaleManager#boot
    * @protected
    */
    boot: function () {

        this.supportsFullScreen = this.game.device.fullscreen && !this.game.device.cocoonJS;

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

        Phaser.Canvas.getOffset(this.game.canvas, this.offset);

        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

        this.setGameSize(this.game.width, this.game.height);

    },

    /**
    * Set the virtual Game size.
    * Use this instead of directly changing `game.width` or `game.height`.
    *
    * The actual physical display (Canvas element size) will depend on various settings including
    * - Scale Mode
    * - Scale Factor
    * - Size of Canvas's parent element (or Window);
    *   or CSS styling on the parent element, such as max-height or min-height
    *
    * @method Phaser.ScaleManager#setGameSize
    * @public
    * @param {integer} width - _Game width_, in pixels.
    * @param {integer} height - _Game height_, in pixels.
    */
    setGameSize: function (width, height) {

        this._gameSize.setTo(0, 0, width, height);
        
        if (this.currentScaleMode !== Phaser.ScaleManager.RESIZE)
        {
            this.updateDimensions(width, height, true);
        }
        this.queueUpdate(true);

    },

    /**
    * Sets the callback that will be called when the bounds of the Canvas's parent container may have changed.
    *
    * This callback ..
    * - Will normally be invoked from `preUpdate`
    * - May be invoked even though the parent container or canvas sizes have not changed
    * - Unlike `onSizeChange`, it runs _before_ the canvas is guaranteed to be updated
    *
    * See `onSizeChange` for a better way of reacting to layout updates.
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
    * Signals a resize - IF the target bounds differ from the last bounds the resize was sent at.
    * This also triggers updates on `grid` (FlexGrid) and, if in a RESIZE mode, `game.state` (StateManager).
    *
    * @method Phaser.ScaleMager#signalResize
    * @private
    */
    signalSizeChange: function () {

        var width = this.width;
        var height = this.height;

        if (width !== this._lastResizeBounds.width ||
            height !== this._lastResizeBounds.height)
        {
            this._lastResizeBounds.setTo(0, 0, width, height);

            this.grid.onResize(width, height);

            this.onSizeChange.dispatch(this, width, height);

            // Per StateManager#onResizeCallback, it only occurs when in RESIZE mode.
            if (this.currentScaleMode === Phaser.ScaleManager.RESIZE)
            {
                this.game.state.resize(width, height);
            }
        }

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
    * @todo These values are only sometimes honored.
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

        if (this.game.time.now < (this._lastSizeCheck + this._sizeThrottle))
        {
            return;
        }

        var prevThrottle = this._sizeThrottle;

        Phaser.Canvas.getOffset(this.game.canvas, this.offset);

        var prevWidth = this._parentBounds.width;
        var prevHeight = this._parentBounds.height;
        var bounds = this.getParentBounds(this._parentBounds);

        if (bounds.width !== prevWidth || bounds.height !== prevHeight)
        {
            if (this.onResize)
            {
                this.onResize.call(this.onResizeContext, bounds.width, bounds.height);
            }

            this.setScreenSize();

            this.signalSizeChange();
        }

        // Don't let an update be too eager about resetting the throttle.
        if (this._sizeThrottle < prevThrottle)
        {
            this._sizeThrottle = Math.max(this._sizeThrottle, this._sizeThrottleReset);
        }

        var throttle = this._sizeThrottle * 2;

        this._sizeThrottle = Phaser.Math.clamp(throttle, 10, this.trackParentInterval);
        this._lastSizeCheck = this.game.time.now;

    },

    /**
    * Update the dimensions taking the parent scaling factor into account.
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
        this.updateScalingAndBounds();

        if (resize)
        {
            //  Resize the renderer (which in turn resizes the Game canvas!)
            this.game.renderer.resize(this.width, this.height);

            //  The Camera can never be smaller than the game size
            this.game.camera.setSize(this.width, this.height);

            //  This should only happen if the world is smaller than the new canvas size
            this.game.world.resize(this.width, this.height);
        }

    },

    /**
    * Update relevant scaling values based on the ScaleManager dimension and game dimensions,
    * which should already be set. This does not change `sourceAspectRatio`.
    * @private
    */
    updateScalingAndBounds: function () {

        this.scaleFactor.x = this.game.width / this.width;
        this.scaleFactor.y = this.game.height / this.height;

        this.scaleFactorInversed.x = this.width / this.game.width;
        this.scaleFactorInversed.y = this.height / this.game.height;

        this.aspectRatio = this.width / this.height;

        // This can be invoked in boot pre-canvas
        if (this.game.canvas)
        {
            Phaser.Canvas.getOffset(this.game.canvas, this.offset);
        }
        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

        // Can be invoked in boot pre-input
        if (this.game.input && this.game.input.scale)
        {
            this.game.input.scale.setTo(this.scaleFactor.x, this.scaleFactor.y);
        }

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

        this.queueUpdate(true);

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

        this.orientation = window['orientation'] | 0;

        if (this.isLandscape)
        {
            this.enterLandscape.dispatch(this.orientation, true, false);
        }
        else
        {
            this.enterPortrait.dispatch(this.orientation, false, true);
        }

        this.queueUpdate(true);

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

        if (this.updateOrientationState())
        {
            this.queueUpdate(true);
        }
        else
        {
            this.queueUpdate();
        }

    },

    /**
    * Scroll to the top - in some environments.
    * @private
    */
    scrollTop: function () {

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

    },

    /**
    * Request a refresh, which is not normally needed, based on the current mode settings.
    * The refresh does not run immediately but rather is queued for subsequent game updates.
    * 
    * @method Phaser.ScaleManager#refresh
    * @public
    */
    refresh: function () {

        this.scrollTop();
        this.queueUpdate(true);

    },

    /**
    * Set game and/or screen (game canvas) size automatically based on the scaleMode.
    * This is used internally.
    *
    * Do not call this to "refresh" the display, but rather use `refresh`.
    *
    * @method Phaser.ScaleManager#setScreenSize
    * @protected
    * @deprecated 2.1.4 - This method is _internal_ and may be made _private_ in the future.
    */
    setScreenSize: function () {

        var scaleMode = this.currentScaleMode;

        if (scaleMode === Phaser.ScaleManager.RESIZE)
        {
            this.reflowGame();
            return;
        }

        this.scrollTop();

        // (This came from older code, by why is it here?)
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
                if (!this.isFullScreen && !this.parentIsWindow)
                {
                    // Try to expand parent out, but choosing maximizing dimensions.                    
                    // Then select minimize dimensions which should then honor parent
                    // maximum bound applications.
                    this.setShowAll(true);
                    this.resetCanvas();
                    this.setShowAll();
                }
                else
                {
                    this.setShowAll();
                }
            }
            else if (scaleMode === Phaser.ScaleManager.NO_SCALE)
            {
                this.width = this.game.width;
                this.height = this.game.height;
            }
        }

        if (this.updateOrientationState())
        {
            this.queueUpdate(true);
        }

        this.reflowCanvas();

    },

    /**
    * Returns the bounds of the parent.
    *
    * If fullscreen or without parent, this is the bounds of the screen itself.
    *
    * The values are rounded to the nearest pixel.
    *
    * @method Phaser.ScaleManager#getParentBounds
    * @protected
    * @param {Phaser.Rectangle} [target=(new Rectangle)] - The rectangle to update; a new one is created as needed.
    * @param {boolean} [constrainToWindow=false] - If set then *also* constrain the bounding rectangle to the window.
    */
    getParentBounds: function (target, constrainToWindow) {

        var bounds = target || new Phaser.Rectangle();
        var parentNode = this.game.canvas && this.game.canvas.parentNode;

        if (this.isFullScreen && !this._createdFullScreenTarget)
        {
            bounds.setTo(0, 0, Math.round(window.outerWidth), Math.round(window.outerHeight));
        }
        else if (this.parentIsWindow || !parentNode)
        {
            bounds.setTo(0, 0, Math.round(window.innerWidth), Math.round(window.innerHeight));
        }
        else
        {
            var clientRect = parentNode.getBoundingClientRect();

            bounds.setTo(
                Math.round(clientRect.left), Math.round(clientRect.top),
                Math.round(clientRect.width), Math.round(clientRect.height));

            constrainToWindow = true;
            if (constrainToWindow)
            {
                var offset = Phaser.Canvas.getOffset(parentNode);
                var toRight = Math.round(window.innerWidth - offset.x);
                var toBottom = Math.round(window.innerHeight - offset.y);
                bounds.width = Phaser.Math.clmap(bounds.width, 0, toRight);
                bounds.height = Phaser.Math.clmap(bounds.height, 0, toBottom);
            }
        }

        return bounds;

    },

    /**
    * Update the canvas position/margins - for alignment within the parent container.
    *
    * The canvas margins _must_ be reset/cleared prior to invoking this.
    *
    * @method Phaser.ScaleManager#alignCanvas
    * @private
    * @param {boolean} horizontal - Align horizontally?
    * @param {boolean} vertical - Align vertically?
    */
    alignCanvas: function (horizontal, vertical) {

        var parentBounds = this.getParentBounds();
        var canvas = this.game.canvas;
        var margin = this.margin;

        if (horizontal)
        {
            margin.x = margin.width = 0;

            var canvasBounds = canvas.getBoundingClientRect();
            if (this.width < parentBounds.width && !this.incorrectOrientation)
            {
                var currentEdge = canvasBounds.left - parentBounds.x;
                var targetEdge = (parentBounds.width / 2) - (this.width / 2);

                targetEdge = Math.max(targetEdge, 0);

                var offset = Math.round(targetEdge - currentEdge);
                margin.x = offset;
            }

            canvas.style.marginLeft = margin.x + 'px';
            if (margin.x !== 0)
            {
                margin.width = -(parentBounds.width - canvasBounds.width - margin.x);
                canvas.style.marginRight = margin.width + 'px';
            }
        }

        if (vertical)
        {
            margin.y = margin.height = 0;

            var canvasBounds = canvas.getBoundingClientRect();
            if (this.height < parentBounds.height && !this.incorrectOrientation)
            {
                var currentEdge = canvasBounds.top - parentBounds.y;
                var targetEdge = (parentBounds.height / 2) - (this.height / 2);

                targetEdge = Math.max(targetEdge, 0);
                
                var offset = Math.round(targetEdge - currentEdge);
                margin.y = offset;
            }

            canvas.style.marginTop = margin.y + 'px';
            if (margin.y !== 0)
            {
                margin.height = -(parentBounds.height - canvasBounds.height - margin.y);
                canvas.style.marginBottom = margin.height + 'px';
            }
        }

    },

    /**
    * Updates the game dimensions and canvas based on internal state.
    *
    * The canvas margins may always be adjusted, even alignment is not in effect.
    * 
    * @method Phaser.ScaleManager#reflowGame
    * @private
    */
    reflowGame: function ()
    {

        this.resetCanvas('', '');

        var bounds = this.getParentBounds();
        this.updateDimensions(bounds.width, bounds.height, true);

    },

    /**
    * Updates the size/position of the canvas based on internal state.
    *
    * The canvas margins may always be adjusted, even alignment is not in effect.
    * 
    * @method Phaser.ScaleManager#reflowCanvas
    * @private
    */
    reflowCanvas: function () {

        if (!this.incorrectOrientation)
        {
            this.width = Phaser.Math.clamp(this.width, this.minWidth || 0, this.maxWidth || this.width);
            this.height = Phaser.Math.clamp(this.height, this.minHeight || 0, this.maxHeight || this.height);
        }

        this.resetCanvas();

        if (!this.noMargins)
        {
            if (this.isFullScreen && this._createdFullScreenTarget)
            {
                this.alignCanvas(true, true);
            }
            else
            {
                this.alignCanvas(this.pageAlignHorizontally, this.pageAlignVertically);
            }
        }

        this.updateScalingAndBounds();

    },

    /**
    * "Reset" the game canvas as set the specified styles directly.
    * @method Phaser.ScaleManager#resetCanvas
    * @private
    * @param {string} [cssWidth=(current width)] - The css width to set.
    * @param {string} [cssHeight=(current height)] - The css height to set.
    */
    resetCanvas: function (cssWidth, cssHeight) {

        if (typeof cssWidth === 'undefined') { cssWidth = this.width + 'px'; }
        if (typeof cssHeight === 'undefined') { cssHeight = this.height + 'px'; }

        var canvas = this.game.canvas;
        if (!this.noMargins)
        {
            canvas.style.marginLeft = '';
            canvas.style.marginTop = '';
            canvas.style.marginRight = '';
            canvas.style.marginBottom = '';
        }
        canvas.style.width = cssWidth;
        canvas.style.height = cssHeight;

    },

    /**
    * Queues/marks a size/bounds check as needing to occur (from `preUpdate`).
    * @method Phaser.ScaleManager#queueUpdate
    * @private
    * @param {boolean|undefined} force - If true updates the parent bounds to ensure the check is dirty; if false updates current bounds; if not specified does not update bounds.
    */
    queueUpdate: function (force) {
        if (force === true)
        {
            this._parentBounds.width = 0;
            this._parentBounds.height = 0;
        }
        else if (force === false)
        {
            this.getParentBounds(this._parentBounds);
        }

        this._sizeThrottle = 0;
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
    * @param {boolean} expanding - If true then the maximizing dimension is chosen.
    */
    setShowAll: function (expanding) {

        var bounds = this.getParentBounds();
        var width = bounds.width;
        var height = bounds.height;

        var multiplier;
        if (expanding)
        {
            multiplier = Math.max((height / this.game.height), (width / this.game.width));
        }
        else
        {
            multiplier = Math.min((height / this.game.height), (width / this.game.width));
        }

        this.width = Math.round(this.game.width * multiplier);
        this.height = Math.round(this.game.height * multiplier);

    },

    /**
    * Updates the width/height such that the game is stretched to the available size.
    * Honors `maxWidth` and `maxHeight` when _not_ in full screen.
    *
    * @method Phaser.ScaleManager#setExactFit
    * @private
    */
    setExactFit: function () {

        var bounds = this.getParentBounds();

        this.width = bounds.width;
        this.height = bounds.height;

        if (this.isFullScreen)
        {
            // Max/min not honored fullscreen
            return;
        }

        if (this.maxWidth)
        {
            this.width = Math.min(this.width, this.maxWidth);
        }

        if (this.maxHeight)
        {
            this.height = Math.min(this.height, this.maxHeight);
        }

    },

    /**
    * Tries to enter the browser into full screen mode - this _must_ be called from a user input Pointer or Mouse event.
    *
    * Fullscreen mode needs to be supported by the browser. It is _not_ the same as setting the game size to fill the browser window.
    *
    * The `fullScreenFailed` signal will be dispatched if the fullscreen change request failed or the game does not support the Fullscreen API.
    *
    * @method Phaser.ScaleManager#startFullScreen
    * @public
    * @param {boolean} [antialias] - Changes the anti-alias feature of the canvas before jumping in to full screen (false = retain pixel art, true = smooth art). If not specified then no change is made. Only works in CANVAS mode.
    * @param {boolean} [allowTrampoline=undefined] - Internal argument. If false click trampolining is suppressed.
    * @return {boolean} Returns true if the device supports fullscreen mode and fullscreen mode was attempted to be started. (It might not actually start, wait for the signals.)
    */
    startFullScreen: function (antialias, allowTrampoline) {

        if (this.isFullScreen)
        {
            return false;
        }

        if (!this.supportsFullScreen)
        {
            // Error is called in timeout to emulate the real fullscreenerror event better
            var _this = this;
            setTimeout(function () {
                _this.fullScreenError();
            }, 10);
            return;
        }

        // IE11 clicks trigger MSPointer which is not the mousePointer
        var input = this.game.input;
        if (input.activePointer !== input.mousePointer &&
            (allowTrampoline || allowTrampoline !== false))
        {
            input.activePointer.addClickTrampoline(
                "startFullScreen", this.startFullScreen, this, [antialias, false]);
            return;
        }

        if (typeof antialias !== 'undefined' && this.game.renderType === Phaser.CANVAS)
        {
            this.game.stage.smoothed = antialias;
        }

        var fsTarget = this.fullScreenTarget;
        
        if (!fsTarget)
        {
            this.cleanupCreatedTarget();

            this._createdFullScreenTarget = this.createFullScreenTarget();
            fsTarget = this._createdFullScreenTarget;

            // Move the game canvas inside of the target and add the target to the DOM
            // (The target has to be added for the Fullscreen API to work.)
            var canvas = this.game.canvas;
            var parent = canvas.parentNode;
            parent.insertBefore(fsTarget, canvas);
            fsTarget.appendChild(canvas);
        }

        if (this.game.device.fullscreenKeyboard)
        {
            fsTarget[this.game.device.requestFullscreen](Element.ALLOW_KEYBOARD_INPUT);
        }
        else
        {
            fsTarget[this.game.device.requestFullscreen]();
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
    * Cleans up the previous full screen target, if such was automatically created.
    * This ensures the canvas is restored to its former parent, assuming the target didn't move.
    * @private
    */
    cleanupCreatedTarget: function () {

        var fsTarget = this._createdFullScreenTarget;
        if (fsTarget && fsTarget.parentNode)
        {
            // Make sure to cleanup synthetic target for sure;
            // swap the canvas back to the parent.
            var parent = fsTarget.parentNode;
            parent.insertBefore(this.game.canvas, fsTarget);
            parent.removeChild(fsTarget);

            this._createdFullScreenTarget = null;
        }

    },

    /**
    * Used to prepare/restore extra fullscreen mode settings.
    * (This does move any elements within the DOM tree.)
    *
    * @method Phaser.ScaleManager#prepScreenMode
    * @private
    * @param {boolean} enteringFullscreen - True if _entering_ fullscreen, false if _leaving_.
    */
    prepScreenMode: function (enteringFullscreen) {

        var createdTarget = !!this._createdFullScreenTarget;
        var fsTarget = this._createdFullScreenTarget || this.fullScreenTarget;

        if (enteringFullscreen)
        {

            if (createdTarget || this.fullScreenScaleMode === Phaser.ScaleManager.EXACT_FIT)
            {
                // Resize target, as long as it's not the canvas
                if (fsTarget !== this.game.canvas)
                {
                    this._fullScreenRestore = {};

                    this._fullScreenRestore.target = {
                        width: fsTarget.style['width'],
                        height: fsTarget.style['height']
                    };

                    fsTarget.style['width'] = '100%';
                    fsTarget.style['height'] = '100%';
                }
            }
        }
        else
        {

            // Have restore information
            if (this._fullScreenRestore)
            {
                if (this._fullScreenRestore.target)
                {
                    fsTarget.style['width'] = this._fullScreenRestore.target.width;
                    fsTarget.style['height'] = this._fullScreenRestore.target.height;
                }

                this._fullScreenRestore = null;
            }

            this.updateDimensions(this._gameSize.width, this._gameSize.height, true);
            this.resetCanvas();
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

            this.setScreenSize();
            this.queueUpdate(true);

            this.enterFullScreen.dispatch(this.width, this.height);
        }
        else
        {
            this.prepScreenMode(false);

            this.cleanupCreatedTarget();

            this.setScreenSize();
            this.queueUpdate(true);

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

        this.cleanupCreatedTarget();

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

    var orientationChanged = this.updateOrientationState();
    if (orientationChanged)
    {
        this.refresh();
    }
    return orientationChanged;

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
            if (!this.isFullScreen)
            {
                this.updateDimensions(this._gameSize.width, this._gameSize.height, true);
                this.queueUpdate(true);
            }

            this._scaleMode = value;
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

                this.queueUpdate(true);
            }
            else
            {
                this._fullScreenScaleMode = value;
            }
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
            this.queueUpdate(true);
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
            this.queueUpdate(true);
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
* Returns true if the browser dimensions match a portrait display.
* @name Phaser.ScaleManager#isPortrait
* @property {boolean} isPortrait
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "isPortrait", {

    get: function () {
        return (this.orientation === 0 || this.orientation === 180);
    }

});

/**
* Returns true if the browser dimensions match a landscape display.
* @name Phaser.ScaleManager#isLandscape
* @property {boolean} isLandscape
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "isLandscape", {

    get: function () {
        return (this.orientation === 90 || this.orientation === -90);
    }

});
