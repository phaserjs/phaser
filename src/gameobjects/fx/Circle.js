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
 * @class Circle
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Circle = new Class({

    Extends: BaseFX,

    initialize:

    function Circle (gameObject)
    {
        BaseFX.call(this, FX_CONST.CIRCLE, gameObject);

        this.scale = 1;

        //  0.005 = strength of the ring (0.5 = super soft, 0.05 = gentle, 0.005 = harsh)
        this.feather = 0.005;

        this.thickness = 8;

        this.glcolor = [ 1, 0.2, 0.7 ];
        this.glcolor2 = [ 1, 0, 0, 0.4 ];
    }

});

module.exports = Circle;
