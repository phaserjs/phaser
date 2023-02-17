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
 * @class Barrel
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [amount=1] - The amount of distortion applied to the barrel effect. Typically keep this within the range 0 (no distortion) to 1.
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
         * Typically keep this within the range 0 (no distortion) to 1.
         *
         * @name Phaser.FX.Barrel#amount
         * @type {number}
         * @since 3.60.0
         */
        this.amount = amount;
    }

});

module.exports = Barrel;
