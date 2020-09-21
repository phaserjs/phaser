/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');

/**
 * @classdesc
 * The RGB class holds a single color value and allows for easy modification and reading of it,
 * with optional on-change callback notification and a dirty flag.
 *
 * @class RGB
 * @memberof Phaser.Display
 * @constructor
 * @since 3.50.0
 *
 * @param {number} [red=0] - The red color value. A number between 0 and 1.
 * @param {number} [green=0] - The green color value. A number between 0 and 1.
 * @param {number} [blue=0] - The blue color value. A number between 0 and 1.
 */
var RGB = new Class({

    initialize:

    function RGB (red, green, blue)
    {
        /**
         * Cached RGB values.
         *
         * @name Phaser.Display.RGB#_rgb
         * @type {number[]}
         * @private
         * @since 3.50.0
         */
        this._rgb = [ 0, 0, 0 ];

        /**
         * This callback will be invoked each time one of the RGB color values change.
         *
         * The callback is sent the new color values as the parameters.
         *
         * @name Phaser.Display.RGB#onChangeCallback
         * @type {function}
         * @since 3.50.0
         */
        this.onChangeCallback = NOOP;

        /**
         * Is this color dirty?
         *
         * @name Phaser.Display.RGB#dirty
         * @type {boolean}
         * @since 3.50.0
         */
        this.dirty = false;

        this.set(red, green, blue);
    },

    set: function (red, green, blue)
    {
        if (red === undefined) { red = 0; }
        if (green === undefined) { green = 0; }
        if (blue === undefined) { blue = 0; }

        this._rgb = [ red, green, blue ];

        this.onChange();

        return this;
    },

    equals: function (red, green, blue)
    {
        var rgb = this._rgb;

        return (rgb.r === red && rgb.g === green && rgb.b === blue);
    },

    onChange: function ()
    {
        this.dirty = true;

        var rgb = this._rgb;

        this.onChangeCallback.call(this, rgb[0], rgb[1], rgb[2]);
    },

    r: {

        get: function ()
        {
            return this._rgb[0];
        },

        set: function (value)
        {
            this._rgb[0] = value;
            this.onChange();
        }

    },

    g: {

        get: function ()
        {
            return this._rgb[1];
        },

        set: function (value)
        {
            this._rgb[1] = value;
            this.onChange();
        }

    },

    b: {

        get: function ()
        {
            return this._rgb[2];
        },

        set: function (value)
        {
            this._rgb[2] = value;
            this.onChange();
        }

    }

});

module.exports = RGB;
