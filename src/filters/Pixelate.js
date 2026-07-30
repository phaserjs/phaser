/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Pixelate Filter Controller.
 *
 * This filter controller manages the pixelate effect for a Camera.
 * The pixelate effect is a visual technique that deliberately reduces the resolution or detail of an image,
 * creating a blocky or mosaic appearance composed of large, visible pixels. This effect can be used for stylistic
 * purposes, as a homage to retro gaming, or as a means to obscure certain elements within the game, such as
 * during a transition or to censor specific content.
 *
 * A Pixelate effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 * camera.filters.internal.addPixelate();
 * ```
 *
 * @class Pixelate
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Filters.Controller
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {number} [amount=1] - The amount of pixelation to apply.
 */
var Pixelate = new Class({
    Extends: Controller,

    initialize: function Pixelate (camera, amount)
    {
        if (amount === undefined) { amount = 1; }

        Controller.call(this, camera, 'FilterPixelate');

        /**
         * The amount of pixelation to apply.
         *
         * The size of the pixels is equal to 2 + the amount.
         *
         * @name Phaser.Filters.Pixelate#amount
         * @type {number}
         * @default 1
         * @since 4.0.0
         */
        this.amount = amount;
    }
});

module.exports = Pixelate;
