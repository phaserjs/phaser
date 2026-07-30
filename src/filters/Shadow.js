/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Shadow Filter.
 *
 * This filter controller manages the shadow effect for a Camera.
 *
 * The shadow effect is a visual technique used to create the illusion of depth and realism by adding darker,
 * offset silhouettes or shapes beneath game objects, characters, or environments. These simulated shadows
 * help to enhance the visual appeal and immersion, making the 2D game world appear more dynamic and three-dimensional.
 *
 * This effect samples across an area. To avoid missing data at the edges,
 * use `controller.setPaddingOverride(null)` to automatically pad game objects,
 * or `camera.getPaddingWrapper(x)` to enlarge a camera.
 *
 * A Shadow effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addShadow();
 * camera.filters.external.addShadow();
 * ```
 *
 * @class Shadow
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {number} [x=0] - The horizontal offset of the shadow effect.
 * @param {number} [y=0] - The vertical offset of the shadow effect.
 * @param {number} [decay=0.1] - The amount of decay for the shadow effect.
 * @param {number} [power=1] - The power of the shadow effect.
 * @param {number} [color=0x000000] - The color of the shadow, as a hex value.
 * @param {number} [samples=6] - The number of samples that the shadow effect will run for.
 * @param {number} [intensity=1] - The intensity of the shadow effect.
 */
var Shadow = new Class({

    Extends: Controller,

    initialize: function Shadow (camera, x, y, decay, power, color, samples, intensity)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (decay === undefined) { decay = 0.1; }
        if (power === undefined) { power = 1; }
        if (samples === undefined) { samples = 6; }
        if (intensity === undefined) { intensity = 1; }

        Controller.call(this, camera, 'FilterShadow');

        /**
         * The horizontal offset of the shadow effect.
         *
         * @name Phaser.Filters.Shadow#x
         * @type {number}
         * @since 4.0.0
         */
        this.x = x;

        /**
         * The vertical offset of the shadow effect.
         *
         * @name Phaser.Filters.Shadow#y
         * @type {number}
         * @since 4.0.0
         */
        this.y = y;

        /**
         * Controls how quickly the shadow fades over distance. Lower values produce longer,
         * more gradual shadows; higher values produce shorter, more concentrated shadows.
         *
         * @name Phaser.Filters.Shadow#decay
         * @type {number}
         * @since 4.0.0
         */
        this.decay = decay;

        /**
         * An exponent applied to the shadow falloff curve. Higher values create sharper
         * shadow edges; lower values create softer, more diffuse shadows.
         *
         * @name Phaser.Filters.Shadow#power
         * @type {number}
         * @since 4.0.0
         */
        this.power = power;

        /**
         * The internal WebGL color array used by the shader. Stores the shadow color
         * as normalized RGBA float values in the range 0 to 1. This array is updated
         * automatically when the `color` property is set.
         *
         * @name Phaser.Filters.Shadow#glcolor
         * @type {number[]}
         * @since 4.0.0
         */
        this.glcolor = [ 0, 0, 0, 1 ];

        /**
         * The number of samples that the shadow effect will run for.
         *
         * This should be an integer with a minimum value of 1 and a maximum of 12.
         *
         * @name Phaser.Filters.Shadow#samples
         * @type {number}
         * @since 4.0.0
         */
        this.samples = samples;

        /**
         * A multiplier for the overall shadow visibility. Higher values produce darker,
         * more prominent shadows.
         *
         * @name Phaser.Filters.Shadow#intensity
         * @type {number}
         * @since 4.0.0
         */
        this.intensity = intensity;

        if (color !== undefined)
        {
            this.color = color;
        }
    },

    /**
     * The color of the shadow, expressed as a hex RGB value (e.g. `0xff0000` for red,
     * `0x000000` for black). Setting this property updates the internal `glcolor` array
     * used by the WebGL shader.
     *
     * @name Phaser.Filters.Shadow#color
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

    /**
     * Returns the amount of extra padding, in pixels, that this filter requires when rendering.
     * The padding accounts for the shadow effect extending beyond the original bounds
     * of the filtered Game Object.
     *
     * @method Phaser.Filters.Shadow#getPadding
     * @since 4.0.0
     *
     * @return {Phaser.Geom.Rectangle} The padding Rectangle.
     */
    getPadding: function ()
    {
        var override = this.paddingOverride;
        if (override)
        {
            this.currentPadding.setTo(override.x, override.y, override.width, override.height);
            return override;
        }

        var camera = this.camera;
        var factor = this.decay * this.intensity;
        var x = Math.ceil(Math.abs(this.x) * camera.width * factor);
        var y = Math.ceil(Math.abs(this.y) * camera.height * factor);

        // Never get smaller, only larger.
        this.currentPadding.setTo(-x, -y, x * 2, y * 2);

        return this.currentPadding;
    }
});

module.exports = Shadow;
