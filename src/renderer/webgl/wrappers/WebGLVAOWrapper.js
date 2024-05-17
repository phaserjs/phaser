/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @classdesc
 * Wrapper for a WebGL Vertex Array Object (VAO).
 *
 * A WebGLVertexArrayObject should never be exposed outside the WebGLRenderer,
 * so the WebGLRenderer can handle context loss and other events without other
 * systems having to be aware of it. Always use WebGLVAOWrapper instead.
 *
 * @class WebGLVAOWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} [indexBuffer] - The index buffer used in this VAO, if any.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper[]} attributeBufferLayouts - The vertex buffers containing attribute data for this VAO, alongside the relevant attribute layout.
 */
var WebGLVAOWrapper = new Class({
    initialize: function WebGLVAOWrapper (renderer, indexBuffer, attributeBufferLayouts)
    {
        /**
         * The WebGLRenderer instance that owns this wrapper.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.90.0
         */
        this.renderer = renderer;

        /**
         * The WebGLVertexArrayObject being wrapped by this class.
         *
         * This property could change at any time.
         * Therefore, you should never store a reference to this value.
         * It should only be passed directly to the WebGL API for drawing.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#vertexArrayObject
         * @type {?WebGLVertexArrayObject}
         * @default null
         * @since 3.90.0
         */
        this.vertexArrayObject = null;

        /**
         * The element array buffer used in this VAO, if any.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#indexBuffer
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @default null
         * @since 3.90.0
         */
        this.indexBuffer = indexBuffer;

        /**
         * The vertex buffers containing attribute data for this VAO,
         * alongside the relevant attribute layout.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#attributeBufferLayouts
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper[]}
         * @since 3.90.0
         */
        this.attributeBufferLayouts = attributeBufferLayouts;

        /**
         * The state object used to bind this VAO.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#glState
         * @type {object}
         * @since 3.90.0
         */
        this.glState = {
            vao: this
        };

        this.createResource();
    },

    /**
     * Creates a new WebGLVertexArrayObject.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#createResource
     * @since 3.90.0
     */
    createResource: function ()
    {
        var gl = this.renderer.gl;
        var extVAO = this.renderer.vaoExtension;

        if (!extVAO)
        {
            throw new Error('WebGLVertexArrayObject not supported by this browser');
        }

        this.vertexArrayObject = extVAO.createVertexArrayOES();

        this.bind();

        if (this.indexBuffer)
        {
            this.indexBuffer.bind();
        }

        for (var i = 0; i < this.attributeBufferLayouts.length; i++)
        {
            var attributeBufferLayout = this.attributeBufferLayouts[i];

            attributeBufferLayout.buffer.bind();
            var stride = attributeBufferLayout.layout.stride;

            for (var j = 0; j < attributeBufferLayout.layout.layout.length; j++)
            {
                var layout = attributeBufferLayout.layout.layout[j];

                var location = layout.location;

                var bytes = layout.bytes || 4;
                var columns = layout.columns || 1;
                var normalized = layout.normalized;
                var offset = layout.offset;
                var size = layout.size;
                var type = layout.type;

                for (var column = 0; column < columns; column++)
                {
                    gl.enableVertexAttribArray(location + column);

                    gl.vertexAttribPointer(
                        location + column,
                        size,
                        type,
                        normalized,
                        stride,
                        offset + bytes * column * size
                    );
                }
            }
        }

        // Finalize VAO.
        this.renderer.glWrapper.updateVAO({
            vao: null
        });

        // Force unbind buffers, as they may have been unbound by the VAO
        // without syncing state management.
        this.renderer.glWrapper.updateBindings({
            bindings: {
                arrayBuffer: null,
                elementArrayBuffer: null
            }
        });
    },

    /**
     * Binds this WebGLVAOWrapper to the current WebGLRenderingContext.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#bind
     * @since 3.90.0
     */
    bind: function ()
    {
        this.renderer.glWrapper.updateVAO(this.glState);
    },

    /**
     * Destroys this WebGLVAOWrapper and removes all associated resources.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#destroy
     * @since 3.90.0
     */
    destroy: function ()
    {
        var extVAO = this.renderer.vaoExtension;

        if (this.vertexArrayObject)
        {
            extVAO.deleteVertexArrayOES(this.vertexArrayObject);
            this.vertexArrayObject = null;
        }

        this.indexBuffer = null;
        this.attributeBufferLayouts = null;
        this.glState = null;
        this.renderer = null;
    }
});

module.exports = WebGLVAOWrapper;
