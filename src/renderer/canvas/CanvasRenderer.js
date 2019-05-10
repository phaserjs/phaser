/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasSnapshot = require('../snapshot/CanvasSnapshot');
var CameraEvents = require('../../cameras/2d/events');
var Class = require('../../utils/Class');
var CONST = require('../../const');
var GetBlendModes = require('./utils/GetBlendModes');
var ScaleModes = require('../ScaleModes');
var Smoothing = require('../../display/canvas/Smoothing');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');

/**
 * @classdesc
 * The Canvas Renderer is responsible for managing 2D canvas rendering contexts, including the one used by the Game's canvas. It tracks the internal state of a given context and can renderer textured Game Objects to it, taking into account alpha, blending, and scaling.
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
         * A constant which allows the renderer to be easily identified as a Canvas Renderer.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#type
         * @type {integer}
         * @since 3.0.0
         */
        this.type = CONST.CANVAS;

        /**
         * The total number of Game Objects which were rendered in a frame.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#drawCount
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.drawCount = 0;

        /**
         * The width of the canvas being rendered to.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#width
         * @type {integer}
         * @since 3.0.0
         */
        this.width = 0;

        /**
         * The height of the canvas being rendered to.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#height
         * @type {integer}
         * @since 3.0.0
         */
        this.height = 0;

        /**
         * The local configuration settings of the CanvasRenderer.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = {
            clearBeforeRender: game.config.clearBeforeRender,
            backgroundColor: game.config.backgroundColor,
            resolution: game.config.resolution,
            antialias: game.config.antialias,
            roundPixels: game.config.roundPixels
        };

        /**
         * The scale mode which should be used by the CanvasRenderer.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#scaleMode
         * @type {integer}
         * @since 3.0.0
         */
        this.scaleMode = (game.config.antialias) ? ScaleModes.LINEAR : ScaleModes.NEAREST;

        /**
         * The canvas element which the Game uses.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#gameCanvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.gameCanvas = game.canvas;

        /**
         * The canvas context used to render all Cameras in all Scenes during the game loop.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#gameContext
         * @type {CanvasRenderingContext2D}
         * @since 3.0.0
         */
        this.gameContext = (this.game.config.context) ? this.game.config.context : this.gameCanvas.getContext('2d');

        /**
         * The canvas context currently used by the CanvasRenderer for all rendering operations.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#currentContext
         * @type {CanvasRenderingContext2D}
         * @since 3.0.0
         */
        this.currentContext = this.gameContext;

        /**
         * The blend modes supported by the Canvas Renderer.
         *
         * This object maps the {@link Phaser.BlendModes} to canvas compositing operations.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#blendModes
         * @type {array}
         * @since 3.0.0
         */
        this.blendModes = GetBlendModes();

        // image-rendering: optimizeSpeed;
        // image-rendering: pixelated;

        /**
         * The scale mode currently in use by the Canvas Renderer.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#currentScaleMode
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.currentScaleMode = 0;

        /**
         * Details about the currently scheduled snapshot.
         * 
         * If a non-null `callback` is set in this object, a snapshot of the canvas will be taken after the current frame is fully rendered.
         *
         * @name Phaser.Renderer.Canvas.CanvasRenderer#snapshotState
         * @type {Phaser.Types.Renderer.Snapshot.SnapshotState}
         * @since 3.16.0
         */
        this.snapshotState = {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            getPixel: false,
            callback: null,
            type: 'image/png',
            encoder: 0.92
        };

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
     * Prepares the game canvas for rendering.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#init
     * @since 3.0.0
     */
    init: function ()
    {
        this.game.scale.on('resize', this.onResize, this);

        var baseSize = this.game.scale.baseSize;

        this.resize(baseSize.width, baseSize.height);
    },

    /**
     * The event handler that manages the `resize` event dispatched by the Scale Manager.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#onResize
     * @since 3.16.0
     *
     * @param {Phaser.Structs.Size} gameSize - The default Game Size object. This is the un-modified game dimensions.
     * @param {Phaser.Structs.Size} baseSize - The base Size object. The game dimensions multiplied by the resolution. The canvas width / height values match this.
     * @param {Phaser.Structs.Size} displaySize - The display Size object. The size of the canvas style width / height attributes.
     * @param {number} [resolution] - The Scale Manager resolution setting.
     */
    onResize: function (gameSize, baseSize)
    {
        //  Has the underlying canvas size changed?
        if (baseSize.width !== this.width || baseSize.height !== this.height)
        {
            this.resize(baseSize.width, baseSize.height);
        }
    },

    /**
     * Resize the main game canvas.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#resize
     * @since 3.0.0
     *
     * @param {number} [width] - The new width of the renderer.
     * @param {number} [height] - The new height of the renderer.
     */
    resize: function (width, height)
    {
        this.width = width;
        this.height = height;

        //  Resizing a canvas will reset imageSmoothingEnabled (and probably other properties)
        if (this.scaleMode === ScaleModes.NEAREST)
        {
            Smoothing.disable(this.gameContext);
        }
    },

    /**
     * A NOOP method for handling lost context. Intentionally empty.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#onContextLost
     * @since 3.0.0
     *
     * @param {function} callback - Ignored parameter.
     */
    onContextLost: function ()
    {
    },

    /**
     * A NOOP method for handling restored context. Intentionally empty.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#onContextRestored
     * @since 3.0.0
     *
     * @param {function} callback - Ignored parameter.
     */
    onContextRestored: function ()
    {
    },

    /**
     * Resets the transformation matrix of the current context to the identity matrix, thus resetting any transformation.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#resetTransform
     * @since 3.0.0
     */
    resetTransform: function ()
    {
        this.currentContext.setTransform(1, 0, 0, 1, 0, 0);
    },

    /**
     * Sets the blend mode (compositing operation) of the current context.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#setBlendMode
     * @since 3.0.0
     *
     * @param {string} blendMode - The new blend mode which should be used.
     *
     * @return {this} This CanvasRenderer object.
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
     * Sets the global alpha of the current context.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#setAlpha
     * @since 3.0.0
     *
     * @param {number} alpha - The new alpha to use, where 0 is fully transparent and 1 is fully opaque.
     *
     * @return {this} This CanvasRenderer object.
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

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (config.clearBeforeRender)
        {
            ctx.clearRect(0, 0, width, height);
        }

        if (!config.transparent)
        {
            ctx.fillStyle = config.backgroundColor.rgba;
            ctx.fillRect(0, 0, width, height);
        }

        ctx.save();

        this.drawCount = 0;
    },

    /**
     * Renders the Scene to the given Camera.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#render
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene to render.
     * @param {Phaser.GameObjects.DisplayList} children - The Game Objects within the Scene to be rendered.
     * @param {number} interpolationPercentage - The interpolation percentage to apply. Currently unused.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Scene Camera to render with.
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

        //  Save context pre-clip
        ctx.save();

        if (this.game.scene.customViewports)
        {
            ctx.beginPath();
            ctx.rect(cx, cy, cw, ch);
            ctx.clip();
        }

        this.currentContext = ctx;

        var mask = camera.mask;

        if (mask)
        {
            mask.preRenderCanvas(this, null, camera._maskCamera);
        }

        if (!camera.transparent)
        {
            ctx.fillStyle = camera.backgroundColor.rgba;
            ctx.fillRect(cx, cy, cw, ch);
        }

        ctx.globalAlpha = camera.alpha;

        ctx.globalCompositeOperation = 'source-over';

        this.drawCount += list.length;

        if (camera.renderToTexture)
        {
            camera.emit(CameraEvents.PRE_RENDER, camera);
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

        if (mask)
        {
            mask.postRenderCanvas(this);
        }

        //  Restore pre-clip context
        ctx.restore();

        if (camera.renderToTexture)
        {
            camera.emit(CameraEvents.POST_RENDER, camera);

            scene.sys.context.drawImage(camera.canvas, cx, cy);
        }
    },

    /**
     * Restores the game context's global settings and takes a snapshot if one is scheduled.
     *
     * The post-render step happens after all Cameras in all Scenes have been rendered.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#postRender
     * @since 3.0.0
     */
    postRender: function ()
    {
        var ctx = this.gameContext;

        ctx.restore();

        var state = this.snapshotState;

        if (state.callback)
        {
            CanvasSnapshot(this.gameCanvas, state);

            state.callback = null;
        }
    },

    /**
     * Schedules a snapshot of the entire game viewport to be taken after the current frame is rendered.
     * 
     * To capture a specific area see the `snapshotArea` method. To capture a specific pixel, see `snapshotPixel`.
     * 
     * Only one snapshot can be active _per frame_. If you have already called `snapshotPixel`, for example, then
     * calling this method will override it.
     * 
     * Snapshots work by creating an Image object from the canvas data, this is a blocking process, which gets
     * more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#snapshot
     * @since 3.0.0
     *
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot image is created.
     * @param {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
     * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
     *
     * @return {this} This WebGL Renderer.
     */
    snapshot: function (callback, type, encoderOptions)
    {
        return this.snapshotArea(0, 0, this.gameCanvas.width, this.gameCanvas.height, callback, type, encoderOptions);
    },

    /**
     * Schedules a snapshot of the given area of the game viewport to be taken after the current frame is rendered.
     * 
     * To capture the whole game viewport see the `snapshot` method. To capture a specific pixel, see `snapshotPixel`.
     * 
     * Only one snapshot can be active _per frame_. If you have already called `snapshotPixel`, for example, then
     * calling this method will override it.
     * 
     * Snapshots work by creating an Image object from the canvas data, this is a blocking process, which gets
     * more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#snapshotArea
     * @since 3.16.0
     *
     * @param {integer} x - The x coordinate to grab from.
     * @param {integer} y - The y coordinate to grab from.
     * @param {integer} width - The width of the area to grab.
     * @param {integer} height - The height of the area to grab.
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot image is created.
     * @param {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
     * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
     *
     * @return {this} This WebGL Renderer.
     */
    snapshotArea: function (x, y, width, height, callback, type, encoderOptions)
    {
        var state = this.snapshotState;

        state.callback = callback;
        state.type = type;
        state.encoder = encoderOptions;
        state.getPixel = false;
        state.x = x;
        state.y = y;
        state.width = Math.min(width, this.gameCanvas.width);
        state.height = Math.min(height, this.gameCanvas.height);

        return this;
    },

    /**
     * Schedules a snapshot of the given pixel from the game viewport to be taken after the current frame is rendered.
     * 
     * To capture the whole game viewport see the `snapshot` method. To capture a specific area, see `snapshotArea`.
     * 
     * Only one snapshot can be active _per frame_. If you have already called `snapshotArea`, for example, then
     * calling this method will override it.
     * 
     * Unlike the other two snapshot methods, this one will return a `Color` object containing the color data for
     * the requested pixel. It doesn't need to create an internal Canvas or Image object, so is a lot faster to execute,
     * using less memory.
     *
     * @method Phaser.Renderer.Canvas.CanvasRenderer#snapshotPixel
     * @since 3.16.0
     *
     * @param {integer} x - The x coordinate of the pixel to get.
     * @param {integer} y - The y coordinate of the pixel to get.
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot pixel data is extracted.
     *
     * @return {this} This WebGL Renderer.
     */
    snapshotPixel: function (x, y, callback)
    {
        this.snapshotArea(x, y, 1, 1, callback);

        this.snapshotState.getPixel = true;

        return this;
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
     * Destroys all object references in the Canvas Renderer.
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
