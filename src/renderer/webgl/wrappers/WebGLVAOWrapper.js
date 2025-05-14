/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
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
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this wrapper.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} program - The shader program that this VAO is associated with.
 * @param {?Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} indexBuffer - The index buffer used in this VAO, if any.
 * @param {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper[]} attributeBufferLayouts - The vertex buffers containing attribute data for this VAO, alongside the relevant attribute layout.
 */
var WebGLVAOWrapper = new Class({
    initialize: function WebGLVAOWrapper (renderer, program, indexBuffer, attributeBufferLayouts)
    {
        /**
         * The WebGLRenderer instance that owns this wrapper.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * The shader program that this VAO is associated with.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#program
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper}
         * @since 4.0.0
         */
        this.program = program;

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
         * @since 4.0.0
         */
        this.vertexArrayObject = null;

        /**
         * The element array buffer used in this VAO, if any.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#indexBuffer
         * @type {?Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @default null
         * @since 4.0.0
         */
        this.indexBuffer = indexBuffer;

        /**
         * The vertex buffers containing attribute data for this VAO,
         * alongside the relevant attribute layout.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#attributeBufferLayouts
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper[]}
         * @since 4.0.0
         */
        this.attributeBufferLayouts = attributeBufferLayouts;

        /**
         * The state object used to bind this VAO.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#glState
         * @type {object}
         * @since 4.0.0
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
     * @since 4.0.0
     */
    createResource: function ()
    {
        var gl = this.renderer.gl;

        this.vertexArrayObject = gl.createVertexArray();

        this.bind();

        if (this.indexBuffer)
        {
            this.indexBuffer.bind();
        }

        var program = this.program;
        var glAttributes = program.glAttributes;
        var glAttributeNames = program.glAttributeNames;

        for (var i = 0; i < this.attributeBufferLayouts.length; i++)
        {
            var attributeBufferLayout = this.attributeBufferLayouts[i];

            attributeBufferLayout.buffer.bind();
            var stride = attributeBufferLayout.layout.stride;
            var instanceDivisor = attributeBufferLayout.layout.instanceDivisor;

            for (var j = 0; j < attributeBufferLayout.layout.layout.length; j++)
            {
                var layout = attributeBufferLayout.layout.layout[j];

                // Connect attribute locations from program.
                var attributeIndex = glAttributeNames.get(layout.name);
                if (attributeIndex === undefined)
                {
                    // This attribute is not used in the shader, so skip it.
                    continue;
                }
                var attributeInfo = glAttributes[attributeIndex];
                layout.location = attributeInfo.location;

                // Create attribute pointers.

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

                    if (!isNaN(instanceDivisor))
                    {
                        gl.vertexAttribDivisor(
                            location + column,
                            instanceDivisor
                        );
                    }
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
     * @since 4.0.0
     */
    bind: function ()
    {
        this.renderer.glWrapper.updateVAO(this.glState);
    },

    /**
     * Destroys this WebGLVAOWrapper and removes all associated resources.
     *
     * @method Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper#destroy
     * @since 4.0.0
     */
    destroy: function ()
    {
        var gl = this.renderer.gl;

        if (this.vertexArrayObject)
        {
            gl.deleteVertexArray(this.vertexArrayObject);
            this.vertexArrayObject = null;
        }

        this.indexBuffer = null;
        this.attributeBufferLayouts = null;
        this.glState = null;
        this.renderer = null;
    }
});

module.exports = WebGLVAOWrapper;
