/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Quantize Filter Controller.
 *
 * This controller manages the Quantize effect on a Camera.
 *
 * Quantization reduces the unique number of colors in an image,
 * based on some limited number of steps per color channel.
 * This is good for creating a retro or stylized effect.
 *
 * Basic quantization breaks each channel up into a number of `steps`.
 * These steps are normally regular. You can bias them towards the top or bottom
 * by changing that channel's `gamma` value.
 * You can adjust the lowest step, thus all subsequent steps, with the `offset`.
 *
 * Quantization is done in either RGBA or HSVA space.
 * The steps, gamma, and offset always apply in the same order,
 * but depending on color mode, they are either applied to
 * `[ red, green, blue, alpha ]` or `[ hue, saturation, value, alpha ]`.
 *
 * The output may optionally be dithered, to eliminate banding
 * and create the illusion that there are many more colors in use.
 *
 * @example
 * const camera = this.cameras.main;
 * camera.filters.internal.addQuantize(); // Default effect.
 * camera.filters.external.addQuantize({
 *     steps: [ 16, 1, 1, 1 ],
 *     dither: true,
 *     mode: 1
 * }); // Quantize into 16 fully saturated rainbow hues, and dither.
 *
 * @class Quantize
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {Phaser.Types.Filters.QuantizeConfig} [config] - The configuration object for the Quantize effect.
 */
var Quantize = new Class({
    Extends: Controller,

    initialize: function Quantize (camera, config)
    {
        if (!config) { config = {}; }

        Controller.call(this, camera, 'FilterQuantize');

        /**
         * How many steps to divide each channel into.
         *
         * It's often useful to drop the last place to 1,
         * because it's alpha in both RGBA and HSVA,
         * and alpha is often either on or off.
         *
         * In RGBA mode, the first 3 channels (RGB) should
         * probably be the same, unless there's a stylistic need.
         * In HSVA mode, the first channel (H) should probably have
         * many divisions to distinguish different hues,
         * while the second and third channels (SV) may need fewer steps.
         *
         * @name Phaser.Filters.Quantize#steps
         * @type {number[]}
         * @since 4.0.0
         * @default [ 8, 8, 8, 8 ]
         */
        this.steps = [ 8, 8, 8, 8 ];
        if (config.steps)
        {
            this.steps[0] = config.steps[0];
            this.steps[1] = config.steps[1];
            this.steps[2] = config.steps[2];
            this.steps[3] = config.steps[3];
        }

        /**
         * Gamma curve applied to the input channels.
         * This can help prioritize nuances in dark or light areas.
         *
         * In RGBA mode, the RGB channels can be treated the same.
         * In HSVA mode, you probably want to apply gamma to just
         * the value and saturation channels.
         *
         * @name Phaser.Filters.Quantize#gamma
         * @type {number[]}
         * @since 4.0.0
         * @default [ 1, 1, 1, 1 ]
         */
        this.gamma = [ 1, 1, 1, 1 ];
        if (config.gamma)
        {
            this.gamma[0] = config.gamma[0];
            this.gamma[1] = config.gamma[1];
            this.gamma[2] = config.gamma[2];
            this.gamma[3] = config.gamma[3];
        }

        /**
         * Offset to apply to the channels during quantization.
         * This mainly exists to slide the hue angle for HSVA quantization.
         *
         * @name Phaser.Filters.Quantize#offset
         * @type {number[]}
         * @since 4.0.0
         * @default [ 0, 0, 0, 0 ]
         */
        this.offset = [ 0, 0, 0, 0 ];
        if (config.offset)
        {
            this.offset[0] = config.offset[0];
            this.offset[1] = config.offset[1];
            this.offset[2] = config.offset[2];
            this.offset[3] = config.offset[3];
        }

        /**
         * The color space to use. 0 is RGBA, 1 is HSVA.
         * Use HSVA to control many hues with fewer levels
         * of lightness/saturation.
         *
         * When the mode changes to HSVA, `steps`, `gamma`, and `offset`
         * now apply to the hue, saturation, value, and alpha channels.
         * They are otherwise unchanged.
         *
         * @name Phaser.Filters.Quantize#mode
         * @type {number}
         * @since 4.0.0
         * @default 0
         */
        this.mode = config.mode || 0;

        /**
         * Whether to apply dither to the quantization,
         * creating a smoother output with the reduced colors.
         *
         * @name Phaser.Filters.Quantize#dither
         * @type {boolean}
         * @since 4.0.0
         * @default false
         */
        this.dither = !!config.dither;
    }
});

module.exports = Quantize;
