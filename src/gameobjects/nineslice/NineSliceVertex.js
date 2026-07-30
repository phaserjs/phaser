/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * Represents a single vertex within a NineSlice Game Object.
 *
 * A NineSlice Game Object is divided into a 3x3 grid of regions, each defined by a mesh
 * of vertices. This class stores all the data needed for one vertex: its normalized position
 * (x, y inherited from Vector2), its projected screen-space position (vx, vy), and its
 * UV texture coordinates (u, v) used during rendering.
 *
 * You do not typically create NineSliceVertex instances directly. They are created and
 * managed internally by the NineSlice Game Object.
 *
 * @class NineSliceVertex
 * @memberof Phaser.GameObjects
 * @constructor
 * @extends Phaser.Math.Vector2
 * @since 4.0.0
 *
 * @param {number} x - The x position of the vertex.
 * @param {number} y - The y position of the vertex.
 * @param {number} u - The UV u coordinate of the vertex.
 * @param {number} v - The UV v coordinate of the vertex.
 */
var Vertex = new Class({

    Extends: Vector2,

    initialize:

    function Vertex (x, y, u, v)
    {
        Vector2.call(this, x, y);

        /**
         * The projected x coordinate of this vertex.
         *
         * @name Phaser.GameObjects.NineSliceVertex#vx
         * @type {number}
         * @since 4.0.0
         */
        this.vx = 0;

        /**
         * The projected y coordinate of this vertex.
         *
         * @name Phaser.GameObjects.NineSliceVertex#vy
         * @type {number}
         * @since 4.0.0
         */
        this.vy = 0;

        /**
         * UV u coordinate of this vertex.
         *
         * @name Phaser.GameObjects.NineSliceVertex#u
         * @type {number}
         * @since 4.0.0
         */
        this.u = u;

        /**
         * UV v coordinate of this vertex.
         *
         * @name Phaser.GameObjects.NineSliceVertex#v
         * @type {number}
         * @since 4.0.0
         */
        this.v = v;
    },

    /**
     * Sets the UV texture coordinates of this vertex.
     *
     * @method Phaser.GameObjects.NineSliceVertex#setUVs
     * @since 4.0.0
     *
     * @param {number} u - The UV u coordinate of the vertex.
     * @param {number} v - The UV v coordinate of the vertex.
     *
     * @return {this} This Vertex.
     */
    setUVs: function (u, v)
    {
        this.u = u;
        this.v = v;

        return this;
    },

    /**
     * Updates this vertex's position and calculates its projected screen-space coordinates.
     *
     * Sets the normalized `x` and `y` position, then scales them by the parent object's
     * `width` and `height` to produce the projected `vx` and `vy` values. The origin
     * offset of the parent object is then factored in, shifting `vx` and `vy` so that the
     * mesh is correctly aligned relative to the object's origin point.
     *
     * @method Phaser.GameObjects.NineSliceVertex#resize
     * @since 4.0.0
     *
     * @param {number} x - The x position of the vertex.
     * @param {number} y - The y position of the vertex.
     * @param {number} width - The width of the parent object.
     * @param {number} height - The height of the parent object.
     * @param {number} originX - The originX of the parent object.
     * @param {number} originY - The originY of the parent object.
     *
     * @return {this} This Vertex.
     */
    resize: function (x, y, width, height, originX, originY)
    {
        this.x = x;
        this.y = y;

        this.vx = this.x * width;
        this.vy = -this.y * height;

        if (originX < 0.5)
        {
            this.vx += width * (0.5 - originX);
        }
        else if (originX > 0.5)
        {
            this.vx -= width * (originX - 0.5);
        }

        if (originY < 0.5)
        {
            this.vy += height * (0.5 - originY);
        }
        else if (originY > 0.5)
        {
            this.vy -= height * (originY - 0.5);
        }

        return this;
    }
});

module.exports = Vertex;
