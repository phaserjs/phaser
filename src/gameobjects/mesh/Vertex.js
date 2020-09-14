/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

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
 * @param {number} x - The x coordinate of this vertex.
 * @param {number} y - The y coordinate of this vertex.
 * @param {number} u - The UV u coordinate of this vertex.
 * @param {number} v - The UV v coordinate of this vertex.
 * @param {number} color - The color value of this vertex.
 * @param {number} alpha - The alpha value of this vertex.
 */
var Vertex = new Class({

    initialize:

    function Vertex (x, y, u, v, color, alpha)
    {
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

    setPosition: function (x, y)
    {
        this.x = x;
        this.y = y;

        return this;
    },

    translate: function (x, y)
    {
        if (y === undefined) { y = 0; }

        this.x += x;
        this.y += y;
    }

});

module.exports = Vertex;
