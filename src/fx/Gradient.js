/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var FX_CONST = require('./const');

/**
 * @classdesc
 * The Gradient FX Controller.
 *
 * This FX controller manages the gradient effect for a Game Object.
 *
 * The gradient overlay effect is a visual technique where a smooth color transition is applied over Game Objects,
 * such as sprites or UI components. This effect is used to enhance visual appeal, emphasize depth, or create
 * stylistic and atmospheric variations. It can also be utilized to convey information, such as representing
 * progress or health status through color changes.
 *
 * A Gradient effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addGradient();
 * sprite.postFX.addGradient();
 * ```
 *
 * @class Gradient
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [color1=0xff0000] - The first gradient color, given as a number value.
 * @param {number} [color2=0x00ff00] - The second gradient color, given as a number value.
 * @param {number} [alpha=0.2] - The alpha value of the gradient effect.
 * @param {number} [fromX=0] - The horizontal position the gradient will start from. This value is normalized, between 0 and 1, and is not in pixels.
 * @param {number} [fromY=0] - The vertical position the gradient will start from. This value is normalized, between 0 and 1, and is not in pixels.
 * @param {number} [toX=0] - The horizontal position the gradient will end at. This value is normalized, between 0 and 1, and is not in pixels.
 * @param {number} [toY=1] - The vertical position the gradient will end at. This value is normalized, between 0 and 1, and is not in pixels.
 * @param {number} [size=0] - How many 'chunks' the gradient is divided in to, as spread over the entire height of the texture. Leave this at zero for a smooth gradient, or set higher for a more retro chunky effect.
 */
var Gradient = new Class({

    Extends: Controller,

    initialize:

    function Gradient (gameObject, color1, color2, alpha, fromX, fromY, toX, toY, size)
    {
        if (alpha === undefined) { alpha = 0.2; }
        if (fromX === undefined) { fromX = 0; }
        if (fromY === undefined) { fromY = 0; }
        if (toX === undefined) { toX = 0; }
        if (toY === undefined) { toY = 1; }
        if (size === undefined) { size = 0; }

        Controller.call(this, FX_CONST.GRADIENT, gameObject);

        /**
         * The alpha value of the gradient effect.
         *
         * @name Phaser.FX.Gradient#alpha
         * @type {number}
         * @since 3.60.0
         */
        this.alpha = alpha;

        /**
         * Sets how many 'chunks' the gradient is divided in to, as spread over the
         * entire height of the texture. Leave this at zero for a smooth gradient,
         * or set to a higher number to split the gradient into that many sections, giving
         * a more banded 'retro' effect.
         *
         * @name Phaser.FX.Gradient#size
         * @type {number}
         * @since 3.60.0
         */
        this.size = size;

        /**
         * The horizontal position the gradient will start from. This value is normalized, between 0 and 1 and is not in pixels.
         *
         * @name Phaser.FX.Gradient#fromX
         * @type {number}
         * @since 3.60.0
         */
        this.fromX = fromX;

        /**
         * The vertical position the gradient will start from. This value is normalized, between 0 and 1 and is not in pixels.
         *
         * @name Phaser.FX.Gradient#fromY
         * @type {number}
         * @since 3.60.0
         */
        this.fromY = fromY;

        /**
         * The horizontal position the gradient will end. This value is normalized, between 0 and 1 and is not in pixels.
         *
         * @name Phaser.FX.Gradient#toX
         * @type {number}
         * @since 3.60.0
         */
        this.toX = toX;

        /**
         * The vertical position the gradient will end. This value is normalized, between 0 and 1 and is not in pixels.
         *
         * @name Phaser.FX.Gradient#toY
         * @type {number}
         * @since 3.60.0
         */
        this.toY = toY;

        /**
         * The internal gl color array for the starting color.
         *
         * @name Phaser.FX.Gradient#glcolor1
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor1 = [ 255, 0, 0 ];

        /**
         * The internal gl color array for the ending color.
         *
         * @name Phaser.FX.Gradient#glcolor2
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor2 = [ 0, 255, 0 ];

        if (color1 !== undefined && color1 !== null)
        {
            this.color1 = color1;
        }

        if (color2 !== undefined && color2 !== null)
        {
            this.color2 = color2;
        }
    },

    /**
     * The first gradient color, given as a number value.
     *
     * @name Phaser.FX.Gradient#color1
     * @type {number}
     * @since 3.60.0
     */
    color1: {

        get: function ()
        {
            var color = this.glcolor1;

            return (((color[0]) << 16) + ((color[1]) << 8) + (color[2] | 0));
        },

        set: function (value)
        {
            var color = this.glcolor1;

            color[0] = ((value >> 16) & 0xFF);
            color[1] = ((value >> 8) & 0xFF);
            color[2] = (value & 0xFF);
        }

    },

    /**
     * The second gradient color, given as a number value.
     *
     * @name Phaser.FX.Gradient#color2
     * @type {number}
     * @since 3.60.0
     */
    color2: {

        get: function ()
        {
            var color = this.glcolor2;

            return (((color[0]) << 16) + ((color[1]) << 8) + (color[2] | 0));
        },

        set: function (value)
        {
            var color = this.glcolor2;

            color[0] = ((value >> 16) & 0xFF);
            color[1] = ((value >> 8) & 0xFF);
            color[2] = (value & 0xFF);
        }

    }

});

module.exports = Gradient;
