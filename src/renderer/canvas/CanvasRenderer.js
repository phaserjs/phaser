/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CanvasSnapshot = require('../snapshot/CanvasSnapshot');
var Class = require('../../utils/Class');
var CONST = require('../../const');
var GetBlendModes = require('./utils/GetBlendModes');
var ScaleModes = require('../ScaleModes');
var Smoothing = require('../../display/canvas/Smoothing');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');

/**
 * @classdesc
 * [description]
 *
 * @class CanvasRenderer
 * @memberof Phaser.Renderer.Canvas
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
            backgroundColor: game.config.backgroundColor,
            resolution: game.config.resolution,
            autoResize: game.config.autoResize,
            antialias: game.config.antialias,
            roundPixels: game.config.roundPixels
        };

        /**
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#scaleMode
         * @type {integer}
         * @since 3.0.0
         */
        this.scaleMode = (game.config.antialias) ? ScaleModes.LINEAR : ScaleModes.NEAREST;

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
         * [description]
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#blendModes
         * @type {array}
         * @since 3.0.0
         */
        this.blendModes = GetBlendModes();

        // image-rendering: optimizeSpeed;
        // image-rendering: pixelated;

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

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#_tempMatrix4
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix4 = new TransformMatrix();

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
     * @return {this} [description]
     */
    setBlendMode: function (blendMode)
    {
        this.currentContext.globalCompositeOperation = blendMode;

        return this;
    },

    /**
     * Changes the Canvas Rendering Context that all draw operations are performed against.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#setContext
     * @since 3.12.0
     *
     * @param {?CanvasRenderingContext2D} [ctx] - The new Canvas Rendering Context to draw everything to. Leave empty to reset to the Game Canvas.
     *
     * @return {this} The Canvas Renderer instance.
     */
    setContext: function (ctx)
    {
        this.currentContext = (ctx) ? ctx : this.gameContext;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#setAlpha
     * @since 3.0.0
     *
     * @param {number} alpha - [description]
     *
     * @return {this} [description]
     */
    setAlpha: function (alpha)
    {
        this.currentContext.globalAlpha = alpha;

        return this;
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
     * @param {number} interpolationPercentage - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    render: function (scene, children, interpolationPercentage, camera)
    {
        var list = children.list;
        var childCount = list.length;

        var cx = camera._cx;
        var cy = camera._cy;
        var cw = camera._cw;
        var ch = camera._ch;

        var ctx = (camera.renderToTexture) ? camera.context : scene.sys.context;

        var scissor = (cx !== 0 || cy !== 0 || cw !== ctx.canvas.width || ch !== ctx.canvas.height);

        this.currentContext = ctx;

        //  If the alpha or blend mode didn't change since the last render, then don't set them again (saves 2 ops)

        if (!camera.transparent)
        {
            ctx.fillStyle = camera.backgroundColor.rgba;
            ctx.fillRect(cx, cy, cw, ch);
        }

        ctx.globalAlpha = camera.alpha;

        ctx.globalCompositeOperation = 'source-over';

        this.drawCount += list.length;

        if (scissor)
        {
            ctx.save();
            ctx.beginPath();
            ctx.rect(cx, cy, cw, ch);
            ctx.clip();
        }

        if (camera.renderToTexture)
        {
            camera.emit('prerender', camera);
        }

        camera.matrix.copyToContext(ctx);

        for (var i = 0; i < childCount; i++)
        {
            var child = list[i];

            if (!child.willRender(camera))
            {
                continue;
            }

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
        ctx.globalAlpha = 1;

        camera.flashEffect.postRenderCanvas(ctx);
        camera.fadeEffect.postRenderCanvas(ctx);

        camera.dirty = false;

        //  Reset the camera scissor
        if (scissor)
        {
            ctx.restore();
        }

        if (camera.renderToTexture)
        {
            camera.emit('postrender', camera);

            scene.sys.context.drawImage(camera.canvas, cx, cy);
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
     * Takes a Sprite Game Object, or any object that extends it, and draws it to the current context.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#batchSprite
     * @since 3.12.0
     *
     * @param {Phaser.GameObjects.GameObject} sprite - The texture based Game Object to draw.
     * @param {Phaser.Textures.Frame} frame - The frame to draw, doesn't have to be that owned by the Game Object.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use for the rendering transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - The transform matrix of the parent container, if set.
     */
    batchSprite: function (sprite, frame, camera, parentTransformMatrix)
    {
        var alpha = camera.alpha * sprite.alpha;

        if (alpha === 0)
        {
            //  Nothing to see, so abort early
            return;
        }
    
        var ctx = this.currentContext;

        var camMatrix = this._tempMatrix1;
        var spriteMatrix = this._tempMatrix2;
        var calcMatrix = this._tempMatrix3;

        var cd = frame.canvasData;

        var frameX = cd.x;
        var frameY = cd.y;
        var frameWidth = frame.cutWidth;
        var frameHeight = frame.cutHeight;
        var res = frame.source.resolution;

        var x = -sprite.displayOriginX + frame.x;
        var y = -sprite.displayOriginY + frame.y;

        var fx = (sprite.flipX) ? -1 : 1;
        var fy = (sprite.flipY) ? -1 : 1;
    
        if (sprite.isCropped)
        {
            var crop = sprite._crop;

            if (crop.flipX !== sprite.flipX || crop.flipY !== sprite.flipY)
            {
                frame.updateCropUVs(crop, sprite.flipX, sprite.flipY);
            }

            frameWidth = crop.cw;
            frameHeight = crop.ch;
    
            frameX = crop.cx;
            frameY = crop.cy;

            x = -sprite.displayOriginX + crop.x;
            y = -sprite.displayOriginY + crop.y;

            if (fx === -1)
            {
                if (x >= 0)
                {
                    x = -(x + frameWidth);
                }
                else if (x < 0)
                {
                    x = (Math.abs(x) - frameWidth);
                }
            }
        
            if (fy === -1)
            {
                if (y >= 0)
                {
                    y = -(y + frameHeight);
                }
                else if (y < 0)
                {
                    y = (Math.abs(y) - frameHeight);
                }
            }
        }

        spriteMatrix.applyITRS(sprite.x, sprite.y, sprite.rotation, sprite.scaleX, sprite.scaleY);

        camMatrix.copyFrom(camera.matrix);

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * sprite.scrollFactorX, -camera.scrollY * sprite.scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = sprite.x;
            spriteMatrix.f = sprite.y;

            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(spriteMatrix, calcMatrix);
        }
        else
        {
            spriteMatrix.e -= camera.scrollX * sprite.scrollFactorX;
            spriteMatrix.f -= camera.scrollY * sprite.scrollFactorY;
    
            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(spriteMatrix, calcMatrix);
        }

        ctx.save();
       
        calcMatrix.setToContext(ctx);

        ctx.scale(fx, fy);

        ctx.globalCompositeOperation = this.blendModes[sprite.blendMode];

        ctx.globalAlpha = alpha;

        ctx.drawImage(frame.source.image, frameX, frameY, frameWidth, frameHeight, x, y, frameWidth / res, frameHeight / res);

        ctx.restore();
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
