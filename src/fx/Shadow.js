/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var FX_CONST = require('./const');

/**
 * @classdesc
 * The Shadow FX Controller.
 *
 * This FX controller manages the shadow effect for a Game Object.
 *
 * The shadow effect is a visual technique used to create the illusion of depth and realism by adding darker,
 * offset silhouettes or shapes beneath game objects, characters, or environments. These simulated shadows
 * help to enhance the visual appeal and immersion, making the 2D game world appear more dynamic and three-dimensional.
 *
 * A Shadow effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addShadow();
 * sprite.postFX.addShadow();
 * ```
 *
 * @class Shadow
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [x=0] - The horizontal offset of the shadow effect.
 * @param {number} [y=0] - The vertical offset of the shadow effect.
 * @param {number} [decay=0.1] - The amount of decay for shadow effect.
 * @param {number} [power=1] - The power of the shadow effect.
 * @param {number} [color=0x000000] - The color of the shadow.
 * @param {number} [samples=6] - The number of samples that the shadow effect will run for. An integer between 1 and 12.
 * @param {number} [intensity=1] - The intensity of the shadow effect.
 */
var Shadow = new Class({

    Extends: Controller,

    initialize:

    function Shadow (gameObject, x, y, decay, power, color, samples, intensity)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (decay === undefined) { decay = 0.1; }
        if (power === undefined) { power = 1; }
        if (samples === undefined) { samples = 6; }
        if (intensity === undefined) { intensity = 1; }

        Controller.call(this, FX_CONST.SHADOW, gameObject);

        /**
         * The horizontal offset of the shadow effect.
         *
         * @name Phaser.FX.Shadow#x
         * @type {number}
         * @since 3.60.0
         */
        this.x = x;

        /**
         * The vertical offset of the shadow effect.
         *
         * @name Phaser.FX.Shadow#y
         * @type {number}
         * @since 3.60.0
         */
        this.y = y;

        /**
         * The amount of decay for the shadow effect.
         *
         * @name Phaser.FX.Shadow#decay
         * @type {number}
         * @since 3.60.0
         */
        this.decay = decay;

        /**
         * The power of the shadow effect.
         *
         * @name Phaser.FX.Shadow#power
         * @type {number}
         * @since 3.60.0
         */
        this.power = power;

        /**
         * The internal gl color array.
         *
         * @name Phaser.FX.Shadow#glcolor
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor = [ 0, 0, 0, 1 ];

        /**
         * The number of samples that the shadow effect will run for.
         *
         * This should be an integer with a minimum value of 1 and a maximum of 12.
         *
         * @name Phaser.FX.Shadow#samples
         * @type {number}
         * @since 3.60.0
         */
        this.samples = samples;

        /**
         * The intensity of the shadow effect.
         *
         * @name Phaser.FX.Shadow#intensity
         * @type {number}
         * @since 3.60.0
         */
        this.intensity = intensity;

        if (color !== undefined)
        {
            this.color = color;
        }
    },

    /**
     * The color of the shadow.
     *
     * @name Phaser.FX.Shadow#color
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

module.exports = Shadow;
