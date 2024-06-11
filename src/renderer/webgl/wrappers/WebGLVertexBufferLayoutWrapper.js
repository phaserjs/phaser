/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
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
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} program - The program that this layout is associated with.
 * @param {Partial<Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout>} layout - The layout of the buffer. At construction, this should be incomplete. The stride and per-attribute location, bytes, and offset will be filled in during construction. This will mutate the object.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} [buffer] - The buffer that this layout should use. If not provided, a new buffer will be created. If the buffer is too small, an exception is thrown.
 * @throws {Error} If the buffer is too small for the layout.
 */
var WebGLVertexBufferLayoutWrapper = new Class({
    initialize: function WebGLVertexBufferLayoutWrapper (renderer, program, layout, buffer)
    {
        /**
         * The WebGLRenderer instance that owns this wrapper.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.90.0
         */
        this.renderer = renderer;

        /**
         * The program that this layout is associated with.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper#program
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper}
         * @since 3.90.0
         */
        this.program = program;

        /**
         * The layout of the buffer.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper#layout
         * @type {Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout}
         * @since 3.90.0
         */
        this.layout = layout;

        // Fill in the layout with the stride
        // and per-attribute location, bytes, and offset.
        program.completeLayout(layout);

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
         * @since 3.90.0
         */
        this.buffer = buffer || renderer.createVertexBuffer(new ArrayBuffer(bufferSize), layout.usage);
    }
});

module.exports = WebGLVertexBufferLayoutWrapper;
