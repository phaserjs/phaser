/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Shine
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [speed=0.5] - The speed of the Shine effect.
 * @param {number} [lineWidth=0.5] - The line width of the Shine effect.
 * @param {number} [gradient=3] - The gradient of the Shine effect.
 * @param {boolean} [reveal=false] - Does this Shine effect reveal or get added to its target?
 */
var Shine = new Class({

    Extends: Controller,

    initialize:

    function Shine (gameObject, speed, lineWidth, gradient, reveal)
    {
        if (speed === undefined) { speed = 0.5; }
        if (lineWidth === undefined) { lineWidth = 0.5; }
        if (gradient === undefined) { gradient = 3; }
        if (reveal === undefined) { reveal = false; }

        Controller.call(this, FX_CONST.SHINE, gameObject);

        /**
         * The speed of the Shine effect.
         *
         * @name Phaser.FX.Shine#speed
         * @type {number}
         * @since 3.60.0
         */
        this.speed = speed;

        /**
         * The line width of the Shine effect.
         *
         * @name Phaser.FX.Shine#lineWidth
         * @type {number}
         * @since 3.60.0
         */
        this.lineWidth = lineWidth;

        /**
         * The gradient of the Shine effect.
         *
         * @name Phaser.FX.Shine#gradient
         * @type {number}
         * @since 3.60.0
         */
        this.gradient = gradient;

        /**
         * Does this Shine effect reveal or get added to its target?
         *
         * @name Phaser.FX.Shine#reveal
         * @type {boolean}
         * @since 3.60.0
         */
        this.reveal = reveal;
    }

});

module.exports = Shine;
