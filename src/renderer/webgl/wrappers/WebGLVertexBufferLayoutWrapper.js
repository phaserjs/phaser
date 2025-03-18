/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @classdesc
 * Wrapper for a vertex buffer layout.
 * This contains the buffer itself, the attribute layout information,
 * and the ArrayBuffer and associate views that the layout is based on.
 *
 * @class WebGLVertexBufferLayoutWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} program - The program that this layout is associated with.
 * @param {Partial<Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout>} layout - The layout of the buffer. At construction, this should be incomplete. The stride and per-attribute location, bytes, and offset will be filled in during construction. This will mutate the object.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} [buffer] - The buffer that this layout should use. If not provided, a new buffer will be created. If the buffer is too small, an exception is thrown.
 * @throws {Error} If the buffer is too small for the layout.
 */
var WebGLVertexBufferLayoutWrapper = new Class({
    initialize: function WebGLVertexBufferLayoutWrapper (renderer, layout, buffer)
    {
        /**
         * The WebGLRenderer instance that owns this wrapper.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * The layout of the buffer.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper#layout
         * @type {Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout}
         * @since 4.0.0
         */
        this.layout = layout;

        // Fill in the layout with the stride
        // and per-attribute bytes and offset.
        this.completeLayout(layout);

        var bufferSize = layout.stride * layout.count;
        if (buffer && buffer.byteLength < bufferSize)
        {
            throw new Error('Buffer too small for layout');
        }

        /**
         * The WebGLBuffer that this layout is based on.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper#buffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 4.0.0
         */
        this.buffer = buffer || renderer.createVertexBuffer(new ArrayBuffer(bufferSize), layout.usage);
    },

    /**
     * Complete the layout of the provided attribute buffer layout.
     * This will fill in the stride, byte counts, and offsets.
     * In addition, it will convert any GLenums specified as strings
     * to their numeric values.
     * This mutates the layout.
     *
     * The order of attributes within the layout forms the order of the buffer.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper#completeLayout
     * @since 4.0.0
     * @param {Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout} attributeBufferLayout - The layout to complete.
     */
    completeLayout: function (attributeBufferLayout)
    {
        var gl = this.renderer.gl;
        var layout = attributeBufferLayout.layout;
        var constants = this.renderer.shaderSetters.constants;

        if (typeof attributeBufferLayout.usage === 'string')
        {
            attributeBufferLayout.usage = gl[attributeBufferLayout.usage];
        }

        var offset = 0;

        for (var i = 0; i < layout.length; i++)
        {
            var attribute = layout[i];
            var size = attribute.size;
            var columns = attribute.columns || 1;

            // First, append the current offset.
            attribute.offset = offset;

            // Convert the type to a GLenum if it is a string.
            if (typeof attribute.type === 'string')
            {
                attribute.type = gl[attribute.type];
            }

            var typeData = constants[attribute.type];
            var baseSize = typeData.size;
            var baseBytes = typeData.bytes;

            // Append the bytes per attribute element.
            attribute.bytes = baseBytes;

            offset += size * columns * baseBytes * baseSize;
        }

        // Now that we know the total stride, we can set it.
        attributeBufferLayout.stride = offset;
    }
});

module.exports = WebGLVertexBufferLayoutWrapper;
