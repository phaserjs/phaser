/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var ColorRamp = require('../display/ColorRamp');

/**
 * @classdesc
 * The GradientMap Filter Controller.
 *
 * This controller manages the GradientMap effect for a Camera.
 *
 * GradientMap recolors an image using a ColorRamp.
 * The image is converted to a progress value at each point,
 * and that progress is evaluated as a color along the ramp.
 *
 * The progress value is normally the brightness of the image.
 * You can use the `colorFactor` and `color` properties to customize it.
 *
 * @example
 * const camera = this.cameras.main;
 * camera.filters.internal.addGradientMap(); // Basic effect.
 * camera.filters.external.addGradientMap({
 *     colorFactor: [ -0.3, -0.6, -0.1, 0 ],
 *     color: [ 0.3, 0.6, 0.1, 0 ]
 * }); // Invert brightness.
 *
 * @class GradientMap
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {Phaser.Types.Filters.GradientMapConfig} [config] - The configuration object for the GradientMap effect.
 */
var GradientMap = new Class({
    Extends: Controller,

    initialize: function GradientMap (camera, config)
    {
        if (!config) { config = {}; }

        var scene = camera.scene;

        Controller.call(this, camera, 'FilterGradientMap');

        var ramp = config.ramp;
        if (!ramp)
        {
            ramp = { colorStart: 0x000000, colorEnd: 0xffffff };
        }
        if (!(ramp instanceof ColorRamp))
        {
            // Ramp is a config. Construct it.
            ramp = new ColorRamp(scene, ramp, true);
        }

        /**
         * The ColorRamp used to recolor the image. Each pixel's brightness
         * (or custom progress value derived from `colorFactor` and `color`)
         * is looked up along this ramp to determine its output color.
         *
         * @name Phaser.Filters.GradientMap#ramp
         * @type {Phaser.Display.ColorRamp}
         * @since 4.0.0
         */
        this.ramp = ramp;

        /**
         * Whether to use Interleaved Gradient Noise to dither the ramp.
         * This can reduce banding, but the effect is easily lost if the image
         * is later transformed.
         *
         * @name Phaser.Filters.GradientMap#dither
         * @type {boolean}
         * @since 4.0.0
         * @default false
         */
        this.dither = !!config.dither;

        /**
         * RGBA offset values added directly to the ramp progress after `colorFactor`
         * has been applied. Each element corresponds to a channel: red, green, blue,
         * and alpha. For example, setting a channel to `1` when its corresponding
         * `colorFactor` entry is `-1` effectively inverts that channel's contribution
         * to the progress value.
         *
         * @name Phaser.Filters.GradientMap#color
         * @type {number[]}
         * @since 4.0.0
         * @default [ 0, 0, 0, 0 ]
         */
        this.color = [ 0, 0, 0, 0 ];
        if (config.color)
        {
            this.color[0] = config.color[0] || 0;
            this.color[1] = config.color[1] || 0;
            this.color[2] = config.color[2] || 0;
            this.color[3] = config.color[3] || 0;
        }

        /**
         * RGBA multipliers applied to each channel of the source image to compute
         * the ramp progress value. The results are summed together. The defaults
         * `[ 0.3, 0.6, 0.1, 0 ]` approximate standard luminance weights, producing
         * a perceptually accurate grayscale progress. Keep the sum of factors equal
         * to 1 for a normalized result, or use negative values (paired with `color`
         * offsets) to invert a channel's contribution.
         *
         * @name Phaser.Filters.GradientMap#colorFactor
         * @type {number[]}
         * @since 4.0.0
         * @default [ 0.3, 0.6, 0.1, 0 ]
         */
        this.colorFactor = [ 0.3, 0.6, 0.1, 0 ];
        if (config.colorFactor)
        {
            this.colorFactor[0] = config.colorFactor[0] || 0;
            this.colorFactor[1] = config.colorFactor[1] || 0;
            this.colorFactor[2] = config.colorFactor[2] || 0;
            this.colorFactor[3] = config.colorFactor[3] || 0;
        }

        /**
         * Whether the input should be unpremultiplied before computing progress.
         * This means that transparent colors are considered at full brightness.
         * It is usually desirable.
         *
         * @name Phaser.Filters.GradientMap#unpremultiply
         * @type {boolean}
         * @since 4.0.0
         * @default true
         */
        this.unpremultiply = config.unpremultiply === undefined ? true : config.unpremultiply;

        /**
         * The blend strength of the gradient map effect over the original image,
         * in the range 0 (no effect, original image fully visible) to 1 (full
         * gradient map effect, original image fully replaced).
         *
         * @name Phaser.Filters.GradientMap#alpha
         * @type {number}
         * @since 4.0.0
         * @default 1
         */
        this.alpha = config.alpha === undefined ? 1 : config.alpha;
    }
});

module.exports = GradientMap;
