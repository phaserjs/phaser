/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @classdesc
* The ScaleManager object handles the the scaling, resizing, and alignment of the
* Game size and the game Display canvas.
*
* The Game size is the logical size of the game; the Display canvas has size as an HTML element.
*
* The calculations of these are heavily influenced by the bounding Parent size which is the computed
* dimenstions of the Display canvas's Parent container/element - the _effective CSS rules of the
* canvas's Parent element play an important role_ in the operation of the ScaleManager. 
*
* The Display canvas - or Game size, depending {@link Phaser.ScaleManager#scaleMode scaleMode} - is updated to best utilize the Parent size.
* When in Fullscreen mode or with `parentIsWindow` the Parent size is that of the visual viewport (see {@link Phaser.ScaleManager#getParentBounds getParentBounds}).
*
* Parent and Display canvas containment guidelines:
*
* - Style the Parent element (of the game canvas) to control the Parent size and
*   thus the Display canvas's size and layout.
*
* - The Parent element's CSS styles should _effectively_ apply maximum (and minimum) bounding behavior.
*
* - The Parent element should _not_ apply a padding as this is not accounted for.
*   If a padding is required apply it to the Parent's parent or apply a margin to the Parent.
*
* - The Display canvas layout CSS styles (ie. margins, size) should not be altered/specified as
*   they may be updated by the ScaleManager.
*
* @description
* Create a new ScaleManager object - this is done automatically by {@link Phaser.Game}
*
* The `width` and `height` constructor parameters can either be a number which represents pixels or a string that represents a percentage: e.g. `800` (for 800 pixels) or `"80%"` for 80%.
*
* @class
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
    * Provides access to some cross-device DOM functions.
    * @property {Phaser.DOM} dom
    * @protected
    * @readonly
    */
    this.dom = Phaser.DOM;

    /**
    * _EXPERIMENTAL:_ A responsive grid on which you can align game objects.
    * @property {Phaser.FlexGrid} grid
    * @public
    */
    this.grid = null;

    /**
    * Target width (in pixels) of the Display canvas.
    * @property {number} width
    * @readonly
    */
    this.width = 0;

    /**
    * Target height (in pixels) of the Display canvas.
    * @property {number} height
    * @readonly
    */
    this.height = 0;

    /**
    * Minimum width the canvas should be scaled to (in pixels).
    * Change with `setMinMax`.
    * @property {number} minWidth
    * @readonly
    * @protected
    */
    this.minWidth = null;

    /**
    * Maximum width the canvas should be scaled to (in pixels).
    * If null it will scale to whatever width the browser can handle.
    * Change with `setMinMax`.
    * @property {number} maxWidth
    * @readonly
    * @protected
    */
    this.maxWidth = null;

    /**
    * Minimum height the canvas should be scaled to (in pixels).
    * Change with `setMinMax`.
    * @property {number} minHeight
    * @readonly
    * @protected
    */
    this.minHeight = null;

    /**
    * Maximum height the canvas should be scaled to (in pixels).
    * If null it will scale to whatever height the browser can handle.
    * Change with `setMinMax`.
    * @property {number} maxHeight
    * @readonly
    * @protected
    */
    this.maxHeight = null;

    /**
    * The offset coordinates of the Display canvas from the top-left of the browser window.
    * The is used internally by Phaser.Pointer (for Input) and possibly other types.
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
    * @protected
    */
    this.forceLandscape = false;

    /**
    * If true, the game should only run in a portrait 
    * Change with `forceOrientation`.
    * @property {boolean} forcePortrait
    * @readonly
    * @default
    * @protected
    */
    this.forcePortrait = false;

    /**
    * True if the `forceLandscape` or `forcePortrait` are set and do not agree with the browser orientation.
    *
    * This value is not updated immediately.
    *
    * @property {boolean} incorrectOrientation    
    * @readonly
    * @protected
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
    * @see {@link Phaser.ScaleManger#refresh refresh}
    * @deprecated 2.2.0 - This is not used anymore as reflow iterations are "automatic".
    */
    this.maxIterations = 5;

    /**
    * This signal is dispatched when the orientation changes _or_ the validity of the current orientation changes.
    * 
    * The signal is supplied with the following arguments:
    * - `scale` - the ScaleManager object
    * - `prevOrientation`, a string - The previous orientation as per {@link Phaser.ScaleManager#screenOrientation screenOrientation}.
    * - `wasIncorrect`, a boolean - True if the previous orientation was last determined to be incorrect.
    *
    * Access the current orientation and validity with `scale.screenOrientation` and `scale.incorrectOrientation`.
    * Thus the following tests can be done:
    *
    *     // The orientation itself changed:
    *     scale.screenOrientation !== prevOrientation
    *     // The orientation just became incorrect:
    *     scale.incorrectOrientation && !wasIncorrect
    *
    * It is possible that this signal is triggered after `forceOrientation` so the orientation
    * correctness changes even if the orientation itself does not change.
    *
    * This is signaled from `preUpdate` (or `pauseUpdate`) _even when_ the game is paused.
    *
    * @property {Phaser.Signal} onOrientationChange
    * @public
    */
    this.onOrientationChange = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser enters landscape orientation, having been in portrait.
    *
    * This is signaled from  `preUpdate` (or `pauseUpdate`) _even when_ the game is paused.
    *
    * @property {Phaser.Signal} enterLandscape
    * @public
    * @deprecated 2.2.0 - Use {@link Phaser.ScaleManager#onOrientationChange onOrientationChange}
    */
    this.enterLandscape = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser enters portrait orientation, having been in landscape.
    *
    * This is signaled from `preUpdate` (or `pauseUpdate`) _even when_ the game is paused.
    *
    * @property {Phaser.Signal} enterPortrait
    * @public
    * @deprecated 2.2.0 - Use {@link Phaser.ScaleManager#onOrientationChange onOrientationChange}
    */
    this.enterPortrait = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser enters an incorrect orientation, as defined by `forceOrientation`.
    *
    * This is signaled from `preUpdate` (or `pauseUpdate`) _even when_ the game is paused.
    *
    * @property {Phaser.Signal} enterIncorrectOrientation
    * @public
    */
    this.enterIncorrectOrientation = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser leaves an incorrect orientation, as defined by `forceOrientation`.
    *
    * This is signaled from `preUpdate` (or `pauseUpdate`) _even when_ the game is paused.
    *
    * @property {Phaser.Signal} leaveIncorrectOrientation
    * @public
    */
    this.leaveIncorrectOrientation = new Phaser.Signal();

    /**
    * If specified, this is the DOM element on which the Fullscreen API enter request will be invoked.
    * The target element must have the correct CSS styling and contain the Display canvas.
    *
    * The elements style will be modified (ie. the width and height might be set to 100%)
    * but it will not be added to, removed from, or repositioned within the DOM.
    * An attempt is made to restore relevant style changes when fullscreen mode is left.
    *
    * For pre-2.2.0 behavior set `game.scale.fullScreenTarget = game.canvas`.
    *
    * @property {?DOMElement} fullScreenTarget
    * @default
    */
    this.fullScreenTarget = null;

    /**
    * The fullscreen target, as created by `createFullScreenTarget`.
    * This is not set if `fullScreenTarget` is used and is cleared when fullscreen mode ends.
    * @property {?DOMElement} _createdFullScreenTarget
    * @private
    */
    this._createdFullScreenTarget = null;

    /**
    * This signal is dispatched when fullscreen mode is ready to be initialized but
    * before the fullscreen request.
    *
    * The signal is passed two arguments: `scale` (the ScaleManager), and an object in the form `{targetElement: DOMElement}`.
    *
    * The `targetElement` is the {@link Phaser.ScaleManager#fullScreenTarget fullScreenTarget} element,
    * if such is assigned, or a new element created by {@link Phaser.ScaleManager#createFullScreenTarget createFullScreenTarget}.
    *
    * Custom CSS styling or resets can be applied to `targetElement` as required.
    *
    * If `targetElement` is _not_ the same element as {@link Phaser.ScaleManager.fullScreenTarget}:
    * - After initialization the Display canvas is moved onto the `targetElement` for
    *   the duration of the fullscreen mode, and restored to it's original DOM location when fullscreen is exited.
    * - The `targetElement` is moved/reparanted within the DOM and may have its CSS styles updated.
    *
    * The behavior of a pre-assigned target element is covered in {@link Phaser.ScaleManager#fullScreenTarget fullScreenTarget}.
    *
    * @property {Phaser.Signal} onFullScreenInit
    * @public
    */
    this.onFullScreenInit = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser enters or leaves fullscreen mode, if supported.
    *
    * The signal is supplied with a single argument: `scale` (the ScaleManager). Use `scale.isFullScreen` to determine
    * if currently running in Fullscreen mode.
    *
    * @property {Phaser.Signal} onFullScreenChange
    * @public    
    */
    this.onFullScreenChange = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser fails to enter fullscreen mode;
    * or if the device does not support fullscreen mode and `startFullScreen` is invoked.
    *
    * The signal is supplied with a single argument: `scale` (the ScaleManager).
    *
    * @property {Phaser.Signal} onFullScreenError
    * @public
    */
    this.onFullScreenError = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser enters fullscreen mode, if supported.
    *
    * @property {Phaser.Signal} enterFullScreen
    * @public
    * @deprecated 2.2.0 - Use {@link Phaser.ScaleManager#onFullScreenChange onFullScreenChange}
    */
    this.enterFullScreen = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser leaves fullscreen mode.
    *
    * @property {Phaser.Signal} leaveFullScreen
    * @public
    * @deprecated 2.2.0 - Use {@link Phaser.ScaleManager#onFullScreenChange onFullScreenChange}
    */
    this.leaveFullScreen = new Phaser.Signal();

    /**
    * This signal is dispatched when the browser fails to enter fullscreen mode;
    * or if the device does not support fullscreen mode and `startFullScreen` is invoked.
    *
    * @property {Phaser.Signal} fullScreenFailed
    * @public
    * @deprecated 2.2.0 - Use {@link Phaser.ScaleManager#onFullScreenError onFullScreenError}
    */
    this.fullScreenFailed = this.onFullScreenError;

    /**
    * The _last known_ orientation of the screen, as defined in the Window Screen Web API.
    * See {@link Phaser.DOM.getScreenOrientation} for possible values.
    *
    * @property {string} screenOrientation
    * @readonly
    * @public
    */
    this.screenOrientation = this.dom.getScreenOrientation();

    /**
    * The _current_ scale factor based on the game dimensions vs. the scaled dimensions.
    * @property {Phaser.Point} scaleFactor
    * @readonly
    */
    this.scaleFactor = new Phaser.Point(1, 1);

    /**
    * The _current_ inversed scale factor. The displayed dimensions divided by the game dimensions.
    * @property {Phaser.Point} scaleFactorInversed
    * @readonly
    * @protected
    */
    this.scaleFactorInversed = new Phaser.Point(1, 1);

    /**
    * The Display canvas is aligned by adjusting the margins; the last margins are stored here.
    *
    * @property {Bounds-like} margin
    * @readonly
    * @protected
    */
    this.margin = {left: 0, top: 0, right: 0, bottom: 0, x: 0, y: 0};

    /**
    * The bounds of the scaled game. The x/y will match the offset of the canvas element and the width/height the scaled width and height.
    * @property {Phaser.Rectangle} bounds
    * @readonly
    */
    this.bounds = new Phaser.Rectangle();

    /**
    * The aspect ratio of the scaled Display canvas.
    * @property {number} aspectRatio
    * @readonly
    */
    this.aspectRatio = 0;

    /**
    * The aspect ratio of the original game dimensions.
    * @property {number} sourceAspectRatio
    * @readonly
    */
    this.sourceAspectRatio = 0;

    /**
    * The native browser events from Fullscreen API changes.
    * @property {any} event
    * @readonly
    * @private
    */
    this.event = null;

    /**
    * The edges on which to constrain the game Display/canvas in _addition_ to the restrictions of the parent container.
    *
    * The properties are strings and can be '', 'visual', 'layout', or 'layout-soft'.
    * - If 'visual', the edge will be constrained to the Window / displayed screen area
    * - If 'layout', the edge will be constrained to the CSS Layout bounds
    * - An invalid value is treated as 'visual'
    *
    * @member
    * @property {string} bottom
    * @property {string} right
    * @default
    */
    this.windowConstraints = {
        right: 'layout',
        bottom: ''
    };

    /**
    * Various compatibility settings.
    * The `(auto)` value indicates the setting is configured based on device and runtime information.
    * @protected
    * 
    * @property {boolean} [supportsFullscreen=(auto)] - True only if fullscreen support will be used. (Changing to fullscreen still might not work.)
    *
    * @property {boolean} [orientationFallback=(auto)] - See {@link Phaser.DOM.getScreenOrientation}.
    *
    * @property {boolean} [noMargins=false] - If true then the Display canvas's margins will not be updated anymore: existing margins must be manually cleared. Disabling margins prevents automatic canvas alignment/centering, possibly in fullscreen.
    *
    * @property {?Phaser.Point} [scrollTo=(auto)] - If specified the window will be scrolled to this position on every refresh.
    *
    * @property {boolean} [forceMinimumDocumentHeight=false] - If enabled the document elements minimum height is explicity set on updates.
    *
    * @property {boolean} [canExpandParent=true] - If enabled then SHOW_ALL and USER_SCALE modes can try and expand the parent element. It may be necessary for the parent element to impose CSS width/height restrictions.
    */
    this.compatibility = {
        supportsFullScreen: false,
        orientationFallback: null,
        noMargins: false,
        scrollTo: null,
        forceMinimumDocumentHeight: false,
        canExpandParent: true
    };

    /**
    * Scale mode to be used when not in fullscreen.
    * @property {number} _scaleMode
    * @private
    */
    this._scaleMode = Phaser.ScaleManager.NO_SCALE;

    /*
    * Scale mode to be used in fullscreen.
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
    * The _original_ DOM element for the parent of the Display canvas.
    * This may be different in fullscreen - see `createFullScreenTarget`.
    *
    * @property {?DOMElement} parentNode
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
    *
    * @property {integer} trackParentInterval
    * @default
    * @protected
    * @see {@link Phaser.ScaleManager#refresh refresh}
    */
    this.trackParentInterval = 2000;

    /**
    * This signal is dispatched when the size of the Display canvas changes _or_ the size of the Game changes. 
    * When invoked this is done _after_ the Canvas size/position have been updated.
    *
    * This signal is _only_ called when a change occurs and a reflow may be required.
    * For example, if the canvas does not change sizes because of CSS settings (such as min-width)
    * then this signal will _not_ be triggered.
    *
    * Use this to handle responsive game layout options.
    *
    * This is signaled from `preUpdate` (or `pauseUpdate`) _even when_ the game is paused.
    *
    * @property {Phaser.Signal} onSizeChange
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
    * Information saved when fullscreen mode is started.
    * @property {?object} _fullScreenRestore
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
    * The user-supplied scale factor, used with the USER_SCALE scaling mode.
    * @property {Phaser.Point} _userScaleFactor
    * @private
    */
    this._userScaleFactor = new Phaser.Point(1, 1);

    /**
    * The user-supplied scale trim, used with the USER_SCALE scaling mode.
    * @property {Phaser.Point} _userScaleTrim
    * @private
    */
    this._userScaleTrim = new Phaser.Point(0, 0);

    /**
    * The last time the bounds were checked in `preUpdate`.
    * @property {number} _lastUpdate
    * @private
    */
    this._lastUpdate = 0;

    /**
    * Size checks updates are delayed according to the throttle.
    * The throttle increases to `trackParentInterval` over time and is used to more
    * rapidly detect changes in certain browsers (eg. IE) while providing back-off safety.
    * @property {integer} _updateThrottle
    * @private
    */
    this._updateThrottle = 0;

    /**
    * The minimum throttle allowed until it has slowed down sufficiently.
    * @property {integer} _updateThrottleReset   
    * @private
    */
    this._updateThrottleReset = 100;

    /**
    * The cached result of the parent (possibly window) bounds; used to invalidate sizing.
    * @property {Phaser.Rectangle} _parentBounds
    * @private
    */
    this._parentBounds = new Phaser.Rectangle();

    /**
    * Temporary bounds used for internal work to cut down on new objects created.
    * @property {Phaser.Rectangle} _parentBounds
    * @private
    */
    this._tempBounds = new Phaser.Rectangle();

    /**
    * The Canvas size at which the last onSizeChange signal was triggered.
    * @property {Phaser.Rectangle} _lastReportedCanvasSize
    * @private
    */
    this._lastReportedCanvasSize = new Phaser.Rectangle();

    /**
    * The Game size at which the last onSizeChange signal was triggered.
    * @property {Phaser.Rectangle} _lastReportedGameSize
    * @private
    */
    this._lastReportedGameSize = new Phaser.Rectangle();

    if (game.config)
    {
        this.parseConfig(game.config);
    }

    this.setupScale(width, height);

};

/**
* A scale mode that stretches content to fill all available space - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
*
* @constant
* @type {integer}
*/
Phaser.ScaleManager.EXACT_FIT = 0;

/**
* A scale mode that prevents any scaling - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
*
* @constant
* @type {integer}
*/
Phaser.ScaleManager.NO_SCALE = 1;

/**
* A scale mode that shows the entire game while maintaining proportions - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
*
* @constant
* @type {integer}
*/
Phaser.ScaleManager.SHOW_ALL = 2;

/**
* A scale mode that causes the Game size to change - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
*
* @constant
* @type {integer}
*/
Phaser.ScaleManager.RESIZE = 3;

/**
* A scale mode that allows a custom scale factor - see {@link Phaser.ScaleManager#scaleMode scaleMode}.
*
* @constant
* @type {integer}
*/
Phaser.ScaleManager.USER_SCALE = 4;


Phaser.ScaleManager.prototype = {

    /**
    * Start the ScaleManager.
    * 
    * @method Phaser.ScaleManager#boot
    * @protected
    */
    boot: function () {

        // Configure device-dependent compatibility

        var compat = this.compatibility;
        
        compat.supportsFullScreen = this.game.device.fullscreen && !this.game.device.cocoonJS;

        //  We can't do anything about the status bars in iPads, web apps or desktops
        if (!this.game.device.iPad && !this.game.device.webApp && !this.game.device.desktop)
        {
            if (this.game.device.android && !this.game.device.chrome)
            {
                compat.scrollTo = new Phaser.Point(0, 1);
            }
            else
            {
                compat.scrollTo = new Phaser.Point(0, 0);
            }
        }

        if (this.game.device.desktop)
        {
            compat.orientationFallback = 'screen';
        }
        else
        {
            compat.orientationFallback = '';
        }

        // Configure event listeners

        var _this = this;

        this._orientationChange = function(event) {
            return _this.orientationChange(event);
        };

        this._windowResize = function(event) {
            return _this.windowResize(event);
        };

        // This does not appear to be on the standards track
        window.addEventListener('orientationchange', this._orientationChange, false);
        window.addEventListener('resize', this._windowResize, false);

        if (this.compatibility.supportsFullScreen)
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

        this.game.onResume.add(this._gameResumed, this);

        // Initialize core bounds

        this.dom.getOffset(this.game.canvas, this.offset);

        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

        this.setGameSize(this.game.width, this.game.height);

        // Don't use updateOrientationState so events are not fired
        this.screenOrientation = this.dom.getScreenOrientation(this.compatibility.orientationFallback);

    },

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

            rect.width = this.dom.visualBounds.width;
            rect.height = this.dom.visualBounds.height;

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

        this._gameSize.setTo(0, 0, newWidth, newHeight);

        this.grid = new Phaser.FlexGrid(this, newWidth, newHeight);

        this.updateDimensions(newWidth, newHeight, false);

    },

    /**
    * Invoked when the game is resumed.
    * 
    * @method Phaser.ScaleManager#_gameResumed
    * @private
    */
    _gameResumed: function () {

        this.queueUpdate(true);

    },

    /**
    * Set the actual Game size.
    * Use this instead of directly changing `game.width` or `game.height`.
    *
    * The actual physical display (Canvas element size) depends on various settings including
    * - Scale mode
    * - Scaling factor
    * - Size of Canvas's parent element or CSS rules such as min-height/max-height;
    * - The size of the Window
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
    * Set a User scaling factor used in the USER_SCALE scaling mode.
    *
    * The target canvas size is computed by:
    *
    *     canvas.width = (game.width * hScale) - hTrim
    *     canvas.height = (game.height * vScale) - vTrim
    *
    * This method can be used in the {@link Phaser.ScaleManager#setResizeCallback resize callback}.
    *
    * @method Phaser.ScaleManager#setUserScale
    * @param {number} hScale - Horizontal scaling factor.
    * @param {numer} vScale - Vertical scaling factor.
    * @param {integer} [hTrim=0] - Horizontal trim, applied after scaling.
    * @param {integer} [vTrim=0] - Vertical trim, applied after scaling.
    */
    setUserScale: function (hScale, vScale, hTrim, vTrim) {

        this._userScaleFactor.setTo(hScale, vScale);
        this._userScaleTrim.setTo(hTrim | 0, vTrim | 0);
        this.queueUpdate(true);

    },

    /**
    * Sets the callback that will be invoked before sizing calculations.
    *
    * This is the appropriate place to call `setUserScale` if needing custom dynamic scaling.
    *
    * The callback is supplied with two arguments `scale` and `parentBounds` where `scale` is the ScaleManager
    * and `parentBounds`, a Phaser.Rectangle, is the size of the Parent element.
    *
    * This callback
    * - May be invoked even though the parent container or canvas sizes have not changed
    * - Unlike `onSizeChange`, it runs _before_ the canvas is guaranteed to be updated
    * - Will be invoked from `preUpdate`, _even when_ the game is paused    
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
    * Signals a resize - IF the canvas or Game size differs from the last signal.
    *
    * This also triggers updates on `grid` (FlexGrid) and, if in a RESIZE mode, `game.state` (StateManager).
    *
    * @method Phaser.ScaleMager#signalSizeChange
    * @private
    */
    signalSizeChange: function () {

        if (!Phaser.Rectangle.sameDimensions(this, this._lastReportedCanvasSize) ||
            !Phaser.Rectangle.sameDimensions(this.game, this._lastReportedGameSize))
        {
            var width = this.width;
            var height = this.height;

            this._lastReportedCanvasSize.setTo(0, 0, width, height);
            this._lastReportedGameSize.setTo(0, 0, this.game.width, this.game.height);

            this.grid.onResize(width, height);

            this.onSizeChange.dispatch(this, width, height);

            // Per StateManager#onResizeCallback, it only occurs when in RESIZE mode.
            if (this.currentScaleMode === Phaser.ScaleManager.RESIZE)
            {
                this.game.state.resize(width, height);
                this.game.load.resize(width, height);
            }
        }

    },

    /**
    * Set the min and max dimensions for the Display canvas.
    * 
    * _Note:_ The min/max dimensions are only applied in some cases
    * - When the device is not in an incorrect orientation; or
    * - The scale mode is EXACT_FIT when not in fullscreen
    *
    * @method Phaser.ScaleManager#setMinMax
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

        if (this.game.time.time < (this._lastUpdate + this._updateThrottle))
        {
            return;
        }

        var prevThrottle = this._updateThrottle;
        this._updateThrottleReset = prevThrottle >= 400 ? 0 : 100;

        this.dom.getOffset(this.game.canvas, this.offset);

        var prevWidth = this._parentBounds.width;
        var prevHeight = this._parentBounds.height;
        var bounds = this.getParentBounds(this._parentBounds);

        var boundsChanged = bounds.width !== prevWidth || bounds.height !== prevHeight;

        // Always invalidate on a newly detected orientation change
        var orientationChanged = this.updateOrientationState();

        if (boundsChanged || orientationChanged)
        {
            if (this.onResize)
            {
                this.onResize.call(this.onResizeContext, this, bounds);
            }

            this.updateLayout();

            this.signalSizeChange();
        }

        // Next throttle, eg. 25, 50, 100, 200..
        var throttle = this._updateThrottle * 2;

        // Don't let an update be too eager about resetting the throttle.
        if (this._updateThrottle < prevThrottle)
        {
            throttle = Math.min(prevThrottle, this._updateThrottleReset);
        }

        this._updateThrottle = Phaser.Math.clamp(throttle, 25, this.trackParentInterval);
        this._lastUpdate = this.game.time.time;

    },

    /**
    * Update method while paused.
    *
    * @method Phaser.ScaleManager#pauseUpdate
    * @private
    */
    pauseUpdate: function () {

        this.preUpdate();

        // Updates at slowest.
        this._updateThrottle = this.trackParentInterval;
        
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
            //  Resize the renderer (which in turn resizes the Display canvas!)
            this.game.renderer.resize(this.width, this.height);

            //  The Camera can never be smaller than the Game size
            this.game.camera.setSize(this.width, this.height);

            //  This should only happen if the world is smaller than the new canvas size
            this.game.world.resize(this.width, this.height);
        }

    },

    /**
    * Update relevant scaling values based on the ScaleManager dimension and game dimensions,
    * which should already be set. This does not change `sourceAspectRatio`.
    * 
    * @method Phaser.ScaleManager#updateScalingAndBounds
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
            this.dom.getOffset(this.game.canvas, this.offset);
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
    * This enables generation of incorrect orientation signals and affects resizing but does not otherwise rotate or lock the orientation.
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
    * Classify the orientation, per `getScreenOrientation`.
    * 
    * @method Phaser.ScaleManager#classifyOrientation
    * @private
    * @param {string} orientation - The orientation string, e.g. 'portrait-primary'.
    * @return {?string} The classified orientation: 'portrait', 'landscape`, or null.
    */
    classifyOrientation: function (orientation) {

        if (orientation === 'portrait-primary' || orientation === 'portrait-secondary')
        {
            return 'portrait';
        }
        else if (orientation === 'landscape-primary' || orientation === 'landscape-secondary')
        {
            return 'landscape';
        }
        else
        {
            return null;
        }

    },

    /**
    * Updates the current orientation and dispatches orientation change events.
    * 
    * @method Phaser.ScaleManager#updateOrientationState
    * @private
    * @return {boolean} True if the orientation state changed which means a forced update is likely required.
    */
    updateOrientationState: function () {

        var previousOrientation = this.screenOrientation;
        var previouslyIncorrect = this.incorrectOrientation;
        
        this.screenOrientation = this.dom.getScreenOrientation(this.compatibility.orientationFallback);

        this.incorrectOrientation = (this.forceLandscape && !this.isLandscape) ||
            (this.forcePortrait && !this.isPortrait);

        var changed = previousOrientation !== this.screenOrientation;
        var correctnessChanged = previouslyIncorrect !== this.incorrectOrientation;

        if (changed)
        {
            if (this.isLandscape)
            {
                this.enterLandscape.dispatch(this.orientation, true, false);
            }
            else
            {
                this.enterPortrait.dispatch(this.orientation, false, true);
            }
        }

        if (correctnessChanged)
        {
            if (this.incorrectOrientation)
            {
                this.enterIncorrectOrientation.dispatch();
            }
            else
            {
                this.leaveIncorrectOrientation.dispatch();
            }
        }

        if (changed || correctnessChanged)
        {
            this.onOrientationChange.dispatch(this, previousOrientation, previouslyIncorrect);
        }

        return changed || correctnessChanged;

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

        this.queueUpdate(true);

    },

    /**
    * Scroll to the top - in some environments. See `compatibility.scrollTo`.
    * 
    * @method Phaser.ScaleManager#scrollTop
    * @private
    */
    scrollTop: function () {

        var scrollTo = this.compatibility.scrollTo;

        if (scrollTo)
        {
            window.scrollTo(scrollTo.x, scrollTo.y);
        }

    },

    /**
    * The `refresh` methods informs the ScaleManager that a layout refresh is required.
    *
    * The ScaleManager automatically queues a layout refresh (eg. updates the Game size or Display canvas layout)
    * when the browser is resized, the orientation changes, or when there is a detected change
    * of the Parent size. Refreshing is also done automatically when public properties,
    * such as `scaleMode`, are updated or state-changing methods are invoked.
    *
    * The `refresh` method _may_ need to be used in a few (rare) situtations when
    *
    * - a device change event is not correctly detected; or
    * - the Parent size changes (and an immediate reflow is desired); or
    * - the ScaleManager state is updated by non-standard means.
    *
    * The queued layout refresh is not immediate but will run promptly in an upcoming `preRender`.
    * 
    * @method Phaser.ScaleManager#refresh
    * @public
    */
    refresh: function () {

        this.scrollTop();
        this.queueUpdate(true);

    },

    /**
    * Updates the game / canvas position and size.
    *
    * @method Phaser.ScaleManager#updateLayout
    * @private
    */
    updateLayout: function () {

        var scaleMode = this.currentScaleMode;

        if (scaleMode === Phaser.ScaleManager.RESIZE)
        {
            this.reflowGame();
            return;
        }

        this.scrollTop();

        if (this.compatibility.forceMinimumDocumentHeight)
        {
            // (This came from older code, by why is it here?)
            // Set minimum height of content to new window height
            document.documentElement.style.minHeight = window.innerHeight + 'px';
        }
        
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
                if (!this.isFullScreen && this.boundingParent &&
                    this.compatibility.canExpandParent)
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
            else if (scaleMode === Phaser.ScaleManager.USER_SCALE)
            {
                this.width = (this.game.width * this._userScaleFactor.x) - this._userScaleTrim.x;
                this.height = (this.game.height * this._userScaleFactor.y) - this._userScaleTrim.y;
            }
        }

        if (!this.compatibility.canExpandParent &&
            (scaleMode === Phaser.ScaleManager.SHOW_ALL || scaleMode === Phaser.ScaleManager.USER_SCALE))
        {
            var bounds = this.getParentBounds(this._tempBounds);
            this.width = Math.min(this.width, bounds.width);
            this.height = Math.min(this.height, bounds.height);
        }

        // Always truncate / force to integer
        this.width = this.width | 0;
        this.height = this.height | 0;

        this.reflowCanvas();

    },

    /**
    * Returns the computed Parent size/bounds that the Display canvas is allowed/expected to fill.
    *
    * If in fullscreen mode or without parent (see {@link Phaser.ScaleManager#parentIsWindow parentIsWindow}),
    * this will be the bounds of the visual viewport itself.
    *
    * This function takes the `windowConstraints` into consideration - if the parent is partially outside
    * the viewport then this function may return a smaller than expected size.
    *
    * Values are rounded to the nearest pixel.
    *
    * @method Phaser.ScaleManager#getParentBounds
    * @protected
    * @param {Phaser.Rectangle} [target=(new Rectangle)] - The rectangle to update; a new one is created as needed.
    * @return {Phaser.Rectangle} The established parent bounds.
    */
    getParentBounds: function (target) {

        var bounds = target || new Phaser.Rectangle();
        var parentNode = this.boundingParent;
        var visualBounds = this.dom.visualBounds;
        var layoutBounds = this.dom.layoutBounds;

        if (!parentNode)
        {
            bounds.setTo(0, 0, visualBounds.width, visualBounds.height);
        }
        else
        {
            // Ref. http://msdn.microsoft.com/en-us/library/hh781509(v=vs.85).aspx for getBoundingClientRect
            var clientRect = parentNode.getBoundingClientRect();

            bounds.setTo(clientRect.left, clientRect.top, clientRect.width, clientRect.height);

            var wc = this.windowConstraints;

            if (wc.right)
            {
                var windowBounds = wc.right === 'layout' ? layoutBounds : visualBounds;
                bounds.right = Math.min(bounds.right, windowBounds.width);
            }

            if (wc.bottom)
            {
                var windowBounds = wc.bottom === 'layout' ? layoutBounds : visualBounds;
                bounds.bottom = Math.min(bounds.bottom, windowBounds.height);
            }
        }

        bounds.setTo(
            Math.round(bounds.x), Math.round(bounds.y),
            Math.round(bounds.width), Math.round(bounds.height));

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

        var parentBounds = this.getParentBounds(this._tempBounds);
        var canvas = this.game.canvas;
        var margin = this.margin;

        if (horizontal)
        {
            margin.left = margin.right = 0;

            var canvasBounds = canvas.getBoundingClientRect();

            if (this.width < parentBounds.width && !this.incorrectOrientation)
            {
                var currentEdge = canvasBounds.left - parentBounds.x;
                var targetEdge = (parentBounds.width / 2) - (this.width / 2);

                targetEdge = Math.max(targetEdge, 0);

                var offset = targetEdge - currentEdge;

                margin.left = Math.round(offset);
            }

            canvas.style.marginLeft = margin.left + 'px';

            if (margin.left !== 0)
            {
                margin.right = -(parentBounds.width - canvasBounds.width - margin.left);
                canvas.style.marginRight = margin.right + 'px';
            }
        }

        if (vertical)
        {
            margin.top = margin.bottom = 0;

            var canvasBounds = canvas.getBoundingClientRect();
            
            if (this.height < parentBounds.height && !this.incorrectOrientation)
            {
                var currentEdge = canvasBounds.top - parentBounds.y;
                var targetEdge = (parentBounds.height / 2) - (this.height / 2);

                targetEdge = Math.max(targetEdge, 0);
                
                var offset = targetEdge - currentEdge;
                margin.top = Math.round(offset);
            }

            canvas.style.marginTop = margin.top + 'px';

            if (margin.top !== 0)
            {
                margin.bottom = -(parentBounds.height - canvasBounds.height - margin.top);
                canvas.style.marginBottom = margin.bottom + 'px';
            }
        }

        // Silly backwards compatibility..
        margin.x = margin.left;
        margin.y = margin.top;

    },

    /**
    * Updates the Game state / size.
    *
    * The canvas margins may always be adjusted, even if alignment is not in effect.
    * 
    * @method Phaser.ScaleManager#reflowGame
    * @private
    */
    reflowGame: function () {

        this.resetCanvas('', '');

        var bounds = this.getParentBounds(this._tempBounds);
        this.updateDimensions(bounds.width, bounds.height, true);

    },

    /**
    * Updates the Display canvas size.
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

        if (!this.compatibility.noMargins)
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
    * "Reset" the Display canvas and set the specified width/height.
    *
    * @method Phaser.ScaleManager#resetCanvas
    * @private
    * @param {string} [cssWidth=(current width)] - The css width to set.
    * @param {string} [cssHeight=(current height)] - The css height to set.
    */
    resetCanvas: function (cssWidth, cssHeight) {

        if (typeof cssWidth === 'undefined') { cssWidth = this.width + 'px'; }
        if (typeof cssHeight === 'undefined') { cssHeight = this.height + 'px'; }

        var canvas = this.game.canvas;

        if (!this.compatibility.noMargins)
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
    *
    * @method Phaser.ScaleManager#queueUpdate
    * @private
    * @param {boolean} force - If true resets the parent bounds to ensure the check is dirty.
    */
    queueUpdate: function (force) {

        if (force)
        {
            this._parentBounds.width = 0;
            this._parentBounds.height = 0;
        }

        this._updateThrottle = this._updateThrottleReset;

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

        this.width = this.dom.visualBounds.width;
        this.height = this.dom.visualBounds.height;

    },

    /**
    * Updates the width/height such that the game is scaled proportionally.
    * 
    * @method Phaser.ScaleManager#setShowAll
    * @private
    * @param {boolean} expanding - If true then the maximizing dimension is chosen.
    */
    setShowAll: function (expanding) {

        var bounds = this.getParentBounds(this._tempBounds);
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
    * Honors `maxWidth` and `maxHeight` when _not_ in fullscreen.
    *
    * @method Phaser.ScaleManager#setExactFit
    * @private
    */
    setExactFit: function () {

        var bounds = this.getParentBounds(this._tempBounds);

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
    * Creates a fullscreen target. This is called automatically as as needed when entering
    * fullscreen mode and the resulting element is supplied to `onFullScreenInit`.
    *
    * Use {@link Phaser.ScaleManager#onFullScreenInit onFullScreenInit} to customize the created object.
    *
    * @method Phaser.ScaleManager#createFullScreenTarget
    * @protected
    */
    createFullScreenTarget: function () {

        var fsTarget = document.createElement('div');

        fsTarget.style.margin = '0';
        fsTarget.style.padding = '0';
        fsTarget.style.background = '#000';

        return fsTarget;

    },

    /**
    * Start the browsers fullscreen mode - this _must_ be called from a user input Pointer or Mouse event.
    *
    * The Fullscreen API must be supported by the browser for this to work - it is not the same as setting
    * the game size to fill the browser window. See `compatibility.supportsFullScreen` to check if the current
    * device is reported to support fullscreen mode.
    *
    * The `fullScreenFailed` signal will be dispatched if the fullscreen change request failed or the game does not support the Fullscreen API.
    *
    * @method Phaser.ScaleManager#startFullScreen
    * @public
    * @param {boolean} [antialias] - Changes the anti-alias feature of the canvas before jumping in to fullscreen (false = retain pixel art, true = smooth art). If not specified then no change is made. Only works in CANVAS mode.
    * @param {boolean} [allowTrampoline=undefined] - Internal argument. If `false` click trampolining is suppressed.
    * @return {boolean} Returns true if the device supports fullscreen mode and fullscreen mode was attempted to be started. (It might not actually start, wait for the signals.)
    */
    startFullScreen: function (antialias, allowTrampoline) {

        if (this.isFullScreen)
        {
            return false;
        }

        if (!this.compatibility.supportsFullScreen)
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

        if (input.activePointer !== input.mousePointer && (allowTrampoline || allowTrampoline !== false))
        {
            input.activePointer.addClickTrampoline("startFullScreen", this.startFullScreen, this, [antialias, false]);
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
        }

        var initData = {
            targetElement: fsTarget
        };

        this.onFullScreenInit.dispatch(this, initData);

        if (this._createdFullScreenTarget)
        {
            // Move the Display canvas inside of the target and add the target to the DOM
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
    * Stops / exits fullscreen mode, if active.
    *
    * @method Phaser.ScaleManager#stopFullScreen
    * @public
    * @return {boolean} Returns true if the browser supports fullscreen mode and fullscreen mode will be exited.
    */
    stopFullScreen: function () {

        if (!this.isFullScreen || !this.compatibility.supportsFullScreen)
        {
            return false;
        }

        document[this.game.device.cancelFullscreen]();

        return true;

    },

    /**
    * Cleans up the previous fullscreen target, if such was automatically created.
    * This ensures the canvas is restored to its former parent, assuming the target didn't move.
    *
    * @method Phaser.ScaleManager#cleanupCreatedTarget
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
        }

        this._createdFullScreenTarget = null;

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
                    this._fullScreenRestore = {
                        targetWidth: fsTarget.style.width,
                        targetHeight: fsTarget.style.height
                    };

                    fsTarget.style.width = '100%';
                    fsTarget.style.height = '100%';
                }
            }
        }
        else
        {
            // Have restore information
            if (this._fullScreenRestore)
            {
                fsTarget.style.width = this._fullScreenRestore.targetWidth;
                fsTarget.style.height = this._fullScreenRestore.targetHeight;

                this._fullScreenRestore = null;
            }

            // Always reset to game size
            this.updateDimensions(this._gameSize.width, this._gameSize.height, true);
            this.resetCanvas();
        }

    },

    /**
    * Called automatically when the browser enters of leaves fullscreen mode.
    *
    * @method Phaser.ScaleManager#fullScreenChange
    * @private
    * @param {Event} [event=undefined] - The fullscreenchange event
    */
    fullScreenChange: function (event) {

        this.event = event;

        if (this.isFullScreen)
        {
            this.prepScreenMode(true);

            this.updateLayout();
            this.queueUpdate(true);

            this.enterFullScreen.dispatch(this.width, this.height);
        }
        else
        {
            this.prepScreenMode(false);

            this.cleanupCreatedTarget();

            this.updateLayout();
            this.queueUpdate(true);

            this.leaveFullScreen.dispatch(this.width, this.height);
        }

        this.onFullScreenChange.dispatch(this);

    },

    /**
    * Called automatically when the browser fullscreen request fails;
    * or called when a fullscreen request is made on a device for which it is not supported.
    *
    * @method Phaser.ScaleManager#fullScreenError
    * @private
    * @param {Event} [event=undefined] - The fullscreenerror event; undefined if invoked on a device that does not support the Fullscreen API.
    */
    fullScreenError: function (event) {

        this.event = event;

        this.cleanupCreatedTarget();

        console.warn('Phaser.ScaleManager: requestFullscreen failed or device does not support the Fullscreen API');

        this.onFullScreenError.dispatch(this);

    },

    /**
    * Takes a Sprite or Image object and scales it to fit the given dimensions.
    * Scaling happens proportionally without distortion to the sprites texture.
    * The letterBox parameter controls if scaling will produce a letter-box effect or zoom the
    * sprite until it fills the given values. Note that with letterBox set to false the scaled sprite may spill out over either
    * the horizontal or vertical sides of the target dimensions. If you wish to stop this you can crop the Sprite.
    *
    * @method Phaser.ScaleManager#scaleSprite
    * @protected
    * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite we want to scale.
    * @param {integer} [width] - The target width that we want to fit the sprite in to. If not given it defaults to ScaleManager.width.
    * @param {integer} [height] - The target height that we want to fit the sprite in to. If not given it defaults to ScaleManager.height.
    * @param {boolean} [letterBox=false] - True if we want the `fitted` mode. Otherwise, the function uses the `zoom` mode.
    * @return {Phaser.Sprite|Phaser.Image} The scaled sprite.
    */
    scaleSprite: function (sprite, width, height, letterBox) {

        if (typeof width === 'undefined') { width = this.width; }
        if (typeof height === 'undefined') { height = this.height; }
        if (typeof letterBox === 'undefined') { letterBox = false; }

        sprite.scale.set(1);

        if ((sprite.width <= 0) || (sprite.height <= 0) || (width <= 0) || (height <= 0))
        {
            return sprite;
        }

        var scaleX1 = width;
        var scaleY1 = (sprite.height * width) / sprite.width;

        var scaleX2 = (sprite.width * height) / sprite.height;
        var scaleY2 = height;

        var scaleOnWidth = (scaleX2 > width);

        if (scaleOnWidth)
        {
            scaleOnWidth = letterBox;
        }
        else
        {
            scaleOnWidth = !letterBox;
        }

        if (scaleOnWidth)
        {
            sprite.width = Math.floor(scaleX1);
            sprite.height = Math.floor(scaleY1);
        }
        else
        {
            sprite.width = Math.floor(scaleX2);
            sprite.height = Math.floor(scaleY2);
        }

        //  Enable at some point?
        // sprite.x = Math.floor((width - sprite.width) / 2);
        // sprite.y = Math.floor((height - sprite.height) / 2);

        return sprite;

    },

    /**
    * Destroys the ScaleManager and removes any event listeners.
    * This should probably only be called when the game is destroyed.
    *
    * @method Phaser.ScaleManager#destroy
    * @protected
    */
    destroy: function () {

        this.game.onResume.remove(this._gameResumed, this);

        window.removeEventListener('orientationchange', this._orientationChange, false);
        window.removeEventListener('resize', this._windowResize, false);

        if (this.compatibility.supportsFullScreen)
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
* @deprecated 2.2.0 - This method is INTERNAL: avoid using it directly.
*/
Phaser.ScaleManager.prototype.checkResize = Phaser.ScaleManager.prototype.windowResize;

/**
* window.orientationchange event handler.
* @method checkOrientation
* @memberof Phaser.ScaleManager
* @protected
* @deprecated 2.2.0 - This method is INTERNAL: avoid using it directly.
*/
Phaser.ScaleManager.prototype.checkOrientation = Phaser.ScaleManager.prototype.orientationChange;

/**
* Updates the size of the Game or the size/position of the Display canvas based on internal state.
*
* Do not call this directly. To "refresh" the layout use {@link Phaser.ScaleManager#refresh refresh}.
* To precisely control the scaling/size, apply appropriate rules to the bounding Parent container or
* use the {@link Phaser.ScaleManager#scaleMode USER_SCALE scale mode}.
*
* @method Phaser.ScaleManager#setScreenSize
* @protected
* @deprecated 2.2.0 - This method is INTERNAL: avoid using it directly.
*/
Phaser.ScaleManager.prototype.setScreenSize = Phaser.ScaleManager.prototype.updateLayout;

/**
* Updates the size/position of the Display canvas based on internal state.
*
* Do not call this directly. To "refresh" the layout use {@link Phaser.ScaleManager#refresh refresh}.
* To precisely control the scaling/size, apply appropriate rules to the bounding Parent container or
* use the {@link Phaser.ScaleManager#scaleMode USER_SCALE scale mode}.
*
* @method setSize
* @memberof Phaser.ScaleManager
* @protected
* @deprecated 2.2.0 - This method is INTERNAL: avoid using it directly.
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
* @deprecated 2.2.0 - This is only for backward compatibility of user code.
*/
Phaser.ScaleManager.prototype.checkOrientationState = function () {

    var changed = this.updateOrientationState();
    if (changed)
    {
        this.refresh();
    }
    return changed;

};

/**
* The DOM element that is considered the Parent bounding element, if any.
*
* This `null` if `parentIsWindow` is true or if fullscreen mode is entered and `fullScreenTarget` is specified.
* It will also be null if there is no game canvas or if the game canvas has no parent.
*
* @name Phaser.ScaleManager#boundingParent
* @property {?DOMElement} boundingParent
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "boundingParent", {

    get: function () {
        if (this.parentIsWindow ||
            (this.isFullScreen && !this._createdFullScreenTarget))
        {
            return null;
        }

        var parentNode = this.game.canvas && this.game.canvas.parentNode;
        return parentNode || null;
    }

});

/**
* The scaling method used by the ScaleManager when not in fullscreen.
* 
* <dl>
*   <dt>{@link Phaser.ScaleManager.NO_SCALE}</dt>
*   <dd>
*       The Game display area will not be scaled - even if it is too large for the canvas/screen.
*       This mode _ignores_ any applied scaling factor and displays the canvas at the Game size.
*   </dd>
*   <dt>{@link Phaser.ScaleManager.EXACT_FIT}</dt>
*   <dd>
*       The Game display area will be _stretched_ to fill the entire size of the canvas's parent element and/or screen.
*       Proportions are not mainted.
*   </dd>
*   <dt>{@link Phaser.ScaleManager.SHOW_ALL}</dt>
*   <dd>
*       Show the entire game display area while _maintaining_ the original aspect ratio.
*   </dd>
*   <dt>{@link Phaser.ScaleManager.RESIZE}</dt>
*   <dd>
*       The dimensions of the game display area are changed to match the size of the parent container.
*       That is, this mode _changes the Game size_ to match the display size.
*       <p>
*       Any manually set Game size (see `setGameSize`) is ignored while in effect.
*   </dd>
*   <dt>{@link Phaser.ScaleManager.USER_SCALE}</dt>
*   <dd>
*       The game Display is scaled according to the user-specified scale set by {@link Phaser.ScaleManager#setUserScale setUserScale}.
*       <p>
*       This scale can be adjusted in the {@link Phaser.ScaleManager#setResizeCallback resize callback}
*       for flexible custom-sizing needs.
*   </dd>
* </dl>
*
* @name Phaser.ScaleManager#scaleMode
* @property {integer} scaleMode
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
* The scaling method used by the ScaleManager when in fullscreen.
*
* See {@link Phaser.ScaleManager#scaleMode scaleMode} for the different modes allowed.
*
* @name Phaser.ScaleManager#fullScreenScaleMode
* @property {integer} fullScreenScaleMode
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
* See {@link Phaser.ScaleManager#scaleMode scaleMode} for the different modes allowed.
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
* If true then the Display canvas will be horizontally-aligned _in the parent container_.
*
* To align across the page the Display canvas should be added directly to page;
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
* If true then the Display canvas will be vertically-aligned _in the parent container_.
*
* To align across the page the Display canvas should be added directly to page;
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
* Returns true if the browser is in fullscreen mode, otherwise false.
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
* Returns true if the browser is in portrait mode.
*
* @name Phaser.ScaleManager#isPortrait
* @property {boolean} isPortrait
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "isPortrait", {

    get: function () {
        return this.classifyOrientation(this.screenOrientation) === 'portrait';
    }

});

/**
* Returns true if the browser is in landscape mode.
*
* @name Phaser.ScaleManager#isLandscape
* @property {boolean} isLandscape
* @readonly
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "isLandscape", {

    get: function () {
        return this.classifyOrientation(this.screenOrientation) === 'landscape';
    }

});

/**
* The _last known_ orientation value of the game. A value of 90 is landscape and 0 is portrait.
* @name Phaser.ScaleManager#orientation
* @property {integer} orientation
* @readonly
* @deprecated 2.2.0 - Use `ScaleManager.screenOrientation` instead.
*/
Object.defineProperty(Phaser.ScaleManager.prototype, "orientation", {

    get: function ()
    {
        return (this.classifyOrientation(this.screenOrientation) === 'portrait' ? 0 : 90);
    }

});
