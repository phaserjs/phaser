/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
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
 * @constructor
 * @since 3.15.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance.
 * @param {any} config
 */
var ScaleManager = new Class({

    initialize:

    function ScaleManager (game)
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

        this.scaleMode = 0;

        //  The canvas resolution
        this.resolution = 1;

        //  The canvas zoom factor
        this.zoom = 1;

        this.autoRound = false;

        this.trackParent = false;

        this.allowFullScreen = false;

        //  The scale between the baseSize and the canvasBounds
        this.displayScale = new Vector2(1, 1);

        this.listeners = {

            orientationChange: NOOP,
            windowResize: NOOP,
            fullScreenChange: NOOP,
            fullScreenError: NOOP

        };
    },

    //  Called BEFORE the Canvas object is created and added to the DOM
    //  So if we need to do anything re: scaling to a parent, we ought to do it after this happens.
    preBoot: function ()
    {
        //  Parse the config to get the scaling values we need
        console.log('preBoot');

        this.parseConfig(this.game.config);

        this.game.events.once('boot', this.boot, this);
    },

    //  Fires BEFORE the canvas has been created
    parseConfig: function (config)
    {
        console.log('parseConfig');

        this.setParent(config.parent, config.expandParent);

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
    },

    setParent: function (parent, canExpandParent)
    {
        console.log('setParent');

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

        var parentStyle = this.parent.style;

        if (canExpandParent)
        {
            parentStyle.height = '100%';

            if (this.parentIsWindow)
            {
                document.getElementsByTagName('html')[0].style.height = '100%';
            }
        }
    },

    getParentBounds: function ()
    {
        var DOMRect = this.parent.getBoundingClientRect();

        console.log('dom', DOMRect.width, DOMRect.height);

        var resolution = this.resolution;

        this.parentSize.setSize(DOMRect.width * resolution, DOMRect.height * resolution);
    },

    //  Fires AFTER the canvas has been created and added to the DOM
    boot: function ()
    {
        console.log('boot');

        this.canvas = this.game.canvas;

        var DOMRect = this.parent.getBoundingClientRect();

        if (this.parentIsWindow)
        {
            DOMRect.height = this.getInnerHeight();
        }

        console.log('dom', DOMRect.width, DOMRect.height);

        this.parentSize.setSize(DOMRect.width, DOMRect.height);

        if (this.scaleMode < 5)
        {
            this.displaySize.setAspectMode(this.scaleMode);
        }

        if (this.scaleMode > 0)
        {
            this.displaySize.setParent(this.parentSize);
        }

        this.updateScale();

        this.game.events.on('prestep', this.step, this);

        this.startListeners();
    },

    updateScale: function ()
    {
        console.log('updateScale');

        this.getParentBounds();

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

        this.updateBounds();

        // this.game.resize();
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

    startListeners: function ()
    {
        var _this = this;
        var listeners = this.listeners;

        listeners.orientationChange = function (event)
        {
            return _this.onOrientationChange(event);
        };

        listeners.windowResize = function (event)
        {
            return _this.onWindowResize(event);
        };

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

    onOrientationChange: function ()
    {
    },

    onWindowResize: function ()
    {
        this.updateScale();
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

    step: function ()
    {
    },

    destroy: function ()
    {
    }

});

module.exports = ScaleManager;
