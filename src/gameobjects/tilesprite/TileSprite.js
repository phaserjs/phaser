/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var CanvasPool = require('../../display/canvas/CanvasPool');
var DefaultTileSpriteNodes = require('../../renderer/webgl/renderNodes/defaults/DefaultTileSpriteNodes');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var Smoothing = require('../../display/canvas/Smoothing');
var TileSpriteRender = require('./TileSpriteRender');
var UUID = require('../../utils/string/UUID');
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
 * Prior to Phaser 4, TileSprite did not support rotation.
 * In WebGL, it required the texture to be a power of two in size,
 * and did not support compressed textures or DynamicTextures.
 * It could introduce aliasing artifacts for textures that were not
 * a power of two in size.
 * These restrictions have been lifted in v4.
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
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} width - The width of the Game Object. If zero it will use the size of the texture frame.
 * @param {number} height - The height of the Game Object. If zero it will use the size of the texture frame.
 * @param {string} textureKey - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager. Cannot be a DynamicTexture.
 * @param {(string|number)} [frameKey] - An optional frame from the Texture this Game Object is rendering with.
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
        Components.Lighting,
        Components.Mask,
        Components.Origin,
        Components.RenderNodes,
        Components.ScrollFactor,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        TileSpriteRender
    ],

    initialize:

    function TileSprite (scene, x, y, width, height, textureKey, frameKey)
    {
        var renderer = scene.sys.renderer;

        var isCanvas = renderer && !renderer.gl;

        GameObject.call(this, scene, 'TileSprite');

        var displayTexture = scene.sys.textures.get(textureKey);
        var displayFrame = displayTexture.get(frameKey);

        width = width ? Math.floor(width) : displayFrame.width;
        height = height ? Math.floor(height) : displayFrame.height;

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
         * Internal tile rotation value.
         *
         * @name Phaser.GameObjects.TileSprite#_tileRotation
         * @type {number}
         * @private
         * @since 4.0.0
         */
        this._tileRotation = 0;

        /**
         * Whether the Tile Sprite has changed in some way, requiring an re-render of its tile texture.
         *
         * Such changes include the texture frame and scroll position of the Tile Sprite.
         *
         * This is irrelevant in WebGL mode.
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
        this.canvas = isCanvas ? CanvasPool.create(this, width, height) : null;

        /**
         * The Context of the Canvas element that the TileSprite renders its fill pattern in to.
         * Only used in Canvas mode.
         *
         * @name Phaser.GameObjects.TileSprite#context
         * @type {?CanvasRenderingContext2D}
         * @since 3.12.0
         */
        this.context = isCanvas ? this.canvas.getContext('2d', { willReadFrequently: false }) : null;

        /**
         * The internal unique key to refer to the texture in the TextureManager.
         *
         * @name Phaser.GameObjects.TileSprite#_displayTextureKey
         * @type {string}
         * @private
         * @since 3.80.0
         */
        this._displayTextureKey = UUID();

        /**
         * The internal Texture to which the TileSprite renders its fill pattern. Only used in Canvas mode.
         *
         * @name Phaser.GameObjects.TileSprite#displayTexture
         * @type {?(Phaser.Textures.Texture|Phaser.Textures.CanvasTexture)}
         * @private
         * @since 3.12.0
         */
        this.displayTexture = isCanvas ? scene.sys.textures.addCanvas(this._displayTextureKey, this.canvas) : null;

        /**
         * The internal Texture Frame the TileSprite is using as its fill pattern. Only used in Canvas mode.
         *
         * @name Phaser.GameObjects.TileSprite#displayFrame
         * @type {?Phaser.Textures.Frame}
         * @private
         * @since 3.12.0
         */
        this.displayFrame = this.displayTexture ? this.displayTexture.get() : null;

        /**
         * The frame currently displayed. This is used internally to track
         * animation updates.
         *
         * @name Phaser.GameObjects.TileSprite#currentFrame
         * @type {Phaser.Textures.Frame}
         * @private
         * @since 4.0.0
         */
        this.currentFrame = null;

        /**
         * The Canvas that the TileSprites texture is rendered to.
         * This is used to create a WebGL texture from.
         *
         * @name Phaser.GameObjects.TileSprite#fillCanvas
         * @type {HTMLCanvasElement}
         * @since 3.12.0
         */
        this.fillCanvas = isCanvas ? CanvasPool.create2D(this, displayFrame.width, this.displayFrame.height) : null;

        /**
         * The Canvas Context used to render the TileSprites texture.
         *
         * @name Phaser.GameObjects.TileSprite#fillContext
         * @type {CanvasRenderingContext2D}
         * @since 3.12.0
         */
        this.fillContext = this.fillCanvas ? this.fillCanvas.getContext('2d', { willReadFrequently: false }) : null;

        /**
         * The texture that the Tile Sprite is rendered to, which is then rendered to a Scene.
         * In WebGL this is a WebGLTextureWrapper. In Canvas it's a Canvas Fill Pattern.
         *
         * @name Phaser.GameObjects.TileSprite#fillPattern
         * @type {?(Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper|CanvasPattern)}
         * @since 3.12.0
         */
        this.fillPattern = null;

        /**
         * The Animation State component of this TileSprite.
         *
         * This component provides features to apply animations to this TileSprite.
         * It is responsible for playing, loading, queuing animations for later playback,
         * mixing between animations and setting the current animation frame to this Sprite.
         *
         * @name Phaser.GameObjects.TileSprite#anims
         * @type {Phaser.Animations.AnimationState}
         * @since 3.0.0
         */
        this.anims = new AnimationState(this);

        this.setTexture(textureKey, frameKey);
        this.setPosition(x, y);
        this.setSize(width, height);
        this.setOrigin(0.5, 0.5);
        this.initRenderNodes(this._defaultRenderNodesMap);
    },

    /**
     * The default render nodes for this Game Object.
     *
     * @name Phaser.GameObjects.TileSprite#_defaultRenderNodesMap
     * @type {Map<string, string>}
     * @private
     * @webglOnly
     * @readonly
     * @since 4.0.0
     */
    _defaultRenderNodesMap: {
        get: function ()
        {
            return DefaultTileSpriteNodes;
        }
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    /**
     * Update this TileSprite's animations.
     *
     * @method Phaser.GameObjects.TileSprite#preUpdate
     * @protected
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);
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
        var newFrame = this.texture.get(frame);

        if (!newFrame.cutWidth || !newFrame.cutHeight)
        {
            this.renderFlags &= ~_FLAG;
        }
        else
        {
            this.renderFlags |= _FLAG;
        }

        this.frame = newFrame;

        this.dirty = true;

        return this;
    },

    /**
     * No-op method for compatibility with Animation.
     *
     * @method Phaser.GameObjects.TileSprite#setSizeToFrame
     * @since 4.0.0
     * @return {this} This Tile Sprite instance.
     */
    setSizeToFrame: function ()
    {
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
     * Sets {@link Phaser.GameObjects.TileSprite#tileRotation}.
     *
     * @method Phaser.GameObjects.TileSprite#setTileRotation
     * @since 4.0.0
     *
     * @param {number} [radians=0] - The rotation of the tiling texture, in radians.
     */
    setTileRotation: function (radians)
    {
        if (radians === undefined) { radians = 0; }

        this.tileRotation = radians;

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
     * This is called automatically during Canvas rendering.
     * It is not used by WebGL.
     *
     * @method Phaser.GameObjects.TileSprite#updateTileTexture
     * @private
     * @since 3.0.0
     */
    updateTileTexture: function ()
    {
        if (!this.renderer || this.renderer.gl)
        {
            return;
        }

        //  Draw the texture to our fillCanvas

        var frame = this.frame;

        var ctx = this.fillContext;
        var canvas = this.fillCanvas;

        var fw = frame.cutWidth;
        var fh = frame.cutHeight;

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

        this.fillPattern = ctx.createPattern(canvas, 'repeat');

        this.currentFrame = frame;
    },

    /**
     * Draw the fill pattern to the internal canvas.
     *
     * This is called automatically during Canvas rendering.
     * It is not used by WebGL.
     *
     * @method Phaser.GameObjects.TileSprite#updateCanvas
     * @private
     * @since 3.12.0
     */
    updateCanvas: function ()
    {
        var canvas = this.canvas;
        var width = this.width;
        var height = this.height;

        var newFrame = this.currentFrame !== this.frame;

        if (canvas.width !== width || canvas.height !== height || newFrame)
        {
            canvas.width = width;
            canvas.height = height;

            this.displayFrame.setSize(width, height);
            this.updateDisplayOrigin();

            if (newFrame)
            {
                this.updateTileTexture();
            }

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

        ctx.clearRect(0, 0, width, height);

        ctx.save();

        ctx.rotate(this._tileRotation);

        ctx.scale(scaleX, scaleY);

        ctx.translate(-positionX, -positionY);

        ctx.fillStyle = this.fillPattern;

        var scaledWidth = Math.max(width, Math.abs(width / scaleX));
        var scaledHeight = Math.max(height, Math.abs(height / scaleY));
        var hypotenuse = Math.sqrt(scaledWidth * scaledWidth + scaledHeight * scaledHeight);

        ctx.fillRect(
            positionX - hypotenuse,
            positionY - hypotenuse,
            2 * hypotenuse,
            2 * hypotenuse
        );

        ctx.restore();

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
        if (this.canvas)
        {
            CanvasPool.remove(this.canvas);
        }
        if (this.fillCanvas)
        {
            CanvasPool.remove(this.fillCanvas);
        }

        this.fillPattern = null;
        this.fillContext = null;
        this.fillCanvas = null;

        this.displayTexture = null;
        this.displayFrame = null;

        this.renderer = null;

        this.anims.destroy();

        this.anims = undefined;
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
     * The rotation of the Tile Sprite texture, in radians.
     *
     * @name Phaser.GameObjects.TileSprite#tileRotation
     * @type {number}
     * @default 0
     * @since 4.0.0
     */
    tileRotation: {
        get: function ()
        {
            return this._tileRotation;
        },

        set: function (radians)
        {
            this._tileRotation = radians;
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
