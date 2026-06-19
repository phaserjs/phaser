/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../../../math/Vector2.js');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var Utils = require('../../Utils.js');
var SubmitterQuad = require('./SubmitterQuad');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * The SubmitterMeshToQuad RenderNode submits data for rendering a Mesh GameObject.
 * It uses a BatchHandler to render the mesh as part of a batch.
 * It is designed to maximize batch compatibility with regular quads,
 * by combining adjacent triangles into quads where possible.
 *
 * Performance-wise, this depends on the sequence of triangles in the mesh.
 * Two sequential triangles sharing an edge will be combined into a quad,
 * which renders as just 4 vertices instead of 6.
 * But a triangle that can't combine will be rendered as a quad too,
 * taking 4 vertices instead of 3.
 * Try to arrange triangles so they can combine.
 *
 * This node receives the drawing context, game object, and parent matrix.
 * It also receives the transformer node from the node that invoked it.
 * This allows the behavior to be configured by setting the appropriate nodes
 * on the GameObject for individual tweaks, or on the invoking Renderer node
 * for global changes.
 *
 * @class SubmitterMeshToQuad
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.NEXT
 * @extends Phaser.Renderer.WebGL.RenderNodes.SubmitterQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.SubmitterQuadConfig} [config] - The configuration object for this RenderNode.
 */
