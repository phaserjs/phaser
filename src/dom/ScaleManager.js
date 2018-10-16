/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var NOOP = require('../utils/NOOP');
var Vec2 = require('../math/Vector2');
var Rectangle = require('../geom/rectangle/Rectangle');

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

        //  The base game size, as requested in the game config
        this.width = 0;
        this.height = 0;

        //  The canvas size, which is the base game size * zoom * resolution
        this.canvasWidth = 0;
        this.canvasHeight = 0;

        this.resolution = 1;
        this.zoom = 1;

        //  The actual displayed canvas size (after refactoring in CSS depending on the scale mode, parent, etc)
        this.displayWidth = 0;
        this.displayHeight = 0;

        //  The scale factor between the base game size and the displayed size
        this.scale = new Vec2(1);

        this.parent;
        this.parentIsWindow;
        this.parentScale = new Vec2(1);
        this.parentBounds = new Rectangle();

        this.minSize = new Vec2();
        this.maxSize = new Vec2();

        this.trackParent = false;
        this.canExpandParent = false;

        this.allowFullScreen = false;

        this.listeners = {

            orientationChange: NOOP,
            windowResize: NOOP,
            fullScreenChange: NOOP,
            fullScreenError: NOOP

        };

    },

    preBoot: function ()
    {
        //  Parse the config to get the scaling values we need
        // console.log('preBoot');

        this.setParent(this.game.config.parent);

        this.parseConfig(this.game.config);

        this.game.events.once('boot', this.boot, this);
    },

    boot: function ()
    {
        // console.log('boot');

        this.setScaleMode(this.scaleMode);

        this.game.events.on('prestep', this.step, this);
    },

    parseConfig: function (config)
    {
        var width = config.width;
        var height = config.height;
        var resolution = config.resolution;
        var scaleMode = config.scaleMode;
        var zoom = config.zoom;

        if (typeof width === 'string')
        {
            this.parentScale.x = parseInt(width, 10) / 100;
            width = this.parentBounds.width * this.parentScale.x;
        }

        if (typeof height === 'string')
        {
            this.parentScale.y = parseInt(height, 10) / 100;
            height = this.parentBounds.height * this.parentScale.y;
        }

        this.width = width;
        this.height = height;

        this.canvasWidth = (width * zoom) * resolution;
        this.canvasHeight = (height * zoom) * resolution;

        this.resolution = resolution;

        this.zoom = zoom;

        this.canExpandParent = config.expandParent;

        this.scaleMode = scaleMode;

        // console.log(config);

        this.minSize.set(config.minWidth, config.minHeight);
        this.maxSize.set(config.maxWidth, config.maxHeight);
    },

    setScaleMode: function (scaleMode)
    {
        this.scaleMode = scaleMode;

        if (scaleMode === CONST.EXACT)
        {
            return;
        }

        var canvas = this.game.canvas;
        var gameStyle = canvas.style;

        var parent = this.parent;
        var parentStyle = parent.style;


        switch (scaleMode)
        {
            case CONST.FILL:

                gameStyle.objectFit = 'fill';
                gameStyle.width = '100%';
                gameStyle.height = '100%';

                if (this.canExpandParent)
                {
                    parentStyle.height = '100%';

                    if (this.parentIsWindow)
                    {
                        document.getElementsByTagName('html')[0].style.height = '100%';
                    }
                }

                break;

            case CONST.CONTAIN:

                gameStyle.objectFit = 'contain';
                gameStyle.width = '100%';
                gameStyle.height = '100%';

                if (this.canExpandParent)
                {
                    parentStyle.height = '100%';

                    if (this.parentIsWindow)
                    {
                        document.getElementsByTagName('html')[0].style.height = '100%';
                    }
                }

                break;
        }

        var min = this.minSize;
        var max = this.maxSize;

        if (min.x > 0)
        {
            gameStyle.minWidth = min.x.toString() + 'px';
        }

        if (min.y > 0)
        {
            gameStyle.minHeight = min.y.toString() + 'px';
        }

        if (max.x > 0)
        {
            gameStyle.maxWidth = max.x.toString() + 'px';
        }

        if (max.y > 0)
        {
            gameStyle.maxHeight = max.y.toString() + 'px';
        }
    },

    setParent: function (parent)
    {
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

        this.getParentBounds();
    },

    getParentBounds: function ()
    {
        var DOMRect = this.parent.getBoundingClientRect();

        this.parentBounds.setSize(DOMRect.width, DOMRect.height);
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
        //  canvas.clientWidth and clientHeight = canvas size when scaled with 100% object-fit, ignoring borders, margin, etc
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
    }

});

module.exports = ScaleManager;
