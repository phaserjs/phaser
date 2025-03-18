/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

// Possible errors that can be thrown by `gl.checkFramebufferStatus()`.
var errors = {
    36054: 'Incomplete Attachment',
    36055: 'Missing Attachment',
    36057: 'Incomplete Dimensions',
    36061: 'Framebuffer Unsupported'
};

/**
 * @typedef {object} Attachment
 * @since 4.0.0
 *
 * @property {GLenum} attachmentPoint - The attachment point for the attachment. This is a GLenum such as `gl.COLOR_ATTACHMENT0`, `gl.DEPTH_ATTACHMENT`, `gl.STENCIL_ATTACHMENT`, or `gl.DEPTH_STENCIL_ATTACHMENT`.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} [texture] - The texture for the attachment. Either a texture or a renderbuffer is required.
 * @property {WebGLRenderbuffer} [renderbuffer] - The renderbuffer for the attachment. Either a texture or a renderbuffer is required.
 * @property {GLenum} [internalFormat] - The internal format for the renderbuffer. This is a GLenum such as `gl.DEPTH_STENCIL`.
 */

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
 * This also manages the attachments to the framebuffer,
 * including renderbuffer life cycle.
 *
 * @class WebGLFramebufferWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 3.80.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer this WebGLFramebuffer belongs to.
 * @param {?Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]} colorAttachments - The color textures where the color pixels are written. If empty, the canvas will be used as the color attachment. Only the first color attachment is used in default WebGL1.
 * @param {boolean} [addStencilBuffer=false] - Whether to add a stencil buffer to the framebuffer. If the canvas is used as the color attachment, this will be ignored.
 * @param {boolean} [addDepthBuffer=false] - Whether to add a depth buffer to the framebuffer. If depth and stencil are both provided, they will be combined into a single depth-stencil buffer. If the canvas is used as the color attachment, this will be ignored.
 */
