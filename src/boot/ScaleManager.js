/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Rectangle = require('../geom/rectangle/Rectangle');
var Vec2 = require('../math/Vector2');

/*
    Use `scaleMode` SHOW_ALL.
    Use `scaleMode` EXACT_FIT.
    Use `scaleMode` USER_SCALE. Examine `parentBounds` in the {@link #setResizeCallback resize callback} and call {@link #setUserScale} if necessary.
    Use `scaleMode` RESIZE. Examine the game or canvas size from the {@link #onSizeChange} signal **or** the {@link Phaser.State#resize} callback and reposition game objects if necessary.

    Canvas width / height in the element
    Canvas CSS width / height in the style

    Detect orientation
    Lock orientation (Android only?)
    Full-screen support

    Scale Mode - 
*/

/**
 * @classdesc
 * [description]
 *
 * @class ScaleManager
 * @memberOf Phaser.Boot
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
         * @name Phaser.Boot.ScaleManager#game
         * @type {Phaser.Game}
         * @readOnly
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

        this.screenOrientation = this.dom.getScreenOrientation();

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
            forceMinimumDocumentHeight: false,
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

        this._pendingScaleMode = null;

        this._fullScreenRestore = null;

        this._gameSize = new Rectangle();

        this._userScaleFactor = new Vec2(1, 1);

        this._userScaleTrim = new Vec2(0, 0);

        this._lastUpdate = 0;

        this._updateThrottle = 0;

        this._updateThrottleReset = 100;

        this._parentBounds = new Rectangle();

        this._tempBounds = new Rectangle();

        this._lastReportedCanvasSize = new Rectangle();

        this._lastReportedGameSize = new Rectangle();

        this._booted = false;
    },

    boot: function ()
    {
        // this._innerHeight = this.getInnerHeight();
        // var gameWidth = this.config.width;
        // var gameHeight = this.config.height;

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

        // Configure event listeners

        var _this = this;

        this._orientationChange = function (event)
        {
            return _this.orientationChange(event);
        };

        this._windowResize = function (event)
        {
            return _this.windowResize(event);
        };

        // This does not appear to be on the standards track
        window.addEventListener('orientationchange', this._orientationChange, false);
        window.addEventListener('resize', this._windowResize, false);

        if (this.compatibility.supportsFullScreen)
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

        this.game.events.on('resume', this._gameResumed, this);

        // Initialize core bounds

        // this.dom.getOffset(this.game.canvas, this.offset);

        this.bounds.setTo(this.offset.x, this.offset.y, this.width, this.height);

        this.setGameSize(this.game.width, this.game.height);

        //  Don't use updateOrientationState so events are not fired
        // this.screenOrientation = this.dom.getScreenOrientation(this.compatibility.orientationFallback);

        this._booted = true;

        if (this._pendingScaleMode !== null)
        {
            this.scaleMode = this._pendingScaleMode;
            this._pendingScaleMode = null;
        }
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

    resizeHandler: function ()
    {

    },

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
     * @method Phaser.Boot.ScaleManager#destroy
     * @since 3.12.0
     */
    destroy: function ()
    {
        this.game = null;
    }

});

module.exports = ScaleManager;
