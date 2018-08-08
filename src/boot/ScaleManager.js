/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
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
 * @since 3.12.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance.
 * @param {ScaleManagerConfig} config
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
         * @since 3.12.0
         */
        this.game = game;

        this.config = config;

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

        this.zoom = 0;

        this.resolution = 1;

        this.parent = null;

        this.scaleMode = 0;

        /**
         * Minimum width the canvas should be scaled to (in pixels).
         * Change with {@link #setMinMax}.
         * @property {?number} minWidth
         * @readonly
         * @protected
         */
        this.minWidth = null;

        /**
         * Minimum height the canvas should be scaled to (in pixels).
         * Change with {@link #setMinMax}.
         * @property {?number} minHeight
         * @readonly
         * @protected
         */
        this.minHeight = null;

        /**
         * Maximum width the canvas should be scaled to (in pixels).
         * If null it will scale to whatever width the browser can handle.
         * Change with {@link #setMinMax}.
         * @property {?number} maxWidth
         * @readonly
         * @protected
         */
        this.maxWidth = null;

        /**
         * Maximum height the canvas should be scaled to (in pixels).
         * If null it will scale to whatever height the browser can handle.
         * Change with {@link #setMinMax}.
         * @property {?number} maxHeight
         * @readonly
         * @protected
         */
        this.maxHeight = null;

        /**
         * The _current_ scale factor based on the game dimensions vs. the scaled dimensions.
         * @property {Phaser.Point} scaleFactor
         * @readonly
         */
        this.scaleFactor = new Vec2(1, 1);

        /**
         * The _current_ inversed scale factor. The displayed dimensions divided by the game dimensions.
         * @property {Phaser.Point} scaleFactorInversed
         * @readonly
         * @protected
         */
        this.scaleFactorInversed = new Vec2(1, 1);

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
         * True if the the browser window (instead of the display canvas's DOM parent) should be used as the bounding parent.
         *
         * This is set automatically based on the `parent` argument passed to {@link Phaser.Game}.
         *
         * The {@link #parentNode} property is generally ignored while this is in effect.
         *
         * @property {boolean} parentIsWindow
         */
        this.parentIsWindow = false;

        /**
         * The _original_ DOM element for the parent of the Display canvas.
         * This may be different in fullscreen - see {@link #createFullScreenTarget}.
         *
         * This is set automatically based on the `parent` argument passed to {@link Phaser.Game}.
         *
         * This should only be changed after moving the Game canvas to a different DOM parent.
         *
         * @property {?DOMElement} parentNode
         */
        this.parentNode = null;

        /**
         * The scale of the game in relation to its parent container.
         * @property {Phaser.Point} parentScaleFactor
         * @readonly
         */
        this.parentScaleFactor = new Vec2(1, 1);

        this._lastParentWidth = 0;

        this._lastParentHeight = 0;

        this._innerHeight = 0;

        this.init();
    },

    init: function ()
    {
        this._innerHeight = this.getInnerHeight();

        // var gameWidth = this.config.width;
        // var gameHeight = this.config.height;
    },

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
