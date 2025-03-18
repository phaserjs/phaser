/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Glow Filter controller.
 *
 * This filter controller manages the glow effect for a Camera.
 *
 * The glow effect is a visual technique that creates a soft, luminous halo around game objects,
 * characters, or UI elements. This effect is used to emphasize importance, enhance visual appeal,
 * or convey a sense of energy, magic, or otherworldly presence. The effect can also be set on
 * the inside of edges. The color and strength of the glow can be modified.
 *
 * A Glow effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addGlow();
 * camera.filters.external.addGlow();
 * ```
 *
 * Conversion note from Phaser 3:
 * - The shader now uses stochastic sampling instead of sampling along straight lines. This improves quality, especially around corners.
 * - `scale` has been added to the parameter list, before `knockout`.
 * - `quality` is no longer a fraction, but an integer value. The default has changed from 0.1 to 10. This is not a linear conversion, because of the quality improvement. Judge the quality by eye and adjust the value accordingly.
 *
 * @class Glow
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {number} [color=0xffffff] - The color of the glow effect as a number value.
 * @param {number} [outerStrength=4] - The strength of the glow outward from the edge of textures.
 * @param {number} [innerStrength=0] - The strength of the glow inward from the edge of textures.
 * @param {number} [scale=1] - The scale of the glow effect. This multiplies the fixed distance.
 * @param {boolean} [knockout=false] - If `true` only the glow is drawn, not the texture itself.
 * @param {number} [quality=10] - The quality of the glow effect. This cannot be changed after the filter has been created.
 * @param {number} [distance=10] - The distance of the glow effect. This cannot be changed after the filter has been created.
 */
var Glow = new Class({
    Extends: Controller,

    initialize: function Glow (camera, color, outerStrength, innerStrength, scale, knockout, quality, distance)
    {
        if (outerStrength === undefined) { outerStrength = 4; }
        if (innerStrength === undefined) { innerStrength = 0; }
        if (scale === undefined) { scale = 1; }
        if (knockout === undefined) { knockout = false; }
        if (quality === undefined) { quality = camera.scene.sys.game.config.glowQuality; }
        if (distance === undefined) { distance = camera.scene.sys.game.config.glowDistance; }

        Controller.call(this, camera, 'FilterGlow');

        /**
         * The strength of the glow outward from the edge of textures.
         *
         * @name Phaser.Filters.Glow#outerStrength
         * @type {number}
         * @since 4.0.0
         * @default 4
         */
        this.outerStrength = outerStrength;

        /**
         * The strength of the glow inward from the edge of textures.
         *
         * @name Phaser.Filters.Glow#innerStrength
         * @type {number}
         * @since 4.0.0
         * @default 0
         */
        this.innerStrength = innerStrength;

        /**
         * The scale of the glow effect. This multiplies the fixed distance.
         *
         * @name Phaser.Filters.Glow#scale
         * @type {number}
         * @since 4.0.0
         * @default 1
         */
        this.scale = scale;

        /**
         * If `true` only the glow is drawn, not the texture itself.
         *
         * @name Phaser.Filters.Glow#knockout
         * @type {number}
         * @since 4.0.0
         * @default false
         */
        this.knockout = knockout;

        /**
         * The quality of the glow effect.
         * This cannot be changed after the filter has been created.
         * This controls the number of samples that the glow effect will run for.
         * A higher number is higher quality, but slower to process.
         * Integer values only.
         *
         * @name Phaser.Filters.Glow#quality
         * @type {number}
         * @since 4.0.0
         * @default 10
         * @private
         * @readonly
         */
        this._quality = Math.max(Math.round(quality), 1);

        /**
         * The distance of the glow effect.
         * This cannot be changed after the filter has been created.
         * This controls the distance of the glow effect, in pixels.
         * Integer values only.
         *
         * @name Phaser.Filters.Glow#distance
         * @type {number}
         * @since 4.0.0
         * @default 10
         * @private
         * @readonly
         */
        this._distance = Math.max(Math.round(distance), 1);

        /**
         * A 4 element array of gl color values.
         *
         * @name Phaser.Filters.Glow#glcolor
         * @type {number[]}
         * @since 4.0.0
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
     * @name Phaser.Filters.Glow#color
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
     * The distance of the glow effect.
     * This cannot be changed after the filter has been created.
     * This controls the distance of the glow effect, in pixels.
     * Integer values only.
     *
     * @name Phaser.Filters.Glow#distance
     * @type {number}
     * @since 4.0.0
     * @readonly
     */
    distance: {

        get: function ()
        {
            return this._distance;
        }

    },

    /**
     * The quality of the glow effect.
     * This cannot be changed after the filter has been created.
     * This controls the number of samples that the glow effect will run for.
     * A higher number is higher quality, but slower to process.
     * Integer values only.
     *
     * @name Phaser.Filters.Glow#quality
     * @type {number}
     * @since 4.0.0
     * @readonly
     */
    quality: {

        get: function ()
        {
            return this._quality;
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

        var padding = this.currentPadding;
        var distance = Math.ceil(this.distance * this.scale);

        padding.left = -distance;
        padding.top = -distance;
        padding.right = distance;
        padding.bottom = distance;

        return padding;
    }
});

module.exports = Glow;
