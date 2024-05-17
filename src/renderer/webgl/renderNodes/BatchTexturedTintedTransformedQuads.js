/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/Multi-frag.js');
var ShaderSourceVS = require('../shaders/Multi-vert.js');
var Utils = require('../Utils.js');
var WebGLVertexBufferLayoutWrapper = require('../wrappers/WebGLVertexBufferLayoutWrapper.js');
var Batch = require('./Batch');

/**
 * @classdesc
 * This RenderNode draws Standard Batch Render (SBR) quads in batches.
 *
 * @class BatchTexturedTintedTransformedQuads
 * @extends Phaser.Renderer.WebGL.RenderNodes.Batch
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var BatchTexturedTintedTransformedQuads = new Class({
    Extends: Batch,

    initialize: function BatchTexturedTintedTransformedQuads (manager, renderer)
    {
        Batch.call(this, 'BatchTexturedTintedTransformedQuads', manager, renderer);

        var gl = renderer.gl;

        /**
         * The number of quads per batch, used to determine the size of the
         * vertex and quad buffers, and the number of instances to render.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#quadsPerBatch
         * @type {number}
         * @since 3.90.0
         */
        this.quadsPerBatch = renderer.config.batchSize;

        /**
         * The number of vertices per instance.
         * This is always 4 for a quad.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#verticesPerInstance
         * @type {number}
         * @since 3.90.0
         * @default 4
         */
        this.verticesPerInstance = 4;

        /**
         * The number of indices per instance.
         * This is always 6 for a quad.
         * It is composed of four triangles,
         * but the first and last are degenerate to allow for
         * TRIANGLE_STRIP rendering, so there are only two true triangles.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#indicesPerInstance
         * @type {number}
         * @since 3.90.0
         * @default 6
         */
        this.indicesPerInstance = 6;

        /**
         * The number of bytes per index per instance.
         * This is used to advance the index buffer, and accounts for the
         * size of a Uint16Array element.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#bytesPerIndexPerInstance
         * @type {number}
         * @since 3.90.0
         * @default 12
         */
        this.bytesPerIndexPerInstance = this.indicesPerInstance * Uint16Array.BYTES_PER_ELEMENT;

        /**
         * The maximum number of textures per batch entry.
         * This is usually the maximum number of texture units available,
         * but it might be smaller for some uses.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#maxTexturesPerBatch
         * @type {number}
         * @since 3.90.0
         */
        this.maxTexturesPerBatch = manager.maxParallelTextureUnits;

        /**
         * The number of quads currently in the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#instanceCount
         * @type {number}
         * @since 3.90.0
         */
        this.instanceCount = 0;

        var ParsedShaderSourceFS = Utils.parseFragmentShaderMaxTextures(ShaderSourceFS, this.maxTexturesPerBatch);

        /**
         * The WebGL program used to render the Game Object.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#program
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper}
         * @since 3.90.0
         */
        this.program = renderer.createProgram(ShaderSourceVS, ParsedShaderSourceFS);

        /**
         * The index buffer defining vertex order.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#indexBuffer
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper}
         * @since 3.90.0
         */
        this.indexBuffer = renderer.createIndexBuffer(
            this._generateElementIndices(this.quadsPerBatch),
            gl.STATIC_DRAW
        );

        /**
         * The layout, data, and vertex buffer used to store the vertex data.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#vertexBufferLayout
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper}
         * @since 3.90.0
         */
        this.vertexBufferLayout = new WebGLVertexBufferLayoutWrapper(
            renderer,
            this.program,
            {
                usage: gl.DYNAMIC_DRAW,
                count: this.quadsPerBatch * 4,
                layout: [
                    {
                        name: 'inPosition',
                        location: -1,
                        size: 2,
                        type: gl.FLOAT,
                        normalized: false
                    },
                    {
                        name: 'inTexCoord',
                        location: -1,
                        size: 2,
                        type: gl.FLOAT,
                        normalized: false
                    },
                    {
                        name: 'inTexId',
                        location: -1,
                        size: 1,
                        type: gl.FLOAT,
                        normalized: false
                    },
                    {
                        name: 'inTintEffect',
                        location: -1,
                        size: 1,
                        type: gl.FLOAT,
                        normalized: false
                    },
                    {
                        name: 'inTint',
                        location: -1,
                        size: 4,
                        type: gl.UNSIGNED_BYTE,
                        normalized: true
                    }
                ]
            }
        );

        /**
         * The Vertex Array Object used to render the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#vao
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper}
         * @since 3.90.0
         */
        this.vao = renderer.createVAO(this.indexBuffer, [
            this.vertexBufferLayout
        ]);

        /**
         * The current batch entry being filled with textures.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#currentBatchEntry
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineBatchEntry}
         * @since 3.90.0
         */
        this.currentBatchEntry = {
            start: 0,
            count: 0,
            unit: 0,
            texture: []
        };

        /**
         * The entries in the batch.
         * Each entry represents a "sub-batch" of quads which use the same
         * pool of textures. This allows the renderer to continue to buffer
         * quads into the same batch without needing to upload the vertex
         * buffer. When the batch flushes, there will be one vertex buffer
         * upload, and one draw call per batch entry.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#batchEntries
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineBatchEntry[]}
         * @since 3.90.0
         * @default []
         */
        this.batchEntries = [];

        /**
         * The number of floats per instance, used to determine how much of the vertex buffer to update.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#floatsPerInstance
         * @type {number}
         * @since 3.90.0
         */
        this.floatsPerInstance = this.vertexBufferLayout.layout.stride * this.verticesPerInstance / Float32Array.BYTES_PER_ELEMENT;

        // Set the dimension-related uniforms and listen for resize events.
        this.resize(renderer.width, renderer.height);
        this.renderer.on(Phaser.Renderer.Events.RESIZE, this.resize, this);

        // Main sampler will never change after initialization,
        // because it addresses texture units, not textures.
        this.program.setUniform('uMainSampler[0]', this.renderer.textureUnitIndices);

        // Listen for changes to the number of draw calls per batch.
        this.manager.on(Phaser.Renderer.Events.SET_PARALLEL_TEXTURE_UNITS, this.updateTextureCount, this);
    },

    /**
     * Draw then empty the current batch.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#run
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        if (this.instanceCount === 0) { return; }

        var bytesPerIndexPerInstance = this.bytesPerIndexPerInstance;
        var indicesPerInstance = this.indicesPerInstance;
        var program = this.program;
        var vao = this.vao;
        var renderer = this.renderer;
        var vertexBuffer = this.vertexBufferLayout.buffer;

        // Finalize the current batch entry.
        this.pushCurrentBatchEntry();

        // Update vertex buffers.
        if (this.instanceCount < this.quadsPerBatch)
        {
            // We use a subarray to avoid copying the buffer, but still
            // control the length.
            vertexBuffer.update(this.vertexBufferLayout.viewFloat32.subarray(0, this.instanceCount * this.floatsPerInstance));
        }
        else
        {
            vertexBuffer.update(this.vertexBufferLayout.data);
        }

        this.program.setUniform('uRoundPixels', drawingContext.camera.roundPixels);

        var subBatches = this.batchEntries.length;
        for (var i = 0; i < subBatches; i++)
        {
            var entry = this.batchEntries[i];
            renderer.drawElements(
                drawingContext,
                entry.texture,
                program,
                vao,
                entry.count * indicesPerInstance,
                entry.start * bytesPerIndexPerInstance
            );
        }

        // Reset batch accumulation.
        this.instanceCount = 0;
        this.currentBatchEntry.start = 0;
        this.batchEntries.length = 0;
    },

    /**
     * Add a quad to the batch.
     *
     * For compatibility with TRIANGLE_STRIP rendering,
     * the vertices are added in the order:
     *
     * - Top-left
     * - Bottom-left
     * - Top-right
     * - Bottom-right
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#batch
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} glTexture - The texture to render.
     * @param {number} x0 - The x coordinate of the top-left corner.
     * @param {number} y0 - The y coordinate of the top-left corner.
     * @param {number} x1 - The x coordinate of the bottom-left corner.
     * @param {number} y1 - The y coordinate of the bottom-left corner.
     * @param {number} x2 - The x coordinate of the top-right corner.
     * @param {number} y2 - The y coordinate of the top-right corner.
     * @param {number} x3 - The x coordinate of the bottom-right corner.
     * @param {number} y3 - The y coordinate of the bottom-right corner.
     * @param {number} texX - The left u coordinate (0-1).
     * @param {number} texY - The top v coordinate (0-1).
     * @param {number} texWidth - The width of the texture (0-1).
     * @param {number} texHeight - The height of the texture (0-1).
     * @param {number} tintFill - Whether to tint the fill color.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBR - The bottom-right tint color.
     */
    batch: function (currentContext, glTexture, x0, y0, x1, y1, x2, y2, x3, y3, texX, texY, texWidth, texHeight, tintFill, tintTL, tintBL, tintTR, tintBR)
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, currentContext);
        }

        // Texture

        // Check if the texture is already in the batch.
        // This could be a very expensive operation if we're not careful.
        // If we just use `batchTextures.indexOf`, a linear search,
        // we can use up to 20% of a frame budget.
        // Instead, we cache the texture unit index on the texture itself,
        // so we can immediately tell whether it's in the batch.
        // We reset this value when we flush the batch.

        var textureIndex = glTexture.batchUnit;
        if (textureIndex === -1)
        {
            var currentBatchEntry = this.currentBatchEntry;
            if (currentBatchEntry.count === this.maxTexturesPerBatch)
            {
                // Commit the current batch entry and start a new one.
                this.pushCurrentBatchEntry();
                currentBatchEntry = this.currentBatchEntry;
            }
            textureIndex = currentBatchEntry.unit;
            glTexture.batchUnit = textureIndex;
            currentBatchEntry.texture[textureIndex] = glTexture;
            currentBatchEntry.unit++;
        }

        // Update the vertex buffer.
        var vertexOffset32 = this.instanceCount * this.floatsPerInstance;
        var vertexViewF32 = this.vertexBufferLayout.viewFloat32;
        var vertexViewU32 = this.vertexBufferLayout.viewUint32;

        // Top-left
        vertexViewF32[vertexOffset32++] = x0;
        vertexViewF32[vertexOffset32++] = y0;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTL;

        // Bottom-left
        vertexViewF32[vertexOffset32++] = x1;
        vertexViewF32[vertexOffset32++] = y1;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBL;

        // Top-right
        vertexViewF32[vertexOffset32++] = x2;
        vertexViewF32[vertexOffset32++] = y2;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTR;

        // Bottom-right
        vertexViewF32[vertexOffset32++] = x3;
        vertexViewF32[vertexOffset32++] = y3;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBR;

        // Increment the instance count.
        this.instanceCount++;
        this.currentBatchEntry.count++;

        // Check whether the batch should be rendered immediately.
        // This guarantees that none of the arrays are full above.
        if (this.instanceCount === this.quadsPerBatch)
        {
            this.run(currentContext);

            // Now the batch is empty.
        }
    },

    /**
     * Push the current batch entry to the batch entry list,
     * and create a new batch entry for future use.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#pushCurrentBatchEntry
     * @since 3.90.0
     */
    pushCurrentBatchEntry: function ()
    {
        this.batchEntries.push(this.currentBatchEntry);

        // Clear unit assignment on textures.
        var texture = this.currentBatchEntry.texture;
        for (var i = 0; i < texture.length; i++)
        {
            texture[i].batchUnit = -1;
        }

        this.currentBatchEntry = {
            start: this.instanceCount,
            count: 0,
            unit: 0,
            texture: []
        };
    },

    /**
     * Generate element indices for the quad vertices.
     * This is called automatically when the node is initialized.
     *
     * Each quad is drawn as two triangles, with the vertices in the order:
     * 0, 0, 1, 2, 3, 3. The quads are drawn as a TRIANGLE_STRIP, so the
     * repeated vertices form degenerate triangles to connect the quads
     * without being drawn.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#_generateElementIndices
     * @since 3.90.0
     * @private
     * @param {number} quads - The number of quads to define.
     * @return {Uint16Array} The index buffer data.
     */
    _generateElementIndices: function (quads)
    {
        var indices = new Uint16Array(quads * 6);
        var offset = 0;
        for (var i = 0; i < quads; i++)
        {
            var index = i * 4;
            indices[offset++] = index;
            indices[offset++] = index;
            indices[offset++] = index + 1;
            indices[offset++] = index + 2;
            indices[offset++] = index + 3;
            indices[offset++] = index + 3;
        }
        return indices;
    },

    /**
     * Set new dimensions for the renderer. This is called automatically when the renderer is resized.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedTransformedQuads#resize
     * @since 3.90.0
     * @param {number} width - The new width of the renderer.
     * @param {number} height - The new height of the renderer.
     */
    resize: function (width, height)
    {
        this.program.setUniform('uResolution', [ width, height ]);
        this.program.setUniform('uProjectionMatrix', this.renderer.projectionMatrix.val);
    },

    /**
     * Update the number of draw calls per batch.
     * This rebuilds the shader program with the new draw call count.
     * The minimum number of draw calls is 1, and the maximum is the number of
     * texture units defined in the renderer.
     * Rebuilding the shader may be expensive, so use this sparingly.
     *
     * If this runs during a batch, and the new count is less than the number of
     * textures in the current batch entry, the batch will be flushed before the
     * shader program is rebuilt, so none of the textures are skipped.
     *
     * This is usually called automatically by a listener
     * for the `Phaser.Renderer.Events.SET_PARALLEL_TEXTURE_UNITS` event,
     * triggered by the RenderNodeManager.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.Pressurizer#updateTextureCount
     * @since 3.90.0
     * @param {number} [count] - The new number of draw calls per batch. If undefined, the maximum number of texture units is used.
     */
    updateTextureCount: function (count)
    {
        if (count === undefined)
        {
            count = this.renderer.maxTextures;
        }

        var newCount = Math.max(1, Math.min(count, this.renderer.maxTextures));
        if (newCount === this.texturesPerBatch)
        {
            return;
        }

        if (
            newCount < this.currentBatchEntry.unit &&
            this.manager.currentBatchNode === this
        )
        {
            // The batch is currently running. Flush the current batch entry,
            // before the shader program becomes unable to handle all textures.
            this.manager.setCurrentBatchNode(null);
        }

        this.maxTexturesPerBatch = newCount;

        // Recreate the shader program with the new texture count.
        var ParsedShaderSourceFS = Utils.parseFragmentShaderMaxTextures(
            ShaderSourceFS,
            this.maxTexturesPerBatch
        );
        this.program.fragmentSource = ParsedShaderSourceFS;
        this.program.createResource();

        this.program.setUniform(
            'uMainSampler[0]',
            this.renderer.textureUnitIndices
        );
        this.resize(this.renderer.width, this.renderer.height);
    }
});

module.exports = BatchTexturedTintedTransformedQuads;
