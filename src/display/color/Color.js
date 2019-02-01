/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var GetColor = require('./GetColor');
var GetColor32 = require('./GetColor32');
var HSVToRGB = require('./HSVToRGB');
var RGBToHSV = require('./RGBToHSV');

/**
 * @namespace Phaser.Display.Color
 */

/**
 * @classdesc
 * The Color class holds a single color value and allows for easy modification and reading of it.
 *
 * @class Color
 * @memberof Phaser.Display
 * @constructor
 * @since 3.0.0
 *
 * @param {integer} [red=0] - The red color value. A number between 0 and 255.
 * @param {integer} [green=0] - The green color value. A number between 0 and 255.
 * @param {integer} [blue=0] - The blue color value. A number between 0 and 255.
 * @param {integer} [alpha=255] - The alpha value. A number between 0 and 255.
 */
var Color = new Class({

    initialize:

    function Color (red, green, blue, alpha)
    {
        if (red === undefined) { red = 0; }
        if (green === undefined) { green = 0; }
        if (blue === undefined) { blue = 0; }
        if (alpha === undefined) { alpha = 255; }

        /**
         * The internal red color value.
         *
         * @name Phaser.Display.Color#r
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.r = 0;

        /**
         * The internal green color value.
         *
         * @name Phaser.Display.Color#g
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.g = 0;

        /**
         * The internal blue color value.
         *
         * @name Phaser.Display.Color#b
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.b = 0;

        /**
         * The internal alpha color value.
         *
         * @name Phaser.Display.Color#a
         * @type {number}
         * @private
         * @default 255
         * @since 3.0.0
         */
        this.a = 255;

        /**
         * The hue color value. A number between 0 and 1.
         * This is the base color.
         *
         * @name Phaser.Display.Color#_h
         * @type {number}
         * @default 0
         * @private
         * @since 3.13.0
         */
        this._h = 0;

        /**
         * The saturation color value. A number between 0 and 1.
         * This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
         *
         * @name Phaser.Display.Color#_s
         * @type {number}
         * @default 0
         * @private
         * @since 3.13.0
         */
        this._s = 0;

        /**
         * The lightness color value. A number between 0 and 1.
         * This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
         *
         * @name Phaser.Display.Color#_v
         * @type {number}
         * @default 0
         * @private
         * @since 3.13.0
         */
        this._v = 0;

        /**
         * Is this color update locked?
         *
         * @name Phaser.Display.Color#_locked
         * @type {boolean}
         * @private
         * @since 3.13.0
         */
        this._locked = false;

        /**
         * An array containing the calculated color values for WebGL use.
         *
         * @name Phaser.Display.Color#gl
         * @type {number[]}
         * @since 3.0.0
         */
        this.gl = [ 0, 0, 0, 1 ];

        /**
         * Pre-calculated internal color value.
         *
         * @name Phaser.Display.Color#_color
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._color = 0;

        /**
         * Pre-calculated internal color32 value.
         *
         * @name Phaser.Display.Color#_color32
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._color32 = 0;

        /**
         * Pre-calculated internal color rgb string value.
         *
         * @name Phaser.Display.Color#_rgba
         * @type {string}
         * @private
         * @default ''
         * @since 3.0.0
         */
        this._rgba = '';

        this.setTo(red, green, blue, alpha);
    },

    /**
     * Sets this color to be transparent. Sets all values to zero.
     *
     * @method Phaser.Display.Color#transparent
     * @since 3.0.0
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    transparent: function ()
    {
        this._locked = true;

        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 0;

        this._locked = false;

        return this.update(true);
    },

    /**
     * Sets the color of this Color component.
     *
     * @method Phaser.Display.Color#setTo
     * @since 3.0.0
     *
     * @param {integer} red - The red color value. A number between 0 and 255.
     * @param {integer} green - The green color value. A number between 0 and 255.
     * @param {integer} blue - The blue color value. A number between 0 and 255.
     * @param {integer} [alpha=255] - The alpha value. A number between 0 and 255.
     * @param {boolean} [updateHSV=true] - Update the HSV values after setting the RGB values?
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setTo: function (red, green, blue, alpha, updateHSV)
    {
        if (alpha === undefined) { alpha = 255; }
        if (updateHSV === undefined) { updateHSV = true; }

        this._locked = true;

        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;

        this._locked = false;

        return this.update(updateHSV);
    },

    /**
     * Sets the red, green, blue and alpha GL values of this Color component.
     *
     * @method Phaser.Display.Color#setGLTo
     * @since 3.0.0
     *
     * @param {number} red - The red color value. A number between 0 and 1.
     * @param {number} green - The green color value. A number between 0 and 1.
     * @param {number} blue - The blue color value. A number between 0 and 1.
     * @param {number} [alpha=1] - The alpha value. A number between 0 and 1.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setGLTo: function (red, green, blue, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        this._locked = true;

        this.redGL = red;
        this.greenGL = green;
        this.blueGL = blue;
        this.alphaGL = alpha;

        this._locked = false;

        return this.update(true);
    },

    /**
     * Sets the color based on the color object given.
     *
     * @method Phaser.Display.Color#setFromRGB
     * @since 3.0.0
     *
     * @param {InputColorObject} color - An object containing `r`, `g`, `b` and optionally `a` values in the range 0 to 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setFromRGB: function (color)
    {
        this._locked = true;

        this.red = color.r;
        this.green = color.g;
        this.blue = color.b;

        if (color.hasOwnProperty('a'))
        {
            this.alpha = color.a;
        }

        this._locked = false;

        return this.update(true);
    },

    /**
     * Sets the color based on the hue, saturation and lightness values given.
     *
     * @method Phaser.Display.Color#setFromHSV
     * @since 3.13.0
     *
     * @param {number} h - The hue, in the range 0 - 1. This is the base color.
     * @param {number} s - The saturation, in the range 0 - 1. This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
     * @param {number} v - The value, in the range 0 - 1. This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setFromHSV: function (h, s, v)
    {
        return HSVToRGB(h, s, v, this);
    },

    /**
     * Updates the internal cache values.
     *
     * @method Phaser.Display.Color#update
     * @private
     * @since 3.0.0
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    update: function (updateHSV)
    {
        if (updateHSV === undefined) { updateHSV = false; }

        if (this._locked)
        {
            return this;
        }

        var r = this.r;
        var g = this.g;
        var b = this.b;
        var a = this.a;

        this._color = GetColor(r, g, b);
        this._color32 = GetColor32(r, g, b, a);
        this._rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';

        if (updateHSV)
        {
            RGBToHSV(r, g, b, this);
        }

        return this;
    },

    /**
     * Updates the internal hsv cache values.
     *
     * @method Phaser.Display.Color#updateHSV
     * @private
     * @since 3.13.0
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    updateHSV: function ()
    {
        var r = this.r;
        var g = this.g;
        var b = this.b;

        RGBToHSV(r, g, b, this);

        return this;
    },

    /**
     * Returns a new Color component using the values from this one.
     *
     * @method Phaser.Display.Color#clone
     * @since 3.0.0
     *
     * @return {Phaser.Display.Color} A new Color object.
     */
    clone: function ()
    {
        return new Color(this.r, this.g, this.b, this.a);
    },

    /**
     * Sets this Color object to be grayscaled based on the shade value given.
     *
     * @method Phaser.Display.Color#gray
     * @since 3.13.0
     * 
     * @param {integer} shade - A value between 0 and 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    gray: function (shade)
    {
        return this.setTo(shade, shade, shade);
    },

    /**
     * Sets this Color object to be a random color between the `min` and `max` values given.
     *
     * @method Phaser.Display.Color#random
     * @since 3.13.0
     * 
     * @param {integer} [min=0] - The minimum random color value. Between 0 and 255.
     * @param {integer} [max=255] - The maximum random color value. Between 0 and 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    random: function (min, max)
    {
        if (min === undefined) { min = 0; }
        if (max === undefined) { max = 255; }

        var r = Math.floor(min + Math.random() * (max - min));
        var g = Math.floor(min + Math.random() * (max - min));
        var b = Math.floor(min + Math.random() * (max - min));

        return this.setTo(r, g, b);
    },

    /**
     * Sets this Color object to be a random grayscale color between the `min` and `max` values given.
     *
     * @method Phaser.Display.Color#randomGray
     * @since 3.13.0
     * 
     * @param {integer} [min=0] - The minimum random color value. Between 0 and 255.
     * @param {integer} [max=255] - The maximum random color value. Between 0 and 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    randomGray: function (min, max)
    {
        if (min === undefined) { min = 0; }
        if (max === undefined) { max = 255; }

        var s = Math.floor(min + Math.random() * (max - min));

        return this.setTo(s, s, s);
    },

    /**
     * Increase the saturation of this Color by the percentage amount given.
     * The saturation is the amount of the base color in the hue.
     *
     * @method Phaser.Display.Color#saturate
     * @since 3.13.0
     * 
     * @param {integer} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    saturate: function (amount)
    {
        this.s += amount / 100;

        return this;
    },

    /**
     * Decrease the saturation of this Color by the percentage amount given.
     * The saturation is the amount of the base color in the hue.
     *
     * @method Phaser.Display.Color#desaturate
     * @since 3.13.0
     * 
     * @param {integer} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    desaturate: function (amount)
    {
        this.s -= amount / 100;

        return this;
    },

    /**
     * Increase the lightness of this Color by the percentage amount given.
     *
     * @method Phaser.Display.Color#lighten
     * @since 3.13.0
     * 
     * @param {integer} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    lighten: function (amount)
    {
        this.v += amount / 100;

        return this;
    },

    /**
     * Decrease the lightness of this Color by the percentage amount given.
     *
     * @method Phaser.Display.Color#darken
     * @since 3.13.0
     * 
     * @param {integer} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    darken: function (amount)
    {
        this.v -= amount / 100;

        return this;
    },

    /**
     * Brighten this Color by the percentage amount given.
     *
     * @method Phaser.Display.Color#brighten
     * @since 3.13.0
     * 
     * @param {integer} amount - The percentage amount to change this color by. A value between 0 and 100.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    brighten: function (amount)
    {
        var r = this.r;
        var g = this.g;
        var b = this.b;

        r = Math.max(0, Math.min(255, r - Math.round(255 * - (amount / 100))));
        g = Math.max(0, Math.min(255, g - Math.round(255 * - (amount / 100))));
        b = Math.max(0, Math.min(255, b - Math.round(255 * - (amount / 100))));

        return this.setTo(r, g, b);
    },

    /**
     * The color of this Color component, not including the alpha channel.
     *
     * @name Phaser.Display.Color#color
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    color: {

        get: function ()
        {
            return this._color;
        }

    },

    /**
     * The color of this Color component, including the alpha channel.
     *
     * @name Phaser.Display.Color#color32
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    color32: {

        get: function ()
        {
            return this._color32;
        }

    },

    /**
     * The color of this Color component as a string which can be used in CSS color values.
     *
     * @name Phaser.Display.Color#rgba
     * @type {string}
     * @readonly
     * @since 3.0.0
     */
    rgba: {

        get: function ()
        {
            return this._rgba;
        }

    },

    /**
     * The red color value, normalized to the range 0 to 1.
     *
     * @name Phaser.Display.Color#redGL
     * @type {number}
     * @since 3.0.0
     */
    redGL: {

        get: function ()
        {
            return this.gl[0];
        },

        set: function (value)
        {
            this.gl[0] = Math.min(Math.abs(value), 1);

            this.r = Math.floor(this.gl[0] * 255);

            this.update(true);
        }

    },

    /**
     * The green color value, normalized to the range 0 to 1.
     *
     * @name Phaser.Display.Color#greenGL
     * @type {number}
     * @since 3.0.0
     */
    greenGL: {

        get: function ()
        {
            return this.gl[1];
        },

        set: function (value)
        {
            this.gl[1] = Math.min(Math.abs(value), 1);

            this.g = Math.floor(this.gl[1] * 255);

            this.update(true);
        }

    },

    /**
     * The blue color value, normalized to the range 0 to 1.
     *
     * @name Phaser.Display.Color#blueGL
     * @type {number}
     * @since 3.0.0
     */
    blueGL: {

        get: function ()
        {
            return this.gl[2];
        },

        set: function (value)
        {
            this.gl[2] = Math.min(Math.abs(value), 1);

            this.b = Math.floor(this.gl[2] * 255);

            this.update(true);
        }

    },

    /**
     * The alpha color value, normalized to the range 0 to 1.
     *
     * @name Phaser.Display.Color#alphaGL
     * @type {number}
     * @since 3.0.0
     */
    alphaGL: {

        get: function ()
        {
            return this.gl[3];
        },

        set: function (value)
        {
            this.gl[3] = Math.min(Math.abs(value), 1);

            this.a = Math.floor(this.gl[3] * 255);

            this.update();
        }

    },

    /**
     * The red color value, normalized to the range 0 to 255.
     *
     * @name Phaser.Display.Color#red
     * @type {number}
     * @since 3.0.0
     */
    red: {

        get: function ()
        {
            return this.r;
        },

        set: function (value)
        {
            value = Math.floor(Math.abs(value));

            this.r = Math.min(value, 255);

            this.gl[0] = value / 255;

            this.update(true);
        }

    },

    /**
     * The green color value, normalized to the range 0 to 255.
     *
     * @name Phaser.Display.Color#green
     * @type {number}
     * @since 3.0.0
     */
    green: {

        get: function ()
        {
            return this.g;
        },

        set: function (value)
        {
            value = Math.floor(Math.abs(value));

            this.g = Math.min(value, 255);

            this.gl[1] = value / 255;

            this.update(true);
        }

    },

    /**
     * The blue color value, normalized to the range 0 to 255.
     *
     * @name Phaser.Display.Color#blue
     * @type {number}
     * @since 3.0.0
     */
    blue: {

        get: function ()
        {
            return this.b;
        },

        set: function (value)
        {
            value = Math.floor(Math.abs(value));

            this.b = Math.min(value, 255);

            this.gl[2] = value / 255;

            this.update(true);
        }

    },

    /**
     * The alpha color value, normalized to the range 0 to 255.
     *
     * @name Phaser.Display.Color#alpha
     * @type {number}
     * @since 3.0.0
     */
    alpha: {

        get: function ()
        {
            return this.a;
        },

        set: function (value)
        {
            value = Math.floor(Math.abs(value));

            this.a = Math.min(value, 255);

            this.gl[3] = value / 255;

            this.update();
        }

    },

    /**
     * The hue color value. A number between 0 and 1.
     * This is the base color.
     *
     * @name Phaser.Display.Color#h
     * @type {number}
     * @since 3.13.0
     */
    h: {

        get: function ()
        {
            return this._h;
        },

        set: function (value)
        {
            this._h = value;

            HSVToRGB(value, this._s, this._v, this);
        }

    },

    /**
     * The saturation color value. A number between 0 and 1.
     * This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
     *
     * @name Phaser.Display.Color#s
     * @type {number}
     * @since 3.13.0
     */
    s: {

        get: function ()
        {
            return this._s;
        },

        set: function (value)
        {
            this._s = value;

            HSVToRGB(this._h, value, this._v, this);
        }

    },

    /**
     * The lightness color value. A number between 0 and 1.
     * This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
     *
     * @name Phaser.Display.Color#v
     * @type {number}
     * @since 3.13.0
     */
    v: {

        get: function ()
        {
            return this._v;
        },

        set: function (value)
        {
            this._v = value;

            HSVToRGB(this._h, this._s, value, this);
        }

    }

});

module.exports = Color;
