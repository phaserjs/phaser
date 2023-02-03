/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var IntegerToColor = require('../../display/color/IntegerToColor');
var PIPELINES_CONST = require('../../renderer/webgl/pipelines/const');
var Render = require('./PointLightRender');

/**
 * @classdesc
 * The Point Light Game Object provides a way to add a point light effect into your game,
 * without the expensive shader processing requirements of the traditional Light Game Object.
 *
 * The difference is that the Point Light renders using a custom shader, designed to give the
 * impression of a point light source, of variable radius, intensity and color, in your game.
 * However, unlike the Light Game Object, it does not impact any other Game Objects, or use their
 * normal maps for calcuations. This makes them extremely fast to render compared to Lights
 * and perfect for special effects, such as flickering torches or muzzle flashes.
 *
 * For maximum performance you should batch Point Light Game Objects together. This means
 * ensuring they follow each other consecutively on the display list. Ideally, use a Layer
 * Game Object and then add just Point Lights to it, so that it can batch together the rendering
 * of the lights. You don't _have_ to do this, and if you've only a handful of Point Lights in
 * your game then it's perfectly safe to mix them into the dislay list as normal. However, if
 * you're using a large number of them, please consider how they are mixed into the display list.
 *
 * The renderer will automatically cull Point Lights. Those with a radius that does not intersect
 * with the Camera will be skipped in the rendering list. This happens automatically and the
 * culled state is refreshed every frame, for every camera.
 *
 * The origin of a Point Light is always 0.5 and it cannot be changed.
 *
 * Point Lights are a WebGL only feature and do not have a Canvas counterpart.
 *
 * @class PointLight
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.PostPipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Point Light belongs. A Point Light can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Point Light in the world.
 * @param {number} y - The vertical position of this Point Light in the world.
 * @param {number} [color=0xffffff] - The color of the Point Light, given as a hex value.
 * @param {number} [radius=128] - The radius of the Point Light.
 * @param {number} [intensity=1] - The intensity, or color blend, of the Point Light.
 * @param {number} [attenuation=0.1] - The attenuation  of the Point Light. This is the reduction of light from the center point.
 */
var PointLight = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.PostPipeline,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function PointLight (scene, x, y, color, radius, intensity, attenuation)
    {
        if (color === undefined) { color = 0xffffff; }
        if (radius === undefined) { radius = 128; }
        if (intensity === undefined) { intensity = 1; }
        if (attenuation === undefined) { attenuation = 0.1; }

        GameObject.call(this, scene, 'PointLight');

        this.initPipeline(PIPELINES_CONST.POINTLIGHT_PIPELINE);
        this.initPostPipeline();

        this.setPosition(x, y);

        /**
         * The color of this Point Light. This property is an instance of a
         * Color object, so you can use the methods within it, such as `setTo(r, g, b)`
         * to change the color value.
         *
         * @name Phaser.GameObjects.PointLight#color
         * @type {Phaser.Display.Color}
         * @since 3.50.0
         */
        this.color = IntegerToColor(color);

        /**
         * The intensity of the Point Light.
         *
         * The colors of the light are multiplied by this value during rendering.
         *
         * @name Phaser.GameObjects.PointLight#intensity
         * @type {number}
         * @since 3.50.0
         */
        this.intensity = intensity;

        /**
         * The attenuation of the Point Light.
         *
         * This value controls the force with which the light falls-off from the center of the light.
         *
         * Use small float-based values, i.e. 0.1.
         *
         * @name Phaser.GameObjects.PointLight#attenuation
         * @type {number}
         * @since 3.50.0
         */
        this.attenuation = attenuation;

        //  read only:
        this.width = radius * 2;
        this.height = radius * 2;

        this._radius = radius;
    },

    /**
     * The radius of the Point Light.
     *
     * @name Phaser.GameObjects.PointLight#radius
     * @type {number}
     * @since 3.50.0
     */
    radius: {

        get: function ()
        {
            return this._radius;
        },

        set: function (value)
        {
            this._radius = value;
            this.width = value * 2;
            this.height = value * 2;
        }

    },

    originX: {

        get: function ()
        {
            return 0.5;
        }

    },

    originY: {

        get: function ()
        {
            return 0.5;
        }

    },

    displayOriginX: {

        get: function ()
        {
            return this._radius;
        }

    },

    displayOriginY: {

        get: function ()
        {
            return this._radius;
        }

    }

});

module.exports = PointLight;
