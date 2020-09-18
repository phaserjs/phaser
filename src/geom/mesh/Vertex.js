/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A Vertex Object.
 *
 * This class consists of all the information needed for a single vertex within
 * a Model Object.
 *
 * @class Vertex
 * @memberof Phaser.Geom.Mesh
 * @constructor
 * @since 3.50.0
 *
 * @param {number} x - The x position of the vertex.
 * @param {number} y - The y position of the vertex.
 * @param {number} z - The z position of the vertex.
 * @param {number} u - The UV u coordinate of the vertex.
 * @param {number} v - The UV v coordinate of the vertex.
 * @param {number} [color=0xffffff] - The color value of the vertex.
 * @param {number} [alpha=1] - The alpha value of the vertex.
 */
var Vertex = new Class({

    initialize:

    function Vertex (x, y, z, u, v, normalX, normalY, normalZ, color, alpha)
    {
        if (normalX === undefined) { normalX = 0; }
        if (normalY === undefined) { normalY = 0; }
        if (normalZ === undefined) { normalZ = 0; }
        if (color === undefined) { color = 0xffffff; }
        if (alpha === undefined) { alpha = 1; }

        /**
         * The x coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#vx
         * @type {number}
         * @since 3.50.0
         */
        this.x = x;

        /**
         * The y coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#vy
         * @type {number}
         * @since 3.50.0
         */
        this.y = y;

        /**
         * The z coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#vz
         * @type {number}
         * @since 3.50.0
         */
        this.z = z;

        /**
         * The x normal of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#nx
         * @type {number}
         * @since 3.50.0
         */
        this.nx = normalX;

        /**
         * The y normal of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#ny
         * @type {number}
         * @since 3.50.0
         */
        this.ny = normalY;

        /**
         * The z normal of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#nz
         * @type {number}
         * @since 3.50.0
         */
        this.nz = normalZ;

        /**
         * UV u coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#u
         * @type {number}
         * @since 3.50.0
         */
        this.u = u;

        /**
         * UV v coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#v
         * @type {number}
         * @since 3.50.0
         */
        this.v = v;

        /**
         * The color value of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#color
         * @type {number}
         * @since 3.50.0
         */
        this.color = color;

        /**
         * The alpha value of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#alpha
         * @type {number}
         * @since 3.50.0
         */
        this.alpha = alpha;
    },

    /**
     * Transforms this vertex by the given matrix, storing the results in `vx`, `vy` and `vz`.
     *
     * @method Phaser.Geom.Mesh.Model#transformCoordinatesLocal
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} transformMatrix - The transform matrix to apply to this vertex.
     * @param {number} width - The width of the parent Mesh.
     * @param {number} height - The height of the parent Mesh.
    transformCoordinatesLocal: function (transformMatrix, width, height)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var m = transformMatrix.val;

        var tx = (x * m[0]) + (y * m[4]) + (z * m[8]) + m[12];
        var ty = (x * m[1]) + (y * m[5]) + (z * m[9]) + m[13];
        var tz = (x * m[2]) + (y * m[6]) + (z * m[10]) + m[14];
        var tw = (x * m[3]) + (y * m[7]) + (z * m[11]) + m[15];

        this.vx = (tx / tw) * width;
        this.vy = -(ty / tw) * height;
        this.vz = (tz / tw);
    },
     */

});

module.exports = Vertex;
