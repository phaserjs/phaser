/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * The ColorMatrix class creates a 5x5 matrix that can be used in shaders and graphics
 * operations. It provides methods required to modify the color values, such as adjusting
 * the brightness, setting a sepia tone, hue rotation and more.
 *
 * Use the method `getData` to return a Float32Array containing the current color values.
 *
 * @class ColorMatrix
 * @memberof Phaser.Display
 * @constructor
 * @since 3.50.0
 */
var ColorMatrix = new Class({

    initialize:

    function ColorMatrix ()
    {
        /**
         * Internal ColorMatrix array.
         *
         * @name Phaser.Display.ColorMatrix#_matrix
         * @type {number[]}
         * @private
         * @since 3.50.0
         */
        this._matrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ];

        /**
         * Is the ColorMatrix array dirty?
         *
         * @name Phaser.Display.ColorMatrix#_dirty
         * @type {boolean}
         * @private
         * @since 3.50.0
         */
        this._dirty = true;

        /**
         * The matrix data as a Float32Array.
         *
         * Returned by the `getData` method.
         *
         * @name Phaser.Display.ColorMatrix#data
         * @type {Float32Array}
         * @private
         * @since 3.50.0
         */
        this._data;
    },

    /**
     * Sets this ColorMatrix from the given array of color values.
     *
     * @method Phaser.Display.ColorMatrix#set
     * @since 3.50.0
     *
     * @param {number[]} value - The ColorMatrix values to set.
     *
     * @return {this} This ColorMatrix instance.
     */
    set: function (value)
    {
        this._matrix = value;

        this._dirty = true;

        return this;
    },

    /**
     * Resets the ColorMatrix.
     *
     * @method Phaser.Display.ColorMatrix#reset
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    reset: function ()
    {
        //  Long-winded, but saves on gc, which happens a lot in Post FX Shaders
        //  that reset the ColorMatrix every frame.

        var m = this._matrix;

        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;

        m[5] = 0;
        m[6] = 1;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;

        m[10] = 0;
        m[11] = 0;
        m[12] = 1;
        m[13] = 0;
        m[14] = 0;

        m[15] = 0;
        m[16] = 0;
        m[17] = 0;
        m[18] = 1;
        m[19] = 0;

        m[20] = 0;
        m[21] = 0;
        m[22] = 0;
        m[23] = 0;
        m[24] = 1;

        this._dirty = true;

        return this;
    },

    /**
     * Gets the ColorMatrix as a Float32Array.
     *
     * Can be used directly as a 1fv shader uniform value.
     *
     * @method Phaser.Display.ColorMatrix#getData
     * @since 3.50.0
     *
     * @return {Float32Array} The ColorMatrix as a Float32Array.
     */
    getData: function ()
    {
        if (this._dirty)
        {
            var f32 = new Float32Array(this._matrix);

            f32[4] /= 255;
            f32[9] /= 255;
            f32[14] /= 255;
            f32[19] /= 255;

            this._data = f32;

            this._dirty = false;
        }

        return this._data;
    },

    /**
     * Changes the brightness of this ColorMatrix by the given amount.
     *
     * @method Phaser.Display.ColorMatrix#brightness
     * @since 3.50.0
     *
     * @param {number} [value=0] - The amount of brightness to apply to this ColorMatrix.
     *
     * @return {this} This ColorMatrix instance.
     */
    brightness: function (value)
    {
        if (value === undefined) { value = 0; }

        var b = value + 1;

        return this.multiply(this._matrix, [
            b, 0, 0, 0, 0,
            0, b, 0, 0, 0,
            0, 0, b, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Changes the saturation of this ColorMatrix by the given amount.
     *
     * @method Phaser.Display.ColorMatrix#saturation
     * @since 3.50.0
     *
     * @param {number} [value=0] - The amount of saturation to apply to this ColorMatrix.
     *
     * @return {this} This ColorMatrix instance.
     */
    saturation: function (value)
    {
        if (value === undefined) { value = 0; }

        var x = value * 2 / 3 + 1;
        var y = ((x - 1) * -0.5);

        return this.multiply(this._matrix, [
            x, y, y, 0, 0,
            y, x, y, 0, 0,
            y, y, x, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Rotates the hues of this ColorMatrix by the value given.
     *
     * @method Phaser.Display.ColorMatrix#hue
     * @since 3.50.0
     *
     * @param {number} [rotation=0] - The amount of hue rotation to apply to this ColorMatrix, in degrees.
     *
     * @return {this} This ColorMatrix instance.
     */
    hue: function (rotation)
    {
        if (rotation === undefined) { rotation = 0; }

        rotation = rotation / 180 * Math.PI;

        var cos = Math.cos(rotation);
        var sin = Math.sin(rotation);
        var lumR = 0.213;
        var lumG = 0.715;
        var lumB = 0.072;

        return this.multiply(this._matrix, [
            lumR + cos * (1 - lumR) + sin * (-lumR),lumG + cos * (-lumG) + sin * (-lumG),lumB + cos * (-lumB) + sin * (1 - lumB), 0, 0,
            lumR + cos * (-lumR) + sin * (0.143),lumG + cos * (1 - lumG) + sin * (0.140),lumB + cos * (-lumB) + sin * (-0.283), 0, 0,
            lumR + cos * (-lumR) + sin * (-(1 - lumR)),lumG + cos * (-lumG) + sin * (lumG),lumB + cos * (1 - lumB) + sin * (lumB), 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Sets this ColorMatrix to be grayscale.
     *
     * @method Phaser.Display.ColorMatrix#grayscale
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    grayscale: function ()
    {
        return this.saturation(-1);
    },

    /**
     * Change the contrast of this ColorMatrix by the amount given.
     *
     * @method Phaser.Display.ColorMatrix#contrast
     * @since 3.50.0
     *
     * @param {number} [value=0] - The amount of contrast to apply to this ColorMatrix.
     *
     * @return {this} This ColorMatrix instance.
     */
    contrast: function (value)
    {
        if (value === undefined) { value = 0; }

        var v = value + 1;
        var o = -128 * (v - 1);

        return this.multiply(this._matrix, [
            v, 0, 0, 0, o,
            0, v, 0, 0, o,
            0, 0, v, 0, o,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Converts this ColorMatrix to have negative values.
     *
     * @method Phaser.Display.ColorMatrix#negative
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    negative: function ()
    {
        return this.contrast(-2);
    },

    /**
     * Apply a desaturated luminance to this ColorMatrix.
     *
     * @method Phaser.Display.ColorMatrix#desaturateLuminance
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    desaturateLuminance: function ()
    {
        return this.multiply(this._matrix, [
            0.2764723, 0.9297080, 0.0938197, 0, -37.1,
            0.2764723, 0.9297080, 0.0938197, 0, -37.1,
            0.2764723, 0.9297080, 0.0938197, 0, -37.1,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Applies a sepia tone to this ColorMatrix.
     *
     * @method Phaser.Display.ColorMatrix#sepia
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    sepia: function ()
    {
        return this.multiply(this._matrix, [
            0.393, 0.7689999, 0.18899999, 0, 0,
            0.349, 0.6859999, 0.16799999, 0, 0,
            0.272, 0.5339999, 0.13099999, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Applies a brown tone to this ColorMatrix.
     *
     * @method Phaser.Display.ColorMatrix#brown
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    brown: function ()
    {
        return this.multiply(this._matrix, [
            0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0, 47.43192855600873,
            -0.037703249837783157, 0.8609577587992641, 0.15059552388459913, 0, -36.96841498319127,
            0.24113635128153335, -0.07441037908422492, 0.44972182064877153, 0, -7.562075277591283,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Applies a vintage pinhole color effect to this ColorMatrix.
     *
     * @method Phaser.Display.ColorMatrix#vintagePinhole
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    vintagePinhole: function ()
    {
        return this.multiply(this._matrix, [
            0.6279345635605994, 0.3202183420819367, -0.03965408211312453, 0, 9.651285835294123,
            0.02578397704808868, 0.6441188644374771, 0.03259127616149294, 0, 7.462829176470591,
            0.0466055556782719, -0.0851232987247891, 0.5241648018700465, 0, 5.159190588235296,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Applies a kodachrome color effect to this ColorMatrix.
     *
     * @method Phaser.Display.ColorMatrix#kodachrome
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    kodachrome: function ()
    {
        return this.multiply(this._matrix, [
            1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502,
            -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203,
            -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Applies a technicolor color effect to this ColorMatrix.
     *
     * @method Phaser.Display.ColorMatrix#technicolor
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    technicolor: function ()
    {
        return this.multiply(this._matrix, [
            1.9125277891456083, -0.8545344976951645, -0.09155508482755585, 0, 11.793603434377337,
            -0.3087833385928097, 1.7658908555458428, -0.10601743074722245, 0, -70.35205161461398,
            -0.231103377548616, -0.7501899197440212, 1.847597816108189, 0, 30.950940869491138,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Applies a polaroid color effect to this ColorMatrix.
     *
     * @method Phaser.Display.ColorMatrix#polaroid
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    polaroid: function ()
    {
        return this.multiply(this._matrix, [
            1.438, -0.062, -0.062, 0, 0,
            -0.122, 1.378, -0.122, 0, 0,
            -0.016, -0.016, 1.483, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Shifts the values of this ColorMatrix into BGR order.
     *
     * @method Phaser.Display.ColorMatrix#shiftToBGR
     * @since 3.50.0
     *
     * @return {this} This ColorMatrix instance.
     */
    shiftToBGR: function ()
    {
        return this.multiply(this._matrix, [
            0, 0, 1, 0, 0,
            0, 1, 0, 0, 0,
            1, 0, 0, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 1
        ]);
    },

    /**
     * Multiplies the two given matrices.
     *
     * @method Phaser.Display.ColorMatrix#multiply
     * @since 3.50.0
     *
     * @param {number[]} a - The first ColorMatrix array to multiply.
     * @param {number[]} b - The second ColorMatrix array to multiply.
     *
     * @return {this} This ColorMatrix instance.
     */
    multiply: function (a, b)
    {
        var j;
        var k;
        var col = [];

        for (var i = 0; i < 5; i++)
        {
            for (j = 0; j < 5; j++)
            {
                col[j] = a[j + i * 5];
            }

            for (j = 0; j < 5; j++)
            {
                var val = 0;

                for (k = 0; k < 5; k++)
                {
                    val += b[j + k * 5] * col[k];
                }

                a[j + i * 5] = val;
            }
        }

        this._dirty = true;

        return this;
    }

});

module.exports = ColorMatrix;
