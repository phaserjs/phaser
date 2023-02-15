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
 * @class Bloom
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Bloom = new Class({

    Extends: BaseFX,

    initialize:

    function Bloom (gameObject)
    {
        BaseFX.call(this, FX_CONST.BLOOM, gameObject);

        this.steps = 4;
        this.offsetX = 1;
        this.offsetY = 1;
        this.blurStrength = 1;
        this.strength = 1; // blend strength
        this.glcolor = [ 1, 1, 1 ];
    }

});

module.exports = Bloom;
