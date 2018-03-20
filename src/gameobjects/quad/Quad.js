/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Mesh = require('../mesh/Mesh');

/**
 * @classdesc
 * A Quad Game Object.
 *
 * A Quad is a Mesh Game Object pre-configured with two triangles arranged into a rectangle, with a single
 * texture spread across them.
 *
 * You can manipulate the corner points of the quad via the getters and setters such as `topLeftX`, and also
 * change their alpha and color values. The quad itself can be moved by adjusting the `x` and `y` properties.
 *
 * @class Quad
 * @extends Phaser.GameObjects.Mesh
 * @memberOf Phaser.GameObjects
 * @constructor
 * @webglOnly
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var Quad = new Class({

    Extends: Mesh,

    initialize:

    function Quad (scene, x, y, texture, frame)
    {
        //  0----3
        //  |\  B|
        //  | \  |
        //  |  \ |
        //  | A \|
        //  |    \
        //  1----2

        var vertices = [
            0, 0, // tl
            0, 0, // bl
            0, 0, // br
            0, 0, // tl
            0, 0, // br
            0, 0 // tr
        ];
        var uv = [
            0, 0, // tl
            0, 1, // bl
            1, 1, // br
            0, 0, // tl
            1, 1, // br
            1, 0 // tr
        ];
        var colors = [
            0xffffff, // tl
            0xffffff, // bl
            0xffffff, // br
            0xffffff, // tl
            0xffffff, // br
            0xffffff // tr
        ];
        var alphas = [
            1, // tl
            1, // bl
            1, // br
            1, // tl
            1, // br
            1 // tr
        ];

        Mesh.call(this, scene, x, y, vertices, uv, colors, alphas, texture, frame);

        this.resetPosition();
    },

    /**
     * The top-left x vertex of this Quad.
     *
     * @name Phaser.GameObjects.Quad#topLeftX
     * @type {number}
     * @since 3.0.0
     */
    topLeftX: {

        get: function ()
        {
            return this.x + this.vertices[0];
        },

        set: function (value)
        {
            this.vertices[0] = value - this.x;
            this.vertices[6] = value - this.x;
        }

    },

    /**
     * The top-left y vertex of this Quad.
     *
     * @name Phaser.GameObjects.Quad#topLeftY
     * @type {number}
     * @since 3.0.0
     */
    topLeftY: {

        get: function ()
        {
            return this.y + this.vertices[1];
        },

        set: function (value)
        {
            this.vertices[1] = value - this.y;
            this.vertices[7] = value - this.y;
        }

    },

    /**
     * The top-right x vertex of this Quad.
     *
     * @name Phaser.GameObjects.Quad#topRightX
     * @type {number}
     * @since 3.0.0
     */
    topRightX: {

        get: function ()
        {
            return this.x + this.vertices[10];
        },

        set: function (value)
        {
            this.vertices[10] = value - this.x;
        }

    },

    /**
     * The top-right y vertex of this Quad.
     *
     * @name Phaser.GameObjects.Quad#topRightY
     * @type {number}
     * @since 3.0.0
     */
    topRightY: {

        get: function ()
        {
            return this.y + this.vertices[11];
        },

        set: function (value)
        {
            this.vertices[11] = value - this.y;
        }

    },

    /**
     * The bottom-left x vertex of this Quad.
     *
     * @name Phaser.GameObjects.Quad#bottomLeftX
     * @type {number}
     * @since 3.0.0
     */
    bottomLeftX: {

        get: function ()
        {
            return this.x + this.vertices[2];
        },

        set: function (value)
        {
            this.vertices[2] = value - this.x;
        }

    },

    /**
     * The bottom-left y vertex of this Quad.
     *
     * @name Phaser.GameObjects.Quad#bottomLeftY
     * @type {number}
     * @since 3.0.0
     */
    bottomLeftY: {

        get: function ()
        {
            return this.y + this.vertices[3];
        },

        set: function (value)
        {
            this.vertices[3] = value - this.y;
        }

    },

    /**
     * The bottom-right x vertex of this Quad.
     *
     * @name Phaser.GameObjects.Quad#bottomRightX
     * @type {number}
     * @since 3.0.0
     */
    bottomRightX: {

        get: function ()
        {
            return this.x + this.vertices[4];
        },

        set: function (value)
        {
            this.vertices[4] = value - this.x;
            this.vertices[8] = value - this.x;
        }

    },

    /**
     * The bottom-right y vertex of this Quad.
     *
     * @name Phaser.GameObjects.Quad#bottomRightY
     * @type {number}
     * @since 3.0.0
     */
    bottomRightY: {

        get: function ()
        {
            return this.y + this.vertices[5];
        },

        set: function (value)
        {
            this.vertices[5] = value - this.y;
            this.vertices[9] = value - this.y;
        }

    },

    /**
     * The top-left alpha value of this Quad.
     *
     * @name Phaser.GameObjects.Quad#topLeftAlpha
     * @type {float}
     * @since 3.0.0
     */
    topLeftAlpha: {

        get: function ()
        {
            return this.alphas[0];
        },

        set: function (value)
        {
            this.alphas[0] = value;
            this.alphas[3] = value;
        }

    },

    /**
     * The top-right alpha value of this Quad.
     *
     * @name Phaser.GameObjects.Quad#topRightAlpha
     * @type {float}
     * @since 3.0.0
     */
    topRightAlpha: {

        get: function ()
        {
            return this.alphas[5];
        },

        set: function (value)
        {
            this.alphas[5] = value;
        }

    },

    /**
     * The bottom-left alpha value of this Quad.
     *
     * @name Phaser.GameObjects.Quad#bottomLeftAlpha
     * @type {float}
     * @since 3.0.0
     */
    bottomLeftAlpha: {

        get: function ()
        {
            return this.alphas[1];
        },

        set: function (value)
        {
            this.alphas[1] = value;
        }

    },

    /**
     * The bottom-right alpha value of this Quad.
     *
     * @name Phaser.GameObjects.Quad#bottomRightAlpha
     * @type {float}
     * @since 3.0.0
     */
    bottomRightAlpha: {

        get: function ()
        {
            return this.alphas[2];
        },

        set: function (value)
        {
            this.alphas[2] = value;
            this.alphas[4] = value;
        }

    },

    /**
     * The top-left color value of this Quad.
     *
     * @name Phaser.GameObjects.Quad#topLeftColor
     * @type {number}
     * @since 3.0.0
     */
    topLeftColor: {

        get: function ()
        {
            return this.colors[0];
        },

        set: function (value)
        {
            this.colors[0] = value;
            this.colors[3] = value;
        }

    },

    /**
     * The top-right color value of this Quad.
     *
     * @name Phaser.GameObjects.Quad#topRightColor
     * @type {number}
     * @since 3.0.0
     */
    topRightColor: {

        get: function ()
        {
            return this.colors[5];
        },

        set: function (value)
        {
            this.colors[5] = value;
        }

    },

    /**
     * The bottom-left color value of this Quad.
     *
     * @name Phaser.GameObjects.Quad#bottomLeftColor
     * @type {number}
     * @since 3.0.0
     */
    bottomLeftColor: {

        get: function ()
        {
            return this.colors[1];
        },

        set: function (value)
        {
            this.colors[1] = value;
        }

    },

    /**
     * The bottom-right color value of this Quad.
     *
     * @name Phaser.GameObjects.Quad#bottomRightColor
     * @type {number}
     * @since 3.0.0
     */
    bottomRightColor: {

        get: function ()
        {
            return this.colors[2];
        },

        set: function (value)
        {
            this.colors[2] = value;
            this.colors[4] = value;
        }

    },

    /**
     * Sets the top-left vertex position of this Quad.
     *
     * @method Phaser.GameObjects.Quad#setTopLeft
     * @since 3.0.0
     *
     * @param {number} x - The horizontal coordinate of the vertex.
     * @param {number} y - The vertical coordinate of the vertex.
     *
     * @return {Phaser.GameObjects.Quad} This Game Object.
     */
    setTopLeft: function (x, y)
    {
        this.topLeftX = x;
        this.topLeftY = y;

        return this;
    },

    /**
     * Sets the top-right vertex position of this Quad.
     *
     * @method Phaser.GameObjects.Quad#setTopRight
     * @since 3.0.0
     *
     * @param {number} x - The horizontal coordinate of the vertex.
     * @param {number} y - The vertical coordinate of the vertex.
     *
     * @return {Phaser.GameObjects.Quad} This Game Object.
     */
    setTopRight: function (x, y)
    {
        this.topRightX = x;
        this.topRightY = y;

        return this;
    },

    /**
     * Sets the bottom-left vertex position of this Quad.
     *
     * @method Phaser.GameObjects.Quad#setBottomLeft
     * @since 3.0.0
     *
     * @param {number} x - The horizontal coordinate of the vertex.
     * @param {number} y - The vertical coordinate of the vertex.
     *
     * @return {Phaser.GameObjects.Quad} This Game Object.
     */
    setBottomLeft: function (x, y)
    {
        this.bottomLeftX = x;
        this.bottomLeftY = y;

        return this;
    },

    /**
     * Sets the bottom-right vertex position of this Quad.
     *
     * @method Phaser.GameObjects.Quad#setBottomRight
     * @since 3.0.0
     *
     * @param {number} x - The horizontal coordinate of the vertex.
     * @param {number} y - The vertical coordinate of the vertex.
     *
     * @return {Phaser.GameObjects.Quad} This Game Object.
     */
    setBottomRight: function (x, y)
    {
        this.bottomRightX = x;
        this.bottomRightY = y;

        return this;
    },

    /**
     * Resets the positions of the four corner vertices of this Quad.
     *
     * @method Phaser.GameObjects.Quad#resetPosition
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Quad} This Game Object.
     */
    resetPosition: function ()
    {
        var x = this.x;
        var y = this.y;
        var halfWidth = Math.floor(this.width / 2);
        var halfHeight = Math.floor(this.height / 2);

        this.setTopLeft(x - halfWidth, y - halfHeight);
        this.setTopRight(x + halfWidth, y - halfHeight);
        this.setBottomLeft(x - halfWidth, y + halfHeight);
        this.setBottomRight(x + halfWidth, y + halfHeight);

        return this;
    },

    /**
     * Resets the alpha values used by this Quad back to 1.
     *
     * @method Phaser.GameObjects.Quad#resetAlpha
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Quad} This Game Object.
     */
    resetAlpha: function ()
    {
        var alphas = this.alphas;

        alphas[0] = 1;
        alphas[1] = 1;
        alphas[2] = 1;
        alphas[3] = 1;
        alphas[4] = 1;
        alphas[5] = 1;

        return this;
    },

    /**
     * Resets the color values used by this Quad back to 0xffffff.
     *
     * @method Phaser.GameObjects.Quad#resetColors
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Quad} This Game Object.
     */
    resetColors: function ()
    {
        var colors = this.colors;

        colors[0] = 0xffffff;
        colors[1] = 0xffffff;
        colors[2] = 0xffffff;
        colors[3] = 0xffffff;
        colors[4] = 0xffffff;
        colors[5] = 0xffffff;

        return this;
    },

    /**
     * Resets the position, alpha and color values used by this Quad.
     *
     * @method Phaser.GameObjects.Quad#reset
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Quad} This Game Object.
     */
    reset: function ()
    {
        this.resetPosition();

        this.resetAlpha();

        return this.resetColors();
    }

});

module.exports = Quad;
