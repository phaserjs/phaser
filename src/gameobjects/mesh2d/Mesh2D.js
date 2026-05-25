/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
 * with a position, texture coordinate, color, and alpha;
 * and a reference to a texture.
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
 * @extends Phaser.GameObjects.Components.Alpha
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
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {number[]} vertices - The vertices of the mesh. Each vertex is a sequence within the array: x, y, u, v, color, alpha. The array has a step of 6.
 * @param {number[]} indices - The indices of the mesh. Each index is a sequence: a, b, c, page. The abc values index to vertices in the vertices array. The page value is the index of the texture source in the texture atlas to use for this triangle. Typically 0. The array has a step of 4.
 * @param {boolean} [flipV=false] - Whether to flip the texture coordinates vertically. This affects texture coordinates, not the vertices. Set this property if your geometry provides texture coordinates that are opposite to GL texture expectations (which are bottom-up).
 */
var Mesh2D = new Class({
    Extends: GameObject,

    Mixins: [
        Components.Alpha,
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
        Components.Tint,
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
         * x, y, u, v, color, alpha.
         * The array has a step of 6.
         *
         * - x (offset 0): The x position of the vertex.
         * - y (offset 1): The y position of the vertex.
         * - u (offset 2): The u texture coordinate of the vertex.
         * - v (offset 3): The v texture coordinate of the vertex.
         * - color (offset 4): The color of the vertex, as an integer RGB value.
         * - alpha (offset 5): The alpha of the vertex, as a float value between 0 and 1.
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
    }
});

module.exports = Mesh2D;
