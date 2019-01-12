/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var GetInnerHeight = require('./GetInnerHeight');
var GetScreenOrientation = require('./GetScreenOrientation');
var NOOP = require('../utils/NOOP');
var Rectangle = require('../geom/rectangle/Rectangle');
var Size = require('../structs/Size');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * TODO
 *
 * @class ScaleManager
 * @memberof Phaser.DOM
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance.
 * @param {any} config
 */
var ScaleManager = new Class({

    Extends: EventEmitter,

    initialize:

    function ScaleManager (game)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Phaser.Game instance.
         *
         * @name Phaser.DOM.ScaleManager#game
         * @type {Phaser.Game}
         * @readonly
         * @since 3.15.0
         */
        this.game = game;

        //  Reference to the canvas being scaled
        this.canvas;

        /**
         * The DOM bounds of the canvas element.
         *
         * @name Phaser.Input.InputManager#canvasBounds
         * @type {Phaser.Geom.Rectangle}
         * @since 3.16.0
         */
        this.canvasBounds = new Rectangle();

        //  The parent object, often a div, or the browser window
        this.parent;

        this.parentIsWindow;

        //  The parent Size object.
        this.parentSize = new Size();

        //  The un-modified game size, as requested in the game config (the raw width / height) as used for world bounds, cameras, etc
        this.gameSize = new Size();

        //  The modified game size, which is the gameSize * resolution, used to set the canvas width/height (but not the CSS style)
        this.baseSize = new Size();

        //  The size used for the canvas style, factoring in the scale mode, parent and other values
        this.displaySize = new Size();

        this.scaleMode = CONST.NONE;

        //  The canvas resolution
        this.resolution = 1;

        //  The canvas zoom factor
        this.zoom = 1;

        //  The scale between the baseSize and the canvasBounds
        this.displayScale = new Vector2(1, 1);

        //  Automatically floor the canvas sizes
        this.autoRound = false;

        //  Automatically center the canvas within the parent? 0 = No centering. 1 = Center both horizontally and vertically. 2 = Center horizontally. 3 = Center vertically.
        this.autoCenter = CONST.NO_CENTER;

        //  The device orientation (if available)
        this.orientation = CONST.LANDSCAPE;

        this.trackParent = false;

        this.allowFullScreen = false;

        this.dirty = false;

        //  How many ms should elapse before checking if the browser size has changed?
        this.resizeInterval = 500;

        this._lastCheck = 0;

        this._checkOrientation = false;

        this.listeners = {

            orientationChange: NOOP,
            windowResize: NOOP,
            fullScreenChange: NOOP,
            fullScreenError: NOOP

        };
    },

    //  Called BEFORE the Canvas object is created and added to the DOM
    //  So if we need to do anything re: scaling to a parent, we should do it in `boot` and not here.
    preBoot: function ()
    {
        //  Parse the config to get the scaling values we need
        this.parseConfig(this.game.config);

        this.game.events.once('boot', this.boot, this);
    },

    //  Fires AFTER the canvas has been created and added to the DOM
    boot: function ()
    {
        this.canvas = this.game.canvas;

        this.getParentBounds();

        if (this.scaleMode < 5)
        {
            this.displaySize.setAspectMode(this.scaleMode);
        }

        if (this.scaleMode > 0)
        {
            this.displaySize.setParent(this.parentSize);
        }

        this.game.events.on('prestep', this.step, this);

        this.startListeners();

        this.refresh();
    },

    parseConfig: function (config)
    {
        this.getParent(config);
        this.getParentBounds();

        var width = config.width;
        var height = config.height;
        var resolution = config.resolution;
        var scaleMode = config.scaleMode;
        var zoom = config.zoom;
        var autoRound = config.autoRound;

        //  If width = '100%', or similar value
        if (typeof width === 'string')
        {
            var parentScaleX = parseInt(width, 10) / 100;

            width = Math.floor(this.parentSize.width * parentScaleX);
        }

        //  If height = '100%', or similar value
        if (typeof height === 'string')
        {
            var parentScaleY = parseInt(height, 10) / 100;

            height = Math.floor(this.parentSize.height * parentScaleY);
        }

        this.resolution = resolution;

        this.zoom = zoom;

        this.scaleMode = scaleMode;

        this.autoRound = autoRound;

        this.autoCenter = config.autoCenter;

        this.resizeInterval = config.resizeInterval;

        if (autoRound)
        {
            width = Math.floor(width);
            height = Math.floor(height);
        }

        //  The un-modified game size, as requested in the game config (the raw width / height) as used for world bounds, etc
        this.gameSize.setSize(width, height);

        //  The modified game size, which is the w/h * resolution
        this.baseSize.setSize(width * resolution, height * resolution);

        if (autoRound)
        {
            this.baseSize.width = Math.floor(this.baseSize.width);
            this.baseSize.height = Math.floor(this.baseSize.height);
        }

        if (config.minWidth > 0)
        {
            this.displaySize.setMin(config.minWidth * zoom, config.minHeight * zoom);
        }

        if (config.maxWidth > 0)
        {
            this.displaySize.setMax(config.maxWidth * zoom, config.maxHeight * zoom);
        }

        //  The size used for the canvas style, factoring in the scale mode and parent and zoom value
        //  We just use the w/h here as this is what sets the aspect ratio (which doesn't then change)
        this.displaySize.setSize(width, height);

        this.orientation = GetScreenOrientation(width, height);
    },

    getParent: function (config)
    {
        var parent = config.parent;
        var canExpandParent = config.expandParent;

        var target;

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

        //  Fallback to the document body. Covers an invalid ID and a non HTMLElement object.
        if (!target)
        {
            //  Use the full window
            this.parent = document.body;
            this.parentIsWindow = true;
        }
        else
        {
            this.parent = target;
            this.parentIsWindow = false;
        }

        if (canExpandParent)
        {
            if (this.parentIsWindow)
            {
                document.getElementsByTagName('html')[0].style.height = '100%';
            }
            else
            {
                this.parent.style.height = '100%';
            }
        }
    },

    //  Return `true` if the parent bounds have changed size, otherwise returns false.
    getParentBounds: function ()
    {
        var DOMRect = this.parent.getBoundingClientRect();

        if (this.parentIsWindow && this.game.device.os.iOS)
        {
            DOMRect.height = GetInnerHeight(true);
        }

        var parentSize = this.parentSize;

        var resolution = this.resolution;
        var newWidth = DOMRect.width * resolution;
        var newHeight = DOMRect.height * resolution;

        if (parentSize.width !== newWidth || parentSize.height !== newHeight)
        {
            this.parentSize.setSize(newWidth, newHeight);

            return true;
        }
        else
        {
            return false;
        }
    },

    //  https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation
    //  'portrait-primary', 'landscape-primary', 'landscape', 'portrait', etc.
    lockOrientation: function (orientation)
    {
        var lock = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

        if (lock)
        {
            return lock(orientation);
        }

        return false;
    },

    //  Directly resize the game.
    resize: function (width, height)
    {
        if (this.autoRound)
        {
            width = Math.floor(width);
            height = Math.floor(height);
        }

        this.gameSize.setSize(width, height);

        this.baseSize.setSize(width * this.resolution, height * this.resolution);

        this.refresh();
    },

    setZoom: function (value)
    {
        if (value !== this.zoom)
        {
            this.zoom = value;

            this.refresh();
        }

        return this;
    },

    /**
     * Game Resize event.
     * 
     * Listen for it using the event type `resize`.
     *
     * @event Phaser.Game#resizeEvent
     * @param {number} width - The new width of the Game.
     * @param {number} height - The new height of the Game.
     */

    refresh: function ()
    {
        this.updateScale();
        this.updateBounds();

        if (this._checkOrientation)
        {
            this._checkOrientation = false;

            var newOrientation = GetScreenOrientation(this.width, this.height);

            if (newOrientation !== this.orientation)
            {
                this.orientation = newOrientation;
    
                this.emit('orientationchange', newOrientation);
            }
        }

        this.emit('resize', this.gameSize, this.baseSize, this.displaySize, this.resolution);
    },

    updateScale: function ()
    {
        var style = this.canvas.style;

        var width = this.gameSize.width;
        var height = this.gameSize.height;

        var styleWidth;
        var styleHeight;

        var zoom = this.zoom;
        var autoRound = this.autoRound;
        var resolution = this.resolution;

        if (this.scaleMode === 0)
        {
            //  No scale
            this.displaySize.setSize((width * zoom) * resolution, (height * zoom) * resolution);

            styleWidth = this.displaySize.width / resolution;
            styleHeight = this.displaySize.height / resolution;

            if (autoRound)
            {
                styleWidth = Math.floor(styleWidth);
                styleHeight = Math.floor(styleHeight);
            }

            style.width = styleWidth + 'px';
            style.height = styleHeight + 'px';
        }
        else if (this.scaleMode === 5)
        {
            //  Resize to match parent

            //  This will constrain using min/max
            this.displaySize.setSize(this.parentSize.width, this.parentSize.height);

            this.gameSize.setSize(this.displaySize.width, this.displaySize.height);

            this.baseSize.setSize(this.displaySize.width * resolution, this.displaySize.height * resolution);

            styleWidth = this.displaySize.width / resolution;
            styleHeight = this.displaySize.height / resolution;

            if (autoRound)
            {
                styleWidth = Math.floor(styleWidth);
                styleHeight = Math.floor(styleHeight);
            }

            this.canvas.width = styleWidth;
            this.canvas.height = styleHeight;
        }
        else
        {
            //  All other scale modes
            this.displaySize.setSize(this.parentSize.width, this.parentSize.height);

            styleWidth = this.displaySize.width / resolution;
            styleHeight = this.displaySize.height / resolution;

            if (autoRound)
            {
                styleWidth = Math.floor(styleWidth);
                styleHeight = Math.floor(styleHeight);
            }

            style.width = styleWidth + 'px';
            style.height = styleHeight + 'px';
        }

        var offsetX = Math.floor((this.parentSize.width - styleWidth) / 2);
        var offsetY = Math.floor((this.parentSize.height - styleHeight) / 2);

        if (this.autoCenter === 1)
        {
            style.marginLeft = offsetX + 'px';
            style.marginTop = offsetY + 'px';
        }
        else if (this.autoCenter === 2)
        {
            style.marginLeft = offsetX + 'px';
        }
        else if (this.autoCenter === 3)
        {
            style.marginTop = offsetY + 'px';
        }

        //  Update the parentSize incase the canvas/style change modified it
        if (!this.parentIsWindow)
        {
            this.getParentBounds();
        }
    },

    /**
     * Updates the Input Manager bounds rectangle to match the bounding client rectangle of the
     * canvas element being used to track input events.
     *
     * @method Phaser.DOM.ScaleManager#updateBounds
     * @since 3.16.0
     */
    updateBounds: function ()
    {
        var bounds = this.canvasBounds;
        var clientRect = this.canvas.getBoundingClientRect();

        bounds.x = clientRect.left + window.pageXOffset - document.documentElement.clientLeft;
        bounds.y = clientRect.top + window.pageYOffset - document.documentElement.clientTop;
        bounds.width = clientRect.width;
        bounds.height = clientRect.height;

        this.displayScale.set(this.baseSize.width / bounds.width, this.baseSize.height / bounds.height);
    },

    /**
     * Transforms the pageX value into the scaled coordinate space of the Input Manager.
     *
     * @method Phaser.Input.InputManager#transformX
     * @since 3.0.0
     *
     * @param {number} pageX - The DOM pageX value.
     *
     * @return {number} The translated value.
     */
    transformX: function (pageX)
    {
        return (pageX - this.canvasBounds.left) * this.displayScale.x;
    },

    /**
     * Transforms the pageY value into the scaled coordinate space of the Input Manager.
     *
     * @method Phaser.Input.InputManager#transformY
     * @since 3.0.0
     *
     * @param {number} pageY - The DOM pageY value.
     *
     * @return {number} The translated value.
     */
    transformY: function (pageY)
    {
        return (pageY - this.canvasBounds.top) * this.displayScale.y;
    },

    startListeners: function ()
    {
        var _this = this;
        var listeners = this.listeners;

        listeners.orientationChange = function ()
        {
            _this._checkOrientation = true;
            _this.dirty = true;
        };

        listeners.windowResize = function ()
        {
            _this.dirty = true;
        };

        //  Only dispatched on mobile devices
        window.addEventListener('orientationchange', listeners.orientationChange, false);

        window.addEventListener('resize', listeners.windowResize, false);

        if (this.allowFullScreen)
        {
            listeners.fullScreenChange = function (event)
            {
                return _this.onFullScreenChange(event);
            };

            listeners.fullScreenError = function (event)
            {
                return _this.onFullScreenError(event);
            };

            var vendors = [ 'webkit', 'moz', '' ];

            vendors.forEach(function (prefix)
            {
                document.addEventListener(prefix + 'fullscreenchange', listeners.fullScreenChange, false);
                document.addEventListener(prefix + 'fullscreenerror', listeners.fullScreenError, false);
            });

            //  MS Specific
            document.addEventListener('MSFullscreenChange', listeners.fullScreenChange, false);
            document.addEventListener('MSFullscreenError', listeners.fullScreenError, false);
        }
    },

    onFullScreenChange: function ()
    {
    },

    onFullScreenError: function ()
    {
    },

    step: function (time, delta)
    {
        this._lastCheck += delta;

        if (this.dirty || this._lastCheck > this.resizeInterval)
        {
            //  Returns true if the parent bounds have changed size
            if (this.getParentBounds())
            {
                this.refresh();
            }

            this.dirty = false;
            this._lastCheck = 0;
        }
    },

    stopListeners: function ()
    {
        var listeners = this.listeners;

        window.removeEventListener('orientationchange', listeners.orientationChange, false);
        window.removeEventListener('resize', listeners.windowResize, false);

        var vendors = [ 'webkit', 'moz', '' ];

        vendors.forEach(function (prefix)
        {
            document.removeEventListener(prefix + 'fullscreenchange', listeners.fullScreenChange, false);
            document.removeEventListener(prefix + 'fullscreenerror', listeners.fullScreenError, false);
        });

        //  MS Specific
        document.removeEventListener('MSFullscreenChange', listeners.fullScreenChange, false);
        document.removeEventListener('MSFullscreenError', listeners.fullScreenError, false);
    },

    destroy: function ()
    {
        this.removeAllListeners();

        this.stopListeners();
    },

    isFullScreen: {

        get: function ()
        {
            return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        }
    
    },

    width: {

        get: function ()
        {
            return this.gameSize.width;
        }
    
    },

    height: {

        get: function ()
        {
            return this.gameSize.height;
        }
    
    },

    isPortrait: {

        get: function ()
        {
            return (this.orientation === CONST.PORTRAIT);
        }
    
    },

    isLandscape: {

        get: function ()
        {
            return (this.orientation === CONST.LANDSCAPE);
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
