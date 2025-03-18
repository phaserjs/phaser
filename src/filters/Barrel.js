/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Barrel Filter Controller.
 *
 * This filter controller manages the barrel distortion effect for a Camera.
 * A barrel effect allows you to apply either a 'pinch' or 'expand' distortion to
 * the view. The amount of the effect can be modified in real-time.
 *
 * A Barrel effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 *
 * camera.filters.internal.addBarrel();
 * camera.filters.external.addBarrel();
 * ```
 *
 * @class Barrel
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that owns this filter.
 * @param {number} [amount=1] - The amount of distortion applied to the barrel effect. A value of 1 is no distortion. Typically keep this within +- 1.
 */
var Barrel = new Class({
    Extends: Controller,

    initialize: function Barrel (camera, amount)
    {
        if (amount === undefined) { amount = 1; }

        Controller.call(this, camera, 'FilterBarrel');

        /**
         * The amount of distortion applied to the barrel effect.
         *
         * Typically keep this within the range 1 (no distortion) to +- 1.
         *
         * @name Phaser.Filters.Barrel#amount
         * @type {number}
         * @since 4.0.0
         */
        this.amount = amount;
    }
});

module.exports = Barrel;
