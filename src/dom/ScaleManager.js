/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');
var Size = require('../structs/Size');

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

        this.scaleMode = 0;

        //  The parent object, often a div, or the browser window
        this.parent;

        this.parentIsWindow;

        //  The parent Size object.
        this.parentSize = new Size();

        //  The un-modified game size, as requested in the game config.
        this.gameSize = new Size();

        //  The canvas size, which is the game size * zoom * resolution, with the scale mode applied and factoring in the parent.
        this.canvasSize = new Size();

        //  The canvas resolution
        this.resolution = 1;

        //  The canvas zoom factor
        this.zoom = 1;

        this.trackParent = false;

        this.allowFullScreen = false;

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

        this.setParent(this.game.config.parent, this.game.config.expandParent);

        this.parseConfig(this.game.config);

        this.game.events.once('boot', this.boot, this);
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

        this.parentSize.setSize(DOMRect.width, DOMRect.height);
    },

    parseConfig: function (config)
    {
        console.log('parseConfig');

        var width = config.width;
        var height = config.height;
        var resolution = config.resolution;
        var scaleMode = config.scaleMode;
        var zoom = config.zoom;

        //  If width = '100%', or similar value
        if (typeof width === 'string')
        {
            var parentScaleX = parseInt(width, 10) / 100;

            width = this.parentSize.width * parentScaleX;
        }

        //  If height = '100%', or similar value
        if (typeof height === 'string')
        {
            var parentScaleY = parseInt(height, 10) / 100;

            height = this.parentSize.height * parentScaleY;
        }

        this.resolution = resolution;

        this.zoom = zoom;

        this.scaleMode = scaleMode;

        //  The un-modified game size, as requested in the game config.
        this.gameSize.setSize(width * resolution, height * resolution);

        // this.gameSize.setSize((width * zoom) * resolution, (height * zoom) * resolution);

        // if (scaleMode < 5)
        // {
        //     this.canvasSize.setAspectMode(scaleMode);
        // }

        if (config.minWidth > 0)
        {
            this.canvasSize.setMin(config.minWidth * zoom, config.minHeight * zoom);
        }

        if (config.maxWidth > 0)
        {
            this.canvasSize.setMax(config.maxWidth * zoom, config.maxHeight * zoom);
        }

        // console.log('set canvas size', width, height);

        this.canvasSize.setSize(width * zoom, height * zoom);

        // this.canvasSize.setSize((width * zoom) * resolution, (height * zoom) * resolution);

        // console.log(this.canvasSize.toString());
    },

    //  Fires AFTER the canvas has been added to the DOM
    boot: function ()
    {
        console.log('boot');

        // this.setScaleMode(this.scaleMode);

        var DOMRect = this.parent.getBoundingClientRect();

        if (this.parentIsWindow)
        {
            DOMRect.height = this.getInnerHeight();
        }

        console.log('dom', DOMRect.width, DOMRect.height);

        this.parentSize.setSize(DOMRect.width, DOMRect.height);

        if (this.scaleMode < 5)
        {
            this.canvasSize.setAspectMode(this.scaleMode);
        }

        if (this.scaleMode > 0)
        {
            console.log('set parent');
            this.canvasSize.setParent(this.parentSize);
            console.log(this.canvasSize.toString());
        }

        this.updateScale();

        this.game.events.on('prestep', this.step, this);

        this.startListeners();
    },

    setScaleMode: function ()
    {
    },

    updateScale: function ()
    {
        console.log('updateScale');

        this.getParentBounds();

        if (this.scaleMode > 0)
        {
            var style = this.game.canvas.style;

            this.canvasSize.setSize(this.parentSize.width, this.parentSize.height);
    
            // var sx = (this.canvasSize.width / this.gameSize.width) / this.resolution;
            // var sy = (this.canvasSize.height / this.gameSize.height) / this.resolution;

            // style.transformOrigin = '0 0';
            // style.transform = 'scale(' + sx + ',' + sy + ')';

            style.width = this.canvasSize.width + 'px';
            style.height = this.canvasSize.height + 'px';

            // style.width = this.canvasSize.width / this.resolution + 'px';
            // style.height = this.canvasSize.height / this.resolution + 'px';

            console.log(this.canvasSize.toString());
        }
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
