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
 * @class Shadow
 * @extends Phaser.FX.BaseFX
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Shadow = new Class({

    Extends: BaseFX,

    initialize:

    function Shadow (gameObject, x, y, decay, power, color, samples, intensity)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (decay === undefined) { decay = 0.1; }
        if (power === undefined) { power = 1; }
        if (samples === undefined) { samples = 6; }
        if (intensity === undefined) { intensity = 1; }

        BaseFX.call(this, FX_CONST.SHADOW, gameObject);

        this.x = x;
        this.y = y;
        this.decay = decay;
        this.power = power;
        this.glcolor = [ 0, 0, 0, 1 ];
        this.samples = samples; // max 12, min 1
        this.intensity = intensity;

        if (color !== undefined)
        {
            this.color = color;
        }
    },

    /**
     * The color of the shadow.
     *
     * @name Phaser.FX.Shadow#color
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
