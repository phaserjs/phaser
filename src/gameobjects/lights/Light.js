/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Circle = require('../../geom/circle/Circle');
var Class = require('../../utils/Class');
var Components = require('../components');
var RGB = require('../../display/RGB');
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
 * As of Phaser 3.60 this Game Object now has the Transform and Origin components. However, changing the scale,
 * rotation or origin properties will not make any difference to the Light. They are simply present to allow you
 * to add this Light to a Container, or enable it for Physics.
 *
 * @class Light
 * @extends Phaser.Geom.Circle
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
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

    Extends: Circle,

    Mixins: [
        Components.Origin,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible
    ],

    initialize:

    function Light (x, y, radius, r, g, b, intensity)
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
