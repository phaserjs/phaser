/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CanvasInterpolation = require('../display/canvas/CanvasInterpolation');
var CanvasPool = require('../display/canvas/CanvasPool');
var CONST = require('../const');
var Features = require('../device/Features');

/**
 * Called automatically by Phaser.Game and responsible for creating the renderer it will use.
 *
 * Relies upon two webpack global flags to be defined: `WEBGL_RENDERER` and `CANVAS_RENDERER` during build time, but not at run-time.
 *
 * @function Phaser.Boot.CreateRenderer
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance on which the renderer will be set.
 */
var CreateRenderer = function (game)
{
    var config = game.config;

    //  Game either requested Canvas,
    //  or requested AUTO or WEBGL but the browser doesn't support it, so fall back to Canvas

    if (config.renderType !== CONST.HEADLESS)
    {
        if (config.renderType === CONST.CANVAS || (config.renderType !== CONST.CANVAS && !Features.webGL))
        {
            if (Features.canvas)
            {
                //  They requested Canvas and their browser supports it
                config.renderType = CONST.CANVAS;
            }
            else
            {
                throw new Error('Cannot create Canvas or WebGL context, aborting.');
            }
        }
        else
        {
            //  Game requested WebGL and browser says it supports it
            config.renderType = CONST.WEBGL;
        }
    }

    //  Pixel Art mode?
    if (config.pixelArt)
    {
        CanvasPool.disableSmoothing();
    }

    //  Does the game config provide its own canvas element to use?
    if (config.canvas)
    {
        game.canvas = config.canvas;
    }
    else
    {
        game.canvas = CanvasPool.create(game, config.width, config.height, config.renderType);
    }

    //  Does the game config provide some canvas css styles to use?
    if (config.canvasStyle)
    {
        game.canvas.style = config.canvasStyle;
    }

    //  Pixel Art mode?
    if (config.pixelArt)
    {
        CanvasInterpolation.setCrisp(game.canvas);
    }

    //  Zoomed?
    if (config.zoom !== 1)
    {
        game.canvas.style.width = (config.width * config.zoom).toString() + 'px';
        game.canvas.style.height = (config.height * config.zoom).toString() + 'px';
    }

    if (config.renderType === CONST.HEADLESS)
    {
        //  Nothing more to do here
        return;
    }

    var CanvasRenderer;
    var WebGLRenderer;

    if (typeof WEBGL_RENDERER && typeof CANVAS_RENDERER)
    {
        CanvasRenderer = require('../renderer/canvas/CanvasRenderer');
        WebGLRenderer = require('../renderer/webgl/WebGLRenderer');

        //  Let the config pick the renderer type, as both are included
        if (config.renderType === CONST.WEBGL)
        {
            game.renderer = new WebGLRenderer(game);

            //  The WebGL Renderer sets this value during its init, not on construction
            game.context = null;
        }
        else
        {
            game.renderer = new CanvasRenderer(game);
            game.context = game.renderer.gameContext;
        }
    }

    if (typeof WEBGL_RENDERER && !typeof CANVAS_RENDERER)
    {
        WebGLRenderer = require('../renderer/webgl/WebGLRenderer');

        //  Force the type to WebGL, regardless what was requested
        config.renderType = CONST.WEBGL;

        game.renderer = new WebGLRenderer(game);

        //  The WebGL Renderer sets this value during its init, not on construction
        game.context = null;
    }

    if (!typeof WEBGL_RENDERER && typeof CANVAS_RENDERER)
    {
        CanvasRenderer = require('../renderer/canvas/CanvasRenderer');

        //  Force the type to Canvas, regardless what was requested
        config.renderType = CONST.CANVAS;

        game.renderer = new CanvasRenderer(game);

        game.context = game.renderer.gameContext;
    }
};

module.exports = CreateRenderer;
