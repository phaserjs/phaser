/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Vector2 from '../../math/Vector2.js';

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
 * @memberof Phaser.GameObjects
 * @since 4.0.0
 */
export class NineSliceVertex extends Vector2
{
    /**
     * The projected x coordinate of this vertex.
     *
     * @since 4.0.0
     */
    vx: number;

    /**
     * The projected y coordinate of this vertex.
     *
     * @since 4.0.0
     */
    vy: number;

    /**
     * UV u coordinate of this vertex.
     *
     * @since 4.0.0
     */
    u: number;

    /**
     * UV v coordinate of this vertex.
     *
     * @since 4.0.0
     */
    v: number;

    /**
     * @param x - The x position of the vertex.
     * @param y - The y position of the vertex.
     * @param u - The UV u coordinate of the vertex.
     * @param v - The UV v coordinate of the vertex.
     */
    constructor (x: number, y: number, u: number, v: number)
    {
        super(x, y);

        this.vx = 0;
        this.vy = 0;
        this.u = u;
        this.v = v;
    }

    /**
     * Sets the UV texture coordinates of this vertex.
     *
     * @since 4.0.0
     *
     * @param u - The UV u coordinate of the vertex.
     * @param v - The UV v coordinate of the vertex.
     *
     * @return This Vertex.
     */
    setUVs (u: number, v: number): this
    {
        this.u = u;
        this.v = v;

        return this;
    }

    /**
     * Updates this vertex's position and calculates its projected screen-space coordinates.
     *
     * Sets the normalized `x` and `y` position, then scales them by the parent object's
     * `width` and `height` to produce the projected `vx` and `vy` values. The origin
     * offset of the parent object is then factored in, shifting `vx` and `vy` so that the
     * mesh is correctly aligned relative to the object's origin point.
     *
     * @since 4.0.0
     *
     * @param x - The x position of the vertex.
     * @param y - The y position of the vertex.
     * @param width - The width of the parent object.
     * @param height - The height of the parent object.
     * @param originX - The originX of the parent object.
     * @param originY - The originY of the parent object.
     *
     * @return This Vertex.
     */
    resize (x: number, y: number, width: number, height: number, originX: number, originY: number): this
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
}

export default NineSliceVertex;