var SubmitterMeshToQuad = new Class({
    Extends: SubmitterQuad,

    initialize: function SubmitterMeshToQuad (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        SubmitterQuad.call(this, manager, config);

        /**
         * Temporary point used to store the transformed vertex positions.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterMeshToQuad#_tempPoint
         * @type {Phaser.Math.Vector2}
         * @since 4.NEXT
         * @private
         */
        this._tempPoint = new Vector2();
    },

    /**
     * The default configuration for this RenderNode.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.SubmitterMeshToQuad#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.SubmitterQuadConfig}
     */
    defaultConfig: {
        name: 'SubmitterMeshToQuad',
        role: 'Submitter',
        batchHandler: 'BatchHandler'
    },

    /**
     * Processes the given GameObject and submits mesh vertex data to the appropriate
     * batch handler for rendering. This method iterates over the mesh indices and
     * vertices, checking for shared edges between triangles to combine them into quads.
     * If no shared edge is found, the triangle is submitted as a degenerate. The
     * method then caches the last triangle and continues iterating until all triangles
     * are processed. If a cached triangle remains at the end, it is submitted as a
     * degenerate.
     *
     * The method also sets the render options for the GameObject, including the normal
     * map texture and rotation.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterMeshToQuad#run
     * @since 4.NEXT
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The parent matrix of the GameObject, if it is a nested game object.
     * @param {Phaser.Renderer.WebGL.RenderNodes.TransformerVertex} transformerNode - The transformer node used to transform the GameObject.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} [normalMap] - The normal map texture to use for lighting. If omitted, the normal map texture of the GameObject will be used, or the default normal map texture of the renderer.
     * @param {number} [normalMapRotation] - The rotation of the normal map texture. If omitted, the rotation of the GameObject will be used.
     */
    run: function (
        drawingContext,
        gameObject,
        parentMatrix,
        transformerNode,
        normalMap,
        normalMapRotation
    )
    {
        this.onRunBegin(drawingContext);

        // Build the transform matrix once for the whole mesh, so that
        // `_submitQuad` can transform each vertex cheaply.
        transformerNode.setupMatrix(drawingContext, gameObject, parentMatrix);

        // If the game object has a prebuilt ordered index list, consume it
        // directly. It is arranged into quad-forming pairs of triangles, so we
        // can submit quads without searching for shared edges.
        if (gameObject.useOrderedIndices && gameObject.indicesOrdered)
        {
            var ordered = gameObject.indicesOrdered;

            // Each quad is a pair of triangles (8 values):
            // p, q, r, page (first triangle) and q, r, s, page (second).
            for (var o = 0; o < ordered.length; o += 8)
            {
                this._submitQuad(
                    ordered[o],
                    ordered[o + 1],
                    ordered[o + 2],
                    ordered[o + 6],
                    ordered[o + 3],
                    drawingContext, gameObject, parentMatrix, transformerNode, normalMap, normalMapRotation
                );
            }

            this.onRunEnd(drawingContext);

            return;
        }

        var cached = false;
        var triCount = gameObject.indices.length / 4;

        // First triangle vertex cache.
        var d, e, f, firstTexturePage;

        for (var i = 0; i < triCount; i++)
        {
            var index = i * 4;
            var a = gameObject.indices[index];
            var b = gameObject.indices[index + 1];
            var c = gameObject.indices[index + 2];
            var texturePage = gameObject.indices[index + 3];

            // We could check for degenerate triangles,
            // using either abc or the texture coordinates,
            // but as we expect raw triangles, and there's no reason to define
            // degenerate triangles except for purposeful topology, we don't.

            if (!cached)
            {
                cached = true;

                d = a;
                e = b;
                f = c;
                firstTexturePage = texturePage;

                continue;
            }

            // Compare with potential first half of quad.
            // If the texture page is the same,
            // and the triangles share any edge (as defined by abc and def),
            // then we can submit a quad combining the triangles.
            if (texturePage === firstTexturePage)
            {
                var sharedEdge = false;

                // Whether vertices are the same.
                var isAD = a === d;
                var isAE = a === e;
                var isAF = a === f;
                var isBD = b === d;
                var isBE = b === e;
                var isBF = b === f;
                var isCD = c === d;
                var isCE = c === e;
                var isCF = c === f;

                // Shared quad.
                var p, q, r, s;

                // Possible combinations of shared edges.
                if ((isAD && isBE) || (isAE && isBD))
                {
                    sharedEdge = true;
                    p = c;
                    q = a;
                    r = b;
                    s = f;
                }
                else if ((isAD && isBF) || (isAF && isBD))
                {
                    sharedEdge = true;
                    p = c;
                    q = a;
                    r = b;
                    s = e;
                }
                else if ((isAE && isBF) || (isAF && isBE))
                {
                    sharedEdge = true;
                    p = c;
                    q = a;
                    r = b;
                    s = d;
                }
                else if ((isAD && isCE) || (isAE && isCD))
                {
                    sharedEdge = true;
                    p = b;
                    q = a;
                    r = c;
                    s = f;
                }
                else if ((isAD && isCF) || (isAF && isCD))
                {
                    sharedEdge = true;
                    p = b;
                    q = a;
                    r = c;
                    s = e;
                }
                else if ((isAE && isCF) || (isAF && isCE))
                {
                    sharedEdge = true;
                    p = b;
                    q = a;
                    r = c;
                    s = d;
                }
                else if ((isBD && isCE) || (isBE && isCD))
                {
                    sharedEdge = true;
                    p = a;
                    q = b;
                    r = c;
                    s = f;
                }
                else if ((isBD && isCF) || (isBF && isCD))
                {
                    sharedEdge = true;
                    p = a;
                    q = b;
                    r = c;
                    s = e;
                }
                else if ((isBE && isCF) || (isBF && isCE))
                {
                    sharedEdge = true;
                    p = a;
                    q = b;
                    r = c;
                    s = d;
                }

                if (sharedEdge)
                {
                    this._submitQuad(p, q, r, s, texturePage, drawingContext, gameObject, parentMatrix, transformerNode, normalMap, normalMapRotation);

                    cached = false;

                    continue;
                }
            }

            // The cached triangle cannot be linked with the current tri,
            // so we submit it as a degenerate.
            this._submitQuad(d, e, f, f, firstTexturePage, drawingContext, gameObject, parentMatrix, transformerNode, normalMap, normalMapRotation);

            // Update the cached triangle.
            d = a;
            e = b;
            f = c;
            firstTexturePage = texturePage;
            cached = true;
        }

        if (cached)
        {
            // We have a cached triangle, but it's not part of a quad.
            // Submit it as a degenerate.
            this._submitQuad(d, e, f, f, firstTexturePage, drawingContext, gameObject, parentMatrix, transformerNode, normalMap, normalMapRotation);
        }

        this.onRunEnd(drawingContext);
    },

    /**
     * Submits a quad to the batch handler for rendering.
     * This is used internally by the `run` method
     * to submit a quad that is a combination of two triangles,
     * or a single triangle using a degenerate triangle to pad quad alignment.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.SubmitterMeshToQuad#_submitQuad
     * @since 4.NEXT
     * @param {number} a - The index of the first vertex of the quad. This is the corner unique to the first triangle.
     * @param {number} b - The index of the second vertex of the quad. This is shared between triangles.
     * @param {number} c - The index of the third vertex of the quad. This is shared between triangles.
     * @param {number} d - The index of the fourth vertex of the quad. This is the corner unique to the second triangle.
     * @param {number} texturePage - The index of the texture source to use for the quad.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The parent matrix of the GameObject, if it is a nested game object.
     * @param {Phaser.Renderer.WebGL.RenderNodes.TransformerVertex} transformerNode - The transformer node used to transform the GameObject.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} [normalMap] - The normal map texture to use for lighting. If omitted, the normal map texture of the GameObject will be used, or the default normal map texture of the renderer.
     * @param {number} [normalMapRotation] - The rotation of the normal map texture. If omitted, the rotation of the GameObject will be used.
     */
    _submitQuad: function (
        a, b, c, d,
        texturePage,
        drawingContext,
        gameObject,
        parentMatrix,
        transformerNode,
        normalMap,
        normalMapRotation
    )
    {
        var step = 4;

        var xA = gameObject.vertices[a * step];
        var yA = gameObject.vertices[a * step + 1];
        var uA = gameObject.vertices[a * step + 2];
        var vA = gameObject.vertices[a * step + 3];

        var xB = gameObject.vertices[b * step];
        var yB = gameObject.vertices[b * step + 1];
        var uB = gameObject.vertices[b * step + 2];
        var vB = gameObject.vertices[b * step + 3];

        var xC = gameObject.vertices[c * step];
        var yC = gameObject.vertices[c * step + 1];
        var uC = gameObject.vertices[c * step + 2];
        var vC = gameObject.vertices[c * step + 3];

        var xD = gameObject.vertices[d * step];
        var yD = gameObject.vertices[d * step + 1];
        var uD = gameObject.vertices[d * step + 2];
        var vD = gameObject.vertices[d * step + 3];

        if (gameObject.flipV)
        {
            vA = 1 - vA;
            vB = 1 - vB;
            vC = 1 - vC;
            vD = 1 - vD;
        }

        var tintEffect = gameObject.tintMode;
        var tint = getTint(gameObject.tint, gameObject.alpha);
        var tint2 = gameObject.tint2;
        var tempPoint = this._tempPoint;

        // The transform matrix is built once per mesh by `run`, via
        // `transformerNode.setupMatrix`, so we only project each vertex here.
        tempPoint.set(xA, yA);
        transformerNode.transformVertex(tempPoint);
        xA = tempPoint.x;
        yA = tempPoint.y;
        tempPoint.set(xB, yB);
        transformerNode.transformVertex(tempPoint);
        xB = tempPoint.x;
        yB = tempPoint.y;
        tempPoint.set(xC, yC);
        transformerNode.transformVertex(tempPoint);
        xC = tempPoint.x;
        yC = tempPoint.y;
        tempPoint.set(xD, yD);
        transformerNode.transformVertex(tempPoint);
        xD = tempPoint.x;
        yD = tempPoint.y;

        this.setRenderOptions(gameObject, normalMap, normalMapRotation);

        (
            gameObject.customRenderNodes[this.batchHandler] ||
            gameObject.defaultRenderNodes[this.batchHandler]
        ).batchWithUV(
            drawingContext,
            gameObject.texture.source[texturePage].glTexture,

            // Combined quad in order TL, BL, TR, BR:
            xA, yA, xB, yB, xC, yC, xD, yD,

            // Texture coordinates in order TL, BL, TR, BR:
            uA, vA, uB, vB, uC, vC, uD, vD,

            tintEffect,

            // Tint colors in order TL, BL, TR, BR:
            tint, tint, tint, tint,

            // Extra render options:
            this._renderOptions,

            // Secondary tint colors in order TL, BL, TR, BR:
            tint2, tint2, tint2, tint2,
        );
    }
});

module.exports = SubmitterMeshToQuad;
