/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../../display/canvas/CanvasPool');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameEvents = require('../../core/events');
var GameObject = require('../GameObject');
var GetPowerOfTwo = require('../../math/pow2/GetPowerOfTwo');
var Smoothing = require('../../display/canvas/Smoothing');
var TileSpriteRender = require('./TileSpriteRender');
var Vector2 = require('../../math/Vector2');

//  bitmask flag for GameObject.renderMask
var _FLAG = 8; // 1000

/**
 * @classdesc
 * A TileSprite is a Sprite that has a repeating texture.
 *
 * The texture can be scrolled and scaled independently of the TileSprite itself. Textures will automatically wrap and
 * are designed so that you can create game backdrops using seamless textures as a source.
 *
 * You shouldn't ever create a TileSprite any larger than your actual canvas size. If you want to create a large repeating background
 * that scrolls across the whole map of your game, then you create a TileSprite that fits the canvas size and then use the `tilePosition`
 * property to scroll the texture as the player moves. If you create a TileSprite that is thousands of pixels in size then it will
 * consume huge amounts of memory and cause performance issues. Remember: use `tilePosition` to scroll your texture and `tileScale` to
 * adjust the scale of the texture - don't resize the sprite itself or make it larger than it needs.
 *
 * An important note about Tile Sprites and NPOT textures: Internally, TileSprite textures use GL_REPEAT to provide
 * seamless repeating of the textures. This, combined with the way in which the textures are handled in WebGL, means
 * they need to be POT (power-of-two) sizes in order to wrap. If you provide a NPOT (non power-of-two) texture to a
 * TileSprite it will generate a POT sized canvas and draw your texture to it, scaled up to the POT size. It's then
 * scaled back down again during rendering to the original dimensions. While this works, in that it allows you to use
 * any size texture for a Tile Sprite, it does mean that NPOT textures are going to appear anti-aliased when rendered,
 * due to the interpolation that took place when it was resized into a POT texture. This is especially visible in
 * pixel art graphics. If you notice it and it becomes an issue, the only way to avoid it is to ensure that you
 * provide POT textures for Tile Sprites.
 *
 * @class TileSprite
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Crop
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.FX
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} width - The width of the Game Object. If zero it will use the size of the texture frame.
 * @param {number} height - The height of the Game Object. If zero it will use the size of the texture frame.
 * @param {string} textureKey - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frameKey] - An optional frame from the Texture this Game Object is rendering with.
 */
