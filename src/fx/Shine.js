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

        this.speed = 0.5;
        this.lineWidth = 0.5;
        this.gradient = 3;
        this.reveal = false;
    }

});

module.exports = Shine;
