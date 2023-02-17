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
 * @class Bokeh
 * @extends Phaser.FX.Controller
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Bokeh = new Class({

    Extends: Controller,

    initialize:

    function Bokeh (gameObject, radius, amount, contrast, isTiltShift, blurX, blurY, strength)
    {
        if (radius === undefined) { radius = 0.5; }
        if (amount === undefined) { amount = 1; }
        if (contrast === undefined) { contrast = 0.2; }
        if (isTiltShift === undefined) { isTiltShift = false; }
        if (blurX === undefined) { blurX = 1; }
        if (blurY === undefined) { blurY = 1; }
        if (strength === undefined) { strength = 1; }

        Controller.call(this, FX_CONST.BOKEH, gameObject);

        this.radius = radius;
        this.amount = amount;
        this.contrast = contrast;

        this.isTiltShift = isTiltShift;
        this.strength = strength;
        this.blurX = blurX;
        this.blurY = blurY;
    }

});

module.exports = Bokeh;
