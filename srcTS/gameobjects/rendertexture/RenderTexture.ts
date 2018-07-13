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
var Render = require('./RenderTextureRender');
var RenderTextureCanvas = require('./RenderTextureCanvas');
var RenderTextureWebGL = require('./RenderTextureWebGL');

/**
 * @classdesc
 * A Render Texture.
 *
 * @class RenderTexture
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.2.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.MatrixStack
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {integer} [width=32] - The width of the Render Texture.
 * @param {integer} [height=32] - The height of the Render Texture.
 */
var RenderTexture = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Mask,
        Components.MatrixStack,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function RenderTexture (scene, x, y, width, height)
    {
        if (width === undefined) { width = 32; }
        if (height === undefined) { height = 32; }

        GameObject.call(this, scene, 'RenderTexture');

        this.initMatrixStack();

        /**
         * A reference to either the Canvas or WebGL Renderer that the Game instance is using.
         *
         * @name Phaser.GameObjects.RenderTexture#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.2.0
         */
        this.renderer = scene.sys.game.renderer;

        /**
         * The tint of the Render Texture when rendered.
         *
         * @name Phaser.GameObjects.RenderTexture#globalTint
         * @type {number}
         * @default 0xffffff
         * @since 3.2.0
         */
        this.globalTint = 0xffffff;

        /**
         * The alpha of the Render Texture when rendered.
         *
         * @name Phaser.GameObjects.RenderTexture#globalAlpha
         * @type {number}
         * @default 1
         * @since 3.2.0
         */
        this.globalAlpha = 1;

        /**
         * The HTML Canvas Element that the Render Texture is drawing to.
         * This is only set if Phaser is running with the Canvas Renderer.
         *
         * @name Phaser.GameObjects.RenderTexture#canvas
         * @type {?HTMLCanvasElement}
         * @since 3.2.0
         */
        this.canvas = null;

        /**
         * A reference to the Rendering Context belonging to the Canvas Element this Render Texture is drawing to.
         * This is only set if Phaser is running with the Canvas Renderer.
         *
         * @name Phaser.GameObjects.RenderTexture#context
         * @type {?CanvasRenderingContext2D}
         * @since 3.2.0
         */
        this.context = null;

        /**
         * A reference to the GL Frame Buffer this Render Texture is drawing to.
         * This is only set if Phaser is running with the WebGL Renderer.
         *
         * @name Phaser.GameObjects.RenderTexture#framebuffer
         * @type {?WebGLFramebuffer}
         * @since 3.2.0
         */
        this.framebuffer = null;

        if (this.renderer.type === CONST.WEBGL)
        {
            var gl = this.renderer.gl;

            this.gl = gl;
            this.fill = RenderTextureWebGL.fill;
            this.clear = RenderTextureWebGL.clear;
            this.draw = RenderTextureWebGL.draw;
            this.drawFrame = RenderTextureWebGL.drawFrame;
            this.texture = this.renderer.createTexture2D(0, gl.NEAREST, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.RGBA, null, width, height, false);
            this.framebuffer = this.renderer.createFramebuffer(width, height, this.texture, false);
        }
        else if (this.renderer.type === CONST.CANVAS)
        {
            this.fill = RenderTextureCanvas.fill;
            this.clear = RenderTextureCanvas.clear;
            this.draw = RenderTextureCanvas.draw;
            this.drawFrame = RenderTextureCanvas.drawFrame;
            this.canvas = CanvasPool.create2D(this, width, height);
            this.context = this.canvas.getContext('2d');
        }

        this.setPosition(x, y);
        this.setSize(width, height);
        this.initPipeline('TextureTintPipeline');
    },

    /**
     * Resizes the Render Texture to the new dimensions given.
     *
     * In WebGL it will destroy and then re-create the frame buffer being used by the Render Texture.
     * In Canvas it will resize the underlying canvas element.
     * Both approaches will erase everything currently drawn to the Render Texture.
     *
     * If the dimensions given are the same as those already being used, calling this method will do nothing.
     *
     * @method Phaser.GameObjects.RenderTexture#resize
     * @since 3.10.0
     *
     * @param {number} width - The new width of the Render Texture.
     * @param {number} [height] - The new height of the Render Texture. If not specified, will be set the same as the `width`.
     *
     * @return {this} This Render Texture.
     */
    resize: function (width, height)
    {
        if (height === undefined) { height = width; }

        if (width !== this.width || height !== this.height)
        {
            if (this.canvas)
            {
                this.canvas.width = width;
                this.canvas.height = height;
            }
            else
            {
                this.renderer.deleteTexture(this.texture);
                this.renderer.deleteFramebuffer(this.framebuffer);

                var gl = this.renderer.gl;

                this.texture = this.renderer.createTexture2D(0, gl.NEAREST, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.RGBA, null, width, height, false);
                this.framebuffer = this.renderer.createFramebuffer(width, height, this.texture, false);
            }

            this.setSize(width, height);
        }

        return this;
    },

    /**
     * Set the tint to use when rendering this Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#setGlobalTint
     * @since 3.2.0
     *
     * @param {integer} tint - The tint value.
     *
     * @return {this} This Render Texture.
     */
    setGlobalTint: function (tint)
    {
        this.globalTint = tint;

        return this;
    },

    /**
     * Set the alpha to use when rendering this Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#setGlobalAlpha
     * @since 3.2.0
     *
     * @param {number} alpha - The alpha value.
     *
     * @return {this} This Render Texture.
     */
    setGlobalAlpha: function (alpha)
    {
        this.globalAlpha = alpha;

        return this;
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.RenderTexture#preDestroy
     * @protected
     * @since 3.9.0
     */
    preDestroy: function ()
    {
        if (this.renderer && this.renderer.gl)
        {
            this.renderer.deleteTexture(this.texture);
            this.renderer.deleteFramebuffer(this.framebuffer);
        }
    }

    /**
     * Fills the Render Texture with the given color.
     *
     * @method Phaser.GameObjects.RenderTexture#fill
     * @since 3.2.0
     *
     * @param {number} rgb - The color to fill the Render Texture with.
     *
     * @return {Phaser.GameObjects.RenderTexture} This Game Object.
     */

    /**
     * Clears the Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#clear
     * @since 3.2.0
     *
     * @return {Phaser.GameObjects.RenderTexture} This Game Object.
     */

    /**
     * Draws a texture frame to the Render Texture at the given position.
     *
     * @method Phaser.GameObjects.RenderTexture#draw
     * @since 3.2.0
     *
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {number} x - The x position to draw the frame at.
     * @param {number} y - The y position to draw the frame at.
     *
     * @return {Phaser.GameObjects.RenderTexture} This Game Object.
     */

});

module.exports = RenderTexture;
