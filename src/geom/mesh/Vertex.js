/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
 */
var Vertex = new Class({

    Extends: Vector3,

    initialize:

    function Vertex (x, y, z, u, v, color, alpha)
    {
        if (color === undefined) { color = 0xffffff; }
        if (alpha === undefined) { alpha = 1; }

        Vector3.call(this, x, y, z);

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
     * Loads the data from this Vertex into the given Typed Arrays.
     *
     * @method Phaser.Geom.Mesh.Vertex#translate
     * @since 3.50.0
     *
     * @param {Float32Array} F32 - A Float32 Array to insert the position, UV and unit data in to.
     * @param {Uint32Array} U32 - A Uint32 Array to insert the color and alpha data in to.
     * @param {number} offset - The index of the array to insert this Vertex to.
     * @param {number} textureUnit - The texture unit currently in use.
     * @param {number} alpha - The alpha of the parent object.
     * @param {number} a - The parent transform matrix data a component.
     * @param {number} b - The parent transform matrix data b component.
     * @param {number} c - The parent transform matrix data c component.
     * @param {number} d - The parent transform matrix data d component.
     * @param {number} e - The parent transform matrix data e component.
     * @param {number} f - The parent transform matrix data f component.
     * @param {boolean} roundPixels - Round the vertex position or not?
     *
     * @return {number} The new array offset.
     */
    load: function (F32, U32, offset, textureUnit, tintEffect, alpha, a, b, c, d, e, f, roundPixels)
    {
        var tx = this.x * a + this.y * c + e;
        var ty = this.x * b + this.y * d + f;

        if (roundPixels)
        {
            tx = Math.round(tx);
            ty = Math.round(ty);
        }

        F32[++offset] = tx;
        F32[++offset] = ty;
        F32[++offset] = this.u;
        F32[++offset] = this.v;
        F32[++offset] = textureUnit;
        F32[++offset] = tintEffect;
        U32[++offset] = Utils.getTintAppendFloatAlpha(this.color, alpha * this.alpha);

        return offset;
    }

});

module.exports = Vertex;
