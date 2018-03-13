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
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.MatrixStack
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
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
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.MatrixStack,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Size,
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

        this.renderer = scene.sys.game.renderer;
        this.globalTint = 0xffffff;
        this.globalAlpha = 1.0;
        
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
            this.canvas = CanvasPool.create2D(null, width, height);
            this.context = this.canvas.getContext('2d');
        }

        this.setPosition(x, y);
        this.setSize(width, height);
        this.initPipeline('TextureTintPipeline');
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.RenderTexture#destroy
     * @since 3.2.0
     */
    destroy: function ()
    {
        GameObject.destroy.call(this);

        if (this.renderer.type === CONST.WEBGL)
        {
            this.renderer.deleteTexture(this.texture);
            this.renderer.deleteFramebuffer(this.framebuffer);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.RenderTexture#setGlobalTint
     * @since 3.2.0
     *
     * @param {int} tint [description]
     *
     * @return {Phaser.GameObjects.RenderTexture} [description]
     */
    setGlobalTint: function (tint)
    {
        this.globalTint = tint;
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.RenderTexture#setGlobalAlpha
     * @since 3.2.0
     *
     * @param {float} alpha [description]
     *
     * @return {Phaser.GameObjects.RenderTexture} [description]
     */
    setGlobalAlpha: function (alpha)
    {
        this.globalAlpha = alpha;
        return this;
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
     * @param {string|integer} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {number} x - The x position to draw the frame at.
     * @param {number} y - The y position to draw the frame at.
     *
     * @return {Phaser.GameObjects.RenderTexture} This Game Object.
     */

});

module.exports = RenderTexture;
