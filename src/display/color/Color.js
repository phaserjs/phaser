var Class = require('../../utils/Class');
var GetColor = require('./GetColor');
var GetColor32 = require('./GetColor32');

var Color = new Class({

    initialize:

    /**
     * The Color class holds a single color value and allows for easy modification and reading of it.
     *
     * @class Color
     * @memberOf Phaser.Display
     * @constructor
     * @since 3.0.0
     *
     * @param {integer} [red=0] - The red color value. A number between 0 and 255.
     * @param {integer} [green=0] - The green color value. A number between 0 and 255.
     * @param {integer} [blue=0] - The blue color value. A number between 0 and 255.
     * @param {integer} [alpha=255] - The alpha value. A number between 0 and 255.
     */
    function Color (red, green, blue, alpha)
    {
        if (red === undefined) { red = 0; }
        if (green === undefined) { green = 0; }
        if (blue === undefined) { blue = 0; }
        if (alpha === undefined) { alpha = 255; }

        /**
         * The internal red color value.
         *
         * @property {number} r
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.r = 0;

        /**
         * The internal green color value.
         *
         * @property {number} g
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.g = 0;

        /**
         * The internal blue color value.
         *
         * @property {number} b
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.b = 0;

        /**
         * The internal alpha color value.
         *
         * @property {number} a
         * @private
         * @default 255
         * @since 3.0.0
         */
        this.a = 255;

        /**
         * An array containing the calculated color values for WebGL use.
         *
         * @property {array} gl
         * @since 3.0.0
         */
        this.gl = [ 0, 0, 0, 1 ];

        /**
         * Pre-calculated internal color value.
         *
         * @property {number} _color
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._color = 0;

        /**
         * Pre-calculated internal color32 value.
         *
         * @property {number} _color32
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._color32 = 0;

        /**
         * Pre-calculated internal color rgb string value.
         *
         * @property {string} _rgba
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
     * @method Phaser.Curves.Color#transparent
     * @since 3.0.0
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    transparent: function ()
    {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 0;

        return this.update();
    },

    /**
     * Sets the color of this Color component.
     *
     * @method Phaser.Curves.Color#setTo
     * @since 3.0.0
     *
     * @param {integer} red - The red color value. A number between 0 and 255.
     * @param {integer} green - The green color value. A number between 0 and 255.
     * @param {integer} blue - The blue color value. A number between 0 and 255.
     * @param {integer} [alpha=255] - The alpha value. A number between 0 and 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setTo: function (red, green, blue, alpha)
    {
        if (alpha === undefined) { alpha = 255; }

        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;

        return this.update();
    },

    /**
     * Sets the red, green, blue and alpha GL values of this Color component.
     *
     * @method Phaser.Curves.Color#setGLTo
     * @since 3.0.0
     *
     * @param {float} red - The red color value. A number between 0 and 1.
     * @param {float} green - The green color value. A number between 0 and 1.
     * @param {float} blue - The blue color value. A number between 0 and 1.
     * @param {float} [alpha=1] - The alpha value. A number between 0 and 1.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setGLTo: function (red, green, blue, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        this.redGL = red;
        this.greenGL = green;
        this.blueGL = blue;
        this.alphaGL = alpha;

        return this.update();
    },

    /**
     * Sets the color based on the color object given.
     *
     * @method Phaser.Curves.Color#setFromRGB
     * @since 3.0.0
     *
     * @param {object} color - An object containing `r`, `g`, `b` and optionally `a` values in the range 0 to 255.
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    setFromRGB: function (color)
    {
        this.red = color.r;
        this.green = color.g;
        this.blue = color.b;

        if (color.hasOwnProperty('a'))
        {
            this.alpha = color.a;
        }

        return this.update();
    },

    /**
     * Updates the internal cache values.
     *
     * @method Phaser.Curves.Color#update
     * @since 3.0.0
     *
     * @return {Phaser.Display.Color} This Color object.
     */
    update: function ()
    {
        this._color = GetColor(this.r, this.g, this.b);
        this._color32 = GetColor32(this.r, this.g, this.b, this.a);
        this._rgba = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (this.a / 255) + ')';

        return this;
    },

    /**
     * Returns a new Color component using the values from this one.
     *
     * @method Phaser.Curves.Color#clone
     * @since 3.0.0
     *
     * @return {Phaser.Display.Color} A new Color object.
     */
    clone: function ()
    {
        return new Color(this.r, this.g, this.b, this.a);
    },

    /**
     * The color of this Color component, not including the alpha channel.
     * 
     * @name Phaser.Display.Color#color
     * @property {number} color
     * @readOnly
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
     * @property {number} color32
     * @readOnly
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
     * @property {string} rgba
     * @readOnly
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
     * @property {float} redGL
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

            this.update();
        }

    },

    /**
     * The green color value, normalized to the range 0 to 1.
     * 
     * @name Phaser.Display.Color#greenGL
     * @property {float} greenGL
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

            this.update();
        }

    },

    /**
     * The blue color value, normalized to the range 0 to 1.
     * 
     * @name Phaser.Display.Color#blueGL
     * @property {float} blueGL
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

            this.update();
        }

    },

    /**
     * The alpha color value, normalized to the range 0 to 1.
     * 
     * @name Phaser.Display.Color#alphaGL
     * @property {float} alphaGL
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
     * @property {float} red
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

            this.update();
        }

    },

    /**
     * The green color value, normalized to the range 0 to 255.
     * 
     * @name Phaser.Display.Color#green
     * @property {float} green
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

            this.update();
        }

    },

    /**
     * The blue color value, normalized to the range 0 to 255.
     * 
     * @name Phaser.Display.Color#blue
     * @property {float} blue
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

            this.update();
        }

    },

    /**
     * The alpha color value, normalized to the range 0 to 255.
     * 
     * @name Phaser.Display.Color#alpha
     * @property {float} alpha
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

    }

});

module.exports = Color;
