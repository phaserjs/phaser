/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TintModes = require('../../renderer/TintModes');
var DefaultMesh2DNodes = require('../../renderer/webgl/renderNodes/defaults/DefaultMesh2DNodes');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var Mesh2DRender = require('./Mesh2DRender');

/**
 * @classdesc
 * A Mesh2D Game Object.
 *
 * A Mesh2D Game Object is used for the display of 2D meshes.
 * It is a WebGL only Game Object.
 * It contains a number of textured triangles.
 * Each triangle is defined by a set of three vertices,
 * with a position and texture coordinate; and a reference to a texture.
 *
 * Because the triangles define their own texture coordinates,
 * Mesh2D does not directly use frame data from the texture.
 * However, it can copy a frame as a pair of triangles for convenience.
 *
 * The Mesh2D game object batches together with quads from game objects
 * like Image, Sprite, and Text.
 * It uses render nodes which attempt to combine triangles into quads,
 * or inserts degenerate triangles to treat single triangles as quads.
 * You must take care to arrange triangles to take advantage of this system.
 *
 * Mesh2D supports lighting. You should be careful not to distort
 * the mesh too far, or normal maps will look weird.
 * In particular, rotating texture coordinates will rotate the apparent light
 * direction.
 *
 * This is intended to be used as a base for dealing with 2D meshes.
 *
 * @class Mesh2D
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @webglonly
 * @constructor
 * @since 4.NEXT
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {number[]} vertices - The vertices of the mesh. Each vertex is a sequence within the array: x, y, u, v. The array has a step of 4.
 * @param {number[]} indices - The indices of the mesh. Each index is a sequence: a, b, c, page. The abc values index to vertices in the vertices array. The page value is the index of the texture source in the texture atlas to use for this triangle. Typically 0. The array has a step of 4.
 * @param {boolean} [flipV=false] - Whether to flip the texture coordinates vertically. This affects texture coordinates, not the vertices. Set this property if your geometry provides texture coordinates that are opposite to GL texture expectations (which are bottom-up).
 */
