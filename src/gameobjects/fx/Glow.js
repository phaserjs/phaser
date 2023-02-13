/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class Glow
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Glow = new Class({

    initialize:

    function Glow (gameObject)
    {
        this.type = FX_CONST.GLOW;

        this.gameObject = gameObject;

        this.active = true;

        this.distance = 16;
        this.outerStrength = 4;
        this.innerStrength = 0;
        this.knockout = false;
        this._color = [ 1, 1, 1, 1 ];
    },

    /**
     * The color of the glow.
     *
     * @name Phaser.GameObjects.FX.Glow#color
     * @type {number}
     * @since 3.60.0
     */
    color: {

        get: function ()
        {
            var color = this._color;

            return (((color[0] * 255) << 16) + ((color[1] * 255) << 8) + (color[2] * 255 | 0));
        },

        set: function (value)
        {
            var color = this._color;

            color[0] = ((value >> 16) & 0xFF) / 255;
            color[1] = ((value >> 8) & 0xFF) / 255;
            color[2] = (value & 0xFF) / 255;
        }

    },

    destroy: function ()
    {
        this.gameObject = null;
    }

});

module.exports = Glow;
