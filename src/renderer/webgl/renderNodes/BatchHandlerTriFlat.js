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
    },

    defaultConfig: {
        name: 'BatchHandlerTriFlat',
        verticesPerInstance: 3,
        indicesPerInstance: 3,
        vertexSource: ShaderSourceVS,
        fragmentSource: ShaderSourceFS,
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
     * By default, each instance is a triangle.
     * The triangle is drawn with TRIANGLES topology,
     * so the vertices are in the order 0, 1, 2,
     * and each instance is fully separate.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#_generateElementIndices
     * @since 3.90.0
     * @private
     * @param {number} instances - The number of instances to define.
     * @return {ArrayBuffer} The index buffer data.
     */
    _generateElementIndices: function (instances)
    {
        var buffer = new ArrayBuffer(instances * 3 * 2);
        var indices = new Uint16Array(buffer);
        var offset = 0;
        for (var i = 0; i < instances; i++)
        {
            var index = i * 3;
            indices[offset++] = index;
            indices[offset++] = index + 1;
            indices[offset++] = index + 2;
        }
        return buffer;
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

        // Update vertex buffers.
        // Because we are probably using a generic vertex buffer
        // which is larger than the current batch, we need to update
        // the buffer with the correct size.
        vertexBuffer.update(instanceCount * this.bytesPerInstance);

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

        this.onRunEnd(drawingContext);
    },

    /**
     * Add a triangle to the batch.
     *
     * The vertices are not textured, and are named A, B, and C.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat#batch
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {number} xA - The x-coordinate of vertex A.
     * @param {number} yA - The y-coordinate of vertex A.
     * @param {number} xB - The x-coordinate of vertex B.
     * @param {number} yB - The y-coordinate of vertex B.
     * @param {number} xC - The x-coordinate of vertex C.
     * @param {number} yC - The y-coordinate of vertex C.
     * @param {number} tintA - The vertex A tint color.
     * @param {number} tintB - The vertex B tint color.
     * @param {number} tintC - The vertex C tint color.
     */
    batch: function (currentContext, xA, yA, xB, yB, xC, yC, tintA, tintB, tintC)
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, currentContext);
        }

        // Update the vertex buffer.
        var vertexOffset32 = this.instanceCount * this.floatsPerInstance;
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexViewF32 = vertexBuffer.viewF32;
        var vertexViewU32 = vertexBuffer.viewU32;

        // Vertex A
        vertexViewF32[vertexOffset32++] = xA;
        vertexViewF32[vertexOffset32++] = yA;
        vertexViewU32[vertexOffset32++] = tintA;

        // Vertex B
        vertexViewF32[vertexOffset32++] = xB;
        vertexViewF32[vertexOffset32++] = yB;
        vertexViewU32[vertexOffset32++] = tintB;

        // Vertex C
        vertexViewF32[vertexOffset32++] = xC;
        vertexViewF32[vertexOffset32++] = yC;
        vertexViewU32[vertexOffset32++] = tintC;

        // Increment the instance count.
        this.instanceCount++;

        // Check whether the batch should be rendered immediately.
        // This guarantees that none of the arrays are full above.
        if (this.instanceCount === this.instancesPerBatch)
        {
            this.run(currentContext);

            // Now the batch is empty.
        }
    }
});

module.exports = BatchHandlerTriFlat;
