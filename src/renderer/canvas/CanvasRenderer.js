/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BlitImage = require('./utils/BlitImage');
var CanvasSnapshot = require('../snapshot/CanvasSnapshot');
var Class = require('../../utils/Class');
var CONST = require('../../const');
var DrawImage = require('./utils/DrawImage');
var GetBlendModes = require('./utils/GetBlendModes');
var ScaleModes = require('../ScaleModes');
var Smoothing = require('../../display/canvas/Smoothing');

/**
 * @classdesc
 * [description]
 *
 * @class CanvasRenderer
 * @memberOf Phaser.Renderer.Canvas
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser Game instance that owns this renderer.
 */
var CanvasRenderer = new Class({

    initialize:

    function CanvasRenderer (game)
    {
        /**
         * The Phaser Game instance that owns this renderer.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#type
         * @type {integer}
         * @since 3.0.0
         */
        this.type = CONST.CANVAS;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#drawCount
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.drawCount = 0;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = game.config.width;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = game.config.height;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#config
         * @type {RendererConfig}
         * @since 3.0.0
         */
        this.config = {
            clearBeforeRender: game.config.clearBeforeRender,
            pixelArt: game.config.pixelArt,
            backgroundColor: game.config.backgroundColor,
            resolution: game.config.resolution,
            autoResize: game.config.autoResize,
            roundPixels: game.config.roundPixels
        };

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#scaleMode
         * @type {integer}
         * @since 3.0.0
         */
        this.scaleMode = (game.config.pixelArt) ? ScaleModes.NEAREST : ScaleModes.LINEAR;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#gameCanvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.gameCanvas = game.canvas;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#gameContext
         * @type {CanvasRenderingContext2D}
         * @since 3.0.0
         */
        this.gameContext = (this.game.config.context) ? this.game.config.context : this.gameCanvas.getContext('2d');

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#currentContext
         * @type {CanvasRenderingContext2D}
         * @since 3.0.0
         */
        this.currentContext = this.gameContext;

        /**
         * Map to the required function.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#drawImage
         * @type {function}
         * @since 3.0.0
         */
        this.drawImage = DrawImage(this.config.roundPixels);

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#blitImage
         * @type {function}
         * @since 3.0.0
         */
        this.blitImage = BlitImage(this.config.roundPixels);

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#blendModes
         * @type {array}
         * @since 3.0.0
         */
        this.blendModes = GetBlendModes();

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#currentAlpha
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.currentAlpha = 1;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#currentBlendMode
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.currentBlendMode = 0;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#currentScaleMode
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.currentScaleMode = 0;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#snapshotCallback
         * @type {?SnapshotCallback}
         * @default null
         * @since 3.0.0
         */
        this.snapshotCallback = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#snapshotType
         * @type {?string}
         * @default null
         * @since 3.0.0
         */
        this.snapshotType = null;

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#snapshotEncoder
         * @type {?number}
         * @default null
         * @since 3.0.0
         */
        this.snapshotEncoder = null;

        this.init();
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#init
     * @since 3.0.0
     */
    init: function ()
    {
        this.resize(this.width, this.height);
    },

    /**
     * Resize the main game canvas.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#resize
     * @since 3.0.0
     *
     * @param {integer} width - [description]
     * @param {integer} height - [description]
     */
    resize: function (width, height)
    {
        var resolution = this.config.resolution;

        this.width = width * resolution;
        this.height = height * resolution;

        this.gameCanvas.width = this.width;
        this.gameCanvas.height = this.height;

        if (this.config.autoResize)
        {
            this.gameCanvas.style.width = (this.width / resolution) + 'px';
            this.gameCanvas.style.height = (this.height / resolution) + 'px';
        }

        //  Resizing a canvas will reset imageSmoothingEnabled (and probably other properties)
        if (this.scaleMode === ScaleModes.NEAREST)
        {
            Smoothing.disable(this.gameContext);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#onContextLost
     * @since 3.0.0
     *
     * @param {function} callback - [description]
     */
    onContextLost: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#onContextRestored
     * @since 3.0.0
     *
     * @param {function} callback - [description]
     */
    onContextRestored: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#resetTransform
     * @since 3.0.0
     */
    resetTransform: function ()
    {
        this.currentContext.setTransform(1, 0, 0, 1, 0, 0);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#setBlendMode
     * @since 3.0.0
     *
     * @param {number} blendMode - [description]
     *
     * @return {number} [description]
     */
    setBlendMode: function (blendMode)
    {
        if (this.currentBlendMode !== blendMode)
        {
            this.currentContext.globalCompositeOperation = blendMode;
            this.currentBlendMode = blendMode;
        }

        return this.currentBlendMode;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#setAlpha
     * @since 3.0.0
     *
     * @param {float} alpha - [description]
     *
     * @return {float} [description]
     */
    setAlpha: function (alpha)
    {
        if (this.currentAlpha !== alpha)
        {
            this.currentContext.globalAlpha = alpha;
            this.currentAlpha = alpha;
        }

        return this.currentAlpha;
    },

    /**
     * Called at the start of the render loop.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#preRender
     * @since 3.0.0
     */
    preRender: function ()
    {
        var ctx = this.gameContext;
        var config = this.config;

        var width = this.width;
        var height = this.height;

        if (config.clearBeforeRender)
        {
            ctx.clearRect(0, 0, width, height);
        }

        if (!config.transparent)
        {
            ctx.fillStyle = config.backgroundColor.rgba;
            ctx.fillRect(0, 0, width, height);
        }

        this.drawCount = 0;
    },

    /**
     * Renders the Scene to the given Camera.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#render
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     * @param {Phaser.GameObjects.DisplayList} children - [description]
     * @param {float} interpolationPercentage - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    render: function (scene, children, interpolationPercentage, camera)
    {
        var ctx = scene.sys.context;
        var scissor = (camera.x !== 0 || camera.y !== 0 || camera.width !== ctx.canvas.width || camera.height !== ctx.canvas.height);
        var list = children.list;
        var resolution = this.config.resolution;

        this.currentContext = ctx;

        //  If the alpha or blend mode didn't change since the last render, then don't set them again (saves 2 ops)

        if (!camera.transparent)
        {
            ctx.fillStyle = camera.backgroundColor.rgba;
            ctx.fillRect(camera.x, camera.y, camera.width, camera.height);
        }

        if (this.currentAlpha !== 1)
        {
            ctx.globalAlpha = 1;
            this.currentAlpha = 1;
        }

        if (this.currentBlendMode !== 0)
        {
            ctx.globalCompositeOperation = 'source-over';
            this.currentBlendMode = 0;
        }

        this.currentScaleMode = 0;

        this.drawCount += list.length;

        if (scissor)
        {
            ctx.save();
            ctx.beginPath();
            ctx.rect(camera.x * resolution, camera.y * resolution, camera.width * resolution, camera.height * resolution);
            ctx.clip();
        }

        var matrix = camera.matrix.matrix;

        ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

        for (var c = 0; c < list.length; c++)
        {
            var child = list[c];

            if (child.mask)
            {
                child.mask.preRenderCanvas(this, child, camera);
            }

            child.renderCanvas(this, child, interpolationPercentage, camera);

            if (child.mask)
            {
                child.mask.postRenderCanvas(this, child, camera);
            }
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = 'source-over';

        camera.flashEffect.postRenderCanvas(ctx);
        camera.fadeEffect.postRenderCanvas(ctx);

        //  Reset the camera scissor
        if (scissor)
        {
            ctx.restore();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#postRender
     * @since 3.0.0
     */
    postRender: function ()
    {
        var ctx = this.gameContext;

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';

        this.currentAlpha = 1;
        this.currentBlendMode = 0;

        if (this.snapshotCallback)
        {
            this.snapshotCallback(CanvasSnapshot(this.gameCanvas, this.snapshotType, this.snapshotEncoder));
            this.snapshotCallback = null;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#snapshot
     * @since 3.0.0
     *
     * @param {SnapshotCallback} callback - [description]
     * @param {string} type - [description]
     * @param {number} encoderOptions - [description]
     */
    snapshot: function (callback, type, encoderOptions)
    {
        this.snapshotCallback = callback;
        this.snapshotType = type;
        this.snapshotEncoder = encoderOptions;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.gameCanvas = null;
        this.gameContext = null;

        this.game = null;
    }

});

module.exports = CanvasRenderer;
