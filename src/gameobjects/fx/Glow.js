/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseFX = require('./BaseFX');
var Class = require('../../utils/Class');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Glow
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Glow = new Class({

    Extends: BaseFX,

    initialize:

    function Glow (gameObject, distance, outerStrength, innerStrength, knockout, color)
    {
        if (distance === undefined) { distance = 16; }
        if (outerStrength === undefined) { outerStrength = 4; }
        if (innerStrength === undefined) { innerStrength = 0; }
        if (knockout === undefined) { knockout = false; }

        BaseFX.call(this, FX_CONST.GLOW, gameObject);

        /**
         * The distance of the glow.
         *
         * This must be an integer and can be between 0 and 128 inclusive.
         *
         * The higher the value, the more iterations the shader takes
         * when drawing the glow.
         *
         * @name Phaser.GameObjects.FX.Glow#distance
         * @type {number}
         * @since 3.60.0
         */
        this.distance = distance;

        /**
         * The strength of the glow outward from the edge of the Sprite.
         *
         * @name Phaser.GameObjects.FX.Glow#outerStrength
         * @type {number}
         * @since 3.60.0
         */
        this.outerStrength = outerStrength;

        /**
         * The strength of the glow inward from the edge of the Sprite.
         *
         * @name Phaser.GameObjects.FX.Glow#innerStrength
         * @type {number}
         * @since 3.60.0
         */
        this.innerStrength = innerStrength;

        /**
         * If `true` on the glow is drawn, not the texture itself.
         *
         * @name Phaser.GameObjects.FX.Glow#knockout
         * @type {number}
         * @since 3.60.0
         */
        this.knockout = knockout;

        /**
         * A 4 element array of gl color values.
         *
         * @name Phaser.GameObjects.FX.Glow#glcolor
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor = [ 1, 1, 1, 1 ];

        if (color !== undefined)
        {
            this.color = color;
        }
    },

    /**
     * The color of the glow as a number value.
     *
     * @name Phaser.GameObjects.FX.Glow#color
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

    }

});

module.exports = Glow;
