/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ShaderSourceFS = require('../shaders/Multi-frag');
var ShaderSourceVS = require('../shaders/Multi-vert');
var Utils = require('../Utils');
var BatchHandlerQuad = require('./BatchHandlerQuad');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * This RenderNode renders textured triangle strips, such as for the Rope
 * Game Object. It uses batches to accelerate drawing.
 *
 * If a strip is submitted with too many vertices (usually >32,768),
 * it will throw an error.
 *
 * @class BatchHandlerStrip
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} config - The configuration object for this handler.
 */
var BatchHandlerStrip = new Class({
    Extends: BatchHandlerQuad,

    initialize: function BatchHandlerStrip (manager, config)
    {
        BatchHandlerQuad.call(this, manager, config);
    },

    /**
     * The default configuration object for this handler.
     * This is merged with the `config` object passed in the constructor.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerStrip#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 3.90.0
     */
    defaultConfig: {
        name: 'BatchHandlerStrip',
        verticesPerInstance: 2,
        indicesPerInstance: 2,
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
     * By default, each instance is a vertex pair.
     * Pairs are composed into triangle strips.
     * Strips in batches are linked by degenerate triangles,
     * created by repeating the last and first vertices of each strip
     * in an intermediate pair.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerStrip#_generateElementIndices
     * @since 3.90.0
     * @private
     * @param {number} instances - The number of instances to define.
     * @return {ArrayBuffer} The index buffer data.
     */
    _generateElementIndices: function (instances)
    {
        var buffer = new ArrayBuffer(instances * 2 * 2);
        var indices = new Uint16Array(buffer);
        var len = indices.length;
        for (var i = 0; i < len; i++)
        {
            indices[i] = i;
        }
        return buffer;
    },

    /**
     * Add a strip to the batch.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerStrip#batch
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} src - The Game Object being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} calcMatrix - The current transform matrix.
     * @param {Phaser.Renderer.WebGL.WebGLTextureWrapper} glTexture - The texture to render.
     * @param {Float32Array} vertices - The vertices of the strip.
     * @param {Float32Array} uv - The UV coordinates of the strip.
     * @param {Uint32Array} colors - The color values of the strip.
     * @param {Float32Array} alphas - The alpha values of the strip.
     * @param {number} alpha - The overall alpha value of the strip.
     * @param {number} tintFill - Whether to tint the fill color.
     * @param {function} [debugCallback] - The debug callback, called with an array consisting of alternating x,y values of the transformed vertices.
     */
    batch: function (drawingContext, src, calcMatrix, glTexture, vertices, uv, colors, alphas, alpha, tintFill, debugCallback)
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, drawingContext);
        }

        var submittedInstanceCount = vertices.length / (2 * this.verticesPerInstance);
        if (submittedInstanceCount > this.instancesPerBatch)
        {
            throw new Error('BatchHandlerStrip: Vertex count exceeds maximum per batch (' + this.maxVerticesPerBatch + ')');
        }

        // Check whether the batch should be rendered immediately.
        // This guarantees that none of the arrays are full below.
        if (this.instanceCount + submittedInstanceCount > this.instancesPerBatch)
        {
            this.run(drawingContext);

            // Now the batch is empty.
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

        var roundPixels = drawingContext.camera.roundPixels;
        var repeatFirstVertex = false;

        // Add degenerate triangles between strips.
        if (this.instanceCount > 0)
        {
            var prevOffset = 1 + this.floatsPerInstance / this.verticesPerInstance;

            // Copy the previous vertex to the start of the next strip.
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewF32[vertexOffset32++] = vertexViewF32[vertexOffset32 - prevOffset];
            vertexViewU32[vertexOffset32++] = vertexViewU32[vertexOffset32 - prevOffset];

            repeatFirstVertex = true;
        }

        var debugVerts;
        if (debugCallback)
        {
            debugVerts = [];
        }

        var a = calcMatrix.a;
        var b = calcMatrix.b;
        var c = calcMatrix.c;
        var d = calcMatrix.d;
        var e = calcMatrix.e;
        var f = calcMatrix.f;
        var cameraAlpha = drawingContext.camera.alpha;

        var meshVerticesLength = vertices.length;

        for (var i = 0; i < meshVerticesLength; i += 2)
        {
            var x = vertices[i];
            var y = vertices[i + 1];
            
            var tx = x * a + y * c + e;
            var ty = x * b + y * d + f;

            if (roundPixels)
            {
                tx = Math.round(tx);
                ty = Math.round(ty);
            }

            vertexViewF32[vertexOffset32++] = tx;
            vertexViewF32[vertexOffset32++] = ty;
            vertexViewF32[vertexOffset32++] = uv[i];
            vertexViewF32[vertexOffset32++] = uv[i + 1];
            vertexViewF32[vertexOffset32++] = textureIndex;
            vertexViewF32[vertexOffset32++] = tintFill;
            vertexViewU32[vertexOffset32++] = getTint(
                colors[i / 2],
                cameraAlpha * (alphas[i / 2] * alpha)
            );

            if (repeatFirstVertex)
            {
                // Repeat the first vertex of the strip.
                i -= 2;

                // Increment the instance count.
                this.instanceCount++;
                this.currentBatchEntry.count++;

                repeatFirstVertex = false;
            }
            else if (debugVerts)
            {
                debugVerts.push(tx, ty);
            }

            if (i % 4 === 2)
            {
                // Every 2 vertices is an instance.

                // Increment the instance count.
                this.instanceCount++;
                this.currentBatchEntry.count++;
            }
        }

        if (debugCallback)
        {
            debugCallback.call(src, src, meshVerticesLength, debugVerts);
        }
    }
});

module.exports = BatchHandlerStrip;
