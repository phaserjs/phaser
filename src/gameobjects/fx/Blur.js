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
 * @class Blur
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Blur = new Class({

    Extends: BaseFX,

    initialize:

    function Blur (gameObject)
    {
        BaseFX.call(this, FX_CONST.BLUR, gameObject);

        this.x = 2;
        this.y = 2;
        this.steps = 4;
        this.strength = 1;
        this.glcolor = [ 1, 1, 1 ];
    }

});

module.exports = Blur;