var Mesh2D = new Class({
    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Lighting,
        Components.Origin,
        Components.RenderNodes,
        Components.ScrollFactor,
        Components.TextureCrop,
        Components.Transform,
        Components.Visible,
        Mesh2DRender
    ],

    initialize: function Mesh2D(scene, x, y, texture, vertices, indices, flipV) {
        GameObject.call(this, scene, 'Mesh2D');

        this.setTexture(texture);
        this.setPosition(x, y);
        this.initRenderNodes(this._defaultRenderNodesMap);

        /**
         * The vertices of the mesh.
         * Each vertex is a sequence within the array:
         * x, y, u, v.
         * The array has a step of 4.
         *
         * - x (offset 0): The x position of the vertex.
         * - y (offset 1): The y position of the vertex.
         * - u (offset 2): The u texture coordinate of the vertex.
         * - v (offset 3): The v texture coordinate of the vertex.
         *
         * @name Phaser.GameObjects.Mesh2D#vertices
         * @type {number[]}
         * @since 4.NEXT
         */
        this.vertices = vertices;

        /**
         * The indices of the mesh.
         * Each index is a sequence: a, b, c, page.
         * These index to vertices in the vertices array.
         * The array has a step of 4.
         *
         * - a (offset 0): The index of the first vertex.
         * - b (offset 1): The index of the second vertex.
         * - c (offset 2): The index of the third vertex.
         * - page (offset 3): The page of the triangle: which texture source
         *   in the texture atlas is used for this triangle. Typically 0.
         *
         * @name Phaser.GameObjects.Mesh2D#indices
         * @type {number[]}
         * @since 4.NEXT
         */
        this.indices = indices;

        /**
         * An optimized copy of the `indices` list, built by
         * `buildOrderedIndices`. It uses the same internal pattern as
         * `indices` (a sequence of `a, b, c, page` with a step of 4), but it
         * may be longer, because it can contain synthesized degenerate
         * triangles which pad single triangles out to complete quads.
         *
         * Triangles in this list are arranged in pairs. Each pair is intended
         * to be consumed as a single quad: the first triangle is `p, q, r` and
         * the second is `q, r, s`, where `q, r` is the shared edge, and `p, s`
         * are the corners unique to each triangle. When a triangle has no
         * partner, `s` repeats `r` to form a degenerate second triangle.
         *
         * This is `null` until `buildOrderedIndices` is called. Use
         * `useOrderedIndices` to control whether it is used.
         *
         * @name Phaser.GameObjects.Mesh2D#indicesOrdered
         * @type {?number[]}
         * @since 4.NEXT
         * @default null
         */
        this.indicesOrdered = null;

        /**
         * Whether to use `indicesOrdered` instead of `indices` when rendering.
         *
         * This has no effect unless `indicesOrdered` has been populated by
         * `buildOrderedIndices`. It is safe to toggle at any time, allowing you
         * to switch between the ordered and unordered lists without rebuilding.
         *
         * @name Phaser.GameObjects.Mesh2D#useOrderedIndices
         * @type {boolean}
         * @since 4.NEXT
         * @default false
         */
        this.useOrderedIndices = false;

        /**
         * Whether to render this mesh as individual triangles, rather than
         * combining triangles into quads.
         *
         * When `true`, the renderer routes the mesh to a batch handler
         * optimized for individual triangles (`gl.TRIANGLES`). This is suitable
         * for dynamic topology which cannot be optimized into quads ahead of
         * time. When `false`, the mesh is rendered as quads, which batches with
         * regular sprites.
         *
         * @name Phaser.GameObjects.Mesh2D#renderAsTriangles
         * @type {boolean}
         * @since 4.NEXT
         * @default false
         */
        this.renderAsTriangles = false;

        /**
         * Whether to flip the texture coordinates vertically.
         *
         * This affects texture coordinates, not the vertices.
         * Set this property if your geometry provides texture coordinates
         * that are opposite to GL texture expectations (which are bottom-up).
         *
         * @name Phaser.GameObjects.Mesh2D#flipV
         * @type {boolean}
         * @since 4.NEXT
         * @default false
         */
        this.flipV = !!flipV;

        this.tintMode = TintModes.MULTIPLY;
        this.tint = 0xffffff;
        this.tint2 = 0x000000;
    },

    /**
     * The default render nodes for this Game Object.
     *
     * @name Phaser.GameObjects.Mesh2D#_defaultRenderNodesMap
     * @type {Map<string, string>}
     * @private
     * @webglOnly
     * @readonly
     * @since 4.NEXT
     */
    _defaultRenderNodesMap: {
        get: function ()
        {
            return DefaultMesh2DNodes;
        }
    },

    clearTint: function ()
    {
        this.tintMode = TintModes.MULTIPLY;
        this.tint = 0xffffff;
        this.tint2 = 0x000000;
        return this;
    },

    setTint: function (color)
    {
        this.tint = color;
        return this;
    },

    setTint2: function (color)
    {
        this.tint2 = color;
        return this;
    },

    setTintMode: function (mode)
    {
        this.tintMode = mode;
        return this;
    },

    isTinted: function ()
    {
        return this.tint !== 0xffffff || this.tint2 !== 0x000000 || this.tintMode !== TintModes.MULTIPLY;
    },

    /**
     * Sets the vertical texture flip state of this Game Object.
     *
     * @param {boolean} [value=false] - Whether to flip the texture coordinates vertically.
     * @returns {this} This Game Object instance.
     */
    setFlipV: function (value)
    {
        this.flipV = !!value;
        return this;
    },

    /**
     * Sets whether to use `indicesOrdered` instead of `indices` when rendering.
     *
     * This has no side effects other than setting the property. It does not
     * rebuild `indicesOrdered`, so you may toggle freely between the ordered
     * and unordered lists. Call `buildOrderedIndices` to populate the ordered
     * list.
     *
     * @method Phaser.GameObjects.Mesh2D#setUseOrderedIndices
     * @since 4.NEXT
     * @param {boolean} [value=false] - Whether to use the ordered index list.
     * @returns {this} This Game Object instance.
     */
    setUseOrderedIndices: function (value)
    {
        this.useOrderedIndices = !!value;
        return this;
    },

    /**
     * Sets whether to render this mesh as individual triangles.
     *
     * @method Phaser.GameObjects.Mesh2D#setRenderAsTriangles
     * @since 4.NEXT
     * @param {boolean} [value=false] - Whether to render the mesh as individual triangles.
     * @returns {this} This Game Object instance.
     */
    setRenderAsTriangles: function (value)
    {
        this.renderAsTriangles = !!value;
        return this;
    },

    /**
     * Builds `indicesOrdered`, an optimized copy of `indices` in which
     * triangles are arranged into quad-forming pairs. Each pair consists of
     * two triangles `p, q, r` and `q, r, s`: where two triangles share an edge,
     * `q, r` is that shared edge and `p, s` are their unique corners; where a
     * triangle has no partner, the second triangle of the pair is degenerate
     * (`s` repeats `r`), padding the single triangle out to a full quad.
     *
     * Because this processes the entire `indices` list, you should only call
     * it when the topology is stable. The cost depends on the chosen strategy.
     *
     * @method Phaser.GameObjects.Mesh2D#buildOrderedIndices
     * @since 4.NEXT
     * @param {number} [strategy=0] - The level of optimization to use.
     *
     * - `0`: Fast. Each triangle forms its own quad with a synthesized
     *   degenerate triangle. No edge sharing is detected. This is quick to
     *   build but the least memory efficient at render time.
     * - `1`: Medium. Each triangle checks only the next triangle for a shared
     *   edge, forming a quad if one is found, otherwise padding with a
     *   degenerate triangle.
     * - `2`: High. Every triangle is checked against every other triangle for a
     *   shared edge, using an edge lookup to keep this tractable. This is the
     *   slowest to build but the most memory efficient at render time.
     * @param {boolean} [useOrderedIndices] - If defined, also sets the `useOrderedIndices` property.
     * @returns {this} This Game Object instance.
     */
    buildOrderedIndices: function (strategy, useOrderedIndices)
    {
        if (strategy === undefined) { strategy = 0; }

        if (useOrderedIndices !== undefined)
        {
            this.useOrderedIndices = !!useOrderedIndices;
        }

        var indices = this.indices;
        var triCount = (indices.length / 4) | 0;

        // The multiplier used to canonicalize an edge into a single numeric
        // key. It must exceed the largest vertex index, so we use the vertex
        // count.
        var vCount = (this.vertices.length / 4) | 0;

        // The output list, built up below.
        var ordered = [];

        if (strategy === 1)
        {
            this._buildOrderedIndicesNext(indices, triCount, vCount, ordered);
        }
        else if (strategy === 2)
        {
            this._buildOrderedIndicesAll(indices, triCount, vCount, ordered);
        }
        else
        {
            this._buildOrderedIndicesFast(indices, triCount, ordered);
        }

        this.indicesOrdered = ordered;

        return this;
    },

    /**
     * Strategy 0: each triangle becomes its own quad, padded by a degenerate
     * triangle. No edge detection is performed.
     *
     * @method Phaser.GameObjects.Mesh2D#_buildOrderedIndicesFast
     * @since 4.NEXT
     * @private
     * @param {number[]} indices - The source index list.
     * @param {number} triCount - The number of triangles in the source list.
     * @param {number[]} ordered - The output list to populate.
     */
    _buildOrderedIndicesFast: function (indices, triCount, ordered)
    {
        for (var i = 0; i < triCount; i++)
        {
            var i4 = i * 4;
            this._pushDegenerateQuad(
                ordered,
                indices[i4],
                indices[i4 + 1],
                indices[i4 + 2],
                indices[i4 + 3]
            );
        }
    },

    /**
     * Strategy 1: each unconsumed triangle checks only the immediately
     * following triangle for a shared edge. Matching triangles form a quad;
     * otherwise the triangle is padded with a degenerate triangle.
     *
     * @method Phaser.GameObjects.Mesh2D#_buildOrderedIndicesNext
     * @since 4.NEXT
     * @private
     * @param {number[]} indices - The source index list.
     * @param {number} triCount - The number of triangles in the source list.
     * @param {number} vCount - The vertex count, used to canonicalize edges.
     * @param {number[]} ordered - The output list to populate.
     */
    _buildOrderedIndicesNext: function (indices, triCount, vCount, ordered)
    {
        for (var i = 0; i < triCount; i++)
        {
            var i4 = i * 4;
            var a = indices[i4];
            var b = indices[i4 + 1];
            var c = indices[i4 + 2];
            var page = indices[i4 + 3];

            var paired = false;
            var j = i + 1;

            if (j < triCount)
            {
                var j4 = j * 4;

                if (page === indices[j4 + 3])
                {
                    var quad = this._sharedEdgeQuad(
                        a, b, c,
                        indices[j4], indices[j4 + 1], indices[j4 + 2],
                        vCount
                    );

                    if (quad)
                    {
                        this._pushQuad(ordered, quad[0], quad[1], quad[2], quad[3], page);

                        // Skip the consumed partner.
                        i = j;
                        paired = true;
                    }
                }
            }

            if (!paired)
            {
                this._pushDegenerateQuad(ordered, a, b, c, page);
            }
        }
    },

    /**
     * Strategy 2: every triangle is matched against every other triangle using
     * an edge lookup. Each unconsumed triangle greedily pairs with the first
     * unconsumed triangle that shares an edge and texture page.
     *
     * @method Phaser.GameObjects.Mesh2D#_buildOrderedIndicesAll
     * @since 4.NEXT
     * @private
     * @param {number[]} indices - The source index list.
     * @param {number} triCount - The number of triangles in the source list.
     * @param {number} vCount - The vertex count, used to canonicalize edges.
     * @param {number[]} ordered - The output list to populate.
     */
    _buildOrderedIndicesAll: function (indices, triCount, vCount, ordered)
    {
        // Map from a canonical edge key to the list of triangles which contain
        // that edge. Each entry records the partner triangle, the texture page,
        // and the vertex opposite the shared edge.
        var edgeMap = {};

        var i, i4, a, b, c, page;

        for (i = 0; i < triCount; i++)
        {
            i4 = i * 4;
            a = indices[i4];
            b = indices[i4 + 1];
            c = indices[i4 + 2];
            page = indices[i4 + 3];

            this._addEdge(edgeMap, a, b, c, i, page, vCount);
            this._addEdge(edgeMap, b, c, a, i, page, vCount);
            this._addEdge(edgeMap, c, a, b, i, page, vCount);
        }

        var consumed = [];

        for (i = 0; i < triCount; i++)
        {
            if (consumed[i]) { continue; }

            i4 = i * 4;
            a = indices[i4];
            b = indices[i4 + 1];
            c = indices[i4 + 2];
            page = indices[i4 + 3];

            consumed[i] = true;

            // Each edge of this triangle, with the vertex opposite it.
            var found = (
                this._matchEdge(edgeMap, consumed, ordered, i, a, b, c, page, vCount) ||
                this._matchEdge(edgeMap, consumed, ordered, i, b, c, a, page, vCount) ||
                this._matchEdge(edgeMap, consumed, ordered, i, c, a, b, page, vCount)
            );

            if (!found)
            {
                this._pushDegenerateQuad(ordered, a, b, c, page);
            }
        }
    },

    /**
     * Adds a triangle edge to the edge lookup used by strategy 2.
     *
     * @method Phaser.GameObjects.Mesh2D#_addEdge
     * @since 4.NEXT
     * @private
     * @param {object} edgeMap - The edge lookup to add to.
     * @param {number} u - The first vertex of the edge.
     * @param {number} v - The second vertex of the edge.
     * @param {number} opp - The vertex opposite the edge.
     * @param {number} tri - The index of the triangle that owns the edge.
     * @param {number} page - The texture page of the triangle.
     * @param {number} vCount - The vertex count, used to canonicalize the edge.
     */
    _addEdge: function (edgeMap, u, v, opp, tri, page, vCount)
    {
        var key = (u < v) ? (u * vCount + v) : (v * vCount + u);
        var list = edgeMap[key];
        if (!list)
        {
            list = edgeMap[key] = [];
        }
        list.push({ tri: tri, opp: opp, page: page });
    },

    /**
     * Attempts to pair triangle `tri` with another unconsumed triangle sharing
     * the edge `q, r`. On success it appends a quad to the output list, marks
     * the partner consumed, and returns `true`.
     *
     * @method Phaser.GameObjects.Mesh2D#_matchEdge
     * @since 4.NEXT
     * @private
     * @param {object} edgeMap - The edge lookup to search.
     * @param {boolean[]} consumed - The per-triangle consumed flags.
     * @param {number[]} ordered - The output list to append a quad to.
     * @param {number} tri - The index of the triangle seeking a partner.
     * @param {number} p - The vertex of `tri` opposite the shared edge.
     * @param {number} q - The first vertex of the shared edge.
     * @param {number} r - The second vertex of the shared edge.
     * @param {number} page - The texture page of `tri`.
     * @param {number} vCount - The vertex count, used to canonicalize the edge.
     * @returns {boolean} Whether a partner was found.
     */
    _matchEdge: function (edgeMap, consumed, ordered, tri, p, q, r, page, vCount)
    {
        var key = (q < r) ? (q * vCount + r) : (r * vCount + q);
        var list = edgeMap[key];
        if (!list) { return false; }

        for (var i = 0; i < list.length; i++)
        {
            var entry = list[i];
            if (entry.tri !== tri && !consumed[entry.tri] && entry.page === page)
            {
                consumed[entry.tri] = true;
                this._pushQuad(ordered, p, q, r, entry.opp, page);
                return true;
            }
        }

        return false;
    },

    /**
     * Determines the quad formed by two triangles which share an edge, using
     * canonical edge keys. Returns `[p, q, r, s]` where `q, r` is the shared
     * edge, `p` is the corner unique to the first triangle, and `s` is the
     * corner unique to the second. Returns `null` if the triangles do not share
     * exactly one edge.
     *
     * @method Phaser.GameObjects.Mesh2D#_sharedEdgeQuad
     * @since 4.NEXT
     * @private
     * @param {number} a - The first vertex of the first triangle.
     * @param {number} b - The second vertex of the first triangle.
     * @param {number} c - The third vertex of the first triangle.
     * @param {number} d - The first vertex of the second triangle.
     * @param {number} e - The second vertex of the second triangle.
     * @param {number} f - The third vertex of the second triangle.
     * @param {number} vCount - The vertex count, used to canonicalize edges.
     * @returns {?number[]} The quad as `[p, q, r, s]`, or `null` if there is no shared edge.
     */
    _sharedEdgeQuad: function (a, b, c, d, e, f, vCount)
    {
        // Canonical edge keys, with the vertex opposite each edge.
        var e1 = [
            [ this._edgeKey(a, b, vCount), c, a, b ],
            [ this._edgeKey(b, c, vCount), a, b, c ],
            [ this._edgeKey(c, a, vCount), b, c, a ]
        ];
        var e2 = [
            [ this._edgeKey(d, e, vCount), f ],
            [ this._edgeKey(e, f, vCount), d ],
            [ this._edgeKey(f, d, vCount), e ]
        ];

        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < 3; j++)
            {
                if (e1[i][0] === e2[j][0])
                {
                    // p = first triangle's opposite corner,
                    // q, r = shared edge, s = second triangle's opposite corner.
                    return [ e1[i][1], e1[i][2], e1[i][3], e2[j][1] ];
                }
            }
        }

        return null;
    },

    /**
     * Returns the canonical key for the edge between two vertices.
     *
     * @method Phaser.GameObjects.Mesh2D#_edgeKey
     * @since 4.NEXT
     * @private
     * @param {number} u - The first vertex of the edge.
     * @param {number} v - The second vertex of the edge.
     * @param {number} vCount - The vertex count, used as the key multiplier.
     * @returns {number} The canonical edge key.
     */
    _edgeKey: function (u, v, vCount)
    {
        return (u < v) ? (u * vCount + v) : (v * vCount + u);
    },

    /**
     * Appends a quad to the ordered index list as a pair of triangles
     * `p, q, r` and `q, r, s`.
     *
     * @method Phaser.GameObjects.Mesh2D#_pushQuad
     * @since 4.NEXT
     * @private
     * @param {number[]} ordered - The output list to append to.
     * @param {number} p - The corner unique to the first triangle.
     * @param {number} q - The first vertex of the shared edge.
     * @param {number} r - The second vertex of the shared edge.
     * @param {number} s - The corner unique to the second triangle.
     * @param {number} page - The texture page shared by both triangles.
     */
    _pushQuad: function (ordered, p, q, r, s, page)
    {
        ordered.push(
            p, q, r, page,
            q, r, s, page
        );
    },

    /**
     * Appends a single triangle to the ordered index list, padded out to a quad
     * with a degenerate second triangle.
     *
     * @method Phaser.GameObjects.Mesh2D#_pushDegenerateQuad
     * @since 4.NEXT
     * @private
     * @param {number[]} ordered - The output list to append to.
     * @param {number} a - The first vertex of the triangle.
     * @param {number} b - The second vertex of the triangle.
     * @param {number} c - The third vertex of the triangle.
     * @param {number} page - The texture page of the triangle.
     */
    _pushDegenerateQuad: function (ordered, a, b, c, page)
    {
        ordered.push(
            a, b, c, page,
            b, c, c, page
        );
    }
});

module.exports = Mesh2D;
