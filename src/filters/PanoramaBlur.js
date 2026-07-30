/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The PanoramaBlur Filter Controller.
 *
 * This filter controller manages the PanoramaBlur effect for a Camera.
 *
 * PanoramaBlur is a filter for blurring a panorama image.
 * This is intended for use with filters like ImageLight that use a panorama image as the environment map.
 * The blur treats a rectangular map as a sphere,
 * and applies heavy distortion close to the poles to get a correct result.
 * You should not use it for general purpose blurring.
 *
 * The effect can be very slow, as it uses a grid of samples.
 * Total samples equals samplesX * samplesY. This can get very high,
 * very quickly, so be careful when increasing these values.
 * They don't need to be too high for good results.
 *
 * By default, the blur is fully diffuse, sampling an entire hemisphere per point.
 * If you reduce the radius, the effect will be more focused.
 * Use this to control different levels of glossiness in objects using environment maps.
 *
 * A PanoramaBlur effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addPanoramaBlur({});
 * camera.filters.external.addPanoramaBlur({});
 * ```
 *
 * @example
 * // Cache a panorama image in a scene.
 * // Assume there is a panorama texture called 'panorama'.
 * var panorama = this.add.image(0, 0, 'panorama');
 * panorama.setPosition(panorama.width / 2, panorama.height / 2);
 * panorama.enableFilters().filters.internal.addPanoramaBlur({});
 *
 * var panoramaBlurred = this.textures.addDynamicTexture('panorama-blurred', panorama.width, panorama.height);
 * panoramaBlurred.draw(panorama).render();
 *
 * panorama.destroy();
 *
 * // Use the blurred panorama in a filter.
 * anotherObject.enableFilters().filters.internal.addImageLight({ environmentMap: 'panorama-blurred' });
 *
 * @class PanoramaBlur
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {Phaser.Types.Filters.PanoramaBlurConfig} [config] - The configuration object for the PanoramaBlur effect.
 */
var PanoramaBlur = new Class({
    Extends: Controller,

    initialize: function PanoramaBlur (camera, config)
    {
        if (config === undefined) { config = {}; }

        Controller.call(this, camera, 'FilterPanoramaBlur');

        /**
         * The radius of the blur effect. 1 samples an entire hemisphere; 0 samples a single point.
         *
         * @name Phaser.Filters.PanoramaBlur#radius
         * @type {number}
         * @since 4.0.0
         */
        this.radius = config.radius || 1;

        /**
         * The number of samples to take along the X axis. More samples produces a more accurate blur, but at the cost of performance. The X axis in a panorama is usually wider than the Y axis.
         *
         * Altering this value triggers a shader re-compile.
         *
         * @name Phaser.Filters.PanoramaBlur#samplesX
         * @type {number}
         * @since 4.0.0
         */
        this.samplesX = config.samplesX || 32;

        /**
         * The number of samples to take along the Y axis. More samples produces a more accurate blur, but at the cost of performance.
         *
         * Altering this value triggers a shader re-compile.
         *
         * @name Phaser.Filters.PanoramaBlur#samplesY
         * @type {number}
         * @since 4.0.0
         */
        this.samplesY = config.samplesY || 16;

        /**
         * An exponent applied to samples. Power above 1 darkens the samples overall, but bright colors are suppressed less than dark ones, causing them to become relatively more dominant in the result. Power below 1 brightens samples overall, reducing the contrast between bright and dark colors. To simulate an HDR environment with bright sunlight that cannot be represented in sRGB color, use high power.
         *
         * @name Phaser.Filters.PanoramaBlur#power
         * @type {number}
         * @since 4.0.0
         */
        this.power = config.power || 1;
    }
});

module.exports = PanoramaBlur;