var WebGLFramebufferWrapper = new Class({

    initialize:

    function WebGLFramebufferWrapper (renderer, colorAttachments, addStencilBuffer, addDepthBuffer)
    {
        var gl = renderer.gl;

        /**
         * The WebGLFramebuffer being wrapped by this class.
         *
         * This property could change at any time.
         * Therefore, you should never store a reference to this value.
         * It should only be passed directly to the WebGL API for drawing.
         *
         * If the FrameBuffer is using the canvas as the color attachment,
         * this property will be `null`.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#webGLFramebuffer
         * @type {?WebGLFramebuffer}
         * @default null
         * @since 3.80.0
         */
        this.webGLFramebuffer = null;

        /**
         * The WebGLRenderer this WebGLFramebuffer belongs to.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * Whether to use the canvas as the color attachment.
         * If this is true, a framebuffer will not be created.
         * This is useful for the main framebuffer, which is created by the browser.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#useCanvas
         * @type {boolean}
         * @default false
         * @since 4.0.0
         */
        this.useCanvas = !colorAttachments || colorAttachments.length === 0;

        /**
         * Width of the depth stencil.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#width
         * @type {number}
         * @since 3.80.0
         */
        this.width = 0;

        /**
         * Height of the depth stencil.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#height
         * @type {number}
         * @since 3.80.0
         */
        this.height = 0;

        /**
         * Attachments to the framebuffer. These contain data such as
         * the width, height, and renderbuffer or texture.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#attachments
         * @type {Attachment[]}
         * @since 4.0.0
         */
        this.attachments = [];

        if (!this.useCanvas)
        {
            for (var i = 0; i < colorAttachments.length; i++)
            {
                this.attachments.push({
                    texture: colorAttachments[i],
                    attachmentPoint: gl.COLOR_ATTACHMENT0 + i
                });

                if (i === 0)
                {
                    this.width = colorAttachments[i].width;
                    this.height = colorAttachments[i].height;
                }
                else if (colorAttachments[i].width !== this.width || colorAttachments[i].height !== this.height)
                {
                    throw new Error('Color attachments must have the same dimensions');
                }
            }

            // Only generate depth and stencil buffers if color attachments are provided.
            // Generate a depth-stencil buffer if both are requested.
            // These must be attached after the color attachments,
            // so that the framebuffer is complete when they're attached.
            if (addDepthBuffer && addStencilBuffer)
            {
                this.attachments.push({
                    attachmentPoint: gl.DEPTH_STENCIL_ATTACHMENT,
                    internalFormat: gl.DEPTH_STENCIL
                });
            }
            else if (addDepthBuffer)
            {
                this.attachments.push({
                    attachmentPoint: gl.DEPTH_ATTACHMENT,
                    internalFormat: gl.DEPTH_COMPONENT16
                });
            }
            else if (addStencilBuffer)
            {
                this.attachments.push({
                    attachmentPoint: gl.STENCIL_ATTACHMENT,
                    internalFormat: gl.STENCIL_INDEX8
                });
            }
        }

        /**
         * The color texture where the color pixels are written.
         *
         * This will be `null` if the canvas is used as the color attachment.
         * It is the first color attachment on the framebuffer.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#renderTexture
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @default null
         * @since 3.80.0
         */
        this.renderTexture = null;

        if (this.attachments[0])
        {
            this.renderTexture = this.attachments[0].texture;
        }

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
        if (this.useCanvas) { return; }

        var renderer = this.renderer;
        var glWrapper = renderer.glWrapper;
        var gl = renderer.gl;

        // Remove any existing framebuffer.
        if (this.webGLFramebuffer)
        {
            gl.deleteFramebuffer(this.webGLFramebuffer);
            for (var i = 0; i < this.attachments.length; i++)
            {
                var attachment = this.attachments[i];
                if (!attachment.texture)
                {
                    gl.deleteRenderbuffer(attachment.renderbuffer);
                }
            }
        }

        // Create framebuffer.
        var framebuffer = gl.createFramebuffer();
        this.webGLFramebuffer = framebuffer;
        glWrapper.updateBindingsFramebuffer({
            bindings:
            {
                framebuffer: this
            }
        }, true);

        // Create attachments.
        for (i = 0; i < this.attachments.length; i++)
        {
            attachment = this.attachments[i];
            var attachmentPoint = attachment.attachmentPoint;
            var texture = attachment.texture;

            if (texture)
            {
                texture.isRenderTexture = true;
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture.webGLTexture, 0);
            }
            else
            {
                // Check for completeness.
                // We must do this after the color attachments are created,
                // or the framebuffer will be incomplete and cannot accept
                // a renderbuffer.
                var complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
                if (complete !== gl.FRAMEBUFFER_COMPLETE)
                {
                    throw new Error('Framebuffer status: ' + (errors[complete] || complete));
                }

                var renderbuffer = gl.createRenderbuffer();
                glWrapper.updateBindingsRenderbuffer({
                    bindings:
                    {
                        renderbuffer: renderbuffer
                    }
                });
                gl.renderbufferStorage(gl.RENDERBUFFER, attachment.internalFormat, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachmentPoint, gl.RENDERBUFFER, renderbuffer);

                // We could check for completeness again here,
                // but the invocations were checked during development,
                // and the renderbuffer is free of error.

                attachment.renderbuffer = renderbuffer;
            }
        }
    },

    /**
     * Resizes the attachments of this WebGLFramebufferWrapper.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#resize
     * @since 4.0.0
     * @param {number} width - The new width of the framebuffer.
     * @param {number} height - The new height of the framebuffer.
     */
    resize: function (width, height)
    {
        if (this.useCanvas)
        {
            return;
        }

        this.width = width;
        this.height = height;

        this.renderTexture.resize(width, height);

        this.createResource();
    },

    /**
     * Destroys this WebGLFramebufferWrapper.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper#destroy
     * @since 3.80.0
     */
    destroy: function ()
    {
        if (this.renderer === null)
        {
            return;
        }

        var renderer = this.renderer;
        var gl = renderer.gl;

        for (var i = 0; i < this.attachments.length; i++)
        {
            var attachment = this.attachments[i];
            if (attachment.texture)
            {
                renderer.glWrapper.updateBindingsFramebuffer({
                    bindings:
                    {
                        framebuffer: this
                    }
                });
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment.attachmentPoint, gl.TEXTURE_2D, null, 0);
                renderer.deleteTexture(attachment.texture);
            }
            else
            {
                gl.deleteRenderbuffer(attachment.renderbuffer);
            }
        }

        gl.deleteFramebuffer(this.webGLFramebuffer);

        // Remove bindings from the global state.
        renderer.glWrapper.updateBindingsFramebuffer({
            bindings:
            {
                framebuffer: null,
                renderbuffer: null
            }
        });

        this.attachments.length = 0;
        this.renderTexture = null;
        this.webGLFramebuffer = null;
        this.renderer = null;
    }
});

module.exports = WebGLFramebufferWrapper;
