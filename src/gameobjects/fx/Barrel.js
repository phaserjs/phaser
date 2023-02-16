/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseFX = require('./BaseFX');
var Class = require('../../utils/Class');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Barrel
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Barrel = new Class({

    Extends: BaseFX,

    initialize:

    function Barrel (gameObject, amount)
    {
        if (amount === undefined) { amount = 1; }

        BaseFX.call(this, FX_CONST.BARREL, gameObject);

        /**
         * The amount of distortion applied to the barrel effect.
         *
         * Typically keep this within the range 0 (no distortion) to 1.
         *
         * @name Phaser.GameObjects.FX.Barrel#amount
         * @type {number}
         * @since 3.60.0
         */
        this.amount = amount;
    }

});

module.exports = Barrel;
