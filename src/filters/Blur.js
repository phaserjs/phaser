/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Blur Filter Controller.
 *
 * This filter controller manages a blur effect.
 *
 * A Gaussian blur is the result of blurring an image by a Gaussian function. It is a widely used effect,
 * typically to reduce image noise and reduce detail. The visual effect of this blurring technique is a
 * smooth blur resembling that of viewing the image through a translucent screen, distinctly different
 * from the bokeh effect produced by an out-of-focus lens or the shadow of an object under usual illumination.
 *
 * A Blur effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addBlur();
 * camera.filters.external.addBlur();
 * ```
 *
 * @class Blur
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {number} [quality=0] - The quality of the blur effect. Can be either 0 for Low Quality, 1 for Medium Quality or 2 for High Quality.
 * @param {number} [x=2] - The horizontal offset of the blur effect.
 * @param {number} [y=2] - The vertical offset of the blur effect.
 * @param {number} [strength=1] - The strength of the blur effect.
 * @param {number} [color=0xffffff] - The color of the blur, as a hex value.
 * @param {number} [steps=4] - The number of steps to run the blur effect for. This value should always be an integer.
 */
var Blur = new Class({
    Extends: Controller,

    initialize: function Blur (camera, quality, x, y, strength, color, steps)
    {
        if (quality === undefined) { quality = 0; }
        if (x === undefined) { x = 2; }
        if (y === undefined) { y = 2; }
        if (strength === undefined) { strength = 1; }
        if (steps === undefined) { steps = 4; }

        Controller.call(this, camera, 'FilterBlur');

        /**
         * The quality of the blur effect.
         *
         * This can be:
         *
         * 0 for Low Quality
         * 1 for Medium Quality
         * 2 for High Quality
         *
         * The higher the quality, the more complex shader is used
         * and the more processing time is spent on the GPU calculating
         * the final blur. This value is used in conjunction with the
         * `steps` value, as one has a direct impact on the other.
         *
         * Keep this value as low as you can, while still achieving the
         * desired effect you need for your game.
         *
         * @name Phaser.Filters.Blur#quality
         * @type {number}
         * @default 0
         * @since 4.0.0
         */
        this.quality = quality;

        /**
         * The horizontal offset of the blur effect.
         *
         * @name Phaser.Filters.Blur#x
         * @type {number}
         * @default 2
         * @since 4.0.0
         */
        this.x = x;

        /**
         * The vertical offset of the blur effect.
         *
         * @name Phaser.Filters.Blur#y
         * @type {number}
         * @default 2
         * @since 4.0.0
         */
        this.y = y;

        /**
         * The strength of the blur effect.
         *
         * @name Phaser.Filters.Blur#strength
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.strength = strength;

        /**
         * The internal gl color array.
         *
         * @name Phaser.Filters.Blur#glcolor
         * @type {number[]}
         * @since 4.0.0
         */
        this.glcolor = [ 1, 1, 1 ];

        if (color !== undefined && color !== null)
        {
            this.color = color;
        }

        /**
         * The number of steps to run the Blur effect for.
         *
         * This value should always be an integer.
         *
         * The higher the value, the smoother the blur,
         * but at the cost of exponentially more gl operations.
         *
         * Keep this to the lowest possible number you can have it, while
         * still looking correct for your game.
         *
         * @name Phaser.Filters.Blur#steps
         * @type {number}
         * @default 4
         * @since 4.0.0
         */
        this.steps = steps;
    },

    /**
     * The color of the blur as a number value.
     *
     * @name Phaser.Filters.Blur#color
     * @type {number}
     * @since 4.0.0
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

    getPadding: function ()
    {
        var override = this.paddingOverride;
        if (override)
        {
            this.currentPadding.setTo(override.x, override.y, override.width, override.height);
            return override;
        }

        var quality = this.quality;
        var offsetConstant = quality === 0 ? 1.333
            : quality === 1 ? 3.2307692308
                : 5.176470588235294;
        var offset = this.steps * this.strength * offsetConstant;
        var x = Math.ceil(this.x * offset);
        var y = Math.ceil(this.y * offset);

        this.currentPadding.setTo(-x, -y, x * 2, y * 2);

        return this.currentPadding;
    }
});

module.exports = Blur;
