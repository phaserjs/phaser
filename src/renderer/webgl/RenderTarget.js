/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Events = require('../events');

/**
 * @classdesc
 * A Render Target encapsulates a WebGL framebuffer and the WebGL Texture that displays it.
 *
 * Instances of this class are typically created by, and belong to WebGL Pipelines, however
 * other Game Objects and classes can take advantage of Render Targets as well.
 *
 * @class RenderTarget
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the WebGLRenderer.
 * @param {number} width - The width of this Render Target.
 * @param {number} height - The height of this Render Target.
 * @param {number} [scale=1] - A value between 0 and 1. Controls the size of this Render Target in relation to the Renderer.
 * @param {number} [minFilter=0] - The minFilter mode of the texture when created. 0 is `LINEAR`, 1 is `NEAREST`.
 * @param {boolean} [autoClear=true] - Automatically clear this framebuffer when bound?
 * @param {boolean} [autoResize=false] - Automatically resize this Render Target if the WebGL Renderer resizes?
 * @param {boolean} [addDepthBuffer=true] - Add a DEPTH_STENCIL and attachment to this Render Target?
 * @param {boolean} [forceClamp=true] - Force the texture to use the CLAMP_TO_EDGE wrap mode, even if a power of two?
 */
var RenderTarget = new Class({

    initialize:

    function RenderTarget (renderer, width, height, scale, minFilter, autoClear, autoResize, addDepthBuffer, forceClamp)
    {
        if (scale === undefined) { scale = 1; }
        if (minFilter === undefined) { minFilter = 0; }
        if (autoClear === undefined) { autoClear = true; }
        if (autoResize === undefined) { autoResize = false; }
        if (addDepthBuffer === undefined) { addDepthBuffer = true; }
        if (forceClamp === undefined) { forceClamp = true; }

        /**
         * A reference to the WebGLRenderer instance.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.50.0
         */
        this.renderer = renderer;

        /**
         * The Framebuffer of this Render Target.
         *
         * This is created in the `RenderTarget.resize` method.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#framebuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper}
         * @since 3.50.0
         */
        this.framebuffer = null;

        /**
         * The WebGLTextureWrapper of this Render Target.
         *
         * This is created in the `RenderTarget.resize` method.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#texture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
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

        /**
         * Does this Render Target automatically resize when the WebGL Renderer does?
         *
         * Modify this property via the `setAutoResize` method.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#autoResize
         * @type {boolean}
         * @readonly
         * @since 3.50.0
         */
        this.autoResize = true;

        /**
         * Does this Render Target have a Depth Buffer?
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#hasDepthBuffer
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.hasDepthBuffer = addDepthBuffer;

        /**
         * Force the WebGL Texture to use the CLAMP_TO_EDGE wrap mode, even if a power of two?
         *
         * If `false` it will use `gl.REPEAT` instead, which may be required for some effects, such
         * as using this Render Target as a texture for a Shader.
         *
         * @name Phaser.Renderer.WebGL.RenderTarget#forceClamp
         * @type {boolean}
         * @since 3.60.0
         */
        this.forceClamp = forceClamp;

        this.init(width, height);

        if (autoResize)
        {
            this.renderer.on(Events.RESIZE, this.resize, this);
        }
        else
        {
            //  Block resizing unless this RT allows it
            this.autoResize = false;
        }
    },

    /**
     * Sets up this Render Target to the given width and height, creating a new
     * frame buffer and texture. This method is called automatically by the constructor
     * and at no other time.
     *
     * @method Phaser.Renderer.WebGL.RenderTarget#init
     * @since 3.86.0
     *
     * @param {number} width - The new width of this Render Target.
     * @param {number} height - The new height of this Render Target.
     */
    init: function (width, height)
    {
        var renderer = this.renderer;

        this.texture = renderer.createTextureFromSource(null, width, height, this.minFilter, this.forceClamp);
        this.framebuffer = renderer.createFramebuffer(width, height, this.texture, this.hasDepthBuffer);

        this.width = width;
        this.height = height;
    },

    /**
     * Sets if this Render Target should automatically resize when the WebGL Renderer
     * emits a resize event.
     *
     * @method Phaser.Renderer.WebGL.RenderTarget#setAutoResize
     * @since 3.50.0
     *
     * @param {boolean} autoResize - Automatically resize this Render Target when the WebGL Renderer resizes?
     *
     * @return {this} This RenderTarget instance.
     */
    setAutoResize: function (autoResize)
    {
        if (autoResize && !this.autoResize)
        {
            this.renderer.on(Events.RESIZE, this.resize, this);

            this.autoResize = true;
        }
        else if (!autoResize && this.autoResize)
        {
            this.renderer.off(Events.RESIZE, this.resize, this);

            this.autoResize = false;
        }

        return this;
    },

    /**
     * Resizes this Render Target as long as the given width and height are different
     * to the current width and height.
     *
     * Deletes both the frame buffer and texture, if they exist and then re-creates
     * them using the new sizes.
     *
     * This method is called automatically by the pipeline during its resize handler.
     *
     * @method Phaser.Renderer.WebGL.RenderTarget#resize
     * @since 3.50.0
     *
     * @param {number} width - The new width of this Render Target.
     * @param {number} height - The new height of this Render Target.
     *
     * @return {this} This RenderTarget instance.
     */
    resize: function (width, height)
    {
        if (this.autoResize && this.willResize(width, height))
        {
            var renderer = this.renderer;

            renderer.deleteFramebuffer(this.framebuffer);

            renderer.deleteTexture(this.texture);

            this.texture = renderer.createTextureFromSource(null, width, height, this.minFilter, this.forceClamp);
            this.framebuffer = renderer.createFramebuffer(width, height, this.texture, this.hasDepthBuffer);

            this.width = width;
            this.height = height;
        }

        return this;
    },

    /**
     * Checks if this Render Target will resize, or not, if given the new
     * width and height values.
     *
     * @method Phaser.Renderer.WebGL.RenderTarget#willResize
     * @since 3.70.0
     *
     * @param {number} width - The new width of this Render Target.
     * @param {number} height - The new height of this Render Target.
     *
     * @return {boolean} `true` if the Render Target will resize, otherwise `false`.
     */
    willResize: function (width, height)
    {
        if (typeof width !== 'number' || typeof height !== 'number')
        {
            return false;
        }

        width = Math.round(width * this.scale);
        height = Math.round(height * this.scale);

        width = Math.max(width, 1);
        height = Math.max(height, 1);
        
        return (width !== this.width || height !== this.height);
    },

    /**
     * Pushes this Render Target as the current frame buffer of the renderer.
     *
     * If `autoClear` is set, then clears the texture.
     *
     * If `adjustViewport` is `true` then it will flush the renderer and then adjust the GL viewport.
     *
     * @method Phaser.Renderer.WebGL.RenderTarget#bind
     * @since 3.50.0
     *
     * @param {boolean} [adjustViewport=false] - Adjust the GL viewport by calling `RenderTarget.adjustViewport` ?
     * @param {number} [width] - Optional new width of this Render Target.
     * @param {number} [height] - Optional new height of this Render Target.
     */
    bind: function (adjustViewport, width, height)
    {
        if (adjustViewport === undefined) { adjustViewport = false; }

        var renderer = this.renderer;

        if (adjustViewport)
        {
            renderer.flush();
        }

        if (width && height)
        {
            this.resize(width, height);
        }

        renderer.pushFramebuffer(this.framebuffer, false, false);

        if (adjustViewport)
        {
            this.adjustViewport();
        }

        if (this.autoClear)
        {
            var gl = this.renderer.gl;

            gl.clearColor(0, 0, 0, 0);

            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        renderer.clearStencilMask();
    },

    /**
     * Adjusts the GL viewport to match the width and height of this Render Target.
     *
     * Also disables `SCISSOR_TEST`.
     *
     * @method Phaser.Renderer.WebGL.RenderTarget#adjustViewport
     * @since 3.50.0
     */
    adjustViewport: function ()
    {
        var gl = this.renderer.gl;

        gl.viewport(0, 0, this.width, this.height);

        gl.disable(gl.SCISSOR_TEST);
    },

    /**
     * Clears a portion or everything from this Render Target. To clear an area,
     * specify the `x`, `y`, `width` and `height`.
     * 
     * @param {number} [x=0] - The left coordinate of the fill rectangle.
     * @param {number} [y=0] - The top coordinate of the fill rectangle.
     * @param {number} [width=this.width] - The width of the fill rectangle.
     * @param {number} [height=this.height] - The height of the fill rectangle.
     *
     * @method Phaser.Renderer.WebGL.RenderTarget#clear
     * @since 3.50.0
     */
    clear: function (x, y, width, height)
    {
        var renderer = this.renderer;
        var gl = renderer.gl;

        renderer.pushFramebuffer(this.framebuffer);

        if (x !== undefined && y !== undefined && width !== undefined && height !== undefined)
        {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(x, y, width, height);
        }
        else
        {
            gl.disable(gl.SCISSOR_TEST);
        }

        gl.clearColor(0, 0, 0, 0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        renderer.popFramebuffer();

        renderer.resetScissor();
    },

    /**
     * Unbinds this Render Target and optionally flushes the WebGL Renderer first.
     *
     * @name Phaser.Renderer.WebGL.RenderTarget#unbind
     * @since 3.50.0
     *
     * @param {boolean} [flush=false] - Flush the WebGL Renderer before unbinding?
     *
     * @return {Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper} The Framebuffer that was set, or `null` if there aren't any more in the stack.
     */
    unbind: function (flush)
    {
        if (flush === undefined) { flush = false; }

        var renderer = this.renderer;

        if (flush)
        {
            renderer.flush();
        }

        return renderer.popFramebuffer();
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
        var renderer = this.renderer;

        renderer.off(Events.RESIZE, this.resize, this);

        renderer.deleteFramebuffer(this.framebuffer);
        renderer.deleteTexture(this.texture);

        this.renderer = null;
        this.framebuffer = null;
        this.texture = null;
    }

});

module.exports = RenderTarget;
