/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');
var FX_CONST = require('./const');

/**
 * @classdesc
 * The Wipe FX Controller.
 *
 * This FX controller manages the wipe effect for a Game Object.
 *
 * The wipe or reveal effect is a visual technique that gradually uncovers or conceals elements
 * in the game, such as images, text, or scene transitions. This effect is often used to create
 * a sense of progression, reveal hidden content, or provide a smooth and visually appealing transition
 * between game states.
 *
 * You can set both the direction and the axis of the wipe effect. The following combinations are possible:
 *
 * * left to right: direction 0, axis 0
 * * right to left: direction 1, axis 0
 * * top to bottom: direction 1, axis 1
 * * bottom to top: direction 1, axis 0
 *
 * It is up to you to set the `progress` value yourself, i.e. via a Tween, in order to transition the effect.
 *
 * A Wipe effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addWipe();
 * sprite.postFX.addWipe();
 * sprite.preFX.addReveal();
 * sprite.postFX.addReveal();
 * ```
 *
 * @class Wipe
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [wipeWidth=0.1] - The width of the wipe effect. This value is normalized in the range 0 to 1.
 * @param {number} [direction=0] - The direction of the wipe effect. Either 0 or 1. Set in conjunction with the axis property.
 * @param {number} [axis=0] - The axis of the wipe effect. Either 0 or 1. Set in conjunction with the direction property.
 * @param {boolean} [reveal=false] - Is this a reveal (true) or a fade (false) effect?
 */
var Wipe = new Class({

    Extends: Controller,

    initialize:

    function Wipe (gameObject, wipeWidth, direction, axis, reveal)
    {
        if (wipeWidth === undefined) { wipeWidth = 0.1; }
        if (direction === undefined) { direction = 0; }
        if (axis === undefined) { axis = 0; }
        if (reveal === undefined) { reveal = false; }

        Controller.call(this, FX_CONST.WIPE, gameObject);

        /**
         * The progress of the Wipe effect. This value is normalized to the range 0 to 1.
         *
         * Adjust this value to make the wipe transition (i.e. via a Tween)
         *
         * @name Phaser.FX.Wipe#progress
         * @type {number}
         * @since 3.60.0
         */
        this.progress = 0;

        /**
         * The width of the wipe effect. This value is normalized in the range 0 to 1.
         *
         * @name Phaser.FX.Wipe#wipeWidth
         * @type {number}
         * @since 3.60.0
         */
        this.wipeWidth = wipeWidth;

        /**
         * The direction of the wipe effect. Either 0 or 1. Set in conjunction with the axis property.
         *
         * @name Phaser.FX.Wipe#direction
         * @type {number}
         * @since 3.60.0
         */
        this.direction = direction;

        /**
         * The axis of the wipe effect. Either 0 or 1. Set in conjunction with the direction property.
         *
         * @name Phaser.FX.Wipe#axis
         * @type {number}
         * @since 3.60.0
         */
        this.axis = axis;

        /**
         * Is this a reveal (true) or a fade (false) effect?
         *
         * @name Phaser.FX.Wipe#reveal
         * @type {boolean}
         * @since 3.60.0
         */
        this.reveal = reveal;
    }

});

module.exports = Wipe;
