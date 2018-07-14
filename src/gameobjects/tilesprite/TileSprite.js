/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CanvasPool = require('../../display/canvas/CanvasPool');
var Class = require('../../utils/Class');
var Components = require('../components');
var CONST = require('../../const');
var GameObject = require('../GameObject');
var GetPowerOfTwo = require('../../math/pow2/GetPowerOfTwo');
var TileSpriteRender = require('./TileSpriteRender');

/**
 * @classdesc
 * A TileSprite is a Sprite that has a repeating texture.
 *
 * The texture can be scrolled and scaled independently of the TileSprite itself. Textures will automatically wrap and
 * are designed so that you can create game backdrops using seamless textures as a source.
 *
 * You shouldn't ever create a TileSprite any larger than your actual screen size. If you want to create a large repeating background
 * that scrolls across the whole map of your game, then you create a TileSprite that fits the screen size and then use the `tilePosition`
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
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} width - The width of the Game Object.
 * @param {number} height - The height of the Game Object.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var TileSprite = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        TileSpriteRender
    ],

    initialize:

    function TileSprite (scene, x, y, width, height, texture, frame)
    {
        var renderer = scene.sys.game.renderer;

        GameObject.call(this, scene, 'TileSprite');

        /**
         * The horizontal scroll position of the Tile Sprite.
         *
         * @name Phaser.GameObjects.TileSprite#tilePositionX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.tilePositionX = 0;

        /**
         * The vertical scroll position of the Tile Sprite.
         *
         * @name Phaser.GameObjects.TileSprite#tilePositionY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.tilePositionY = 0;

        /**
         * The horizontal scale of the Tile Sprite texture.
         *
         * @name Phaser.GameObjects.TileSprite#tileScaleX
         * @type {number}
         * @default 1
         * @since 3.11.0
         */
        this.tileScaleX = 1;

        /**
         * The vertical scale of the Tile Sprite texture.
         *
         * @name Phaser.GameObjects.TileSprite#tileScaleY
         * @type {number}
         * @default 1
         * @since 3.11.0
         */
        this.tileScaleY = 1;

        /**
         * Whether the Tile Sprite has changed in some way, requiring an re-render of its tile texture.
         *
         * Such changes include the texture frame and scroll position of the Tile Sprite.
         *
         * @name Phaser.GameObjects.TileSprite#dirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.dirty = true;

        /**
         * The texture that the Tile Sprite is rendered to, which is then rendered to a Scene.
         * In WebGL this is a WebGLTexture. In Canvas it's a Canvas Fill Pattern.
         *
         * @name Phaser.GameObjects.TileSprite#tileTexture
         * @type {?(WebGLTexture|CanvasPattern)}
         * @default null
         * @since 3.0.0
         */
        this.tileTexture = null;

        /**
         * The renderer in use by this Tile Sprite.
         *
         * @name Phaser.GameObjects.TileSprite#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.0.0
         */
        this.renderer = renderer;

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOriginFromFrame();
        this.initPipeline('TextureTintPipeline');

        /**
         * The next power of two value from the width of the Frame.
         *
         * @name Phaser.GameObjects.TileSprite#potWidth
         * @type {integer}
         * @since 3.0.0
         */
        this.potWidth = GetPowerOfTwo(this.frame.width);

        /**
         * The next power of two value from the height of the Frame.
         *
         * @name Phaser.GameObjects.TileSprite#potHeight
         * @type {integer}
         * @since 3.0.0
         */
        this.potHeight = GetPowerOfTwo(this.frame.height);

        /**
         * The Canvas Pattern used to repeat the TileSprite's texture.
         *
         * @name Phaser.GameObjects.TileSprite#canvasPattern
         * @type {?CanvasPattern}
         * @default null
         * @since 3.0.0
         */
        // this.canvasPattern = null;

        /**
         * The Canvas that the TileSprite's texture is rendered to.
         *
         * @name Phaser.GameObjects.TileSprite#canvasBuffer
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvasBuffer = CanvasPool.create2D(this, this.potWidth, this.potHeight);

        /**
         * The Canvas Context used to render the TileSprite's texture.
         *
         * @name Phaser.GameObjects.TileSprite#canvasBufferCtx
         * @type {CanvasRenderingContext2D}
         * @since 3.0.0
         */
        this.canvasBufferCtx = this.canvasBuffer.getContext('2d');

        /**
         * The previous Texture Frame being used.
         *
         * @name Phaser.GameObjects.Components.Texture#oldFrame
         * @type {Phaser.Textures.Frame}
         * @private
         * @since 3.0.0
         */
        this.oldFrame = null;

        this.updateTileTexture();

        if (scene.sys.game.config.renderType === CONST.WEBGL)
        {
            scene.sys.game.renderer.onContextRestored(function (renderer)
            {
                var gl = renderer.gl;

                this.tileTexture = null;
                this.dirty = true;
                this.tileTexture = renderer.createTexture2D(0, gl.LINEAR, gl.LINEAR, gl.REPEAT, gl.REPEAT, gl.RGBA, this.canvasBuffer, this.potWidth, this.potHeight);
            }, this);
        }
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
     * @return {Phaser.GameObjects.TileSprite} This Tile Sprite instance.
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
     * Render the tile texture if it is dirty, or if the frame has changed.
     *
     * @method Phaser.GameObjects.TileSprite#updateTileTexture
     * @since 3.0.0
     */
    updateTileTexture: function ()
    {
        var frame = this.frame;

        if (!this.dirty && this.oldFrame === frame)
        {
            return;
        }

        this.oldFrame = frame;

        var ctx = this.canvasBufferCtx;
        var canvas = this.canvasBuffer;

        var fw = this.potWidth;
        var fh = this.potHeight;

        if (!this.renderer.gl)
        {
            fw = frame.cutWidth;
            fh = frame.cutHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = fw;
        canvas.height = fh;

        ctx.drawImage(
            frame.source.image,
            frame.cutX, frame.cutY,
            frame.cutWidth, frame.cutHeight,
            0, 0,
            fw, fh
        );

        this.tileTexture = (this.renderer.gl) ? this.renderer.canvasToTexture(canvas, this.tileTexture) : ctx.createPattern(canvas, 'repeat');

        this.dirty = false;
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
            this.renderer.deleteTexture(this.tileTexture);
        }

        CanvasPool.remove(this.canvasBuffer);

        this.tileTexture = null;
        this.canvasBufferCtx = null;
        this.canvasBuffer = null;

        this.renderer = null;
    }

});

module.exports = TileSprite;
