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
 * @class Wipe
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Wipe = new Class({

    Extends: BaseFX,

    initialize:

    function Wipe (gameObject)
    {
        BaseFX.call(this, FX_CONST.WIPE, gameObject);

        //  left to right: direction 0, axis 0
        //  right to left: direction 1, axis 0
        //  top to bottom: direction 1, axis 1
        //  bottom to top: direction 1, axis 0
        //  wipe: reveal 0
        //  reveal: reveal 1
        //  progress: 0 - 1

        this.progress = 0;
        this.wipeWidth = 0.1;
        this.direction = 0;
        this.axis = 0;
        this.reveal = false;
    }

});

module.exports = Wipe;
