/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var GameEvents = require('../core/events');
var GetInnerHeight = require('./GetInnerHeight');
var GetScreenOrientation = require('./GetScreenOrientation');
var NOOP = require('../utils/NOOP');
var Rectangle = require('../geom/rectangle/Rectangle');
var Size = require('../structs/Size');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * 
 * TODO:
 * 
 * 1) Full Screen Input coordinates are wrong (div insert perhaps?).
 * 2) Check zero parent config set-up.
 * 3) Consider moving displaySize to the Scene, so each Scene could have a different scale mode.
 *
 * @class ScaleManager
 * @memberof Phaser.DOM
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance.
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

        /**
         * A reference to the HTML Canvas Element that Phaser uses to render the game.
         *
         * @name Phaser.DOM.ScaleManager#canvas
         * @type {HTMLCanvasElement}
         * @since 3.16.0
         */
        this.canvas;

        /**
         * The DOM bounds of the canvas element.
         *
         * @name Phaser.DOM.ScaleManager#canvasBounds
         * @type {Phaser.Geom.Rectangle}
         * @since 3.16.0
         */
        this.canvasBounds = new Rectangle();

        /**
         * The parent object of the Canvas. Often a div, or the browser window, or nothing in non-browser environments.
         * 
         * This is set in the Game Config as the `parent` property. If undefined (or just not present), it will default
         * to use the document body. If specifically set to `null` Phaser will ignore all parent operations.
         *
         * @name Phaser.DOM.ScaleManager#parent
         * @type {?any}
         * @since 3.16.0
         */
        this.parent = null;

        /**
         * Is the parent element the browser window?
         *
         * @name Phaser.DOM.ScaleManager#parentIsWindow
         * @type {boolean}
         * @since 3.16.0
         */
        this.parentIsWindow = false;

        /**
         * The Parent Size component.
         *
         * @name Phaser.DOM.ScaleManager#parentSize
         * @type {Phaser.Structs.Size}
         * @since 3.16.0
         */
        this.parentSize = new Size();

        /**
         * The Game Size component.
         * 
         * The un-modified game size, as requested in the game config (the raw width / height),
         * as used for world bounds, cameras, etc
         *
         * @name Phaser.DOM.ScaleManager#gameSize
         * @type {Phaser.Structs.Size}
         * @since 3.16.0
         */
        this.gameSize = new Size();

        /**
         * The Base Size component.
         * 
         * The modified game size, which is the gameSize * resolution, used to set the canvas width and height
         * (but not the CSS style)
         *
         * @name Phaser.DOM.ScaleManager#baseSize
         * @type {Phaser.Structs.Size}
         * @since 3.16.0
         */
        this.baseSize = new Size();

        /**
         * The Display Size component.
         * 
         * The size used for the canvas style, factoring in the scale mode, parent and other values.
         *
         * @name Phaser.DOM.ScaleManager#displaySize
         * @type {Phaser.Structs.Size}
         * @since 3.16.0
         */
        this.displaySize = new Size();

        /**
         * The game scale mode.
         *
         * @name Phaser.DOM.ScaleManager#scaleMode
         * @type {integer}
         * @since 3.16.0
         */
        this.scaleMode = CONST.NONE;

        /**
         * The canvas resolution.
         * 
         * This is hard-coded to a value of 1 in the 3.16 release of Phaser and will be enabled at a later date.
         *
         * @name Phaser.DOM.ScaleManager#resolution
         * @type {number}
         * @since 3.16.0
         */
        this.resolution = 1;

        /**
         * The game zoom factor.
         * 
         * This allows you to set a base size that is a multiple of your game size, before any scaling takes place.
         *
         * @name Phaser.DOM.ScaleManager#zoom
         * @type {number}
         * @since 3.16.0
         */
        this.zoom = 1;

        /**
         * The scale factor between the baseSize and the canvasBounds.
         *
         * @name Phaser.DOM.ScaleManager#displayScale
         * @type {Phaser.Math.Vector2}
         * @since 3.16.0
         */
        this.displayScale = new Vector2(1, 1);

        /**
         * If set, the canvas sizes will be automatically passed through Math.floor.
         * This results in rounded pixel display values, which is important for performance on legacy
         * and low powered devices, but at the cost of not achieving a 'perfect' fit in some browser windows.
         *
         * @name Phaser.DOM.ScaleManager#autoRound
         * @type {boolean}
         * @since 3.16.0
         */
        this.autoRound = false;

        /**
         * Automatically center the canvas within the parent?
         * 
         * 0 = No centering.
         * 1 = Center both horizontally and vertically.
         * 2 = Center horizontally.
         * 3 = Center vertically.
         *
         * @name Phaser.DOM.ScaleManager#autoCenter
         * @type {integer}
         * @since 3.16.0
         */
        this.autoCenter = CONST.NO_CENTER;

        /**
         * The current device orientation.
         * 
         * Orientation events are dispatched via the Device Orientation API and typically only on mobile browsers.
         *
         * @name Phaser.DOM.ScaleManager#orientation
         * @type {string}
         * @since 3.16.0
         */
        this.orientation = CONST.LANDSCAPE;

        /**
         * A reference to the Device.Fullscreen object.
         *
         * @name Phaser.DOM.ScaleManager#fullscreen
         * @type {Phaser.Device.Fullscreen}
         * @since 3.16.0
         */
        this.fullscreen;

        /**
         * The dirty state of the Scale Manager.
         * Set if there is a change between the parent size and the current size.
         *
         * @name Phaser.DOM.ScaleManager#dirty
         * @type {boolean}
         * @since 3.16.0
         */
        this.dirty = false;

        /**
         * How many milliseconds should elapse before checking if the browser size has changed?
         * 
         * Most modern browsers dispatch a 'resize' event, which the Scale Manager will listen for.
         * However, older browsers fail to do this, or do it consistently, so we fall back to a
         * more traditional 'size check' based on a time interval. You can control how often it is
         * checked here.
         *
         * @name Phaser.DOM.ScaleManager#resizeInterval
         * @type {integer}
         * @since 3.16.0
         */
        this.resizeInterval = 500;

        /**
         * Internal size interval tracker.
         *
         * @name Phaser.DOM.ScaleManager#_lastCheck
         * @type {integer}
         * @private
         * @since 3.16.0
         */
        this._lastCheck = 0;

        /**
         * Internal flag to check orientation state.
         *
         * @name Phaser.DOM.ScaleManager#_checkOrientation
         * @type {boolean}
         * @private
         * @since 3.16.0
         */
        this._checkOrientation = false;

        /**
         * Internal object containing our defined event listeners.
         *
         * @name Phaser.DOM.ScaleManager#listeners
         * @type {object}
         * @private
         * @since 3.16.0
         */
        this.listeners = {

            orientationChange: NOOP,
            windowResize: NOOP,
            fullScreenChange: NOOP,
            fullScreenError: NOOP

        };
    },

    /**
     * Called before the canvas object is created and added to the DOM.
     *
     * @method Phaser.DOM.ScaleManager#preBoot
     * @protected
     * @listens Phaser.Core.Events#BOOT
     * @since 3.16.0
     */
    preBoot: function ()
    {
        //  Parse the config to get the scaling values we need
        this.parseConfig(this.game.config);

        this.game.events.once('boot', this.boot, this);
    },

    /**
     * The Boot handler is called by Phaser.Game when it first starts up.
     * The renderer is available by now and the canvas has been added to the DOM.
     *
     * @method Phaser.DOM.ScaleManager#boot
     * @protected
     * @fires Phaser.DOM.ScaleManager.Events#RESIZE
     * @since 3.16.0
     */
    boot: function ()
    {
        this.canvas = this.game.canvas;

        this.fullscreen = this.game.device.fullscreen;

        if (this.scaleMode < 5)
        {
            this.displaySize.setAspectMode(this.scaleMode);
        }

        if (this.scaleMode > 0)
        {
            this.getParentBounds();

            this.displaySize.setParent(this.parentSize);
        }

        this.game.events.on(GameEvents.PRE_STEP, this.step, this);

        this.startListeners();

        this.refresh();
    },

    /**
     * Parses the game configuration to set-up the scale defaults.
     *
     * @method Phaser.DOM.ScaleManager#parseConfig
     * @protected
     * @since 3.16.0
     * 
     * @param {GameConfig} config - The Game configuration object.
     */
    parseConfig: function (config)
    {
        //  Get the parent element, if any
        this.getParent(config);
        
        //  Get the size of the parent element
        this.getParentBounds();

        var width = config.width;
        var height = config.height;
        var scaleMode = config.scaleMode;
        var resolution = config.resolution;
        var zoom = config.zoom;
        var autoRound = config.autoRound;

        //  If width = '100%', or similar value
        if (typeof width === 'string')
        {
            if (this.parent)
            {
                var parentScaleX = parseInt(width, 10) / 100;

                width = Math.floor(this.parentSize.width * parentScaleX);
            }
            else
            {
                width = parseInt(width, 10);
            }
        }

        //  If height = '100%', or similar value
        if (typeof height === 'string')
        {
            if (this.parent)
            {
                var parentScaleY = parseInt(height, 10) / 100;

                height = Math.floor(this.parentSize.height * parentScaleY);
            }
            else
            {
                height = parseInt(height, 10);
            }
        }

        //  This is fixed at 1 on purpose.
        //  Changing it will break all user input.
        //  Wait for another release to solve this issue.
        this.resolution = 1;

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

    /**
     * Determines the parent element of the game canvas, if any, based on the game configuration.
     *
     * @method Phaser.DOM.ScaleManager#getParent
     * @since 3.16.0
     * 
     * @param {GameConfig} config - The Game configuration object.
     */
    getParent: function (config)
    {
        var parent = config.parent;

        if (parent === null)
        {
            //  User is responsible for managing the parent
            return;
        }

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

    /**
     * Calculates the size of the parent bounds and updates the `parentSize` component, if the canvas has a dom parent.
     *
     * @method Phaser.DOM.ScaleManager#getParentBounds
     * @since 3.16.0
     * 
     * @return {boolean} `true` if the parent bounds have changed size, otherwise `false`.
     */
    getParentBounds: function ()
    {
        if (!this.parent)
        {
            return false;
        }

        var parentSize = this.parentSize;

        var DOMRect = this.parent.getBoundingClientRect();

        if (this.parentIsWindow && this.game.device.os.iOS)
        {
            DOMRect.height = GetInnerHeight(true);
        }

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

    /**
     * Attempts to lock the orientation of the web browser using the Screen Orientation API.
     * 
     * This API is only available on modern mobile browsers.
     * See https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation for details.
     *
     * @method Phaser.DOM.ScaleManager#lockOrientation
     * @since 3.16.0
     * 
     * @param {string} orientation - The orientation you'd like to lock the browser in. Should be an API string such as 'landscape', 'landscape-primary', 'portrait', etc.
     * 
     * @return {boolean} `true` if the orientation was successfully locked, otherwise `false`.
     */
    lockOrientation: function (orientation)
    {
        var lock = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

        if (lock)
        {
            return lock(orientation);
        }

        return false;
    },

    /**
     * Forcefully resizes the game to the given dimensions.
     * 
     * Use this to change the size of your game after it has booted, or in custom resizing situations.
     * 
     * Calling this method will update the `gameSize` and `baseSize` components and then call `refresh`,
     * which dispatches the resize event.
     *
     * @method Phaser.DOM.ScaleManager#resize
     * @fires Phaser.DOM.ScaleManager.Events#RESIZE
     * @since 3.16.0
     * 
     * @param {number} width - The new width of the game.
     * @param {number} height - The new height of the game.
     */
    resize: function (width, height)
    {
        if (this.autoRound)
        {
            width = Math.floor(width);
            height = Math.floor(height);
        }

        this.gameSize.resize(width, height);

        this.baseSize.resize(width * this.resolution, height * this.resolution);

        this.displaySize.resize(width, height);

        this.refresh();
    },

    /**
     * Sets the zoom value of the Scale Manager post-boot.
     *
     * @method Phaser.DOM.ScaleManager#setZoom
     * @fires Phaser.DOM.ScaleManager.Events#RESIZE
     * @since 3.16.0
     * 
     * @param {number} value - The new zoom value of the game.
     * 
     * @return {this} The Scale Manager instance.
     */
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
     * Refreshes the internal scale values, bounds sizes and orientation checks.
     * 
     * Once finished, dispatches the resize event.
     * 
     * This is called automatically by the Scale Manager when the browser changes.
     *
     * @method Phaser.DOM.ScaleManager#refresh
     * @fires Phaser.DOM.ScaleManager.Events#RESIZE
     * @since 3.16.0
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
    
                this.emit(Events.ORIENTATION_CHANGE, newOrientation);
            }
        }

        this.emit(Events.RESIZE, this.gameSize, this.baseSize, this.displaySize, this.resolution);
    },

    /**
     * [description]
     *
     * @method Phaser.DOM.ScaleManager#updateScale
     * @since 3.16.0
     */
    updateScale: function ()
    {
        var style = this.canvas.style;

        var width = this.gameSize.width;
        var height = this.gameSize.height;

        var styleWidth;
        var styleHeight;

        var zoom = this.zoom;
        var autoRound = this.autoRound;
        var resolution = 1;

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
     * Updates the `canvasBounds` rectangle to match the bounding client rectangle of the
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
     * Transforms the pageX value into the scaled coordinate space of the Scale Manager.
     *
     * @method Phaser.DOM.ScaleManager#transformX
     * @since 3.16.0
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
     * Transforms the pageY value into the scaled coordinate space of the Scale Manager.
     *
     * @method Phaser.DOM.ScaleManager#transformY
     * @since 3.16.0
     *
     * @param {number} pageY - The DOM pageY value.
     *
     * @return {number} The translated value.
     */
    transformY: function (pageY)
    {
        return (pageY - this.canvasBounds.top) * this.displayScale.y;
    },

    /**
     * [description]
     * 
     * https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions
     *
     * @method Phaser.DOM.ScaleManager#startFullscreen
     * @fires Phaser.DOM.ScaleManager.Events#ENTER_FULLSCREEN
     * @fires Phaser.DOM.ScaleManager.Events#FULLSCREEN_UNSUPPORTED
     * @fires Phaser.DOM.ScaleManager.Events#RESIZE
     * @since 3.16.0
     * 
     * @param {FullscreenOptions} [fullscreenOptions] - The FullscreenOptions dictionary is used to provide configuration options when entering full screen.
     */
    startFullscreen: function (fullscreenOptions)
    {
        if (fullscreenOptions === undefined) { fullscreenOptions = { navigationUI: 'hide' }; }

        var fullscreen = this.fullscreen;

        if (!fullscreen.available)
        {
            this.emit(Events.FULLSCREEN_UNSUPPORTED);

            return;
        }

        if (!fullscreen.active)
        {
            //  TODO: Edge needs a div insert, other browsers can use Canvas as the target.
            var fsTarget = this.canvas;

            if (fullscreen.keyboard)
            {
                fsTarget[fullscreen.request](Element.ALLOW_KEYBOARD_INPUT);
            }
            else
            {
                fsTarget[fullscreen.request](fullscreenOptions);
            }

            this.emit(Events.ENTER_FULLSCREEN);

            this.refresh();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.DOM.ScaleManager#stopFullscreen
     * @fires Phaser.DOM.ScaleManager.Events#LEAVE_FULLSCREEN
     * @fires Phaser.DOM.ScaleManager.Events#FULLSCREEN_UNSUPPORTED
     * @since 3.16.0
     */
    stopFullscreen: function ()
    {
        var fullscreen = this.fullscreen;

        if (!fullscreen.available)
        {
            this.emit(Events.FULLSCREEN_UNSUPPORTED);

            return false;
        }

        if (fullscreen.active)
        {
            document[fullscreen.cancel]();

            this.emit(Events.LEAVE_FULLSCREEN);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.DOM.ScaleManager#toggleFullscreen
     * @fires Phaser.DOM.ScaleManager.Events#ENTER_FULLSCREEN
     * @fires Phaser.DOM.ScaleManager.Events#LEAVE_FULLSCREEN
     * @fires Phaser.DOM.ScaleManager.Events#FULLSCREEN_UNSUPPORTED
     * @since 3.16.0
     * 
     * @param {FullscreenOptions} [fullscreenOptions] - The FullscreenOptions dictionary is used to provide configuration options when entering full screen.
     */
    toggleFullscreen: function (fullscreenOptions)
    {
        if (this.fullscreen.active)
        {
            this.stopFullscreen();
        }
        else
        {
            this.startFullscreen(fullscreenOptions);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.DOM.ScaleManager#startListeners
     * @since 3.16.0
     */
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

    /**
     * [description]
     *
     * @method Phaser.DOM.ScaleManager#onFullScreenChange
     * @since 3.16.0
     */
    onFullScreenChange: function ()
    {
        console.log('fs change');
        console.log(this.fullscreen.active);
    },

    /**
     * [description]
     *
     * @method Phaser.DOM.ScaleManager#onFullScreenError
     * @since 3.16.0
     */
    onFullScreenError: function ()
    {
        console.log('fs error');
    },

    /**
     * [description]
     *
     * @method Phaser.DOM.ScaleManager#step
     * @since 3.16.0
     *
     * @param {number} time - The time value from the most recent Game step. Typically a high-resolution timer value, or Date.now().
     * @param {number} delta - The delta value since the last frame. This is smoothed to avoid delta spikes by the TimeStep class.
     */
    step: function (time, delta)
    {
        if (this.scaleMode === 0 || !this.parent)
        {
            return;
        }

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

    /**
     * [description]
     *
     * @method Phaser.DOM.ScaleManager#stopListeners
     * @since 3.16.0
     */
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

    /**
     * [description]
     *
     * @method Phaser.DOM.ScaleManager#destroy
     * @since 3.16.0
     */
    destroy: function ()
    {
        this.removeAllListeners();

        this.stopListeners();
    },

    /**
     * [description]
     *
     * @name Phaser.DOM.ScaleManager#isFullscreen
     * @type {boolean}
     * @readonly
     * @since 3.16.0
     */
    isFullscreen: {

        get: function ()
        {
            return this.fullscreen.active;
        }
    
    },

    /**
     * [description]
     *
     * @name Phaser.DOM.ScaleManager#width
     * @type {number}
     * @readonly
     * @since 3.16.0
     */
    width: {

        get: function ()
        {
            return this.gameSize.width;
        }
    
    },

    /**
     * [description]
     *
     * @name Phaser.DOM.ScaleManager#height
     * @type {number}
     * @readonly
     * @since 3.16.0
     */
    height: {

        get: function ()
        {
            return this.gameSize.height;
        }
    
    },

    /**
     * [description]
     *
     * @name Phaser.DOM.ScaleManager#isPortrait
     * @type {boolean}
     * @readonly
     * @since 3.16.0
     */
    isPortrait: {

        get: function ()
        {
            return (this.orientation === CONST.PORTRAIT);
        }
    
    },

    /**
     * [description]
     *
     * @name Phaser.DOM.ScaleManager#isLandscape
     * @type {boolean}
     * @readonly
     * @since 3.16.0
     */
    isLandscape: {

        get: function ()
        {
            return (this.orientation === CONST.LANDSCAPE);
        }
    
    },

    /**
     * [description]
     *
     * @name Phaser.DOM.ScaleManager#isGamePortrait
     * @type {boolean}
     * @readonly
     * @since 3.16.0
     */
    isGamePortrait: {

        get: function ()
        {
            return (this.height > this.width);
        }
    
    },

    /**
     * [description]
     *
     * @name Phaser.DOM.ScaleManager#isGameLandscape
     * @type {boolean}
     * @readonly
     * @since 3.16.0
     */
    isGameLandscape: {

        get: function ()
        {
            return (this.width > this.height);
        }
    
    }

});

module.exports = ScaleManager;
