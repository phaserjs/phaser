/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../const');
var CanvasPool = require('../dom/CanvasPool');
var Features = require('../device/Features');
//var CanvasRenderer = require('../renderer/canvas/CanvasRenderer');
//var WebGLRenderer = require('../renderer/webgl/WebGLRenderer');
var CanvasInterpolation = require('../dom/CanvasInterpolation');
var RenderDevice = require('../renderer/RenderDevice');
var WebGLBackendInterface = require('../renderer/webgl/BackendInterface');
var WebGLResourceManager = require('../renderer/webgl/ResourceManager');
var RendererList = require('../renderer/RendererList');
/**
* Checks if the device is capable of using the requested renderer and sets it up or an alternative if not.
*
* @method Phaser.Game#setUpRenderer
* @protected
*/
var CreateRenderer = function (game)
{
    var config = game.config;
    var backend = null;
    var resourceManager = null;
    var rendererList = null;
    //  Game either requested Canvas,
    //  or requested AUTO or WEBGL but the browser doesn't support it, so fall back to Canvas
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

    if (config.renderType === CONST.WEBGL) 
    {
        var contextConfig = {
            alpha: true,
            antialias: true,
            premultipliedAlpha: true,
            stencil: true,
            preserveDrawingBuffer: false
        };
        var gl = game.canvas.getContext('webgl', contextConfig) || 
                 game.canvas.getContext('experimental-webgl', contextConfig);

        if (!gl)
        {
            throw new Error('This browser does not support WebGL. Try using the Canvas renderer.');
        }
        backend = new WebGLBackendInterface(gl);
        resourceManager = new WebGLResourceManager(gl);
    }
    rendererList = new RendererList(game);
    game.renderDevice = new RenderDevice(backend, resourceManager, rendererList);
    //  Create the renderer
    /*if (config.renderType === CONST.WEBGL)
    {
        game.renderer = new WebGLRenderer(game);
        game.context = null;
    }
    else
    {
        game.renderer = new CanvasRenderer(game);
        game.context = game.renderer.gameContext;

        //  debug
        game.canvas.id = 'game';
    }*/
};

module.exports = CreateRenderer;
