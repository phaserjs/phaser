/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/Flat-frag');
var ShaderSourceVS = require('../shaders/Flat-vert');
var BatchHandler = require('./BatchHandler');

/**
 * @classdesc
 * This render node draws triangles with vertex color in batches.
 *
 * @class BatchHandlerTriFlat
 * @extends Phaser.Renderer.WebGL.Batch.BatchHandler
 * @memberof Phaser.Renderer.WebGL.Batch
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} manager - The pipeline manager this BatchRenderer belongs to.
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineBatchConfig} config - The configuration object for this BatchRenderer.
 */
var BatchHandlerTriFlat = new Class({
    Extends: BatchHandler,

    initialize: function BatchHandlerTriFlat (manager, config)
    {
        BatchHandler.call(this, manager, config, this.defaultConfig);

        /**
         * An empty array. This is an internal space filler.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#_emptyTextures
         * @type {Array}
         * @private
         * @since 3.90.0
         * @default []
         * @readonly
         */
        this._emptyTextures = [];

        /**
         * The number of vertices currently in the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#vertexCount
         * @type {number}
         * @since 3.90.0
         */
        this.vertexCount = 0;
    },

    defaultConfig: {
        name: 'BatchHandlerTriFlat',
        verticesPerInstance: 3,
        indicesPerInstance: 3,
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
        indexBufferDynamic: true,
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            layout: [
                {
                    name: 'inPosition',
                    size: 2
                },
                {
                    name: 'inTint',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
                }
            ]
        }
    },

    /**
     * Generate element indices for the instance vertices.
     * This is called automatically when the node is initialized.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#_generateElementIndices
     * @since 3.90.0
     * @private
     * @param {number} instances - The number of instances to define.
     * @return {ArrayBuffer} The index buffer data.
     */
    _generateElementIndices: function (instances)
    {
        return new ArrayBuffer(instances * 3 * 2);
    },

    /**
     * Set new dimensions for the renderer. This is called automatically when the renderer is resized.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#resize
     * @since 3.90.0
     */
    resize: function ()
    {
        this.program.setUniform('uProjectionMatrix', this.manager.renderer.projectionMatrix.val);
    },

    /**
     * Draw then empty the current batch.
     *
     * This method is called automatically, by either this node or the manager,
     * when the batch is full, or when something else needs to be rendered.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#run
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        if (this.instanceCount === 0) { return; }

        this.onRunBegin(drawingContext);

        var indicesPerInstance = this.indicesPerInstance;
        var instanceCount = this.instanceCount;
        var program = this.program;
        var vao = this.vao;
        var renderer = this.manager.renderer;
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var stride = this.vertexBufferLayout.layout.stride;

        // Update vertex buffers.
        // Because we are probably using a generic vertex buffer
        // which is larger than the current batch, we need to update
        // the buffer with the correct size.
        vertexBuffer.update(this.vertexCount * stride);

        // Update index buffer.
        // We must bind the VAO before updating the index buffer.
        // Each index is a 16-bit unsigned integer, so 2 bytes.
        vao.bind();
        vao.indexBuffer.update(instanceCount * indicesPerInstance * 2);

        renderer.drawElements(
            drawingContext,
            this._emptyTextures,
            program,
            vao,
            instanceCount * indicesPerInstance,
            0,
            renderer.gl.TRIANGLES
        );

        // Reset batch accumulation.
        this.instanceCount = 0;
        this.vertexCount = 0;

        this.onRunEnd(drawingContext);
    },

    /**
     * Add data to the batch.
     *
     * The data is composed of vertices and indexed triangles.
     * Each triangle is defined by three indices into the vertices array.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#batch
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {number[]} indexes - The index data. Each triangle is defined by three indices into the vertices array, so the length of this should be a multiple of 3.
     * @param {number[]} vertices - The vertices data. Each vertex is defined by an x-coordinate and a y-coordinate.
     * @param {number[]} colors - The color data. Each vertex has a color as a Uint32 value.
     */
    batch: function (currentContext, indexes, vertices, colors)
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, currentContext);
        }

        var passID = 0;
        var instanceCompletion = 0;
        var instancesPerBatch = this.instancesPerBatch;

        // Buffer data
        var stride = this.vertexBufferLayout.layout.stride;
        var verticesPerInstance = this.verticesPerInstance;

        var indexBuffer = this.vao.indexBuffer;
        var indexView16 = indexBuffer.viewU16;
        var indexOffset16 = this.instanceCount * this.indicesPerInstance;

        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexViewF32 = vertexBuffer.viewF32;
        var vertexViewU32 = vertexBuffer.viewU32;
        var vertexOffset32 = this.vertexCount * stride / vertexViewF32.BYTES_PER_ELEMENT;

        // Track vertex usage.
        var passes = [];
        var passOffset = 0;
        var vertexIndices = [];
        var vertexIndicesOffset = 0;

        for (var i = 0; i < indexes.length; i++)
        {
            var index = indexes[i];
            var vertexIndex = index * 2;

            if (passes[i] !== passID)
            {
                // Update the vertex buffer.
                vertexViewF32[vertexOffset32++] = vertices[vertexIndex];
                vertexViewF32[vertexOffset32++] = vertices[vertexIndex + 1];
                vertexViewU32[vertexOffset32++] = colors[index];

                // Assign the vertex to the current pass.
                passes[passOffset++] = passID;

                // Record the index where the vertex was stored.
                vertexIndices[vertexIndicesOffset++] = this.vertexCount;

                this.vertexCount++;
            }
            var id = vertexIndices[vertexIndicesOffset - 1];

            // Update the index buffer.
            // There is always at least one index per vertex,
            // so we can assume that the vertex buffer is large enough.
            indexView16[indexOffset16++] = id;

            // Check whether the instance is complete.
            instanceCompletion++;
            if (instanceCompletion === verticesPerInstance)
            {
                this.instanceCount++;
                instanceCompletion = 0;
            }

            // Check whether the batch should be rendered immediately.
            // This guarantees that none of the arrays are full above.
            if (
                // The instance count has been reached.
                this.instanceCount === instancesPerBatch ||

                // This triangle is complete, and another would exceed the index buffer size.
                (instanceCompletion === 0 && indexOffset16 + verticesPerInstance >= indexView16.length)
            )
            {
                passID++;
                this.run(currentContext);

                indexOffset16 = this.instanceCount * this.indicesPerInstance;
                vertexOffset32 = this.vertexCount * stride / vertexViewF32.BYTES_PER_ELEMENT;
                passOffset = 0;
                vertexIndicesOffset = 0;

                // Now the batch is empty.
            }
        }
    }
});

module.exports = BatchHandlerTriFlat;
