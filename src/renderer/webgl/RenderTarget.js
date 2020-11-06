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
 * Instances of this class belong WebGL Pipelines.
 *
 * @class RenderTarget
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The WebGLPipeline to which this Render Target belongs.
 * @param {number} width - The width of the WebGL Pipeline.
 * @param {number} height - The height of the WebGL Pipeline.
 * @param {number} scale - The scale of the Render Target. This is a scale factor applied to the pipeline size.
 * @param {boolean} autoClear - Automatically gl clear this framebuffer during render?
 */
var RenderTarget = new Class({

    initialize:

    function RenderTarget (pipeline, width, height, scale, autoClear)
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
         * The WebGLFramebuffer this pipeline is targeting, if any.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#framebuffer
         * @type {WebGLFramebuffer}
         * @since 3.50.0
         */
        this.framebuffer = null;

        /**
         * The WebGLTexture this pipeline is targeting, if any.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#texture
         * @type {WebGLTexture}
         * @since 3.50.0
         */
        this.texture = null;

        /**
         * The dimensions of this Render Target are based on the scale of the WebGLRenderer.
         *
         * This value controls how much those dimensions are scaled.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#scale
         * @type {number}
         * @since 3.50.0
         */
        this.scale = scale;

        /**
         * Controls if this Render Target is automatically cleared (via `gl.COLOR_BUFFER_BIT`)
         * during the `WebGLPipeline.postBind` method.
         *
         * If you need more control over how, or if, the target is cleared, you can disable
         * this via the config, or even directly at runtime.
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

        this.texture = renderer.createTextureFromSource(null, width, height, 0);

        this.framebuffer = renderer.createFramebuffer(width, height, this.texture, false);

        return this;
    },

    /**
     * Sets the program this shader uses as being the active shader in the WebGL Renderer.
     *
     * This method is called every time the parent pipeline is made the current active pipeline.
     *
     * @method Phaser.Renderer.WebGL.WebGLShader#bind
     * @since 3.50.0
     *
     * @param {boolean} [setAttributes=false] - Should the vertex attribute pointers be set?
     * @param {boolean} [flush=false] - Flush the pipeline before binding this shader?
     *
     * @return {this} This WebGLShader instance.
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

    unbind: function ()
    {
        this.renderer.popFramebuffer();
    },

    draw: function ()
    {
        var texture = this.texture;

        var width = texture.width;
        var height = texture.height;

        this.pipeline.drawFillRect(0, 0, width, height, 0x0, 1, texture, true);
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
