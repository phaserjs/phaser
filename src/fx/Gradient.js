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
 * @class Gradient
 * @extends Phaser.FX.BaseFX
 * @memberof Phaser.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var Gradient = new Class({

    Extends: BaseFX,

    initialize:

    function Gradient (gameObject, color1, color2, alpha, fromX, fromY, toX, toY, size)
    {
        if (alpha === undefined) { alpha = 0.2; }
        if (fromX === undefined) { fromX = 0; }
        if (fromY === undefined) { fromY = 0; }
        if (toX === undefined) { toX = 0; }
        if (toY === undefined) { toY = 1; }
        if (size === undefined) { size = 0; }

        BaseFX.call(this, FX_CONST.GRADIENT, gameObject);

        this.alpha = alpha;

        //  How many 'chunks' the gradient is divided in to, over the entire
        //  height of the texture. Leave at zero for a smoothed gradient.
        this.size = size;

        this.fromX = fromX;
        this.fromY = fromY;

        this.toX = toX;
        this.toY = toY;

        this.glcolor1 = [ 255, 0, 0 ];
        this.glcolor2 = [ 0, 255, 0 ];

        if (color1 !== undefined && color1 !== null)
        {
            this.color1 = color1;
        }

        if (color2 !== undefined && color2 !== null)
        {
            this.color2 = color2;
        }
    },

    /**
     * The first gradient color, given as a number value.
     *
     * @name Phaser.FX.Gradient#color1
     * @type {number}
     * @since 3.60.0
     */
    color1: {

        get: function ()
        {
            var color = this.glcolor1;

            return (((color[0] * 255) << 16) + ((color[1] * 255) << 8) + (color[2] * 255 | 0));
        },

        set: function (value)
        {
            var color = this.glcolor1;

            color[0] = ((value >> 16) & 0xFF) / 255;
            color[1] = ((value >> 8) & 0xFF) / 255;
            color[2] = (value & 0xFF) / 255;
        }

    },

    /**
     * The second gradient color, given as a number value.
     *
     * @name Phaser.FX.Gradient#color2
     * @type {number}
     * @since 3.60.0
     */
    color2: {

        get: function ()
        {
            var color = this.glcolor2;

            return (((color[0] * 255) << 16) + ((color[1] * 255) << 8) + (color[2] * 255 | 0));
        },

        set: function (value)
        {
            var color = this.glcolor2;

            color[0] = ((value >> 16) & 0xFF) / 255;
            color[1] = ((value >> 8) & 0xFF) / 255;
            color[2] = (value & 0xFF) / 255;
        }

    }

});

module.exports = Gradient;
