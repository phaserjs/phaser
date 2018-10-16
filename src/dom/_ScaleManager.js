/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('../math/Clamp');
var Class = require('../utils/Class');
var CONST = require('./const');
var GetOffset = require('./GetOffset');
var GetScreenOrientation = require('./GetScreenOrientation');
var LayoutBounds = require('./LayoutBounds');
var Rectangle = require('../geom/rectangle/Rectangle');
var SameDimensions = require('../geom/rectangle/SameDimensions');
var Vec2 = require('../math/Vector2');
var VisualBounds = require('./VisualBounds');

/**
 * @classdesc
 * [description]
 *
 * @class ScaleManager
 * @memberof Phaser.DOM
 * @constructor
 * @since 3.15.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance.
 * @param {any} config
 */
var ScaleManager = new Class({

    initialize:

    function ScaleManager (game, config)
    {
        /**
         * A reference to the Phaser.Game instance.
         *
         * @name Phaser.DOM.ScaleManager#game
         * @type {Phaser.Game}
         * @readonly
         * @since 3.15.0
         */
        this.game = game;

        this.config = config;

        this.width = 0;

        this.height = 0;

        this.minWidth = null;

        this.maxWidth = null;

        this.minHeight = null;

        this.maxHeight = null;

        this.offset = new Vec2();

        this.forceLandscape = false;

        this.forcePortrait = false;

        this.incorrectOrientation = false;

        this._pageAlignHorizontally = false;

        this._pageAlignVertically = false;

        this.hasPhaserSetFullScreen = false;

        this.fullScreenTarget = null;

        this._createdFullScreenTarget = null;

        this.screenOrientation;

        this.scaleFactor = new Vec2(1, 1);

        this.scaleFactorInversed = new Vec2(1, 1);

        this.margin = { left: 0, top: 0, right: 0, bottom: 0, x: 0, y: 0 };

        this.bounds = new Rectangle();

        this.aspectRatio = 0;

        this.sourceAspectRatio = 0;

        this.event = null;

        this.windowConstraints = {
            right: 'layout',
            bottom: ''
        };

        this.compatibility = {
            supportsFullScreen: false,
            orientationFallback: null,
            noMargins: false,
            scrollTo: null,
            canExpandParent: true,
            clickTrampoline: ''
        };

        this._scaleMode = Phaser.ScaleManager.NO_SCALE;

        this._fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

        this.parentIsWindow = false;

        this.parentNode = null;

        this.parentScaleFactor = new Vec2(1, 1);

        this.trackParentInterval = 2000;

        this.onResize = null;

        this.onResizeContext = null;

        this._pendingScaleMode = game.config.scaleMode;

        this._fullScreenRestore = null;

        this._gameSize = new Rectangle();

        this._userScaleFactor = new Vec2(1, 1);

        this._userScaleTrim = new Vec2(0, 0);

        this._lastUpdate = 0;

        this._updateThrottle = 0;

        this._updateThrottleReset = 1000;

        this._parentBounds = new Rectangle();

        this._tempBounds = new Rectangle();

        this._lastReportedCanvasSize = new Rectangle();

        this._lastReportedGameSize = new Rectangle();

        this._booted = false;
    },

    preBoot: function ()
    {
        console.log('%c preBoot ', 'background: #000; color: #ffff00');

        // Configure device-dependent compatibility

        var game = this.game;
        var device = game.device;
        var os = game.device.os;
        var compat = this.compatibility;

        compat.supportsFullScreen = device.fullscreen.available && !os.cocoonJS;

        //  We can't do anything about the status bars in iPads, web apps or desktops
        if (!os.iPad && !os.webApp && !os.desktop)
        {
            if (os.android && !device.browser.chrome)
            {
                compat.scrollTo = new Vec2(0, 1);
            }
            else
            {
                compat.scrollTo = new Vec2(0, 0);
            }
        }

        if (os.desktop)
        {
            compat.orientationFallback = 'screen';
            compat.clickTrampoline = 'when-not-mouse';
        }
        else
        {
            compat.orientationFallback = '';
            compat.clickTrampoline = '';
        }

        //  Configure event listeners

        var _this = this;

        this._orientationChange = function (event)
        {
            return _this.orientationChange(event);
        };

        this._windowResize = function (event)
        {
            return _this.windowResize(event);
        };

        window.addEventListener('orientationchange', this._orientationChange, false);
        window.addEventListener('resize', this._windowResize, false);

        if (compat.supportsFullScreen)
        {
            this._fullScreenChange = function (event)
            {
                return _this.fullScreenChange(event);
            };

            this._fullScreenError = function (event)
            {
                return _this.fullScreenError(event);
            };

            var vendors = [ 'webkit', 'moz', '' ];

            vendors.forEach(function (prefix)
            {
                document.addEventListener(prefix + 'fullscreenchange', this._fullScreenChange, false);
                document.addEventListener(prefix + 'fullscreenerror', this._fullScreenError, false);
            });

            //  MS Specific
            document.addEventListener('MSFullscreenChange', this._fullScreenChange, false);
            document.addEventListener('MSFullscreenError', this._fullScreenError, false);
        }

        //  Set-up the Bounds
        var isDesktop = os.desktop && (document.documentElement.clientWidth <= window.innerWidth) && (document.documentElement.clientHeight <= window.innerHeight);

        console.log('isDesktop', isDesktop, os.desktop);

        VisualBounds.init(isDesktop);
        LayoutBounds.init(isDesktop);

        this.setupScale(game.config.width, game.config.height);

        //  Same as calling setGameSize:
        this._gameSize.setTo(0, 0, game.config.width, game.config.height);

        game.events.once('boot', this.boot, this);
    },

    //  Called once added to the DOM, not before
    boot: function ()
    {
        console.log('%c boot ', 'background: #000; color: #ffff00', this.width, this.height);

        var game = this.game;
        var compat = this.compatibility;

        // Initialize core bounds

        GetOffset(game.canvas, this.offset);

        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

        //  Don't use updateOrientationState so events are not fired
        this.screenOrientation = GetScreenOrientation(compat.orientationFallback);

        this._booted = true;

        if (this._pendingScaleMode !== null)
        {
            this.scaleMode = this._pendingScaleMode;

            this._pendingScaleMode = null;
        }

        this.updateLayout();

        this.signalSizeChange();

        //  Make sure to sync the parent bounds to the current local rect, or we'll expand forever
        this.getParentBounds(this._parentBounds);

        game.events.on('resume', this.gameResumed, this);
        game.events.on('prestep', this.step, this);
    },

    setupScale: function (width, height)
    {
        console.log('%c setupScale ', 'background: #000; color: #ffff00', width, height);

        var target;
        var rect = new Rectangle();

        var parent = this.config.parent;

        if (parent !== '')
        {
            if (typeof parent === 'string')
            {
                //  Hopefully an element ID
                target = document.getElementById(parent);
            }
            else if (parent && parent.nodeType === 1)
            {
                //  Quick test for a HTMLElement
                target = parent;
            }
        }

        //  Fallback, covers an invalid ID and a non HTMLElement object
        if (!target)
        {
            //  Use the full window
            this.parentNode = null;
            this.parentIsWindow = true;

            rect.width = VisualBounds.width;
            rect.height = VisualBounds.height;

            console.log('parentIsWindow', VisualBounds.width, VisualBounds.height);

            this.offset.set(0, 0);
        }
        else
        {
            this.parentNode = target;
            this.parentIsWindow = false;

            this.getParentBounds(this._parentBounds, this.parentNode);

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

        newWidth = Math.floor(newWidth);
        newHeight = Math.floor(newHeight);

        this._gameSize.setTo(0, 0, newWidth, newHeight);

        this.updateDimensions(newWidth, newHeight, false);

        console.log('pn', this.parentNode);
        console.log('pw', this.parentIsWindow);
        console.log('pb', this._parentBounds);
        console.log('new size', newWidth, newHeight);
    },

    setGameSize: function (width, height)
    {
        console.log('%c setGameSize ', 'background: #000; color: #ffff00', width, height);

        this._gameSize.setTo(0, 0, width, height);

        if (this.currentScaleMode !== CONST.RESIZE)
        {
            this.updateDimensions(width, height, true);
        }

        this.queueUpdate(true);
    },

    setUserScale: function (hScale, vScale, hTrim, vTrim, queueUpdate, force)
    {
        if (hTrim === undefined) { hTrim = 0; }
        if (vTrim === undefined) { vTrim = 0; }
        if (queueUpdate === undefined) { queueUpdate = true; }
        if (force === undefined) { force = true; }

        this._userScaleFactor.setTo(hScale, vScale);
        this._userScaleTrim.setTo(hTrim, vTrim);

        if (queueUpdate)
        {
            this.queueUpdate(force);
        }
    },

    gameResumed: function ()
    {
        this.queueUpdate(true);
    },

    setResizeCallback: function (callback, context)
    {
        this.onResize = callback;
        this.onResizeContext = context;
    },

    signalSizeChange: function ()
    {
        if (!SameDimensions(this, this._lastReportedCanvasSize) || !SameDimensions(this.game, this._lastReportedGameSize))
        {
            var width = this.width;
            var height = this.height;

            this._lastReportedCanvasSize.setTo(0, 0, width, height);
            this._lastReportedGameSize.setTo(0, 0, this.game.config.width, this.game.config.height);

            // this.onSizeChange.dispatch(this, width, height);

            //  Per StateManager#onResizeCallback, it only occurs when in RESIZE mode.
            if (this.currentScaleMode === CONST.RESIZE)
            {
                this.game.resize(width, height);
            }
        }
    },

    setMinMax: function (minWidth, minHeight, maxWidth, maxHeight)
    {
        this.minWidth = minWidth;
        this.minHeight = minHeight;

        if (maxWidth)
        {
            this.maxWidth = maxWidth;
        }

        if (maxHeight)
        {
            this.maxHeight = maxHeight;
        }
    },

    step: function (time)
    {
        if (time < (this._lastUpdate + this._updateThrottle))
        {
            return;
        }

        var prevThrottle = this._updateThrottle;

        this._updateThrottleReset = (prevThrottle >= 400) ? 0 : 100;

        GetOffset(this.game.canvas, this.offset);

        var prevWidth = this._parentBounds.width;
        var prevHeight = this._parentBounds.height;

        var bounds = this.getParentBounds(this._parentBounds);

        var boundsChanged = (bounds.width !== prevWidth || bounds.height !== prevHeight);

        //  Always invalidate on a newly detected orientation change
        var orientationChanged = this.updateOrientationState();

        if (boundsChanged || orientationChanged)
        {
            console.log('%c   bc    ', 'background: #000; color: #ffff00', boundsChanged, bounds.width, prevWidth, bounds.height, prevHeight);

            if (this.onResize)
            {
                this.onResize.call(this.onResizeContext, this, bounds);
            }

            this.updateLayout();

            this.signalSizeChange();

            //  Make sure to sync the parent bounds to the current local rect, or we'll expand forever
            this.getParentBounds(this._parentBounds);

            console.log('%c   new bounds    ', 'background: #000; color: #ffff00', this._parentBounds.width, this._parentBounds.height);
        }

        //  Next throttle, eg. 25, 50, 100, 200...
        var throttle = this._updateThrottle * 2;

        //  Don't let an update be too eager about resetting the throttle.
        if (this._updateThrottle < prevThrottle)
        {
            throttle = Math.min(prevThrottle, this._updateThrottleReset);
        }

        this._updateThrottle = Clamp(throttle, 25, this.trackParentInterval);

        this._lastUpdate = time;
    },

    updateDimensions: function (width, height, resize)
    {
        this.width = width * this.parentScaleFactor.x;
        this.height = height * this.parentScaleFactor.y;

        this.config.width = this.width;
        this.config.height = this.height;

        this.sourceAspectRatio = this.width / this.height;

        this.updateScalingAndBounds();

        if (resize)
        {
            this.game.resize(this.width, this.height);
        }
    },

    updateScalingAndBounds: function ()
    {
        var game = this.game;
        var config = this.config;

        this.scaleFactor.x = config.width / this.width;
        this.scaleFactor.y = config.height / this.height;

        this.scaleFactorInversed.x = this.width / config.width;
        this.scaleFactorInversed.y = this.height / config.height;

        this.aspectRatio = this.width / this.height;

        //  This can be invoked in boot pre-canvas
        if (game.canvas)
        {
            GetOffset(game.canvas, this.offset);
        }

        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

        //  Can be invoked in boot pre-input
        if (game.input && game.input.scale)
        {
            // game.input.scale.setTo(this.scaleFactor.x, this.scaleFactor.y);
        }
    },

    forceLandscape: function ()
    {
        this.forceLandscape = true;
        this.forcePortrait = false;

        this.queueUpdate(true);
    },

    forcePortrait: function ()
    {
        this.forceLandscape = false;
        this.forcePortrait = true;

        this.queueUpdate(true);

    },

    classifyOrientation: function (orientation)
    {
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

    updateOrientationState: function ()
    {
        var previousOrientation = this.screenOrientation;
        var previouslyIncorrect = this.incorrectOrientation;

        this.screenOrientation = GetScreenOrientation(this.compatibility.orientationFallback);

        this.incorrectOrientation = (this.forceLandscape && !this.isLandscape) || (this.forcePortrait && !this.isPortrait);

        var changed = (previousOrientation !== this.screenOrientation);
        var correctnessChanged = (previouslyIncorrect !== this.incorrectOrientation);

        if (correctnessChanged)
        {
            if (this.incorrectOrientation)
            {
                // this.enterIncorrectOrientation.dispatch();
            }
            else
            {
                // this.leaveIncorrectOrientation.dispatch();
            }
        }

        if (changed || correctnessChanged)
        {
            // this.onOrientationChange.dispatch(this, previousOrientation, previouslyIncorrect);
        }

        return (changed || correctnessChanged);
    },

    orientationChange: function (event)
    {
        this.event = event;

        this.queueUpdate(true);
    },

    windowResize: function (event)
    {
        this.event = event;

        this.queueUpdate(true);
    },

    scrollTop: function ()
    {
        var scrollTo = this.compatibility.scrollTo;

        if (scrollTo)
        {
            window.scrollTo(scrollTo.x, scrollTo.y);
        }
    },

    refresh: function ()
    {
        this.scrollTop();

        this.queueUpdate(true);
    },

    updateLayout: function ()
    {
        var scaleMode = this.currentScaleMode;

        if (scaleMode === CONST.RESIZE)
        {
            this.reflowGame();
            return;
        }

        this.scrollTop();

        if (this.incorrectOrientation)
        {
            this.setMaximum();
        }
        else if (scaleMode === CONST.EXACT_FIT)
        {
            this.setExactFit();
        }
        else if (scaleMode === CONST.SHOW_ALL)
        {
            if (!this.isFullScreen && this.boundingParent && this.compatibility.canExpandParent)
            {
                //  Try to expand parent out, but choosing maximizing dimensions.
                //  Then select minimize dimensions which should then honor parent maximum bound applications.
                this.setShowAll(true);
                this.resetCanvas();
                this.setShowAll();
            }
            else
            {
                this.setShowAll();
            }
        }
        else if (scaleMode === CONST.NO_SCALE)
        {
            this.width = this.config.width;
            this.height = this.config.height;
        }
        else if (scaleMode === CONST.USER_SCALE)
        {
            this.width = (this.config.width * this._userScaleFactor.x) - this._userScaleTrim.x;
            this.height = (this.config.height * this._userScaleFactor.y) - this._userScaleTrim.y;
        }

        if (!this.compatibility.canExpandParent && (scaleMode === CONST.SHOW_ALL || scaleMode === CONST.USER_SCALE))
        {
            var bounds = this.getParentBounds(this._tempBounds);

            this.width = Math.min(this.width, bounds.width);
            this.height = Math.min(this.height, bounds.height);
        }

        //  Always truncate / force to integer
        this.width = this.width | 0;
        this.height = this.height | 0;

        this.reflowCanvas();
    },

    getParentBounds: function (bounds, parentNode)
    {
        // console.log('%c getParentBounds ', 'background: #000; color: #ff00ff');

        if (bounds === undefined) { bounds = new Rectangle(); }
        if (parentNode === undefined) { parentNode = this.boundingParent; }

        var visualBounds = VisualBounds;
        var layoutBounds = LayoutBounds;

        if (!parentNode)
        {
            bounds.setTo(0, 0, visualBounds.width, visualBounds.height);
            // console.log('b1', bounds);
        }
        else
        {
            //  Ref. http://msdn.microsoft.com/en-us/library/hh781509(v=vs.85).aspx for getBoundingClientRect
            var clientRect = parentNode.getBoundingClientRect();
            var parentRect = (parentNode.offsetParent) ? parentNode.offsetParent.getBoundingClientRect() : parentNode.getBoundingClientRect();

            bounds.setTo(clientRect.left - parentRect.left, clientRect.top - parentRect.top, clientRect.width, clientRect.height);

            var wc = this.windowConstraints;
            var windowBounds;

            if (wc.right)
            {
                windowBounds = (wc.right === 'layout') ? layoutBounds : visualBounds;
                bounds.right = Math.min(bounds.right, windowBounds.width);
            }

            if (wc.bottom)
            {
                windowBounds = (wc.bottom === 'layout') ? layoutBounds : visualBounds;
                bounds.bottom = Math.min(bounds.bottom, windowBounds.height);
            }
        }

        bounds.setTo(Math.round(bounds.x), Math.round(bounds.y), Math.round(bounds.width), Math.round(bounds.height));

        // console.log(parentNode.offsetParent);
        // console.log(clientRect);
        // console.log(parentRect);
        // console.log(clientRect.left - parentRect.left, clientRect.top - parentRect.top, clientRect.width, clientRect.height);
        // console.log('gpb', bounds);

        return bounds;
    },

    align: function (horizontal, vertical)
    {
        if (horizontal !== null)
        {
            this.pageAlignHorizontally = horizontal;
        }

        if (vertical !== null)
        {
            this.pageAlignVertically = vertical;
        }
    },

    alignCanvas: function (horizontal, vertical)
    {
        var parentBounds = this.getParentBounds(this._tempBounds);
        var canvas = this.game.canvas;
        var margin = this.margin;

        var canvasBounds;
        var currentEdge;
        var targetEdge;
        var offset;

        if (horizontal)
        {
            margin.left = margin.right = 0;

            canvasBounds = canvas.getBoundingClientRect();

            if (this.width < parentBounds.width && !this.incorrectOrientation)
            {
                currentEdge = canvasBounds.left - parentBounds.x;
                targetEdge = (parentBounds.width / 2) - (this.width / 2);

                targetEdge = Math.max(targetEdge, 0);

                offset = targetEdge - currentEdge;

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

            canvasBounds = canvas.getBoundingClientRect();

            if (this.height < parentBounds.height && !this.incorrectOrientation)
            {
                currentEdge = canvasBounds.top - parentBounds.y;
                targetEdge = (parentBounds.height / 2) - (this.height / 2);

                targetEdge = Math.max(targetEdge, 0);

                offset = targetEdge - currentEdge;

                margin.top = Math.round(offset);
            }

            canvas.style.marginTop = margin.top + 'px';

            if (margin.top !== 0)
            {
                margin.bottom = -(parentBounds.height - canvasBounds.height - margin.top);
                canvas.style.marginBottom = margin.bottom + 'px';
            }
        }

        // margin.x = margin.left;
        // margin.y = margin.top;
    },

    reflowGame: function ()
    {
        this.resetCanvas('', '');

        var bounds = this.getParentBounds(this._tempBounds);

        this.updateDimensions(bounds.width, bounds.height, true);
    },

    reflowCanvas: function ()
    {
        if (!this.incorrectOrientation)
        {
            this.width = Clamp(this.width, this.minWidth || 0, this.maxWidth || this.width);
            this.height = Clamp(this.height, this.minHeight || 0, this.maxHeight || this.height);
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

    resetCanvas: function (cssWidth, cssHeight)
    {
        if (cssWidth === undefined) { cssWidth = this.width + 'px'; }
        if (cssHeight === undefined) { cssHeight = this.height + 'px'; }

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

    queueUpdate: function (force)
    {
        if (force)
        {
            this._parentBounds.width = 0;
            this._parentBounds.height = 0;
            this._lastUpdate = 0;
        }

        this._updateThrottle = this._updateThrottleReset;
    },

    setMaximum: function ()
    {
        this.width = VisualBounds.width;
        this.height = VisualBounds.height;
    },

    setShowAll: function (expanding)
    {
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

    setExactFit: function ()
    {
        var bounds = this.getParentBounds(this._tempBounds);

        this.width = bounds.width;
        this.height = bounds.height;

        if (this.isFullScreen)
        {
            //  Max/min not honored fullscreen
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

    createFullScreenTarget: function ()
    {
        var fsTarget = document.createElement('div');

        fsTarget.style.margin = '0';
        fsTarget.style.padding = '0';
        fsTarget.style.background = '#000';

        return fsTarget;
    },

    startFullScreen: function (antialias, allowTrampoline)
    {
        if (this.isFullScreen)
        {
            return false;
        }

        if (!this.compatibility.supportsFullScreen)
        {
            // Error is called in timeout to emulate the real fullscreenerror event better
            var _this = this;

            setTimeout(function ()
            {
                _this.fullScreenError();
            }, 10);

            return;
        }

        if (this.compatibility.clickTrampoline === 'when-not-mouse')
        {
            var input = this.game.input;

            /*
            if (input.activePointer &&
                input.activePointer !== input.mousePointer &&
                (allowTrampoline || allowTrampoline !== false))
            {
                input.activePointer.addClickTrampoline('startFullScreen', this.startFullScreen, this, [ antialias, false ]);
                return;
            }
            */
        }

        /*
        if (antialias !== undefined && this.game.renderType === CONST.CANVAS)
        {
            this.game.stage.smoothed = antialias;
        }
        */

        var fsTarget = this.fullScreenTarget;

        if (!fsTarget)
        {
            this.cleanupCreatedTarget();

            this._createdFullScreenTarget = this.createFullScreenTarget();

            fsTarget = this._createdFullScreenTarget;
        }

        var initData = { targetElement: fsTarget };

        this.hasPhaserSetFullScreen = true;

        // this.onFullScreenInit.dispatch(this, initData);

        if (this._createdFullScreenTarget)
        {
            //  Move the Display canvas inside of the target and add the target to the DOM
            //  (the target has to be added for the Fullscreen API to work)
            var canvas = this.game.canvas;
            var parent = canvas.parentNode;

            parent.insertBefore(fsTarget, canvas);

            fsTarget.appendChild(canvas);
        }

        if (this.game.device.fullscreen.keyboard)
        {
            fsTarget[this.game.device.fullscreen.request](Element.ALLOW_KEYBOARD_INPUT);
        }
        else
        {
            fsTarget[this.game.device.fullscreen.request]();
        }

        return true;
    },

    stopFullScreen: function ()
    {
        if (!this.isFullScreen || !this.compatibility.supportsFullScreen)
        {
            return false;
        }

        this.hasPhaserSetFullScreen = false;

        document[this.game.device.fullscreen.cancel]();

        return true;
    },

    cleanupCreatedTarget: function ()
    {
        var fsTarget = this._createdFullScreenTarget;

        if (fsTarget && fsTarget.parentNode)
        {
            //  Make sure to cleanup synthetic target for sure;
            //  swap the canvas back to the parent.
            var parent = fsTarget.parentNode;

            parent.insertBefore(this.game.canvas, fsTarget);

            parent.removeChild(fsTarget);
        }

        this._createdFullScreenTarget = null;
    },

    prepScreenMode: function (enteringFullscreen)
    {
        var createdTarget = !!this._createdFullScreenTarget;
        var fsTarget = this._createdFullScreenTarget || this.fullScreenTarget;

        if (enteringFullscreen)
        {
            if (createdTarget || this.fullScreenScaleMode === Phaser.ScaleManager.EXACT_FIT)
            {
                //  Resize target, as long as it's not the canvas
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
            //  Have restore information
            if (this._fullScreenRestore)
            {
                fsTarget.style.width = this._fullScreenRestore.targetWidth;
                fsTarget.style.height = this._fullScreenRestore.targetHeight;

                this._fullScreenRestore = null;
            }

            //  Always reset to game size
            this.updateDimensions(this._gameSize.width, this._gameSize.height, true);

            this.resetCanvas();
        }
    },

    fullScreenChange: function (event)
    {
        this.event = event;

        if (this.isFullScreen)
        {
            this.prepScreenMode(true);

            this.updateLayout();
            this.queueUpdate(true);
        }
        else
        {
            this.prepScreenMode(false);

            this.cleanupCreatedTarget();

            this.updateLayout();
            this.queueUpdate(true);
        }

        // this.onFullScreenChange.dispatch(this, this.width, this.height);
    },

    fullScreenError: function (event)
    {
        this.event = event;

        this.cleanupCreatedTarget();

        console.warn('ScaleManager: requestFullscreen call or browser failed');

        // this.onFullScreenError.dispatch(this);
    },

    /*
    centerDisplay: function ()
    {
        var height = this.height;
        var gameWidth = 0;
        var gameHeight = 0;

        this.parentNode.style.display = 'flex';
        this.parentNode.style.height = height + 'px';

        this.canvas.style.margin = 'auto';
        this.canvas.style.width = gameWidth + 'px';
        this.canvas.style.height = gameHeight + 'px';
    },
    */

    /*
    iOS10 Resize hack. Thanks, Apple.

    I._onWindowResize = function(a) {
        if (this._lastReportedWidth != document.body.offsetWidth) {
            this._lastReportedWidth = document.body.offsetWidth;
            if (this._isAutoPlaying && this._cancelAutoPlayOnInteraction) {
                this.stopAutoPlay(a)
            }
            window.clearTimeout(this._onResizeDebouncedTimeout);
            this._onResizeDebouncedTimeout = setTimeout(this._onResizeDebounced, 500);
            aj._onWindowResize.call(this, a)
        }
    };
    */

    /*
    resize: function ()
    {
        let scale = Math.min(window.innerWidth / canvas.width, window.innerHeight / canvas.height);
        let orientation = 'left';
        let extra = (this.mobile) ? 'margin-left: -50%': '';
        let margin = window.innerWidth / 2 - (canvas.width / 2) * scale;

        canvas.setAttribute('style', '-ms-transform-origin: ' + orientation + ' top; -webkit-transform-origin: ' + orientation + ' top;' +
            ' -moz-transform-origin: ' + orientation + ' top; -o-transform-origin: ' + orientation + ' top; transform-origin: ' + orientation + ' top;' +
            ' -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1);' +
            ' -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');' +
            ' display: block; margin-left: ' + margin + 'px;'
        );
    },
    */

    getInnerHeight: function ()
    {
        //  Based on code by @tylerjpeterson

        if (!this.game.device.os.iOS)
        {
            return window.innerHeight;
        }

        var axis = Math.abs(window.orientation);

        var size = { w: 0, h: 0 };
        
        var ruler = document.createElement('div');

        ruler.setAttribute('style', 'position: fixed; height: 100vh; width: 0; top: 0');

        document.documentElement.appendChild(ruler);

        size.w = (axis === 90) ? ruler.offsetHeight : window.innerWidth;
        size.h = (axis === 90) ? window.innerWidth : ruler.offsetHeight;

        document.documentElement.removeChild(ruler);

        ruler = null;

        if (Math.abs(window.orientation) !== 90)
        {
            return size.h;
        }
        else
        {
            return size.w;
        }
    },

    /**
     * Destroys the ScaleManager.
     *
     * @method Phaser.DOM.ScaleManager#destroy
     * @since 3.15.0
     */
    destroy: function ()
    {
        this.game.events.off('resume', this.gameResumed, this);

        window.removeEventListener('orientationchange', this._orientationChange, false);
        window.removeEventListener('resize', this._windowResize, false);

        if (this.compatibility.supportsFullScreen)
        {
            var vendors = [ 'webkit', 'moz', '' ];

            vendors.forEach(function (prefix)
            {
                document.removeEventListener(prefix + 'fullscreenchange', this._fullScreenChange, false);
                document.removeEventListener(prefix + 'fullscreenerror', this._fullScreenError, false);
            });

            //  MS Specific
            document.removeEventListener('MSFullscreenChange', this._fullScreenChange, false);
            document.removeEventListener('MSFullscreenError', this._fullScreenError, false);
        }

        this.game = null;
    },

    boundingParent: {
        
        get: function ()
        {
            if (this.parentIsWindow || (this.isFullScreen && this.hasPhaserSetFullScreen && !this._createdFullScreenTarget))
            {
                return null;
            }
    
            var parentNode = this.game.canvas && this.game.canvas.parentNode;
    
            return parentNode || null;
        }
    },

    scaleMode: {

        get: function ()
        {
            return this._scaleMode;
        },
    
        set: function (value)
        {
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
    
    },
    
    fullScreenScaleMode: {

        get: function ()
        {
            return this._fullScreenScaleMode;
        },
    
        set: function (value)
        {
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
    
    },

    currentScaleMode: {

        get: function ()
        {
            return (this.isFullScreen) ? this._fullScreenScaleMode : this._scaleMode;
        }
    
    },

    pageAlignHorizontally: {

        get: function ()
        {
            return this._pageAlignHorizontally;
        },
    
        set: function (value)
        {
    
            if (value !== this._pageAlignHorizontally)
            {
                this._pageAlignHorizontally = value;

                this.queueUpdate(true);
            }
    
        }
    
    },

    pageAlignVertically: {

        get: function ()
        {
            return this._pageAlignVertically;
        },
    
        set: function (value)
        {
            if (value !== this._pageAlignVertically)
            {
                this._pageAlignVertically = value;
                this.queueUpdate(true);
            }
    
        }
    
    },

    isFullScreen: {

        get: function ()
        {
            return !!(document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement);
        }
    
    },

    isPortrait: {

        get: function ()
        {
            return (this.classifyOrientation(this.screenOrientation) === 'portrait');
        }
    
    },

    isLandscape: {

        get: function ()
        {
            return (this.classifyOrientation(this.screenOrientation) === 'landscape');
        }
    
    },

    isGamePortrait: {

        get: function ()
        {
            return (this.height > this.width);
        }
    
    },

    isGameLandscape: {

        get: function ()
        {
            return (this.width > this.height);
        }
    
    }

});

module.exports = ScaleManager;
