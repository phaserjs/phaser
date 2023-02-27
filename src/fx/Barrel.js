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
 * The Barrel FX Controller.
 *
 * This FX controller manages the barrel distortion effect for a Game Object.
 *
 * A barrel effect allows you to apply either a 'pinch' or 'expand' distortion to
 * a Game Object. The amount of the effect can be modified in real-time.
 *
 * A Barrel effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addBarrel();
 * sprite.postFX.addBarrel();
 * ```
 *
 * @class Barrel
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [amount=1] - The amount of distortion applied to the barrel effect. A value of 1 is no distortion. Typically keep this within +- 1.
 */
var Barrel = new Class({

    Extends: Controller,

    initialize:

    function Barrel (gameObject, amount)
    {
        if (amount === undefined) { amount = 1; }

        Controller.call(this, FX_CONST.BARREL, gameObject);

        /**
         * The amount of distortion applied to the barrel effect.
         *
         * Typically keep this within the range 1 (no distortion) to +- 1.
         *
         * @name Phaser.FX.Barrel#amount
         * @type {number}
         * @since 3.60.0
         */
        this.amount = amount;
    }

});

module.exports = Barrel;
