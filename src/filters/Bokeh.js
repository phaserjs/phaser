/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Bokeh Filter Controller.
 *
 * This filter controller manages the bokeh effect for a Camera.
 *
 * Bokeh refers to a visual effect that mimics the photographic technique of creating a shallow depth of field.
 * This effect is used to emphasize the game's main subject or action, by blurring the background or foreground
 * elements, resulting in a more immersive and visually appealing experience. It is achieved through rendering
 * techniques that simulate the out-of-focus areas, giving a sense of depth and realism to the game's graphics.
 *
 * This effect can also be used to generate a Tilt Shift effect, which is a technique used to create a miniature
 * effect by blurring everything except a small area of the image. This effect is achieved by blurring the
 * top and bottom elements, while keeping the center area in focus.
 *
 * A Bokeh effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addBokeh();
 * camera.filters.external.addBokeh();
 * ```
 *
 * @class Bokeh
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {number} [radius=0.5] - The radius of the bokeh effect.
 * @param {number} [amount=1] - The amount of the bokeh effect.
 * @param {number} [contrast=0.2] - The color contrast of the bokeh effect.
 * @param {boolean} [isTiltShift=false] - Is this a bokeh or Tile Shift effect?
 * @param {number} [blurX=1] - If Tilt Shift, the amount of horizontal blur.
 * @param {number} [blurY=1] - If Tilt Shift, the amount of vertical blur.
 * @param {number} [strength=1] - If Tilt Shift, the strength of the blur.
 * */
var Bokeh = new Class({

    Extends: Controller,

    initialize: function Bokeh (camera, radius, amount, contrast, isTiltShift, blurX, blurY, strength)
    {
        if (radius === undefined) { radius = 0.5; }
        if (amount === undefined) { amount = 1; }
        if (contrast === undefined) { contrast = 0.2; }
        if (isTiltShift === undefined) { isTiltShift = false; }
        if (blurX === undefined) { blurX = 1; }
        if (blurY === undefined) { blurY = 1; }
        if (strength === undefined) { strength = 1; }

        Controller.call(this, camera, 'FilterBokeh');

        /**
         * The radius of the bokeh effect.
         *
         * This is a float value, where a radius of 0 will result in no effect being applied,
         * and a radius of 1 will result in a strong bokeh. However, you can exceed this value
         * for even stronger effects.
         *
         * @name Phaser.Filters.Bokeh#radius
         * @type {number}
         * @default 0.5
         * @since 4.0.0
         */
        this.radius = radius;

        /**
         * The amount, or strength, of the bokeh effect.
         *
         * @name Phaser.Filters.Bokeh#amount
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.amount = amount;

        /**
         * The color contrast, or brightness, of the bokeh effect.
         *
         * @name Phaser.Filters.Bokeh#contrast
         * @type {number}
         * @default 0.2
         * @since 4.0.0
         */
        this.contrast = contrast;

        /**
         * Is this a Tilt Shift effect or a standard bokeh effect?
         *
         * @name Phaser.Filters.Bokeh#isTiltShift
         * @type {boolean}
         * @since 4.0.0
         */
        this.isTiltShift = isTiltShift;

        /**
         * If a Tilt Shift effect this controls the amount of horizontal blur.
         *
         * Setting this value on a non-Tilt Shift effect will have no effect.
         *
         * @name Phaser.Filters.Bokeh#blurX
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.blurX = blurX;

        /**
         * If a Tilt Shift effect this controls the amount of vertical blur.
         *
         * Setting this value on a non-Tilt Shift effect will have no effect.
         *
         * @name Phaser.Filters.Bokeh#blurY
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.blurY = blurY;

        /**
         * If a Tilt Shift effect this controls the strength of the blur.
         *
         * Setting this value on a non-Tilt Shift effect will have no effect.
         *
         * @name Phaser.Filters.Bokeh#strength
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.strength = strength;
    },

    getPadding: function ()
    {
        var override = this.paddingOverride;
        if (override)
        {
            this.currentPadding.setTo(override.x, override.y, override.width, override.height);
            return override;
        }

        /*
        The padding is calculated based on the camera height and the radius of the bokeh effect.
        The constant value is derived from the shader.
        The shader samples based on a complicated formula,
        but it is based on camera height and radius,
        multiplied by various constants including 0.025 and 0.06,
        and an iteration which sums to 14.284061040284603 after 100 iterations.
        Together, these multiply to the constant 0.021426096060426905.
        This is the maximum padding required for the bokeh effect.
        */

        var padding = Math.ceil(this.camera.height * this.radius * 0.021426096060426905);

        this.currentPadding.setTo(-padding, -padding, padding * 2, padding * 2);

        return this.currentPadding;
    }
});

module.exports = Bokeh;
