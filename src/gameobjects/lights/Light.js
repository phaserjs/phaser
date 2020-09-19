/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @classdesc
 * A 2D point light.
 *
 * These are typically created by a {@link Phaser.GameObjects.LightsManager}, available from within a scene via `this.lights`.
 *
 * Any Game Objects using the Light2D pipeline will then be affected by these Lights as long as they have a normal map.
 *
 * They can also simply be used to represent a point light for your own purposes.
 *
 * @class Light
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of the light.
 * @param {number} y - The vertical position of the light.
 * @param {number} radius - The radius of the light.
 * @param {number} r - The red color of the light. A value between 0 and 1.
 * @param {number} g - The green color of the light. A value between 0 and 1.
 * @param {number} b - The blue color of the light. A value between 0 and 1.
 * @param {number} intensity - The intensity of the light.
 */
var Light = new Class({

    initialize:

    function Light (x, y, radius, r, g, b, intensity)
    {
        /**
         * The horizontal position of the light.
         *
         * @name Phaser.GameObjects.Light#_x
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._x = x;

        /**
         * The vertical position of the light.
         *
         * @name Phaser.GameObjects.Light#_y
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._y = y;

        /**
         * The radius of the light.
         *
         * @name Phaser.GameObjects.Light#_radius
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._radius = radius;

        /**
         * The red color of the light. A value between 0 and 1.
         *
         * @name Phaser.GameObjects.Light#_r
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._r = r;

        /**
         * The green color of the light. A value between 0 and 1.
         *
         * @name Phaser.GameObjects.Light#_g
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._g = g;

        /**
         * The blue color of the light. A value between 0 and 1.
         *
         * @name Phaser.GameObjects.Light#_b
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._b = b;

        /**
         * The intensity of the light.
         *
         * @name Phaser.GameObjects.Light#_intensity
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._intensity = intensity;

        /**
         * The horizontal scroll factor of the light.
         *
         * @name Phaser.GameObjects.Light#_scrollFactorX
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._scrollFactorX = 1;

        /**
         * The vertical scroll factor of the light.
         *
         * @name Phaser.GameObjects.Light#_scrollFactorY
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._scrollFactorY = 1;

        /**
         * The dirty state of the light. A dirty light will reset all of its shader attributes.
         *
         * @name Phaser.GameObjects.Light#dirty
         * @type {boolean}
         * @since 3.50.0
         */
        this.dirty = true;
    },

    /**
     * Set the properties of the light.
     *
     * Sets both horizontal and vertical scroll factor to 1. Use {@link Phaser.GameObjects.Light#setScrollFactor} to set
     * the scroll factor.
     *
     * @method Phaser.GameObjects.Light#set
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of the light.
     * @param {number} y - The vertical position of the light.
     * @param {number} radius - The radius of the light.
     * @param {number} r - The red color. A value between 0 and 1.
     * @param {number} g - The green color. A value between 0 and 1.
     * @param {number} b - The blue color. A value between 0 and 1.
     * @param {number} intensity - The intensity of the light.
     *
     * @return {this} This Light object.
     */
    set: function (x, y, radius, r, g, b, intensity)
    {
        this._x = x;
        this._y = y;

        this._radius = radius;

        this._r = r;
        this._g = g;
        this._b = b;

        this._intensity = intensity;

        this._scrollFactorX = 1;
        this._scrollFactorY = 1;

        this.dirty = true;

        return this;
    },

    /**
     * Set the scroll factor of the light.
     *
     * @method Phaser.GameObjects.Light#setScrollFactor
     * @since 3.0.0
     *
     * @param {number} [x=1] - The horizontal scroll factor of the light.
     * @param {number} [y=x] - The vertical scroll factor of the light.
     *
     * @return {this} This Light object.
     */
    setScrollFactor: function (x, y)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this._scrollFactorX = x;
        this._scrollFactorY = y;

        this.dirty = true;

        return this;
    },

    /**
     * Set the color of the light from a single integer RGB value.
     *
     * @method Phaser.GameObjects.Light#setColor
     * @since 3.0.0
     *
     * @param {number} rgb - The integer RGB color of the light.
     *
     * @return {this} This Light object.
     */
    setColor: function (rgb)
    {
        var color = Utils.getFloatsFromUintRGB(rgb);

        this._r = color[0];
        this._g = color[1];
        this._b = color[2];

        this.dirty = true;

        return this;
    },

    /**
     * Set the intensity of the light.
     *
     * @method Phaser.GameObjects.Light#setIntensity
     * @since 3.0.0
     *
     * @param {number} intensity - The intensity of the light.
     *
     * @return {this} This Light object.
     */
    setIntensity: function (intensity)
    {
        this._intensity = intensity;

        this.dirty = true;

        return this;
    },

    /**
     * Set the position of the light.
     *
     * @method Phaser.GameObjects.Light#setPosition
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of the light.
     * @param {number} y - The vertical position of the light.
     *
     * @return {this} This Light object.
     */
    setPosition: function (x, y)
    {
        this._x = x;
        this._y = y;

        this.dirty = true;

        return this;
    },

    /**
     * Set the radius of the light.
     *
     * @method Phaser.GameObjects.Light#setRadius
     * @since 3.0.0
     *
     * @param {number} radius - The radius of the light.
     *
     * @return {this} This Light object.
     */
    setRadius: function (radius)
    {
        this._radius = radius;

        this.dirty = true;

        return this;
    },

    /**
     * The horizontal position of the light.
     *
     * @name Phaser.GameObjects.Light#x
     * @type {number}
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this._x;
        },

        set: function (value)
        {
            this._x = value;
            this.dirty = true;
        }

    },

    /**
     * The vertical position of the light.
     *
     * @name Phaser.GameObjects.Light#y
     * @type {number}
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this._y;
        },

        set: function (value)
        {
            this._y = value;
            this.dirty = true;
        }

    },

    /**
     * The radius of the light.
     *
     * @name Phaser.GameObjects.Light#radius
     * @type {number}
     * @since 3.0.0
     */
    radius: {

        get: function ()
        {
            return this._radius;
        },

        set: function (value)
        {
            this._radius = value;
            this.dirty = true;
        }

    },

    /**
     * The red color of the light. A value between 0 and 1.
     *
     * @name Phaser.GameObjects.Light#r
     * @type {number}
     * @since 3.0.0
     */
    r: {

        get: function ()
        {
            return this._r;
        },

        set: function (value)
        {
            this._r = value;
            this.dirty = true;
        }

    },

    /**
     * The green color of the light. A value between 0 and 1.
     *
     * @name Phaser.GameObjects.Light#g
     * @type {number}
     * @since 3.0.0
     */
    g: {

        get: function ()
        {
            return this._g;
        },

        set: function (value)
        {
            this._g = value;
            this.dirty = true;
        }

    },

    /**
     * The blue color of the light. A value between 0 and 1.
     *
     * @name Phaser.GameObjects.Light#b
     * @type {number}
     * @since 3.0.0
     */
    b: {

        get: function ()
        {
            return this._b;
        },

        set: function (value)
        {
            this._b = value;
            this.dirty = true;
        }

    },

    /**
     * The intensity of the light.
     *
     * @name Phaser.GameObjects.Light#intensity
     * @type {number}
     * @since 3.0.0
     */
    intensity: {

        get: function ()
        {
            return this._intensity;
        },

        set: function (value)
        {
            this._intensity = value;
            this.dirty = true;
        }

    },

    /**
     * The horizontal scroll factor of the light.
     *
     * @name Phaser.GameObjects.Light#scrollFactorX
     * @type {number}
     * @since 3.0.0
     */
    scrollFactorX: {

        get: function ()
        {
            return this._scrollFactorX;
        },

        set: function (value)
        {
            this._scrollFactorX = value;
            this.dirty = true;
        }

    },

    /**
     * The vertical scroll factor of the light.
     *
     * @name Phaser.GameObjects.Light#scrollFactorY
     * @type {number}
     * @since 3.0.0
     */
    scrollFactorY: {

        get: function ()
        {
            return this._scrollFactorY;
        },

        set: function (value)
        {
            this._scrollFactorY = value;
            this.dirty = true;
        }

    }

});

module.exports = Light;
