/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Circle = require('../../geom/circle/Circle');
var Class = require('../../utils/Class');
var Components = require('../components');
var RGB = require('../../display/RGB');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @classdesc
 * A 2D Light.
 *
 * These are created by the {@link Phaser.GameObjects.LightsManager}, available from within a scene via `this.lights`.
 *
 * Any Game Objects with the Lighting Component, and `setLighting(true)`,
 * will then be affected by these Lights.
 * If they have a normal map, it will be used.
 * If they don't, the Lights will use the default normal map, a flat surface.
 *
 * They can also simply be used to represent a point light for your own purposes.
 *
 * Lights cannot be added to Containers. They are designed to exist in the root of a Scene.
 *
 * @class Light
 * @extends Phaser.Geom.Circle
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {number} x - The horizontal position of the light.
 * @param {number} y - The vertical position of the light.
 * @param {number} radius - The radius of the light.
 * @param {number} r - The red color of the light. A value between 0 and 1.
 * @param {number} g - The green color of the light. A value between 0 and 1.
 * @param {number} b - The blue color of the light. A value between 0 and 1.
 * @param {number} intensity - The intensity of the light.
 * @param {number} [z] - The z position of the light. If not given, it will be set to `radius * 0.1`.
 */
var Light = new Class({

    Extends: Circle,

    Mixins: [
        Components.Origin,
        Components.ScrollFactor,
        Components.Visible
    ],

    initialize:

    function Light (x, y, radius, r, g, b, intensity, z)
    {
        Circle.call(this, x, y, radius);

        /**
         * The color of the light.
         *
         * @name Phaser.GameObjects.Light#color
         * @type {Phaser.Display.RGB}
         * @since 3.50.0
         */
        this.color = new RGB(r, g, b);

        /**
         * The intensity of the light.
         *
         * @name Phaser.GameObjects.Light#intensity
         * @type {number}
         * @since 3.50.0
         */
        this.intensity = intensity;

        /**
         * The z position of the light.
         * This affects the relief effect created by the light.
         * A higher value will make the light appear more raised.
         *
         * Lit game objects are considered to be at z=0.
         * Thus, if z is larger than the radius of the light,
         * the light will not affect them.
         * Strong values are in the range of 0 to radius/2.
         *
         * This is not a true position, and won't be affected by
         * perspective or camera position. It won't be set by `setTo`.
         * Use `setZ` to set it, or `setZNormal` to set it to a fraction
         * of the radius.
         *
         * @name Phaser.GameObjects.Light#z
         * @type {number}
         * @since 4.0.0
         */
        this.z = z === undefined ? radius * 0.1 : z;

        /**
         * The flags that are compared against `RENDER_MASK` to determine if this Game Object will render or not.
         * The bits are 0001 | 0010 | 0100 | 1000 set by the components Visible, Alpha, Transform and Texture respectively.
         * If those components are not used by your custom class then you can use this bitmask as you wish.
         *
         * @name Phaser.GameObjects.Light#renderFlags
         * @type {number}
         * @default 15
         * @since 3.0.0
         */
        this.renderFlags = 15;

        /**
         * A bitmask that controls if this Game Object is drawn by a Camera or not.
         * Not usually set directly, instead call `Camera.ignore`, however you can
         * set this property directly using the Camera.id property:
         *
         * @example
         * this.cameraFilter |= camera.id
         *
         * @name Phaser.GameObjects.Light#cameraFilter
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.cameraFilter = 0;

        this.setScrollFactor(1, 1);
        this.setOrigin();
        this.setDisplayOrigin(radius);
    },

    /**
     * The width of this Light Game Object. This is the same as `Light.diameter`.
     *
     * @name Phaser.GameObjects.Light#displayWidth
     * @type {number}
     * @since 3.60.0
     */
    displayWidth: {

        get: function ()
        {
            return this.diameter;
        },

        set: function (value)
        {
            this.diameter = value;
        }

    },

    /**
     * The height of this Light Game Object. This is the same as `Light.diameter`.
     *
     * @name Phaser.GameObjects.Light#displayHeight
     * @type {number}
     * @since 3.60.0
     */
    displayHeight: {

        get: function ()
        {
            return this.diameter;
        },

        set: function (value)
        {
            this.diameter = value;
        }

    },

    /**
     * The width of this Light Game Object. This is the same as `Light.diameter`.
     *
     * @name Phaser.GameObjects.Light#width
     * @type {number}
     * @since 3.60.0
     */
    width: {

        get: function ()
        {
            return this.diameter;
        },

        set: function (value)
        {
            this.diameter = value;
        }

    },

    /**
     * The height of this Light Game Object. This is the same as `Light.diameter`.
     *
     * @name Phaser.GameObjects.Light#height
     * @type {number}
     * @since 3.60.0
     */
    height: {

        get: function ()
        {
            return this.diameter;
        },

        set: function (value)
        {
            this.diameter = value;
        }

    },

    /**
     * The z position of the light, as a fraction of the radius.
     * This affects the relief effect created by the light.
     * A higher value will make the light appear more raised.
     * Strong values are in the range of 0 to 0.5.
     *
     * @name Phaser.GameObjects.Light#zNormal
     * @type {number}
     * @since 4.0.0
     */
    zNormal: {
        get: function ()
        {
            return this.z / this.radius;
        },

        set: function (value)
        {
            this.z = value * this.radius;
        }
    },

    /**
     * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
     * Also checks the Game Object against the given Cameras exclusion list.
     *
     * @method Phaser.GameObjects.Light#willRender
     * @since 3.50.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to check against this Game Object.
     *
     * @return {boolean} True if the Game Object should be rendered, otherwise false.
     */
    willRender: function (camera)
    {
        return !(Light.RENDER_MASK !== this.renderFlags || (this.cameraFilter !== 0 && (this.cameraFilter & camera.id)));
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

        this.color.set(color[0], color[1], color[2]);

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
        this.intensity = intensity;

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
        this.radius = radius;

        return this;
    },

    /**
     * Set the z position of the light.
     *
     * @method Phaser.GameObjects.Light#setZ
     * @since 4.0.0
     *
     * @param {number} z - The z position of the light.
     *
     * @return {this} This Light object.
     */
    setZ: function (z)
    {
        this.z = z;

        return this;
    },

    /**
     * Set the z position of the light as a fraction of the radius.
     * This affects the relief effect created by the light.
     * A higher value will make the light appear more raised.
     * Strong values are in the range of 0 to 0.5.
     *
     * @method Phaser.GameObjects.Light#setZNormal
     * @since 4.0.0
     *
     * @param {number} z - The normalized z position of the light.
     *
     * @return {this} This Light object.
     */
    setZNormal: function (z)
    {
        this.z = z * this.radius;

        return this;
    }

});

/**
 * The bitmask that `GameObject.renderFlags` is compared against to determine if the Game Object will render or not.
 *
 * @constant {number} RENDER_MASK
 * @memberof Phaser.GameObjects.Light
 * @default
 */
Light.RENDER_MASK = 15;

module.exports = Light;
