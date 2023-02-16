/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseFX = require('./BaseFX');
var Class = require('../utils/Class');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Pixelate
 * @extends Phaser.FX.BaseFX
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Pixelate = new Class({

    Extends: BaseFX,

    initialize:

    function Pixelate (gameObject, amount)
    {
        if (amount === undefined) { amount = 1; }

        BaseFX.call(this, FX_CONST.PIXELATE, gameObject);

        this.amount = amount;
    }

});

module.exports = Pixelate;
