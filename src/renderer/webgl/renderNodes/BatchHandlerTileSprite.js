/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/MultiTileSprite-frag');
var ShaderSourceVS = require('../shaders/MultiTileSprite-vert');
var BatchHandlerQuad = require('./BatchHandlerQuad');

/**
 * @classdesc
 * This RenderNode handles batch rendering of TileSprites.
 *
 * @class BatchHandlerTileSprite
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerTileSprite = new Class({
    Extends: BatchHandlerQuad,

    initialize: function BatchHandlerTileSprite (manager, config)
    {
        BatchHandlerQuad.call(this, manager, config);
    },

    defaultConfig: {
        name: 'BatchHandlerTileSprite',
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
                    name: 'inFrame',
                    size: 4
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
     * Add a TileSprite to the batch.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTileSprite#batch
     * @since 3.90.0
     */
    batch: function (
        currentContext,
        glTexture,
        x0, y0, x1, y1, x2, y2, x3, y3,
        texX, texY, texWidth, texHeight,
        u0, v0, u1, v1, u2, v2, u3, v3,
        tintFill,
        tintTL, tintBL, tintTR, tintBR
    )
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
        vertexViewF32[vertexOffset32++] = u1;
        vertexViewF32[vertexOffset32++] = v1;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBL;

        // Top-left
        vertexViewF32[vertexOffset32++] = x0;
        vertexViewF32[vertexOffset32++] = y0;
        vertexViewF32[vertexOffset32++] = u0;
        vertexViewF32[vertexOffset32++] = v0;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintTL;

        // Bottom-right
        vertexViewF32[vertexOffset32++] = x3;
        vertexViewF32[vertexOffset32++] = y3;
        vertexViewF32[vertexOffset32++] = u3;
        vertexViewF32[vertexOffset32++] = v3;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
        vertexViewF32[vertexOffset32++] = textureIndex;
        vertexViewF32[vertexOffset32++] = tintFill;
        vertexViewU32[vertexOffset32++] = tintBR;

        // Top-right
        vertexViewF32[vertexOffset32++] = x2;
        vertexViewF32[vertexOffset32++] = y2;
        vertexViewF32[vertexOffset32++] = u2;
        vertexViewF32[vertexOffset32++] = v2;
        vertexViewF32[vertexOffset32++] = texX;
        vertexViewF32[vertexOffset32++] = texY;
        vertexViewF32[vertexOffset32++] = texWidth;
        vertexViewF32[vertexOffset32++] = texHeight;
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
    }
});

module.exports = BatchHandlerTileSprite;
