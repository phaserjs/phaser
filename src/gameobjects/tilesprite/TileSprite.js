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
 * [description]
 *
 * @class TileSprite
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
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
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Size,
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
         * [description]
         *
         * @name Phaser.GameObjects.TileSprite#tilePositionX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.tilePositionX = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.TileSprite#tilePositionY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.tilePositionY = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.TileSprite#dirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.dirty = true;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.TileSprite#tileTexture
         * @type {?WebGLTexture}
         * @default null
         * @since 3.0.0
         */
        this.tileTexture = null;

        /**
         * [description]
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
         * [description]
         *
         * @name Phaser.GameObjects.TileSprite#canvasPattern
         * @type {?CanvasPattern}
         * @default null
         * @since 3.0.0
         */
        this.canvasPattern = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.TileSprite#canvasBuffer
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvasBuffer = CanvasPool.create2D(null, this.potWidth, this.potHeight);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.TileSprite#canvasBufferCtx
         * @type {CanvasRenderingContext2D}
         * @since 3.0.0
         */
        this.canvasBufferCtx = this.canvasBuffer.getContext('2d');

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
     * [description]
     *
     * @method Phaser.GameObjects.TileSprite#updateTileTexture
     * @since 3.0.0
     */
    updateTileTexture: function ()
    {
        if (!this.dirty && this.oldFrame === this.frame)
        {
            return;
        }

        this.oldFrame = this.frame;

        this.canvasBufferCtx.clearRect(0, 0, this.canvasBuffer.width, this.canvasBuffer.height);

        if (this.renderer.gl)
        {
            this.canvasBufferCtx.drawImage(
                this.frame.source.image,
                this.frame.cutX, this.frame.cutY,
                this.frame.cutWidth, this.frame.cutHeight,
                0, 0,
                this.potWidth, this.potHeight
            );

            this.tileTexture = this.renderer.canvasToTexture(this.canvasBuffer, this.tileTexture, (this.tileTexture === null), this.scaleMode);
        }
        else
        {
            this.canvasBuffer.width = this.frame.cutWidth;
            this.canvasBuffer.height = this.frame.cutHeight;
            this.canvasBufferCtx.drawImage(
                this.frame.source.image,
                this.frame.cutX, this.frame.cutY,
                this.frame.cutWidth, this.frame.cutHeight,
                0, 0,
                this.frame.cutWidth, this.frame.cutHeight
            );

            this.canvasPattern = this.canvasBufferCtx.createPattern(this.canvasBuffer, 'repeat');
        }

        this.dirty = false;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.TileSprite#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        if (this.renderer)
        {
            this.renderer.deleteTexture(this.tileTexture);
        }

        CanvasPool.remove(this.canvasBuffer);

        this.canvasPattern = null;
        this.canvasBufferCtx = null;
        this.canvasBuffer = null;

        this.renderer = null;
        this.visible = false;
    }

});

module.exports = TileSprite;
