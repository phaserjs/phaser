/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/Multi-frag');
var ShaderSourceVS = require('../shaders/Multi-vert');
var Utils = require('../Utils');
var BatchHandler = require('./BatchHandler');

/**
 * @classdesc
 * This RenderNode draws Standard Batch Render (SBR) quads in batches.
 *
 * @class BatchHandlerQuad
 * @extends Phaser.Renderer.WebGL.RenderNodes.Batch
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerQuad = new Class({
    Extends: BatchHandler,

    initialize: function BatchHandlerQuad (manager, config)
    {
        BatchHandler.call(this, manager, config, this.defaultConfig);

        // Main sampler will never change after initialization,
        // because it addresses texture units, not textures.
        this.program.setUniform('uMainSampler[0]', this.manager.renderer.textureUnitIndices);
    },

    /**
     * The default configuration object for this handler.
     * This is merged with the `config` object passed in the constructor.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandler#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 3.90.0
     */
    defaultConfig: {
        name: 'BatchHandlerQuad',
        verticesPerInstance: 4,
        indicesPerInstance: 6,
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
                    name: 'inTexCoord',
                    size: 2
                },
                {
                    name: 'inTexId'
                },
                {
                    name: 'inTintEffect'
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
     * By default, each instance is a quad.
     * Each quad is drawn as two triangles, with the vertices in the order:
     * 0, 0, 1, 2, 3, 3. The quads are drawn as a TRIANGLE_STRIP, so the
     * repeated vertices form degenerate triangles to connect the quads
     * without being drawn.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#_generateElementIndices
     * @since 3.90.0
     * @private
     * @param {number} instances - The number of instances to define.
     * @return {ArrayBuffer} The index buffer data.
     */
    _generateElementIndices: function (instances)
    {
        var buffer = new ArrayBuffer(instances * 6 * 2);
        var indices = new Uint16Array(buffer);
        var offset = 0;
        for (var i = 0; i < instances; i++)
        {
            var index = i * 4;
            indices[offset++] = index;
            indices[offset++] = index;
            indices[offset++] = index + 1;
            indices[offset++] = index + 2;
            indices[offset++] = index + 3;
            indices[offset++] = index + 3;
        }
        return buffer;
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
        this.program.setUniform('uProjectionMatrix', this.manager.renderer.projectionMatrix.val);
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
        var renderer = this.manager.renderer;

        if (count === undefined)
        {
            count = renderer.maxTextures;
        }

        var newCount = Math.max(1, Math.min(count, renderer.maxTextures));
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
        this.program.fragmentSource = Utils.parseFragmentShaderMaxTextures(
            this.rawShaderSourceFS,
            this.maxTexturesPerBatch
        );
        this.program.createResource();

        this.program.setUniform(
            'uMainSampler[0]',
            renderer.textureUnitIndices
        );
        this.resize(renderer.width, renderer.height);
    },

    /**
     * Called at the beginning of the `run` method.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#onRunBegin
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    onRunBegin: function (drawingContext)
    {
        this.program.setUniform(
            'uRoundPixels',
            drawingContext.roundPixels
        );
    },

    /**
     * Draw then empty the current batch.
     *
     * This method is called automatically, by either this node or the manager,
     * when the batch is full, or when something else needs to be rendered.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#run
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    run: function (drawingContext)
    {
        if (this.instanceCount === 0) { return; }

        this.onRunBegin(drawingContext);

        var bytesPerIndexPerInstance = this.bytesPerIndexPerInstance;
        var indicesPerInstance = this.indicesPerInstance;
        var program = this.program;
        var vao = this.vao;
        var renderer = this.manager.renderer;
        var vertexBuffer = this.vertexBufferLayout.buffer;

        // Finalize the current batch entry.
        this.pushCurrentBatchEntry();

        // Update vertex buffers.
        // Because we are probably using a generic vertex buffer
        // which is larger than the current batch, we need to update
        // the buffer with the correct size.
        vertexBuffer.update(this.instanceCount * this.bytesPerInstance);

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

        this.onRunEnd(drawingContext);
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
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#batch
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
        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexViewF32 = vertexBuffer.viewF32;
        var vertexViewU32 = vertexBuffer.viewU32;

        // Bottom-left
        vertexViewF32[vertexOffset32++] = x1;
        vertexViewF32[vertexOffset32++] = y1;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBL;

        // Top-left
        vertexViewF32[vertexOffset32++] = x0;
        vertexViewF32[vertexOffset32++] = y0;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTL;

        // Bottom-right
        vertexViewF32[vertexOffset32++] = x3;
        vertexViewF32[vertexOffset32++] = y3;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY + texHeight;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBR;

        // Top-right
        vertexViewF32[vertexOffset32++] = x2;
        vertexViewF32[vertexOffset32++] = y2;
        vertexViewF32[vertexOffset32++] = texX + texWidth;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTR;

        // Increment the instance count.
        this.instanceCount++;
        this.currentBatchEntry.count++;

        // Check whether the batch should be rendered immediately.
        // This guarantees that none of the arrays are full above.
        if (this.instanceCount === this.instancesPerBatch)
        {
            this.run(currentContext);

            // Now the batch is empty.
        }
    },

    /**
     * Push the current batch entry to the batch entry list,
     * and create a new batch entry for future use.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandler#pushCurrentBatchEntry
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
    }
});

module.exports = BatchHandlerQuad;
