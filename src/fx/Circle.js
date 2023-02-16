/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseFX = require('./BaseFX');
var Class = require('../utils/Class');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Circle
 * @extends Phaser.FX.BaseFX
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Circle = new Class({

    Extends: BaseFX,

    initialize:

    function Circle (gameObject, thickness, color, backgroundColor, scale, feather)
    {
        if (thickness === undefined) { thickness = 8; }
        if (scale === undefined) { scale = 1; }
        if (feather === undefined) { feather = 0.005; }

        BaseFX.call(this, FX_CONST.CIRCLE, gameObject);

        /**
         * The scale of the circle. The default scale is 1, which is a circle
         * the full size of the underlying texture. Reduce this value to create
         * a smaller circle, or increase it to create a circle that extends off
         * the edges of the texture.
         *
         * @name Phaser.FX.Circle#scale
         * @type {number}
         * @since 3.60.0
         */
        this.scale = scale;

        /**
         * The amount of feathering to apply to the circle from the ring,
         * extending into the middle of the circle. The default is 0.005,
         * which is a very low amount of feathering just making sure the ring
         * has a smooth edge. Increase this amount to a value such as 0.5
         * or 0.025 for larger amounts of feathering.
         *
         * @name Phaser.FX.Circle#feather
         * @type {number}
         * @since 3.60.0
         */
        this.feather = feather;

        /**
         * The width of the circle around the texture, in pixels. This value
         * doesn't factor in the feather, which can extend the thickness
         * internally depending on its value.
         *
         * @name Phaser.FX.Circle#thickness
         * @type {number}
         * @since 3.60.0
         */
        this.thickness = thickness;

        /**
         * The internal gl color array for the ring color.
         *
         * @name Phaser.FX.Circle#glcolor
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor = [ 1, 0.2, 0.7 ];

        /**
         * The internal gl color array for the background color.
         *
         * @name Phaser.FX.Circle#glcolor2
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor2 = [ 1, 0, 0, 0.4 ];

        if (color !== undefined && color !== null)
        {
            this.color = color;
        }

        if (backgroundColor !== undefined && backgroundColor !== null)
        {
            this.backgroundColor = backgroundColor;
        }
    },

    /**
     * The color of the circular ring, given as a number value.
     *
     * @name Phaser.FX.Circle#color
     * @type {number}
     * @since 3.60.0
     */
    color: {

        get: function ()
        {
            var color = this.glcolor;

            return (((color[0] * 255) << 16) + ((color[1] * 255) << 8) + (color[2] * 255 | 0));
        },

        set: function (value)
        {
            var color = this.glcolor;

            color[0] = ((value >> 16) & 0xFF) / 255;
            color[1] = ((value >> 8) & 0xFF) / 255;
            color[2] = (value & 0xFF) / 255;
        }

    },

    /**
     * The color of the background, behind the texture, given as a number value.
     *
     * @name Phaser.FX.Circle#backgroundColor
     * @type {number}
     * @since 3.60.0
     */
    backgroundColor: {

        get: function ()
        {
            var color = this.glcolor2;

            return (((color[0] * 255) << 16) + ((color[1] * 255) << 8) + (color[2] * 255 | 0));
        },

        set: function (value)
        {
            var color = this.glcolor2;

            color[0] = ((value >> 16) & 0xFF) / 255;
            color[1] = ((value >> 8) & 0xFF) / 255;
            color[2] = (value & 0xFF) / 255;
        }

    }

});

module.exports = Circle;
