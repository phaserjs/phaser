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
 * @class Shadow
 * @extends Phaser.GameObjects.FX.BaseFX
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Shadow = new Class({

    Extends: BaseFX,

    initialize:

    function Shadow (gameObject)
    {
        BaseFX.call(this, FX_CONST.SHADOW, gameObject);

        this.x = 0;
        this.y = 0;
        this.decay = 0.1;
        this.power = 1.0;
        this.glcolor = [ 0, 0, 0, 1 ];
        this.samples = 6; // max 12, min 1
        this.intensity = 1;
    },

    /**
     * The color of the shadow.
     *
     * @name Phaser.GameObjects.FX.Shadow#color
     * @type {number}
     * @since 3.60.0
     */
    color: {

        get: function ()
        {
            var color = this.glcolor;

            return (((color[0] * 255) << 16) + ((color[1] * 255) << 8) + (color[2] * 255 | 0));
        },

        set: function (value)
        {
            var color = this.glcolor;

            color[0] = ((value >> 16) & 0xFF) / 255;
            color[1] = ((value >> 8) & 0xFF) / 255;
            color[2] = (value & 0xFF) / 255;
        }

    }

});

module.exports = Shadow;
