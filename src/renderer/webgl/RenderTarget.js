/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A Render Target encapsulates a WebGL framebuffer and the WebGL Texture that displays it.
 *
 * Instances of this class are created by, and belong to WebGL Pipelines.
 *
 * @class RenderTarget
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The WebGLPipeline to which this Render Target belongs.
 * @param {number} width - The width of the WebGL Pipeline.
 * @param {number} height - The height of the WebGL Pipeline.
 * @param {number} scale - A value between 0 and 1. Controls the size of this Render Target in relation to the Renderer.
 * @param {number} minFilter - The minFilter mode of the texture when created. 0 is `LINEAR`, 1 is `NEAREST`.
 * @param {boolean} autoClear - Automatically clear this framebuffer when bound?
 */
var RenderTarget = new Class({

    initialize:

    function RenderTarget (pipeline, width, height, scale, minFilter, autoClear)
    {
        /**
         * A reference to the WebGLPipeline that owns this Render Target.
         *
         * A Render Target class can only belong to a single pipeline.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#pipeline
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @since 3.50.0
         */
        this.pipeline = pipeline;

        /**
         * A reference to the WebGLRenderer instance.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.50.0
         */
        this.renderer = pipeline.renderer;

        /**
         * The WebGLFramebuffer of this Render Target.
         *
         * This is created in the `RenderTarget.resize` method.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#framebuffer
         * @type {WebGLFramebuffer}
         * @since 3.50.0
         */
        this.framebuffer = null;

        /**
         * The WebGLTexture of this Render Target.
         *
         * This is created in the `RenderTarget.resize` method.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#texture
         * @type {WebGLTexture}
         * @since 3.50.0
         */
        this.texture = null;

        /**
         * The width of the texture.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#width
         * @type {number}
         * @readonly
         * @since 3.50.0
         */
        this.width = 0;

        /**
         * The height of the texture.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#height
         * @type {number}
         * @readonly
         * @since 3.50.0
         */
        this.height = 0;

        /**
         * A value between 0 and 1. Controls the size of this Render Target in relation to the Renderer.
         *
         * A value of 1 matches it. 0.5 makes the Render Target half the size of the renderer, etc.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#scale
         * @type {number}
         * @since 3.50.0
         */
        this.scale = scale;

        /**
         * The minFilter mode of the texture. 0 is `LINEAR`, 1 is `NEAREST`.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#minFilter
         * @type {number}
         * @since 3.50.0
         */
        this.minFilter = minFilter;

        /**
         * Controls if this Render Target is automatically cleared (via `gl.COLOR_BUFFER_BIT`)
         * during the `RenderTarget.bind` method.
         *
         * If you need more control over how, or if, the target is cleared, you can disable
         * this via the config on creation, or even toggle it directly at runtime.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#autoClear
         * @type {boolean}
         * @since 3.50.0
         */
        this.autoClear = autoClear;

        this.resize(width, height);
    },

    /**
     * Resizes this Render Target.
     *
     * Deletes both the frame buffer and texture, if they exist and then re-creates
     * them using the new sizes.
     *
     * This method is called automatically by the pipeline during its resize handler.
     *
     * @method Phaser.Renderer.WebGL.RenderTarget#resize
     * @since 3.50.0
     *
     * @param {number} width - The new width of the WebGL Pipeline.
     * @param {number} height - The new height of the WebGL Pipeline.
     *
     * @return {this} This RenderTarget instance.
     */
    resize: function (width, height)
    {
        var renderer = this.renderer;

        renderer.deleteFramebuffer(this.framebuffer);

        renderer.deleteTexture(this.texture);

        width *= this.scale;
        height *= this.scale;

        this.texture = renderer.createTextureFromSource(null, width, height, this.minFilter);
        this.framebuffer = renderer.createFramebuffer(width, height, this.texture, false);

        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Pushes this Render Target as the current frame buffer of the renderer.
     *
     * If `autoClear` is set, then clears the texture.
     *
     * @method Phaser.Renderer.WebGL.RenderTarget#bind
     * @since 3.50.0
     */
    bind: function ()
    {
        this.renderer.pushFramebuffer(this.framebuffer);

        if (this.autoClear)
        {
            var gl = this.pipeline.gl;

            gl.clearColor(0, 0, 0, 0);

            gl.clear(gl.COLOR_BUFFER_BIT);
        }
    },

    /**
     * Unbinds this Render Target.
     *
     * @name Phaser.Renderer.WebGL.RenderTarget#unbind
     * @since 3.50.0
     *
     * @return {WebGLFramebuffer} The Framebuffer that was set, or `null` if there aren't any more in the stack.
     */
    unbind: function ()
    {
        return this.renderer.popFramebuffer();
    },

    /**
     * Removes all external references from this class and deletes the
     * WebGL framebuffer and texture instances.
     *
     * Does not remove this Render Target from the parent pipeline.
     *
     * @name Phaser.Renderer.WebGL.RenderTarget#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        var renderer = this.pipeline.renderer;

        renderer.deleteFramebuffer(this.framebuffer);
        renderer.deleteTexture(this.texture);

        this.pipeline = null;
        this.framebuffer = null;
        this.texture = null;
    }

});

module.exports = RenderTarget;
