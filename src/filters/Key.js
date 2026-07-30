/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var Color = require('../display/color/Color');

/**
 * @classdesc
 * The Key filter controller.
 *
 * The Key effect removes or isolates a specific color from an image.
 * It can be used to remove a background color from an image,
 * or to isolate a specific color for further processing.
 *
 * By default, Key will remove pixels that match the key color.
 * You can instead keep only the matching pixels by setting `isolate`.
 *
 * The threshold and feather settings control how closely the key color matches.
 * A match is measured by "distance between color vectors";
 * that is, how close the RGB values of the pixel are to the RGB values of the key color.
 *
 * A Key filter is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 * camera.filters.internal.addKey({ color: '#ff00ff' });
 * camera.filters.external.addKey({ color: 0x00ff00 });
 * ```
 *
 * @class Key
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {Phaser.Types.Filters.KeyConfig} [config={}] - The configuration for the filter.
 */
var Key = new Class({
    Extends: Controller,
    initialize: function Key (camera, config)
    {
        if (config === undefined) { config = {}; }

        Controller.call(this, camera, 'FilterKey');

        /**
         * The color to use for the key.
         * It is an array of 4 numbers between 0 and 1, representing the RGBA values.
         *
         * @name Phaser.Filters.Key#color
         * @type {number[]}
         * @since 4.0.0
         * @default [ 1, 1, 1, 1 ]
         */
        this.color = [ 1, 1, 1, 1 ];
        if (config.color !== undefined) { this.setColor(config.color); }
        if (config.alpha !== undefined) { this.setAlpha(config.alpha); }

        /**
         * Whether to keep the region matching the key color.
         * If true, the region matching the key color will be kept,
         * and the rest will be removed.
         * If false, the region matching the key color will be removed,
         * and the rest will be kept.
         *
         * @name Phaser.Filters.Key#isolate
         * @type {boolean}
         * @since 4.0.0
         * @default false
         */
        this.isolate = false;
        if (config.isolate !== undefined) { this.isolate = config.isolate; }

        /**
         * The threshold for the key color.
         * A pixel is considered to be the key color if the difference between
         * the pixel and the key color is less than the threshold.
         * This should be between 0 and 1.
         * The default threshold is 1 / 16, which is a good starting point for most images.
         *
         * @name Phaser.Filters.Key#threshold
         * @type {number}
         * @since 4.0.0
         * @default 0.0625
         */
        this.threshold = 0.0625;
        if (config.threshold !== undefined) { this.threshold = config.threshold; }

        /**
         * The feathering amount for the key color.
         * Pixels outside the threshold, but still within the feather,
         * will be a partial match.
         * This should be a value between 0 and 1.
         *
         * @name Phaser.Filters.Key#feather
         * @type {number}
         * @since 4.0.0
         * @default 0
         */
        this.feather = 0;
        if (config.feather !== undefined) { this.feather = config.feather; }
    },

    /**
     * Sets the alpha value to use for the key.
     * Alpha controls the opacity of pixels matched by the key color, in the range 0 to 1.
     * This is stored in the fourth element of the color array.
     * The RGB color values are preserved.
     *
     * @method Phaser.Filters.Key#setAlpha
     * @since 4.0.0
     * @param {number} alpha - The alpha value to set on the key texture, between 0 (fully transparent) and 1 (fully opaque).
     * @return {this} This Filter Controller.
     */
    setAlpha: function (alpha)
    {
        this.color[3] = alpha;
        return this;
    },

    /**
     * Sets the color to use for the key.
     * This is stored in the first three elements of the color array.
     * The alpha value is preserved.
     *
     * @method Phaser.Filters.Key#setColor
     * @since 4.0.0
     * @param {number | string | number[] | Phaser.Display.Color} color - The color to use for the key. It can be a hexcode number or string, an array of 3 numbers between 0 and 1, or a Color object.
     * @return {this} This Filter Controller.
     */
    setColor: function (color)
    {
        var alpha = this.color[3];
        if (typeof color === 'number')
        {
            var rgb = Color.IntegerToRGB(color);
            this.color = [ rgb.r / 255, rgb.g / 255, rgb.b / 255, alpha ];
        }
        else if (typeof color === 'string')
        {
            var colorObject = Color.HexStringToColor(color);
            this.color = [ colorObject.redGL, colorObject.greenGL, colorObject.blueGL, alpha ];
        }
        else if (Array.isArray(color))
        {
            this.color = [ color[0], color[1], color[2], alpha ];
        }
        else if (color instanceof Color)
        {
            this.color = [ color.redGL, color.greenGL, color.blueGL, alpha ];
        }

        return this;
    }
});

module.exports = Key;
