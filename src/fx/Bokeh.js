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
 * The Bokeh FX Controller.
 *
 * This FX controller manages the bokeh effect for a Game Object.
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
 * A Bokeh effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addBokeh();
 * sprite.postFX.addBokeh();
 * ```
 *
 * @class Bokeh
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [radius=0.5] - The radius of the bokeh effect.
 * @param {number} [amount=1] - The amount of the bokeh effect.
 * @param {number} [contrast=0.2] - The color contrast of the bokeh effect.
 * @param {boolean} [isTiltShift=false] - Is this a bokeh or Tile Shift effect?
 * @param {number} [blurX=1] - If Tilt Shift, the amount of horizontal blur.
 * @param {number} [blurY=1] - If Tilt Shift, the amount of vertical blur.
 * @param {number} [strength=1] - If Tilt Shift, the strength of the blur.
 */
var Bokeh = new Class({

    Extends: Controller,

    initialize:

    function Bokeh (gameObject, radius, amount, contrast, isTiltShift, blurX, blurY, strength)
    {
        if (radius === undefined) { radius = 0.5; }
        if (amount === undefined) { amount = 1; }
        if (contrast === undefined) { contrast = 0.2; }
        if (isTiltShift === undefined) { isTiltShift = false; }
        if (blurX === undefined) { blurX = 1; }
        if (blurY === undefined) { blurY = 1; }
        if (strength === undefined) { strength = 1; }

        Controller.call(this, FX_CONST.BOKEH, gameObject);

        /**
         * The radius of the bokeh effect.
         *
         * This is a float value, where a radius of 0 will result in no effect being applied,
         * and a radius of 1 will result in a strong bokeh. However, you can exceed this value
         * for even stronger effects.
         *
         * @name Phaser.FX.Bokeh#radius
         * @type {number}
         * @since 3.60.0
         */
        this.radius = radius;

        /**
         * The amount, or strength, of the bokeh effect. Defaults to 1.
         *
         * @name Phaser.FX.Bokeh#amount
         * @type {number}
         * @since 3.60.0
         */
        this.amount = amount;

        /**
         * The color contrast, or brightness, of the bokeh effect. Defaults to 0.2.
         *
         * @name Phaser.FX.Bokeh#contrast
         * @type {number}
         * @since 3.60.0
         */
        this.contrast = contrast;

        /**
         * Is this a Tilt Shift effect or a standard bokeh effect?
         *
         * @name Phaser.FX.Bokeh#isTiltShift
         * @type {boolean}
         * @since 3.60.0
         */
        this.isTiltShift = isTiltShift;

        /**
         * If a Tilt Shift effect this controls the strength of the blur.
         *
         * Setting this value on a non-Tilt Shift effect will have no effect.
         *
         * @name Phaser.FX.Bokeh#strength
         * @type {number}
         * @since 3.60.0
         */
        this.strength = strength;

        /**
         * If a Tilt Shift effect this controls the amount of horizontal blur.
         *
         * Setting this value on a non-Tilt Shift effect will have no effect.
         *
         * @name Phaser.FX.Bokeh#blurX
         * @type {number}
         * @since 3.60.0
         */
        this.blurX = blurX;

        /**
         * If a Tilt Shift effect this controls the amount of vertical blur.
         *
         * Setting this value on a non-Tilt Shift effect will have no effect.
         *
         * @name Phaser.FX.Bokeh#blurY
         * @type {number}
         * @since 3.60.0
         */
        this.blurY = blurY;
    }

});

module.exports = Bokeh;
