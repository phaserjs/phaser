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
 * The Pixelate FX Controller.
 *
 * This FX controller manages the pixelate effect for a Game Object.
 *
 * The pixelate effect is a visual technique that deliberately reduces the resolution or detail of an image,
 * creating a blocky or mosaic appearance composed of large, visible pixels. This effect can be used for stylistic
 * purposes, as a homage to retro gaming, or as a means to obscure certain elements within the game, such as
 * during a transition or to censor specific content.
 *
 * A Pixelate effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.preFX.addPixelate();
 * sprite.postFX.addPixelate();
 * ```
 *
 * @class Pixelate
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 * @param {number} [amount=1] - The amount of pixelation to apply.
 */
var Pixelate = new Class({

    Extends: Controller,

    initialize:

    function Pixelate (gameObject, amount)
    {
        if (amount === undefined) { amount = 1; }

        Controller.call(this, FX_CONST.PIXELATE, gameObject);

        /**
         * The amount of pixelation to apply.
         *
         * @name Phaser.FX.Pixelate#amount
         * @type {number}
         * @since 3.60.0
         */
        this.amount = amount;
    }

});

module.exports = Pixelate;
