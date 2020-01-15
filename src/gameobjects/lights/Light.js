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
 * Any Game Objects using the Light2D pipeline will then be affected by these Lights.
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
         * @name Phaser.GameObjects.Light#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The vertical position of the light.
         *
         * @name Phaser.GameObjects.Light#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = y;

        /**
         * The radius of the light.
         *
         * @name Phaser.GameObjects.Light#radius
         * @type {number}
         * @since 3.0.0
         */
        this.radius = radius;

        /**
         * The red color of the light. A value between 0 and 1.
         *
         * @name Phaser.GameObjects.Light#r
         * @type {number}
         * @since 3.0.0
         */
        this.r = r;

        /**
         * The green color of the light. A value between 0 and 1.
         *
         * @name Phaser.GameObjects.Light#g
         * @type {number}
         * @since 3.0.0
         */
        this.g = g;

        /**
         * The blue color of the light. A value between 0 and 1.
         *
         * @name Phaser.GameObjects.Light#b
         * @type {number}
         * @since 3.0.0
         */
        this.b = b;

        /**
         * The intensity of the light.
         *
         * @name Phaser.GameObjects.Light#intensity
         * @type {number}
         * @since 3.0.0
         */
        this.intensity = intensity;

        /**
         * The horizontal scroll factor of the light.
         *
         * @name Phaser.GameObjects.Light#scrollFactorX
         * @type {number}
         * @since 3.0.0
         */
        this.scrollFactorX = 1.0;

        /**
         * The vertical scroll factor of the light.
         *
         * @name Phaser.GameObjects.Light#scrollFactorY
         * @type {number}
         * @since 3.0.0
         */
        this.scrollFactorY = 1.0;
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
     * @return {Phaser.GameObjects.Light} This Light object.
     */
    set: function (x, y, radius, r, g, b, intensity)
    {
        this.x = x;
        this.y = y;

        this.radius = radius;

        this.r = r;
        this.g = g;
        this.b = b;

        this.intensity = intensity;

        this.scrollFactorX = 1;
        this.scrollFactorY = 1;

        return this;
    },

    /**
     * Set the scroll factor of the light.
     *
     * @method Phaser.GameObjects.Light#setScrollFactor
     * @since 3.0.0
     *
     * @param {number} x - The horizontal scroll factor of the light.
     * @param {number} y - The vertical scroll factor of the light.
     *
     * @return {Phaser.GameObjects.Light} This Light object.
     */
    setScrollFactor: function (x, y)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this.scrollFactorX = x;
        this.scrollFactorY = y;

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
     * @return {Phaser.GameObjects.Light} This Light object.
     */
    setColor: function (rgb)
    {
        var color = Utils.getFloatsFromUintRGB(rgb);

        this.r = color[0];
        this.g = color[1];
        this.b = color[2];

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
     * @return {Phaser.GameObjects.Light} This Light object.
     */
    setIntensity: function (intensity)
    {
        this.intensity = intensity;

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
     * @return {Phaser.GameObjects.Light} This Light object.
     */
    setPosition: function (x, y)
    {
        this.x = x;
        this.y = y;

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
     * @return {Phaser.GameObjects.Light} This Light object.
     */
    setRadius: function (radius)
    {
        this.radius = radius;

        return this;
    }

});

module.exports = Light;
