/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../../math/Vector2');
var Class = require('../../../utils/Class');
var Utils = require('../Utils.js');
var BatchHandlerQuad = require('./BatchHandlerQuad');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * This RenderNode renders textured triangles individually, rather than
 * combining them into quads. It is used by the `Mesh2D` Game Object when its
 * `renderAsTriangles` property is enabled, which suits dynamic topology that
 * cannot be optimized into quads ahead of time.
 *
 * It extends `BatchHandlerQuad` and reuses its shader, vertex layout, texture
 * handling, and draw logic. The only differences are its configuration (three
 * vertices and indices per instance, drawn as `gl.TRIANGLES`) and the
 * `batchTriangles` method, which accepts vertex and index arrays directly,
 * much like `BatchHandlerTriFlat`, but writes each vertex in the layout used by
 * `BatchHandlerQuad`.
 *
 * @class BatchHandlerTri
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.2.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} [config] - The configuration object for this handler.
 */
var BatchHandlerTri = new Class({
    Extends: BatchHandlerQuad,

    initialize: function BatchHandlerTri (manager, config)
    {
        BatchHandlerQuad.call(this, manager, config);

        /**
         * Temporary point used to transform vertex positions into screen space.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTri#_tempPoint
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 4.2.0
         */
        this._tempPoint = new Vector2();
    },

    /**
     * The default configuration object for this handler. It is the
     * `BatchHandlerQuad` configuration with the instance shape and topology
     * changed to draw individual triangles.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTri#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 4.2.0
     */
    defaultConfig: Object.assign({}, BatchHandlerQuad.prototype.defaultConfig, {
        name: 'BatchHandlerTri',
        verticesPerInstance: 3,
        indicesPerInstance: 3,
        topology: 0x0004 // gl.TRIANGLES
    }),

    /**
     * Generate element indices for the instance vertices.
     * This is called automatically when the node is initialized.
     *
     * Each instance is a single triangle of three vertices, drawn as
     * `gl.TRIANGLES`. The vertices of each instance are written contiguously,
     * so the indices are simply sequential.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTri#_generateElementIndices
     * @since 4.2.0
     * @private
     * @param {number} instances - The number of instances to define.
     * @return {ArrayBuffer} The index buffer data.
     */
    _generateElementIndices: function (instances)
    {
        var buffer = new ArrayBuffer(instances * 3 * 2);
        var indices = new Uint16Array(buffer);
        var len = indices.length;
        for (var i = 0; i < len; i++)
        {
            indices[i] = i;
        }
        return buffer;
    },

    /**
     * Adds a set of textured triangles to the batch. Each triangle is defined
     * by a stride-4 entry in `indices` (`a, b, c, page`), where `a, b, c` index
     * into `vertices` and `page` selects the texture source. Each vertex is a
     * stride-4 entry in `vertices` (`x, y, u, v`).
     *
     * The vertex positions are transformed into screen space by the supplied
     * transformer node, then written into the vertex buffer in the same layout
     * used by `BatchHandlerQuad`. This handling mirrors `BatchHandlerTriFlat`,
     * but produces fully textured and tinted vertices.
     *
     * This method is named `batchTriangles` rather than `batch` because its
     * call signature differs from the standard quad batch handlers.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTri#batchTriangles
     * @since 4.2.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.Mesh2D} gameObject - The Mesh2D Game Object being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix | undefined} parentMatrix - The parent matrix of the Game Object, if it is nested.
     * @param {Phaser.Renderer.WebGL.RenderNodes.TransformerVertex} transformerNode - The transformer node used to transform each vertex into screen space.
     * @param {number[]} vertices - The vertex data, as a sequence of `x, y, u, v` with a step of 4.
     * @param {number[]} indices - The index data, as a sequence of `a, b, c, page` with a step of 4.
     * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptions} renderOptions - The render options for the batch, as resolved by the submitter node.
     */
    batchTriangles: function (
        drawingContext,
        gameObject,
        parentMatrix,
        transformerNode,
        vertices,
        indices,
        renderOptions
    )
    {
        if (this.instanceCount === 0)
        {
            this.manager.setCurrentBatchNode(this, drawingContext);
        }

        // Check render options and run the batch if they differ.
        // The options are constant across the whole mesh, so we check once.
        renderOptions.alphaStrategy = drawingContext.alphaStrategy;
        this.updateRenderOptions(renderOptions);
        if (this._renderOptionsChanged)
        {
            this.run(drawingContext);
            this.updateShaderConfig();
        }

        // Build the transform matrix once for the whole mesh, then project each
        // vertex cheaply below.
        transformerNode.setupMatrix(drawingContext, gameObject, parentMatrix);

        var step = 4;
        var tempPoint = this._tempPoint;

        var flipV = gameObject.flipV;
        var tintEffect = gameObject.tintMode;
        var tint = getTint(gameObject.tint, gameObject.alpha);
        var tint2 = tintEffect << 24;

        var textureSources = gameObject.texture.source;

        var floatsPerInstance = this.floatsPerInstance;
        var instancesPerBatch = this.instancesPerBatch;

        var vertexBuffer = this.vertexBufferLayout.buffer;
        var vertexViewF32 = vertexBuffer.viewF32;
        var vertexViewU32 = vertexBuffer.viewU32;

        var triCount = (indices.length / 4) | 0;

        for (var i = 0; i < triCount; i++)
        {
            var i4 = i * 4;
            var ia = indices[i4];
            var ib = indices[i4 + 1];
            var ic = indices[i4 + 2];
            var page = indices[i4 + 3];

            var glTexture = textureSources[page].glTexture;

            // Process the texture. This may start a new batch entry.
            var textureDatum = this.batchTextures(glTexture, renderOptions);

            var vertexOffset32 = this.instanceCount * floatsPerInstance;

            // Vertex A
            var ia4 = ia * step;
            tempPoint.set(vertices[ia4], vertices[ia4 + 1]);
            transformerNode.transformVertex(tempPoint);
            var vA = vertices[ia4 + 3];
            vertexViewF32[vertexOffset32++] = tempPoint.x;
            vertexViewF32[vertexOffset32++] = tempPoint.y;
            vertexViewF32[vertexOffset32++] = vertices[ia4 + 2];
            vertexViewF32[vertexOffset32++] = flipV ? 1 - vA : vA;
            vertexViewF32[vertexOffset32++] = textureDatum;
            vertexViewU32[vertexOffset32++] = tint2;
            vertexViewU32[vertexOffset32++] = tint;

            // Vertex B
            var ib4 = ib * step;
            tempPoint.set(vertices[ib4], vertices[ib4 + 1]);
            transformerNode.transformVertex(tempPoint);
            var vB = vertices[ib4 + 3];
            vertexViewF32[vertexOffset32++] = tempPoint.x;
            vertexViewF32[vertexOffset32++] = tempPoint.y;
            vertexViewF32[vertexOffset32++] = vertices[ib4 + 2];
            vertexViewF32[vertexOffset32++] = flipV ? 1 - vB : vB;
            vertexViewF32[vertexOffset32++] = textureDatum;
            vertexViewU32[vertexOffset32++] = tint2;
            vertexViewU32[vertexOffset32++] = tint;

            // Vertex C
            var ic4 = ic * step;
            tempPoint.set(vertices[ic4], vertices[ic4 + 1]);
            transformerNode.transformVertex(tempPoint);
            var vC = vertices[ic4 + 3];
            vertexViewF32[vertexOffset32++] = tempPoint.x;
            vertexViewF32[vertexOffset32++] = tempPoint.y;
            vertexViewF32[vertexOffset32++] = vertices[ic4 + 2];
            vertexViewF32[vertexOffset32++] = flipV ? 1 - vC : vC;
            vertexViewF32[vertexOffset32++] = textureDatum;
            vertexViewU32[vertexOffset32++] = tint2;
            vertexViewU32[vertexOffset32++] = tint;

            // Increment the instance count.
            this.instanceCount++;
            this.currentBatchEntry.count++;

            // Check whether the batch should be rendered immediately.
            // This guarantees that none of the arrays are full above.
            if (this.instanceCount === instancesPerBatch)
            {
                this.run(drawingContext);

                // Now the batch is empty.
            }
        }
    }
});

module.exports = BatchHandlerTri;
