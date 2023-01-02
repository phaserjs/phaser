/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @function Phaser.Core.CreateRenderer
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance on which the renderer will be set.
 */
var CreateRenderer = function (game)
{
    var config = game.config;

    if ((config.customEnvironment || config.canvas) && config.renderType === CONST.AUTO)
    {
        throw new Error('Must set explicit renderType in custom environment');
    }

    //  Not a custom environment, didn't provide their own canvas and not headless, so determine the renderer:
    if (!config.customEnvironment && !config.canvas && config.renderType !== CONST.HEADLESS)
    {
        if (config.renderType === CONST.AUTO)
        {
            config.renderType = Features.webGL ? CONST.WEBGL : CONST.CANVAS;
        }

        if (config.renderType === CONST.WEBGL)
        {
            if (!Features.webGL) { throw new Error('Cannot create WebGL context, aborting.'); }
        }
        else if (config.renderType === CONST.CANVAS)
        {
            if (!Features.canvas) { throw new Error('Cannot create Canvas context, aborting.'); }
        }
        else
        {
            throw new Error('Unknown value for renderer type: ' + config.renderType);
        }
    }

    //  Pixel Art mode?
    if (!config.antialias)
    {
        CanvasPool.disableSmoothing();
    }

    var baseSize = game.scale.baseSize;

    var width = baseSize.width;
    var height = baseSize.height;

    //  Does the game config provide its own canvas element to use?
    if (config.canvas)
    {
        game.canvas = config.canvas;

        game.canvas.width = width;
        game.canvas.height = height;
    }
    else
    {
        game.canvas = CanvasPool.create(game, width, height, config.renderType);
    }

    //  Does the game config provide some canvas css styles to use?
    if (config.canvasStyle)
    {
        game.canvas.style = config.canvasStyle;
    }

    //  Pixel Art mode?
    if (!config.antialias)
    {
        CanvasInterpolation.setCrisp(game.canvas);
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