var TileSprite = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Crop,
        Components.Depth,
        Components.Flip,
        Components.FX,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScrollFactor,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        TileSpriteRender
    ],

    initialize:

    function TileSprite (scene, x, y, width, height, textureKey, frameKey)
    {
        var renderer = scene.sys.renderer;

        GameObject.call(this, scene, 'TileSprite');

        var displayTexture = scene.sys.textures.get(textureKey);
        var displayFrame = displayTexture.get(frameKey);

        if (!width || !height)
        {
            width = displayFrame.width;
            height = displayFrame.height;
        }
        else
        {
            width = Math.floor(width);
            height = Math.floor(height);
        }

        /**
         * Internal tile position vector.
         *
         * @name Phaser.GameObjects.TileSprite#_tilePosition
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.12.0
         */
        this._tilePosition = new Vector2();

        /**
         * Internal tile scale vector.
         *
         * @name Phaser.GameObjects.TileSprite#_tileScale
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.12.0
         */
        this._tileScale = new Vector2(1, 1);

        /**
         * Whether the Tile Sprite has changed in some way, requiring an re-render of its tile texture.
         *
         * Such changes include the texture frame and scroll position of the Tile Sprite.
         *
         * @name Phaser.GameObjects.TileSprite#dirty
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.dirty = false;

        /**
         * The renderer in use by this Tile Sprite.
         *
         * @name Phaser.GameObjects.TileSprite#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.0.0
         */
        this.renderer = renderer;

        /**
         * The Canvas element that the TileSprite renders its fill pattern in to.
         * Only used in Canvas mode.
         *
         * @name Phaser.GameObjects.TileSprite#canvas
         * @type {?HTMLCanvasElement}
         * @since 3.12.0
         */
        this.canvas = CanvasPool.create(this, width, height);

        /**
         * The Context of the Canvas element that the TileSprite renders its fill pattern in to.
         * Only used in Canvas mode.
         *
         * @name Phaser.GameObjects.TileSprite#context
         * @type {CanvasRenderingContext2D}
         * @since 3.12.0
         */
        this.context = this.canvas.getContext('2d');

        /**
         * The Texture the TileSprite is using as its fill pattern.
         *
         * @name Phaser.GameObjects.TileSprite#displayTexture
         * @type {Phaser.Textures.Texture|Phaser.Textures.CanvasTexture}
         * @private
         * @since 3.12.0
         */
        this.displayTexture = displayTexture;

        /**
         * The Frame the TileSprite is using as its fill pattern.
         *
         * @name Phaser.GameObjects.TileSprite#displayFrame
         * @type {Phaser.Textures.Frame}
         * @private
         * @since 3.12.0
         */
        this.displayFrame = displayFrame;

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.GameObjects.TileSprite#_crop
         * @type {object}
         * @private
         * @since 3.12.0
         */
        this._crop = this.resetCropObject();

        /**
         * The Texture this Game Object is using to render with.
         *
         * @name Phaser.GameObjects.TileSprite#texture
         * @type {Phaser.Textures.Texture|Phaser.Textures.CanvasTexture}
         * @since 3.0.0
         */
        this.texture = scene.sys.textures.addCanvas(null, this.canvas, true);

        /**
         * The Texture Frame this Game Object is using to render with.
         *
         * @name Phaser.GameObjects.TileSprite#frame
         * @type {Phaser.Textures.Frame}
         * @since 3.0.0
         */
        this.frame = this.texture.get();

        /**
         * The next power of two value from the width of the Fill Pattern frame.
         *
         * @name Phaser.GameObjects.TileSprite#potWidth
         * @type {number}
         * @since 3.0.0
         */
        this.potWidth = GetPowerOfTwo(displayFrame.width);

        /**
         * The next power of two value from the height of the Fill Pattern frame.
         *
         * @name Phaser.GameObjects.TileSprite#potHeight
         * @type {number}
         * @since 3.0.0
         */
        this.potHeight = GetPowerOfTwo(displayFrame.height);

        /**
         * The Canvas that the TileSprites texture is rendered to.
         * This is used to create a WebGL texture from.
         *
         * @name Phaser.GameObjects.TileSprite#fillCanvas
         * @type {HTMLCanvasElement}
         * @since 3.12.0
         */
        this.fillCanvas = CanvasPool.create2D(this, this.potWidth, this.potHeight);

        /**
         * The Canvas Context used to render the TileSprites texture.
         *
         * @name Phaser.GameObjects.TileSprite#fillContext
         * @type {CanvasRenderingContext2D}
         * @since 3.12.0
         */
        this.fillContext = this.fillCanvas.getContext('2d');

        /**
         * The texture that the Tile Sprite is rendered to, which is then rendered to a Scene.
         * In WebGL this is a WebGLTexture. In Canvas it's a Canvas Fill Pattern.
         *
         * @name Phaser.GameObjects.TileSprite#fillPattern
         * @type {?(WebGLTexture|CanvasPattern)}
         * @since 3.12.0
         */
        this.fillPattern = null;

        this.setPosition(x, y);
        this.setSize(width, height);
        this.setFrame(frameKey);
        this.setOriginFromFrame();
        this.initPipeline();

        scene.sys.game.events.on(GameEvents.CONTEXT_RESTORED, this.onContextRestored, this);
    },

    /**
     * Sets the texture and frame this Game Object will use to render with.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * @method Phaser.GameObjects.TileSprite#setTexture
     * @since 3.0.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture.
     *
     * @return {this} This Game Object instance.
     */
    setTexture: function (key, frame)
    {
        this.displayTexture = this.scene.sys.textures.get(key);

        return this.setFrame(frame);
    },

    /**
     * Sets the frame this Game Object will use to render with.
     *
     * The Frame has to belong to the current Texture being used.
     *
     * It can be either a string or an index.
     *
     * @method Phaser.GameObjects.TileSprite#setFrame
     * @since 3.0.0
     *
     * @param {(string|number)} frame - The name or index of the frame within the Texture.
     *
     * @return {this} This Game Object instance.
     */
    setFrame: function (frame)
    {
        var newFrame = this.displayTexture.get(frame);

        this.potWidth = GetPowerOfTwo(newFrame.width);
        this.potHeight = GetPowerOfTwo(newFrame.height);

        //  So updateCanvas is triggered
        this.canvas.width = 0;

        if (!newFrame.cutWidth || !newFrame.cutHeight)
        {
            this.renderFlags &= ~_FLAG;
        }
        else
        {
            this.renderFlags |= _FLAG;
        }

        this.displayFrame = newFrame;

        this.dirty = true;

        this.updateTileTexture();

        return this;
    },

    /**
     * Sets {@link Phaser.GameObjects.TileSprite#tilePositionX} and {@link Phaser.GameObjects.TileSprite#tilePositionY}.
     *
     * @method Phaser.GameObjects.TileSprite#setTilePosition
     * @since 3.3.0
     *
     * @param {number} [x] - The x position of this sprite's tiling texture.
     * @param {number} [y] - The y position of this sprite's tiling texture.
     *
     * @return {this} This Tile Sprite instance.
     */
    setTilePosition: function (x, y)
    {
        if (x !== undefined)
        {
            this.tilePositionX = x;
        }

        if (y !== undefined)
        {
            this.tilePositionY = y;
        }

        return this;
    },

    /**
     * Sets {@link Phaser.GameObjects.TileSprite#tileScaleX} and {@link Phaser.GameObjects.TileSprite#tileScaleY}.
     *
     * @method Phaser.GameObjects.TileSprite#setTileScale
     * @since 3.12.0
     *
     * @param {number} [x] - The horizontal scale of the tiling texture. If not given it will use the current `tileScaleX` value.
     * @param {number} [y=x] - The vertical scale of the tiling texture. If not given it will use the `x` value.
     *
     * @return {this} This Tile Sprite instance.
     */
    setTileScale: function (x, y)
    {
        if (x === undefined) { x = this.tileScaleX; }
        if (y === undefined) { y = x; }

        this.tileScaleX = x;
        this.tileScaleY = y;

        return this;
    },

    /**
     * Render the tile texture if it is dirty, or if the frame has changed.
     *
     * @method Phaser.GameObjects.TileSprite#updateTileTexture
     * @private
     * @since 3.0.0
     */
    updateTileTexture: function ()
    {
        if (!this.dirty || !this.renderer)
        {
            return;
        }

        //  Draw the displayTexture to our fillCanvas

        var frame = this.displayFrame;

        if (frame.source.isRenderTexture || frame.source.isGLTexture)
        {
            console.warn('TileSprites can only use Image or Canvas based textures');

            this.dirty = false;

            return;
        }

        var ctx = this.fillContext;
        var canvas = this.fillCanvas;

        var fw = this.potWidth;
        var fh = this.potHeight;

        if (!this.renderer || !this.renderer.gl)
        {
            fw = frame.cutWidth;
            fh = frame.cutHeight;
        }

        ctx.clearRect(0, 0, fw, fh);

        canvas.width = fw;
        canvas.height = fh;

        ctx.drawImage(
            frame.source.image,
            frame.cutX, frame.cutY,
            frame.cutWidth, frame.cutHeight,
            0, 0,
            fw, fh
        );

        if (this.renderer && this.renderer.gl)
        {
            this.fillPattern = this.renderer.canvasToTexture(canvas, this.fillPattern);
        }
        else
        {
            this.fillPattern = ctx.createPattern(canvas, 'repeat');
        }

        this.updateCanvas();

        this.dirty = false;
    },

    /**
     * Draw the fill pattern to the internal canvas.
     *
     * @method Phaser.GameObjects.TileSprite#updateCanvas
     * @private
     * @since 3.12.0
     */
    updateCanvas: function ()
    {
        var canvas = this.canvas;

        if (canvas.width !== this.width || canvas.height !== this.height)
        {
            canvas.width = this.width;
            canvas.height = this.height;

            this.frame.setSize(this.width, this.height);
            this.updateDisplayOrigin();

            this.dirty = true;
        }

        if (!this.dirty || this.renderer && this.renderer.gl)
        {
            this.dirty = false;
            return;
        }

        var ctx = this.context;

        if (!this.scene.sys.game.config.antialias)
        {
            Smoothing.disable(ctx);
        }

        var scaleX = this._tileScale.x;
        var scaleY = this._tileScale.y;

        var positionX = this._tilePosition.x;
        var positionY = this._tilePosition.y;

        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();

        ctx.scale(scaleX, scaleY);

        ctx.translate(-positionX, -positionY);

        ctx.fillStyle = this.fillPattern;

        ctx.fillRect(positionX, positionY, this.width / scaleX, this.height / scaleY);

        ctx.restore();

        this.dirty = false;
    },

    /**
     * Internal context-restored handler.
     *
     * @method Phaser.GameObjects.TileSprite#onContextRestored
     * @protected
     * @since 3.60.0
     */
    onContextRestored: function (renderer)
    {
        if (!renderer)
        {
            return;
        }

        var gl = renderer.gl;

        this.dirty = true;
        this.fillPattern = null;
        this.fillPattern = renderer.createTexture2D(0, gl.LINEAR, gl.LINEAR, gl.REPEAT, gl.REPEAT, gl.RGBA, this.fillCanvas, this.potWidth, this.potHeight);

    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.TileSprite#preDestroy
     * @protected
     * @since 3.9.0
     */
    preDestroy: function ()
    {
        if (this.renderer && this.renderer.gl)
        {
            this.renderer.deleteTexture(this.fillPattern);
        }

        CanvasPool.remove(this.canvas);
        CanvasPool.remove(this.fillCanvas);

        this.fillPattern = null;
        this.fillContext = null;
        this.fillCanvas = null;

        this.displayTexture = null;
        this.displayFrame = null;

        this.texture.destroy();

        this.renderer = null;

        this.scene.sys.game.events.off(GameEvents.CONTEXT_RESTORED, this.onContextRestored, this);
    },

    /**
     * The horizontal scroll position of the Tile Sprite.
     *
     * @name Phaser.GameObjects.TileSprite#tilePositionX
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    tilePositionX: {

        get: function ()
        {
            return this._tilePosition.x;
        },

        set: function (value)
        {
            this._tilePosition.x = value;
            this.dirty = true;
        }

    },

    /**
     * The vertical scroll position of the Tile Sprite.
     *
     * @name Phaser.GameObjects.TileSprite#tilePositionY
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    tilePositionY: {

        get: function ()
        {
            return this._tilePosition.y;
        },

        set: function (value)
        {
            this._tilePosition.y = value;
            this.dirty = true;
        }

    },

    /**
     * The horizontal scale of the Tile Sprite texture.
     *
     * @name Phaser.GameObjects.TileSprite#tileScaleX
     * @type {number}
     * @default 1
     * @since 3.11.0
     */
    tileScaleX: {

        get: function ()
        {
            return this._tileScale.x;
        },

        set: function (value)
        {
            this._tileScale.x = value;
            this.dirty = true;
        }

    },

    /**
     * The vertical scale of the Tile Sprite texture.
     *
     * @name Phaser.GameObjects.TileSprite#tileScaleY
     * @type {number}
     * @default 1
     * @since 3.11.0
     */
    tileScaleY: {

        get: function ()
        {
            return this._tileScale.y;
        },

        set: function (value)
        {
            this._tileScale.y = value;
            this.dirty = true;
        }

    }

});

module.exports = TileSprite;
