/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var NOOP = require('../../utils/NOOP');

/**
 * @classdesc
 * The RGB class holds a single color value and allows for easy modification and reading of it,
 * with optional on-change callback notification and a dirty flag.
 *
 * @class RGB
 * @memberof Phaser.Layer3D.Math
 * @constructor
 * @since 3.50.0
 *
 * @param {number} [red=0] - The red color value. A number between 0 and 1, or if `green` and `blue` are undefined, a hex color value.
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
         * @name Phaser.Layer3D.Math.RGB#_rgb
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
         * @name Phaser.Layer3D.Math.RGB#onChangeCallback
         * @type {function}
         * @since 3.50.0
         */
        this.onChangeCallback = NOOP;

        /**
         * Is this color dirty?
         *
         * @name Phaser.Layer3D.Math.RGB#dirty
         * @type {boolean}
         * @since 3.50.0
         */
        this.dirty = false;

        if (green === undefined)
        {
            this.setHex(red);
        }
        else
        {
            this.set(red, green, blue);
        }
    },

    /**
     * Sets the red, green and blue values of this RGB object, flags it as being
     * dirty and then invokes the `onChangeCallback`, if set.
     *
     * @method Phaser.Layer3D.Math.RGB#set
     * @since 3.50.0
     *
     * @param {number} [red=0] - The red color value. A number between 0 and 1.
     * @param {number} [green=0] - The green color value. A number between 0 and 1.
     * @param {number} [blue=0] - The blue color value. A number between 0 and 1.
     *
     * @return {this} This RGB instance.
     */
    set: function (red, green, blue)
    {
        if (red === undefined) { red = 0; }
        if (green === undefined) { green = 0; }
        if (blue === undefined) { blue = 0; }

        this._rgb = [ red, green, blue ];

        this.onChange();

        return this;
    },

    /**
     * Sets the red, green and blue values of this RGB object based on the given hex color value.
     * Then flags it as being dirty and invokes the `onChangeCallback`, if set.
     *
     * @method Phaser.Layer3D.Math.RGB#setHex
     * @since 3.50.0
     *
     * @param {number} color - The hex color value, i.e. 0xffffff for white, or 0x00ff00 for green.
     *
     * @return {this} This RGB instance.
     */
    setHex: function (color)
    {
        color = Math.floor(color);

        return this.set(
            (color >> 16 & 255) / 255,
            (color >> 8 & 255) / 255,
            (color & 255) / 255
        );
    },

    /**
     * Compares the given rgb parameters with those in this object and returns
     * a boolean `true` value if they are equal, otherwise it returns `false`.
     *
     * @method Phaser.Layer3D.Math.RGB#equals
     * @since 3.50.0
     *
     * @param {number} red - The red value to compare with this object.
     * @param {number} green - The green value to compare with this object.
     * @param {number} blue - The blue value to compare with this object.
     *
     * @return {boolean} `true` if the given values match those in this object, otherwise `false`.
     */
    equals: function (red, green, blue)
    {
        var rgb = this._rgb;

        return (rgb.r === red && rgb.g === green && rgb.b === blue);
    },

    /**
     * Internal on change handler. Sets this object as being dirty and
     * then invokes the `onChangeCallback`, if set, passing in the
     * new RGB values.
     *
     * @method Phaser.Layer3D.Math.RGB#onChange
     * @since 3.50.0
     */
    onChange: function ()
    {
        this.dirty = true;

        var rgb = this._rgb;

        this.onChangeCallback.call(this, rgb[0], rgb[1], rgb[2]);
    },

    /**
     * The red color value. Between 0 and 1.
     *
     * Changing this property will flag this RGB object as being dirty
     * and invoke the `onChangeCallback` , if set.
     *
     * @name Phaser.Layer3D.Math.RGB#r
     * @type {number}
     * @since 3.50.0
     */
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

    /**
     * The green color value. Between 0 and 1.
     *
     * Changing this property will flag this RGB object as being dirty
     * and invoke the `onChangeCallback` , if set.
     *
     * @name Phaser.Layer3D.Math.RGB#g
     * @type {number}
     * @since 3.50.0
     */
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

    /**
     * The blue color value. Between 0 and 1.
     *
     * Changing this property will flag this RGB object as being dirty
     * and invoke the `onChangeCallback` , if set.
     *
     * @name Phaser.Layer3D.Math.RGB#b
     * @type {number}
     * @since 3.50.0
     */
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

    },

    /**
     * Nulls any external references this object contains.
     *
     * @method Phaser.Layer3D.Math.RGB#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.onChangeCallback = null;
    }

});

module.exports = RGB;
