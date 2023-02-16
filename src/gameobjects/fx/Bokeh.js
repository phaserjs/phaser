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
 * @class Bokeh
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Bokeh = new Class({

    Extends: BaseFX,

    initialize:

    function Bokeh (gameObject)
    {
        BaseFX.call(this, FX_CONST.BOKEH, gameObject);

        this.isTiltShift = false;
        this.strength = 1;
        this.blurX = 1;
        this.blurY = 1;
        this.radius = 0.5;
        this.amount = 1;
        this.contrast = 0.2;
    }

});

module.exports = Bokeh;
