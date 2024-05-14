/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/BatchQuad-frag.js');
var ShaderSourceVS = require('../shaders/BatchQuad-vert.js');
var Utils = require('../Utils.js');
var WebGLVertexBufferLayoutWrapper = require('../wrappers/WebGLVertexBufferLayoutWrapper.js');
var Batch = require('./Batch');

/**
 * @classdesc
 * This RenderNode draws Standard Batch Render (SBR) quads in batches.
 *
 * @class BatchTexturedTintedRawQuads
 * @extends Phaser.Renderer.WebGL.RenderNodes.Batch
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var BatchTexturedTintedRawQuads = new Class({
    Extends: Batch,

    initialize: function BatchTexturedTintedRawQuads (manager, renderer)
    {
        Batch.call(this, 'BatchTexturedTintedRawQuads', manager, renderer);

        var gl = renderer.gl;

        /**
         * The number of quads per batch, used to determine the size of the
         * vertex and quad buffers, and the number of instances to render.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#quadsPerBatch
         * @type {number}
         * @since 3.90.0
         */
        this.quadsPerBatch = renderer.config.batchSize;

        /**
         * The number of vertices per instance.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#verticesPerInstance
         * @type {number}
         * @since 3.90.0
         * @default 4
         */
        this.verticesPerInstance = 4;

        /**
         * The maximum number of textures per batch entry.
         * This is usually the maximum number of texture units available,
         * but it might be smaller for some uses.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#maxTexturesPerBatch
         * @type {number}
         * @since 3.90.0
         */
        this.maxTexturesPerBatch = manager.maxParallelTextureUnits;

        /**
         * The number of quads currently in the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#instanceCount
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
         * The layout, data, and vertex buffer used to store the quad data.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#quadBufferLayout
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper}
         * @since 3.90.0
         */
        this.quadBufferLayout = new WebGLVertexBufferLayoutWrapper(renderer, this.program, {
            instanceDivisor: 1,
            usage: gl.DYNAMIC_DRAW,
            count: this.quadsPerBatch,
            layout: [
                {
                    name: 'inTexIdAndTintEffect',
                    location: -1,
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inTextureBox',
                    location: -1,
                    size: 4,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inTintTL',
                    location: -1,
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true
                },
                {
                    name: 'inTintBL',
                    location: -1,
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true
                },
                {
                    name: 'inTintTR',
                    location: -1,
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true
                },
                {
                    name: 'inTintBR',
                    location: -1,
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true
                },

                {
                    name: 'inObjectMatrixABCD',
                    location: -1,
                    size: 4,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inObjectMatrixXY',
                    location: -1,
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inWorldMatrixABCD',
                    location: -1,
                    size: 4,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inWorldMatrixXY',
                    location: -1,
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inViewMatrixABCD',
                    location: -1,
                    size: 4,
                    type: gl.FLOAT,
                    normalized: false
                },
                {
                    name: 'inViewMatrixXY',
                    location: -1,
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false
                }
            ]
        });

        /**
         * The layout, data, and vertex buffer used to store the instance data.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#instanceBufferLayout
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVertexBufferLayoutWrapper}
         * @since 3.90.0
         */
        this.instanceBufferLayout = new WebGLVertexBufferLayoutWrapper(renderer, this.program, {
            usage: gl.STATIC_DRAW,
            count: this.verticesPerInstance,
            instanceDivisor: 0,
            layout: [
                {
                    name: 'inPositionAndIndex',
                    location: -1,
                    size: 3,
                    type: gl.FLOAT,
                    normalized: false
                }
            ]
        });

        /**
         * The Vertex Array Object used to render the batch.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#vao
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper}
         * @since 3.90.0
         */
        this.vao = renderer.createVAO(null, [
            this.quadBufferLayout,
            this.instanceBufferLayout
        ]);

        /**
         * The current batch entry being filled with textures.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#currentBatchEntry
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
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#batchEntries
         * @type {Phaser.Types.Renderer.WebGL.WebGLPipelineBatchEntry[]}
         * @since 3.90.0
         * @default []
         */
        this.batchEntries = [];

        /**
         * The number of floats per quad, used to determine how much of the quad buffer to update.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#floatsPerQuad
         * @type {number}
         * @since 3.90.0
         */
        this.floatsPerQuad = this.quadBufferLayout.layout.stride / Float32Array.BYTES_PER_ELEMENT;

        // Set the dimension-related uniforms and listen for resize events.
        this.resize(renderer.width, renderer.height);
        this.renderer.on(Phaser.Renderer.Events.RESIZE, this.resize, this);

        // Main sampler will never change after initialization,
        // because it addresses texture units, not textures.
        this.program.setUniform('uMainSampler[0]', this.getTextureUnitIndices());

        // Initialize the instance buffer, and listen for context loss and restore.
        this.populateInstanceBuffer();
        this.renderer.on(Phaser.Renderer.Events.RESTORE_WEBGL, this.populateInstanceBuffer, this);

        // Listen for changes to the number of draw calls per batch.
        this.manager.on(Phaser.Renderer.Events.SET_PARALLEL_TEXTURE_UNITS, this.updateTextureCount, this);
    },

    /**
     * Draw then empty the current batch.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#run
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        if (this.instanceCount === 0) { return; }

        var renderer = this.renderer;
        var quadBuffer = this.quadBufferLayout.buffer;

        // Finalize the current batch entry.
        this.pushCurrentBatchEntry();

        // Update vertex buffers.
        if (this.instanceCount < this.quadsPerBatch)
        {
            // We use a subarray to avoid copying the buffer, but still
            // control the length.
            quadBuffer.update(this.quadBufferLayout.viewFloat32.subarray(0, this.instanceCount * this.floatsPerQuad));
        }
        else
        {
            quadBuffer.update(this.quadBufferLayout.data);
        }

        this.program.setUniform('uRoundPixels', drawingContext.camera.roundPixels);

        var subBatches = this.batchEntries.length;
        for (var i = 0; i < subBatches; i++)
        {
            var entry = this.batchEntries[i];
            renderer.drawInstances(
                drawingContext,
                entry.texture,
                this.program,
                this.vao,
                entry.start,
                this.verticesPerInstance,
                entry.count
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
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#batch
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} glTexture - The texture to render.
     * @param {boolean} tintFill - Whether to tint the fill color.
     * @param {Phaser.GameObjects.Components.TransformMatrix} objectMatrix - The matrix to transform the base quad into the object space.
     * @param {Phaser.GameObjects.Components.TransformMatrix} worldMatrix - The matrix to transform the object space quad into the world space.
     * @param {Phaser.GameObjects.Components.TransformMatrix} viewMatrix - The matrix to transform the world space quad into the view space.
     * @param {number} texX - The left u coordinate (0-1).
     * @param {number} texY - The top v coordinate (0-1).
     * @param {number} texWidth - The width of the texture (0-1).
     * @param {number} texHeight - The height of the texture (0-1).
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBR - The bottom-right tint color.
     */
    batch: function (currentContext, glTexture, tintFill, objectMatrix, worldMatrix, viewMatrix, texX, texY, texWidth, texHeight, tintTL, tintBL, tintTR, tintBR)
    {
        this.manager.setCurrentBatchNode(this, currentContext);

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

        var quadOffset32 = this.instanceCount * this.floatsPerQuad;
        var quadViewF32 = this.quadBufferLayout.viewFloat32;
        var quadViewU32 = this.quadBufferLayout.viewUint32;

        // Quad
        quadViewF32[quadOffset32 + 0] = textureIndex;
        quadViewF32[quadOffset32 + 1] = tintFill;
        quadViewF32[quadOffset32 + 2] = texX;
        quadViewF32[quadOffset32 + 3] = texY;
        quadViewF32[quadOffset32 + 4] = texWidth;
        quadViewF32[quadOffset32 + 5] = texHeight;
        quadViewU32[quadOffset32 + 6] = tintTL;
        quadViewU32[quadOffset32 + 7] = tintBL;
        quadViewU32[quadOffset32 + 8] = tintTR;
        quadViewU32[quadOffset32 + 9] = tintBR;
        quadViewF32.set(objectMatrix.matrix.subarray(0, 6), quadOffset32 + 10);
        quadViewF32.set(worldMatrix.matrix.subarray(0, 6), quadOffset32 + 16);
        quadViewF32.set(viewMatrix.matrix.subarray(0, 6), quadOffset32 + 22);

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
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#pushCurrentBatchEntry
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
     * Return a list containing the indices of all available texture units.
     * TODO: this should be universal.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#getTextureUnitIndices
     * @since 3.90.0
     * @return {number[]} The list of available texture unit indices.
     */
    getTextureUnitIndices: function ()
    {
        var indices = [];
        for (var i = 0; i < this.renderer.maxTextures; i++)
        {
            indices.push(i);
        }
        return indices;
    },

    /**
     * Populate the instance buffer with the base quad.
     *
     * This is called automatically when the renderer is initialized,
     * or when the context is lost and restored.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#populateInstanceBuffer
     * @since 3.90.0
     */
    populateInstanceBuffer: function ()
    {
        this.instanceBufferLayout.viewFloat32.set([
            0, 0, 0,
            0, 1, 1,
            1, 0, 2,
            1, 1, 3
        ]);
        this.instanceBufferLayout.buffer.update(this.instanceBufferLayout.data);
    },

    /**
     * Set new dimensions for the renderer. This is called automatically when the renderer is resized.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchTexturedTintedRawQuads#resize
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
     * @method Phaser.Renderer.WebGL.RenderNodes.Pressurizer#updateDrawCallCount
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
            this.getTextureUnitIndices()
        );
        this.resize(this.renderer.width, this.renderer.height);
    }
});

module.exports = BatchTexturedTintedRawQuads;
