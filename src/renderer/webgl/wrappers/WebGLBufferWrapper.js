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
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 * @param {ArrayBuffer} dataBuffer - An ArrayBuffer of data to store. The buffer will be permanently associated with this data.
 * @param {GLenum} bufferType - The type of the buffer being created.
 * @param {GLenum} bufferUsage - The usage of the buffer being created. gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW.
 */
var WebGLBufferWrapper = new Class({

    initialize:

    function WebGLBufferWrapper (renderer, dataBuffer, bufferType, bufferUsage)
    {
        /**
         * The WebGLRenderer instance that owns this wrapper.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

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
         * The data associated with the buffer.
         *
         * Note that this will be used to recreate the buffer if the WebGL context is lost.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#dataBuffer
         * @type {ArrayBuffer}
         * @since 4.0.0
         */
        this.dataBuffer = dataBuffer;

        /**
         * A Float32Array view of the dataBuffer.
         *
         * This will be `null` if the byte length of the dataBuffer
         * is not divisible by Float32Array.BYTES_PER_ELEMENT (4).
         * Such a buffer is only suited for use with 16-bit indices.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#viewF32
         * @type {Float32Array | null}
         * @since 4.0.0
         */
        this.viewF32 = null;

        /**
         * A Uint8Array view of the dataBuffer.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#viewU8
         * @type {Uint8Array}
         * @since 4.0.0
         */
        this.viewU8 = new Uint8Array(dataBuffer);

        /**
         * A Uint16Array view of the dataBuffer.
         *
         * This will be `null` if the byte length of the dataBuffer
         * is not divisible by Uint16Array.BYTES_PER_ELEMENT (2).
         * Such a buffer is only suited for use with byte data.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#viewU16
         * @type {Uint16Array | null}
         * @since 4.0.0
         */
        this.viewU16 = null;

        /**
         * A Uint32Array view of the dataBuffer.
         *
         * This will be `null` if the byte length of the dataBuffer
         * is not divisible by Uint32Array.BYTES_PER_ELEMENT (4).
         * Such a buffer is only suited for use with 16-bit indices.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#viewU32
         * @type {Uint32Array | null}
         * @since 4.0.0
         */
        this.viewU32 = null;

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

        this.createViews();

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
        var gl = this.renderer.gl;

        var bufferType = this.bufferType;
        var webGLBuffer = gl.createBuffer();

        this.webGLBuffer = webGLBuffer;

        this.bind();
        gl.bufferData(bufferType, this.dataBuffer, this.bufferUsage);
        this.bind(true);
    },

    /**
     * Binds this WebGLBufferWrapper to the current WebGLRenderingContext.
     * It uses the bufferType of this wrapper to determine which binding point to use.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#bind
     * @since 4.0.0
     * @param {boolean} [unbind=false] - Whether to unbind the buffer instead.
     */
    bind: function (unbind)
    {
        var gl = this.renderer.gl;
        var bufferType = this.bufferType;
        var buffer = unbind ? null : this;

        if (bufferType === gl.ARRAY_BUFFER)
        {
            this.renderer.glWrapper.updateBindingsArrayBuffer({
                bindings: { arrayBuffer: buffer }
            });
        }
        else if (bufferType === gl.ELEMENT_ARRAY_BUFFER)
        {
            this.renderer.glWrapper.updateBindingsElementArrayBuffer({
                bindings: { elementArrayBuffer: buffer }
            });
        }
    },

    /**
     * Updates the data in this WebGLBufferWrapper.
     * The dataBuffer must contain the new data to be uploaded to the GPU.
     * Data will preserve its range from dataBuffer to the WebGLBuffer.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#update
     * @since 4.0.0
     * @param {number} [bytes] - The number of bytes to update in the buffer. If not specified, the entire buffer will be updated.
     * @param {number} [offset=0] - The offset into the buffer to start updating data at.
     */
    update: function (bytes, offset)
    {
        var gl = this.renderer.gl;

        this.bind();

        if (offset === undefined)
        {
            offset = 0;
        }

        if (bytes === undefined)
        {
            gl.bufferSubData(
                this.bufferType,
                offset,
                this.dataBuffer
            );
        }
        else
        {
            gl.bufferSubData(
                this.bufferType,
                offset,
                this.viewU8.subarray(offset, offset + bytes)
            );
        }
    },

    /**
     * Resizes the dataBuffer of this WebGLBufferWrapper.
     * This will recreate `dataBuffer` and the views into it.
     * All data will be lost.
     * All views into `dataBuffer` will be destroyed and recreated.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#resize
     * @since 4.0.0
     * @param {number} bytes - The new size of the buffer in bytes.
     */
    resize: function (bytes)
    {
        var gl = this.renderer.gl;

        this.dataBuffer = new ArrayBuffer(bytes);

        this.createViews();

        this.bind();
        gl.bufferData(this.bufferType, this.dataBuffer, this.bufferUsage);
    },

    /**
     * Creates the views into the dataBuffer.
     * This is called internally.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#createViews
     * @since 4.0.0
     * @private
     */
    createViews: function ()
    {
        var dataBuffer = this.dataBuffer;

        this.viewF32 = null;
        if (dataBuffer.byteLength % Float32Array.BYTES_PER_ELEMENT === 0)
        {
            this.viewF32 = new Float32Array(dataBuffer);
        }

        this.viewU8 = new Uint8Array(dataBuffer);

        this.viewU16 = null;
        if (dataBuffer.byteLength % Uint16Array.BYTES_PER_ELEMENT === 0)
        {
            this.viewU16 = new Uint16Array(dataBuffer);
        }

        this.viewU32 = null;
        if (dataBuffer.byteLength % Uint32Array.BYTES_PER_ELEMENT === 0)
        {
            this.viewU32 = new Uint32Array(dataBuffer);
        }
    },

    /**
     * Remove this WebGLBufferWrapper from the GL context.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper#destroy
     * @since 3.80.0
     */
    destroy: function ()
    {
        this.renderer.gl.deleteBuffer(this.webGLBuffer);
        this.webGLBuffer = null;
        this.dataBuffer = null;
        this.viewF32 = null;
        this.viewU8 = null;
        this.viewU16 = null;
        this.viewU32 = null;
        this.renderer = null;
    }
});

module.exports = WebGLBufferWrapper;
