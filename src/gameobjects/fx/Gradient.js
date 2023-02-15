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
 * @class Gradient
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Gradient = new Class({

    Extends: BaseFX,

    initialize:

    function Gradient (gameObject)
    {
        BaseFX.call(this, FX_CONST.GRADIENT, gameObject);

        this.alpha = 0.2;

        //  How many 'chunks' the gradient is divided in to, over the entire
        //  height of the texture. Leave at zero for a smoothed gradient.
        this.size = 0;

        this.fromX = 0;
        this.fromY = 0;

        this.toX = 0;
        this.toY = 1;

        this.glcolor1 = [ 255, 0, 0 ];
        this.glcolor2 = [ 0, 255, 0 ];
    }

});

module.exports = Gradient;
