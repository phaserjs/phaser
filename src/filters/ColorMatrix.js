/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var DisplayColorMatrix = require('../display/ColorMatrix');

/**
 * @classdesc
 * The ColorMatrix Filter Controller.
 *
 * This filter controller manages the color matrix effect for a Camera.
 *
 * The color matrix effect is a visual technique that involves manipulating the colors of an image
 * or scene using a mathematical matrix. This process can adjust hue, saturation, brightness, and contrast,
 * allowing developers to create various stylistic appearances or mood settings within the game.
 * Common applications include simulating different lighting conditions, applying color filters,
 * or achieving a specific visual style.
 *
 * A ColorMatrix effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * const cmFilter = camera.filters.internal.addColorMatrix();
 * camera.filters.external.addColorMatrix();
 *
 * // To set the matrix values:
 * cmFilter.colorMatrix.sepia();
 * ```
 *
 * @class ColorMatrix
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 */
var ColorMatrix = new Class({
    Extends: Controller,

    initialize: function ColorMatrix (camera)
    {
        Controller.call(this, camera, 'FilterColorMatrix');

        /**
         * The color matrix for this effect.
         * This is where the color values are managed and set.
         *
         * @name Phaser.Filters.ColorMatrix#colorMatrix
         * @type {Phaser.Display.ColorMatrix}
         * @since 4.0.0
         */
        this.colorMatrix = new DisplayColorMatrix();
    },

    destroy: function ()
    {
        this.colorMatrix = null;

        Controller.prototype.destroy.call(this);
    }
});

module.exports = ColorMatrix;
