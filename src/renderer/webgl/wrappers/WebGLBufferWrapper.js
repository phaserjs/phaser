/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @classdesc
 * Wrapper for a WebGL buffer, containing all the information that was used
 * to create it. This can be a VertexBuffer or IndexBuffer.
 *
 * A WebGLBuffer should never be exposed outside the WebGLRenderer, so the
 * WebGLRenderer can handle context loss and other events without other
 * systems having to be aware of it. Always use WebGLBufferWrapper instead.
 *
 * @class WebGLBufferWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 3.80.0
 *
 * @param {WebGLRenderingContext} gl - The WebGLRenderingContext to create the WebGLBuffer for.
 * @param {ArrayBuffer|number} initialDataOrSize - Either an ArrayBuffer of data, or the size of the buffer to create.
 * @param {GLenum} bufferType - The type of the buffer being created.
 * @param {GLenum} bufferUsage - The usage of the buffer being created. gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW.
 */
var WebGLBufferWrapper = new Class({

    initialize:

    function WebGLBufferWrapper (gl, initialDataOrSize, bufferType, bufferUsage)
    {
        /**
         * The WebGLBuffer being wrapped by this class.
         *
         * This property could change at any time.
         * Therefore, you should never store a reference to this value.
         * It should only be passed directly to the WebGL API for drawing.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#webGLBuffer
         * @type {?WebGLBuffer}
         * @default null
         * @since 3.80.0
         */
        this.webGLBuffer = null;

        /**
         * The WebGLRenderingContext that owns this WebGLBuffer.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#gl
         * @type {WebGLRenderingContext}
         * @since 3.80.0
         */
        this.gl = gl;

        /**
         * The initial data or size of the buffer.
         *
         * Note that this will be used to recreate the buffer if the WebGL context is lost.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#initialDataOrSize
         * @type {ArrayBuffer|number}
         * @since 3.80.0
         */
        this.initialDataOrSize = initialDataOrSize;

        /**
         * The type of the buffer.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#bufferType
         * @type {GLenum}
         * @since 3.80.0
         */
        this.bufferType = bufferType;

        /**
         * The usage of the buffer. gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#bufferUsage
         * @type {GLenum}
         * @since 3.80.0
         */
        this.bufferUsage = bufferUsage;

        this.createResource();
    },

    /**
     * Creates a WebGLBuffer for this WebGLBufferWrapper.
     *
     * This is called automatically by the constructor. It may also be
     * called again if the WebGLBuffer needs re-creating.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#createResource
     * @since 3.80.0
     */
    createResource: function ()
    {
        if (this.initialDataOrSize === null)
        {
            return;
        }

        var gl = this.gl;

        if (gl.isContextLost())
        {
            // GL state can't be updated right now.
            // `createResource` will run when the context is restored.
            return;
        }

        var bufferType = this.bufferType;
        var webGLBuffer = gl.createBuffer();

        this.webGLBuffer = webGLBuffer;

        gl.bindBuffer(bufferType, this.webGLBuffer);
        gl.bufferData(bufferType, this.initialDataOrSize, this.bufferUsage);
        gl.bindBuffer(bufferType, null);
    },

    /**
     * Remove this WebGLBufferWrapper from the GL context.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#destroy
     * @since 3.80.0
     */
    destroy: function ()
    {
        var gl = this.gl;
        if (!gl.isContextLost())
        {
            gl.deleteBuffer(this.webGLBuffer);
        }
        this.webGLBuffer = null;
        this.initialDataOrSize = null;
        this.gl = null;
    }
});

module.exports = WebGLBufferWrapper;
