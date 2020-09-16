/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Vector3 = require('../../math/Vector3');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @classdesc
 * A Vertex Object.
 *
 * This class consists of all the information needed for a single vertex within
 * a Model Game Object.
 *
 * @class Vertex
 * @memberof Phaser.Geom.Mesh
 * @extends Phaser.Math.Vector3
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

    Extends: Vector3,

    initialize:

    function Vertex (x, y, z, u, v, color, alpha)
    {
        Vector3.call(this, x, y, z);

        if (color === undefined) { color = 0xffffff; }
        if (alpha === undefined) { alpha = 1; }

        /**
         * The projected x coordinate of this vertex.
         *
         * @name Phaser.GameObjects.Vertex#vx
         * @type {number}
         * @since 3.50.0
         */
        this.vx = 0;

        /**
         * The projected y coordinate of this vertex.
         *
         * @name Phaser.GameObjects.Vertex#vy
         * @type {number}
         * @since 3.50.0
         */
        this.vy = 0;

        /**
         * UV u coordinate of this vertex.
         *
         * @name Phaser.GameObjects.Vertex#u
         * @type {number}
         * @since 3.50.0
         */
        this.u = u;

        /**
         * UV v coordinate of this vertex.
         *
         * @name Phaser.GameObjects.Vertex#v
         * @type {number}
         * @since 3.50.0
         */
        this.v = v;

        /**
         * The color value of this vertex.
         *
         * @name Phaser.GameObjects.Vertex#color
         * @type {number}
         * @since 3.50.0
         */
        this.color = color;

        /**
         * The alpha value of this vertex.
         *
         * @name Phaser.GameObjects.Vertex#alpha
         * @type {number}
         * @since 3.50.0
         */
        this.alpha = alpha;
    },

    transformCoordinatesLocal: function (transformMatrix, width, height)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var m = transformMatrix.val;

        var tx = (x * m[0]) + (y * m[4]) + (z * m[8]) + m[12];
        var ty = (x * m[1]) + (y * m[5]) + (z * m[9]) + m[13];
        var tw = (x * m[3]) + (y * m[7]) + (z * m[11]) + m[15];

        this.vx = (tx / tw) * width + width / 2;
        this.vy = -(ty / tw) * height + height / 2;
    },

    load: function (F32, U32, offset, textureUnit, tintEffect, alpha, a, b, c, d, e, f)
    {
        F32[++offset] = this.vx * a + this.vy * c + e;
        F32[++offset] = this.vx * b + this.vy * d + f;
        F32[++offset] = this.u;
        F32[++offset] = this.v;
        F32[++offset] = textureUnit;
        F32[++offset] = tintEffect;
        U32[++offset] = Utils.getTintAppendFloatAlpha(this.color, alpha * this.alpha);

        return offset;
    }

});

module.exports = Vertex;
