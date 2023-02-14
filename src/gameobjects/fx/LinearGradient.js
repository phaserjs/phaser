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
 * @class LinearGradient
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var LinearGradient = new Class({

    Extends: BaseFX,

    initialize:

    function LinearGradient (gameObject)
    {
        BaseFX.call(this, FX_CONST.LINEAR_GRADIENT, gameObject);

        this.alpha = 1;
        this.size = 16;
        this.glcolor1 = [ 255, 0, 0 ];
        this.glcolor2 = [ 0, 255, 0 ];
    }

});

module.exports = LinearGradient;
