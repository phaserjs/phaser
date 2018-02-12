/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @classdesc
 * [description]
 *
 * @class Light
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of the light.
 * @param {number} y - The vertical position of the light.
 * @param {number} radius - The radius of the light.
 * @param {number} r - The red color. A value between 0 and 1.
 * @param {number} g - The green color. A value between 0 and 1.
 * @param {number} b - The blue color. A value between 0 and 1.
 * @param {number} intensity - The intensity of the light.
 */
var Light = new Class({

    initialize:

    function Light (x, y, radius, r, g, b, intensity)
    {
        /**
         * [description]
         *
         * @name Phaser.GameObjects.Light#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = x;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Light#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = y;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Light#radius
         * @type {number}
         * @since 3.0.0
         */
        this.radius = radius;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Light#r
         * @type {number}
         * @since 3.0.0
         */
        this.r = r;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Light#g
         * @type {number}
         * @since 3.0.0
         */
        this.g = g;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Light#b
         * @type {number}
         * @since 3.0.0
         */
        this.b = b;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Light#intensity
         * @type {number}
         * @since 3.0.0
         */
        this.intensity = intensity;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Light#scrollFactorX
         * @type {number}
         * @since 3.0.0
         */
        this.scrollFactorX = 1.0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Light#scrollFactorY
         * @type {number}
         * @since 3.0.0
         */
        this.scrollFactorY = 1.0;
    },

    /**
     * [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Light#setColor
     * @since 3.0.0
     *
     * @param {number} rgb - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Light#setIntensity
     * @since 3.0.0
     *
     * @param {number} intensity - [description]
     *
     * @return {Phaser.GameObjects.Light} This Light object.
     */
    setIntensity: function (intensity)
    {
        this.intensity = intensity;

        return this;
    },

    /**
     * [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Light#setRadius
     * @since 3.0.0
     *
     * @param {number} radius - [description]
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
