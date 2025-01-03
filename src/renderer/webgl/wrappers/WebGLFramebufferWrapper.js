/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

// Possible errors that can be thrown by `gl.checkFramebufferStatus()`.
/**
 * @ignore 
 */
var errors = {
    36054: 'Incomplete Attachment',
    36055: 'Missing Attachment',
    36057: 'Incomplete Dimensions',
    36061: 'Framebuffer Unsupported'
};

/**
 * @classdesc
 * Wrapper for a WebGL frame buffer,
 * containing all the information that was used to create it.
 *
 * A WebGLFramebuffer should never be exposed outside the WebGLRenderer,
 * so the WebGLRenderer can handle context loss and other events
 * without other systems having to be aware of it.
 * Always use WebGLFramebufferWrapper instead.
 *
 * @class WebGLFramebufferWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 3.80.0
 *
 * @param {WebGLRenderingContext} gl - The WebGLRenderingContext to create the WebGLFramebuffer for.
 * @param {number} width - If `addDepthStencilBuffer` is true, this controls the width of the depth stencil.
 * @param {number} height - If `addDepthStencilBuffer` is true, this controls the height of the depth stencil.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} renderTexture - The color texture where the color pixels are written.
 * @param {boolean} [addDepthStencilBuffer=false] - Create a Renderbuffer for the depth stencil?
 */
var WebGLFramebufferWrapper = new Class({

    initialize:

    function WebGLFramebufferWrapper (gl, width, height, renderTexture, addDepthStencilBuffer)
    {
        /**
         * The WebGLFramebuffer being wrapped by this class.
         *
         * This property could change at any time.
         * Therefore, you should never store a reference to this value.
         * It should only be passed directly to the WebGL API for drawing.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#webGLFramebuffer
         * @type {?WebGLFramebuffer}
         * @default null
         * @since 3.80.0
         */
        this.webGLFramebuffer = null;

        /**
         * The WebGL context this WebGLFramebuffer belongs to.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#gl
         * @type {WebGLRenderingContext}
         * @since 3.80.0
         */
        this.gl = gl;

        /**
         * Width of the depth stencil.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#width
         * @type {number}
         * @since 3.80.0
         */
        this.width = width;

        /**
         * Height of the depth stencil.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#height
         * @type {number}
         * @since 3.80.0
         */
        this.height = height;

        /**
         * The color texture where the color pixels are written.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#renderTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 3.80.0
         */
        this.renderTexture = renderTexture;

        /**
         * Create a Renderbuffer for the depth stencil?
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#addDepthStencilBuffer
         * @type {boolean}
         * @default false
         * @since 3.80.0
         */
        this.addDepthStencilBuffer = !!addDepthStencilBuffer;

        this.createResource();
    },

    /**
     * Creates a WebGLFramebuffer from the given parameters.
     *
     * This is called automatically by the constructor. It may also be
     * called again if the WebGLFramebuffer needs re-creating.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#createResource
     * @since 3.80.0
     */
    createResource: function ()
    {
        var gl = this.gl;

        if (gl.isContextLost())
        {
            // GL state can't be updated right now.
            // `createResource` will run when the context is restored.
            return;
        }

        var renderTexture = this.renderTexture;
        var complete = 0;
        var framebuffer = gl.createFramebuffer();

        this.webGLFramebuffer = framebuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        renderTexture.isRenderTexture = true;
        renderTexture.isAlphaPremultiplied = false;

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture.webGLTexture, 0);

        complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (complete !== gl.FRAMEBUFFER_COMPLETE)
        {
            throw new Error('Framebuffer status: ' + (errors[complete] || complete));
        }

        if (this.addDepthStencilBuffer)
        {
            var depthStencilBuffer = gl.createRenderbuffer();

            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilBuffer);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },

    /**
     * Destroys this WebGLFramebufferWrapper.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#destroy
     * @since 3.80.0
     */
    destroy: function ()
    {
        if (this.webGLFramebuffer === null)
        {
            return;
        }

        var gl = this.gl;

        if (!gl.isContextLost())
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.webGLFramebuffer);

            // Check for a color attachment and remove it
            var colorAttachment = gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);

            if (colorAttachment !== null)
            {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);

                gl.deleteTexture(colorAttachment);
            }

            // Check for a depth-stencil attachment and remove it
            var depthStencilAttachment = gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);

            if (depthStencilAttachment !== null)
            {
                gl.deleteRenderbuffer(depthStencilAttachment);
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            gl.deleteFramebuffer(this.webGLFramebuffer);
        }

        this.renderTexture = null;
        this.webGLFramebuffer = null;
        this.gl = null;
    }
});

module.exports = WebGLFramebufferWrapper;
