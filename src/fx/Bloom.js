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
 * The Bloom FX Controller.
 *
 * This FX controller manages the bloom effect for a Game Object.
 *
 * Bloom is an effect used to reproduce an imaging artifact of real-world cameras.
 * The effect produces fringes of light extending from the borders of bright areas in an image,
 * contributing to the illusion of an extremely bright light overwhelming the
 * camera or eye capturing the scene.
 *
 * A Bloom effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addBloom();
 * sprite.postFX.addBloom();
 * ```
 *
 * @class Bloom
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [color=0xffffff] - The color of the Bloom, as a hex value.
 * @param {number} [offsetX=1] - The horizontal offset of the bloom effect.
 * @param {number} [offsetY=1] - The vertical offset of the bloom effect.
 * @param {number} [blurStrength=1] - The strength of the blur process of the bloom effect.
 * @param {number} [strength=1] - The strength of the blend process of the bloom effect.
 * @param {number} [steps=4] - The number of steps to run the Bloom effect for. This value should always be an integer.
 */
var Bloom = new Class({

    Extends: Controller,

    initialize:

    function Bloom (gameObject, color, offsetX, offsetY, blurStrength, strength, steps)
    {
        if (offsetX === undefined) { offsetX = 1; }
        if (offsetY === undefined) { offsetY = 1; }
        if (blurStrength === undefined) { blurStrength = 1; }
        if (strength === undefined) { strength = 1; }
        if (steps === undefined) { steps = 4; }

        Controller.call(this, FX_CONST.BLOOM, gameObject);

        /**
         * The number of steps to run the Bloom effect for.
         *
         * This value should always be an integer.
         *
         * It defaults to 4. The higher the value, the smoother the Bloom,
         * but at the cost of exponentially more gl operations.
         *
         * Keep this to the lowest possible number you can have it, while
         * still looking correct for your game.
         *
         * @name Phaser.FX.Bloom#steps
         * @type {number}
         * @since 3.60.0
         */
        this.steps = steps;

        /**
         * The horizontal offset of the bloom effect.
         *
         * @name Phaser.FX.Bloom#offsetX
         * @type {number}
         * @since 3.60.0
         */
        this.offsetX = offsetX;

        /**
         * The vertical offset of the bloom effect.
         *
         * @name Phaser.FX.Bloom#offsetY
         * @type {number}
         * @since 3.60.0
         */
        this.offsetY = offsetY;

        /**
         * The strength of the blur process of the bloom effect.
         *
         * @name Phaser.FX.Bloom#blurStrength
         * @type {number}
         * @since 3.60.0
         */
        this.blurStrength = blurStrength;

        /**
         * The strength of the blend process of the bloom effect.
         *
         * @name Phaser.FX.Bloom#strength
         * @type {number}
         * @since 3.60.0
         */
        this.strength = strength;

        /**
         * The internal gl color array.
         *
         * @name Phaser.FX.Bloom#glcolor
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor = [ 1, 1, 1 ];

        if (color !== undefined && color !== null)
        {
            this.color = color;
        }
    },

    /**
     * The color of the bloom as a number value.
     *
     * @name Phaser.FX.Bloom#color
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

module.exports = Bloom;
