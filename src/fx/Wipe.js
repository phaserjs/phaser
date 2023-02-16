/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseFX = require('./BaseFX');
var Class = require('../utils/Class');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Wipe
 * @extends Phaser.FX.BaseFX
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Wipe = new Class({

    Extends: BaseFX,

    initialize:

    function Wipe (gameObject, wipeWidth, direction, axis, reveal)
    {
        if (wipeWidth === undefined) { wipeWidth = 0.1; }
        if (direction === undefined) { direction = 0; }
        if (axis === undefined) { axis = 0; }
        if (reveal === undefined) { reveal = false; }

        BaseFX.call(this, FX_CONST.WIPE, gameObject);

        //  left to right: direction 0, axis 0
        //  right to left: direction 1, axis 0
        //  top to bottom: direction 1, axis 1
        //  bottom to top: direction 1, axis 0
        //  wipe: reveal 0
        //  reveal: reveal 1
        //  progress: 0 - 1

        this.progress = 0;

        this.wipeWidth = wipeWidth;

        this.direction = direction;

        this.axis = axis;

        this.reveal = reveal;
    }

});

module.exports = Wipe;
