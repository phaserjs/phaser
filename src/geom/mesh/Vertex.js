/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Utils = require('../../renderer/webgl/Utils');
var Vector3 = require('../../math/Vector3');

/**
 * @classdesc
 * A Vertex Geometry Object.
 *
 * This class consists of all the information required for a single vertex within a Face Geometry Object.
 *
 * Faces, and thus Vertex objects, are used by the Mesh Game Object in order to render objects in WebGL.
 *
 * @class Vertex
 * @memberof Phaser.Geom.Mesh
 * @constructor
 * @extends Phaser.Math.Vector3
 * @since 3.50.0
 *
 * @param {number} x - The x position of the vertex.
 * @param {number} y - The y position of the vertex.
 * @param {number} z - The z position of the vertex.
 * @param {number} u - The UV u coordinate of the vertex.
 * @param {number} v - The UV v coordinate of the vertex.
 * @param {number} [color=0xffffff] - The color value of the vertex.
 * @param {number} [alpha=1] - The alpha value of the vertex.
 * @param {number} [nx=0] - The x normal value of the vertex.
 * @param {number} [ny=0] - The y normal value of the vertex.
 * @param {number} [nz=0] - The z normal value of the vertex.
 */
var Vertex = new Class({

    Extends: Vector3,

    initialize:

    function Vertex (x, y, z, u, v, color, alpha, nx, ny, nz)
    {
        if (color === undefined) { color = 0xffffff; }
        if (alpha === undefined) { alpha = 1; }
        if (nx === undefined) { nx = 0; }
        if (ny === undefined) { ny = 0; }
        if (nz === undefined) { nz = 0; }

        Vector3.call(this, x, y, z);

        /**
         * The projected x coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#vx
         * @type {number}
         * @since 3.50.0
         */
        this.vx = 0;

        /**
         * The projected y coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#vy
         * @type {number}
         * @since 3.50.0
         */
        this.vy = 0;

        /**
         * The projected z coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#vz
         * @type {number}
         * @since 3.50.0
         */
        this.vz = 0;

        /**
         * The normalized projected x coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#nx
         * @type {number}
         * @since 3.50.0
         */
        this.nx = nx;

        /**
         * The normalized projected y coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#ny
         * @type {number}
         * @since 3.50.0
         */
        this.ny = ny;

        /**
         * The normalized projected z coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#nz
         * @type {number}
         * @since 3.50.0
         */
        this.nz = nz;

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

        /**
         * The translated x coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#tx
         * @type {number}
         * @since 3.50.0
         */
        this.tx = 0;

        /**
         * The translated y coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#ty
         * @type {number}
         * @since 3.50.0
         */
        this.ty = 0;

        /**
         * The translated alpha value of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#ta
         * @type {number}
         * @since 3.50.0
         */
        this.ta = 0;

        /**
         * The translated uv u coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#tu
         * @type {number}
         * @since 3.60.0
         */
        this.tu = u;

        /**
         * The translated uv v coordinate of this vertex.
         *
         * @name Phaser.Geom.Mesh.Vertex#tv
         * @type {number}
         * @since 3.60.0
         */
        this.tv = v;
    },

    /**
     * Sets the U and V properties.
     *
     * Also resets the translated uv properties, undoing any scale
     * or shift they may have had.
     *
     * @method Phaser.Geom.Mesh.Vertex#setUVs
     * @since 3.50.0
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

        this.tu = u;
        this.tv = v;

        return this;
    },

    /**
     * Translates the original UV positions by the given amounts.
     *
     * The original properties `Vertex.u` and `Vertex.v`
     * remain unchanged, only the translated properties
     * `Vertex.tu` and `Vertex.tv`, as used in rendering,
     * are updated.
     *
     * @method Phaser.Geom.Mesh.Vertex#scrollUV
     * @since 3.60.0
     *
     * @param {number} x - The amount to scroll the UV u coordinate by.
     * @param {number} y - The amount to scroll the UV v coordinate by.
     *
     * @return {this} This Vertex.
     */
    scrollUV: function (x, y)
    {
        this.tu += x;
        this.tv += y;

        return this;
    },

    /**
     * Scales the original UV values by the given amounts.
     *
     * The original properties `Vertex.u` and `Vertex.v`
     * remain unchanged, only the translated properties
     * `Vertex.tu` and `Vertex.tv`, as used in rendering,
     * are updated.
     *
     * @method Phaser.Geom.Mesh.Vertex#scaleUV
     * @since 3.60.0
     *
     * @param {number} x - The amount to scale the UV u coordinate by.
     * @param {number} y - The amount to scale the UV v coordinate by.
     *
     * @return {this} This Vertex.
     */
    scaleUV: function (x, y)
    {
        this.tu = this.u * x;
        this.tv = this.v * y;

        return this;
    },

    /**
     * Transforms this vertex by the given matrix, storing the results in `vx`, `vy` and `vz`.
     *
     * @method Phaser.Geom.Mesh.Vertex#transformCoordinatesLocal
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} transformMatrix - The transform matrix to apply to this vertex.
     * @param {number} width - The width of the parent Mesh.
     * @param {number} height - The height of the parent Mesh.
     * @param {number} cameraZ - The z position of the MeshCamera.
     */
    transformCoordinatesLocal: function (transformMatrix, width, height, cameraZ)
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

        if (cameraZ <= 0)
        {
            this.vz = (tz / tw);
        }
        else
        {
            this.vz = -(tz / tw);
        }
    },

    /**
     * Resizes this Vertex by setting the x and y coordinates, then transforms this vertex
     * by an identity matrix and dimensions, storing the results in `vx`, `vy` and `vz`.
     *
     * @method Phaser.Geom.Mesh.Vertex#resize
     * @since 3.60.0
     *
     * @param {number} x - The x position of the vertex.
     * @param {number} y - The y position of the vertex.
     * @param {number} width - The width of the parent Mesh.
     * @param {number} height - The height of the parent Mesh.
     * @param {number} originX - The originX of the parent Mesh.
     * @param {number} originY - The originY of the parent Mesh.
     *
     * @return {this} This Vertex.
     */
    resize: function (x, y, width, height, originX, originY)
    {
        this.x = x;
        this.y = y;

        this.vx = this.x * width;
        this.vy = -this.y * height;
        this.vz = 0;

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
    },

    /**
     * Updates this Vertex based on the given transform.
     *
     * @method Phaser.Geom.Mesh.Vertex#update
     * @since 3.50.0
     *
     * @param {number} a - The parent transform matrix data a component.
     * @param {number} b - The parent transform matrix data b component.
     * @param {number} c - The parent transform matrix data c component.
     * @param {number} d - The parent transform matrix data d component.
     * @param {number} e - The parent transform matrix data e component.
     * @param {number} f - The parent transform matrix data f component.
     * @param {boolean} roundPixels - Round the vertex position or not?
     * @param {number} alpha - The alpha of the parent object.
     *
     * @return {this} This Vertex.
     */
    update: function (a, b, c, d, e, f, roundPixels, alpha)
    {
        var tx = this.vx * a + this.vy * c + e;
        var ty = this.vx * b + this.vy * d + f;

        if (roundPixels)
        {
            tx = Math.round(tx);
            ty = Math.round(ty);
        }

        this.tx = tx;
        this.ty = ty;
        this.ta = this.alpha * alpha;

        return this;
    },

    /**
     * Loads the data from this Vertex into the given Typed Arrays.
     *
     * @method Phaser.Geom.Mesh.Vertex#load
     * @since 3.50.0
     *
     * @param {Float32Array} F32 - A Float32 Array to insert the position, UV and unit data in to.
     * @param {Uint32Array} U32 - A Uint32 Array to insert the color and alpha data in to.
     * @param {number} offset - The index of the array to insert this Vertex to.
     * @param {number} textureUnit - The texture unit currently in use.
     * @param {number} tintEffect - The tint effect to use.
     *
     * @return {number} The new array offset.
     */
    load: function (F32, U32, offset, textureUnit, tintEffect)
    {
        F32[++offset] = this.tx;
        F32[++offset] = this.ty;
        F32[++offset] = this.tu;
        F32[++offset] = this.tv;
        F32[++offset] = textureUnit;
        F32[++offset] = tintEffect;
        U32[++offset] = Utils.getTintAppendFloatAlpha(this.color, this.ta);

        return offset;
    }

});

module.exports = Vertex;
