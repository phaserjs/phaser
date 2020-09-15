/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @classdesc
 * A Vertex Game Object.
 *
 * This tiny class consists of all the information for a single vertex within a Mesh
 * Game Object.
 *
 * @class Vertex
 * @memberof Phaser.GameObjects
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

    function Vertex (x, y, z, u, v, color, alpha)
    {
        if (color === undefined) { color = 0xffffff; }
        if (alpha === undefined) { alpha = 1; }

        /**
         * The x coordinate of this vertex.
         *
         * @name Phaser.GameObjects.Vertex#x
         * @type {number}
         * @since 3.50.0
         */
        this.x = x;

        /**
         * The y coordinate of this vertex.
         *
         * @name Phaser.GameObjects.Vertex#y
         * @type {number}
         * @since 3.50.0
         */
        this.y = y;

        /**
         * The z coordinate of this vertex.
         *
         * @name Phaser.GameObjects.Vertex#z
         * @type {number}
         * @since 3.50.0
         */
        this.z = z;

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

    setPosition: function (x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    },

    translate: function (x, y)
    {
        if (y === undefined) { y = 0; }

        this.x += x;
        this.y += y;
    },

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
