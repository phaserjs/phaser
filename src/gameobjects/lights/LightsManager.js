/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CircleToRectangle = require('../../geom/intersects/CircleToRectangle');
var Class = require('../../utils/Class');
var DistanceBetween = require('../../math/distance/DistanceBetween');
var Light = require('./Light');
var PointLight = require('../pointlight/PointLight');
var RGB = require('../../display/RGB');
var SpliceOne = require('../../utils/array/SpliceOne');
var StableSort = require('../../utils/array/StableSort');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @callback LightForEach
 *
 * @param {Phaser.GameObjects.Light} light - The Light.
 */

/**
 * @classdesc
 * The Lights Manager is responsible for managing all of the {@link Phaser.GameObjects.Light} objects
 * in a Scene, as well as the ambient light color that applies to all lit Game Objects.
 *
 * It is created automatically by the Scene Systems and is accessed via `this.lights` within a Scene.
 * To use the lighting system, call `this.lights.enable()` and ensure that any Game Objects you want
 * to be affected by lighting have `setLighting(true)` applied to them.
 *
 * The Lights Manager works in conjunction with the Light Filter (WebGL only). Game Objects rendered
 * with this filter sample the active lights and the ambient color, and use any normal maps assigned
 * to their textures to produce a dynamic lighting effect. Lighting has no effect in Canvas rendering.
 *
 * Each Scene supports a fixed maximum number of simultaneous lights, set via the `maxLights` property
 * in the game config. When more lights exist than the maximum, the manager culls the furthest lights
 * from the camera each frame. Use {@link Phaser.GameObjects.LightsManager#addLight} to create a
 * Light and {@link Phaser.GameObjects.LightsManager#setAmbientColor} to control the base illumination.
 *
 * @class LightsManager
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 */
var LightsManager = new Class({

    initialize:

    function LightsManager ()
    {
        /**
         * The Lights in the Scene.
         *
         * @name Phaser.GameObjects.LightsManager#lights
         * @type {Phaser.GameObjects.Light[]}
         * @default []
         * @since 3.0.0
         */
        this.lights = [];

        /**
         * The ambient color.
         *
         * @name Phaser.GameObjects.LightsManager#ambientColor
         * @type {Phaser.Display.RGB}
         * @since 3.50.0
         */
        this.ambientColor = new RGB(0.1, 0.1, 0.1);

        /**
         * Whether the Lights Manager is enabled.
         *
         * @name Phaser.GameObjects.LightsManager#active
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.active = false;

        /**
         * The maximum number of lights that a single Camera and the lights shader can process.
         * Change this via the `maxLights` property in your game config, as it cannot be changed at runtime.
         *
         * @name Phaser.GameObjects.LightsManager#maxLights
         * @type {number}
         * @readonly
         * @since 3.15.0
         */
        this.maxLights = -1;

        /**
         * The number of lights processed in the _previous_ frame.
         *
         * @name Phaser.GameObjects.LightsManager#visibleLights
         * @type {number}
         * @readonly
         * @since 3.50.0
         */
        this.visibleLights = 0;
    },

    /**
     * Creates a new Point Light Game Object and adds it to the Scene.
     *
     * Note: This method will only be available if the Point Light Game Object has been built into Phaser.
     *
     * The Point Light Game Object provides a way to add a point light effect into your game,
     * without the expensive shader processing requirements of the traditional Light Game Object.
     *
     * The difference is that the Point Light renders using a custom shader, designed to give the
     * impression of a point light source, of variable radius, intensity and color, in your game.
     * However, unlike the Light Game Object, it does not impact any other Game Objects, or use their
     * normal maps for calculations. This makes them extremely fast to render compared to Lights
     * and perfect for special effects, such as flickering torches or muzzle flashes.
     *
     * For maximum performance you should batch Point Light Game Objects together. This means
     * ensuring they follow each other consecutively on the display list. Ideally, use a Layer
     * Game Object and then add just Point Lights to it, so that it can batch together the rendering
     * of the lights. You don't _have_ to do this, and if you've only a handful of Point Lights in
     * your game then it's perfectly safe to mix them into the display list as normal. However, if
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
     * @method Phaser.GameObjects.LightsManager#addPointLight
     * @since 3.50.0
     *
     * @param {number} x - The horizontal position of this Point Light in the world.
     * @param {number} y - The vertical position of this Point Light in the world.
     * @param {number} [color=0xffffff] - The color of the Point Light, given as a hex value.
     * @param {number} [radius=128] - The radius of the Point Light.
     * @param {number} [intensity=1] - The intensity, or color blend, of the Point Light.
     * @param {number} [attenuation=0.1] - The attenuation of the Point Light. This is the reduction of light from the center point.
     *
     * @return {Phaser.GameObjects.PointLight} The Game Object that was created.
     */
    addPointLight: function (x, y, color, radius, intensity, attenuation)
    {
        return this.systems.displayList.add(new PointLight(this.scene, x, y, color, radius, intensity, attenuation));
    },

    /**
     * Enable the Lights Manager. This activates the lighting system for the Scene, causing all
     * Game Objects using the Light Filter to be affected by the configured lights and ambient
     * color. On first enable, the `maxLights` value is read from the renderer configuration.
     *
     * @method Phaser.GameObjects.LightsManager#enable
     * @since 3.0.0
     *
     * @return {this} This Lights Manager instance.
     */
    enable: function ()
    {
        if (this.maxLights === -1)
        {
            this.maxLights = this.systems.renderer.config.maxLights;
        }

        this.active = true;

        return this;
    },

    /**
     * Disable the Lights Manager. When disabled, the lighting system no longer affects the rendering
     * of Game Objects using the Light Filter, effectively switching them back to unlit rendering.
     * The existing lights and ambient color are preserved and will take effect again if the manager
     * is re-enabled.
     *
     * @method Phaser.GameObjects.LightsManager#disable
     * @since 3.0.0
     *
     * @return {this} This Lights Manager instance.
     */
    disable: function ()
    {
        this.active = false;

        return this;
    },

    /**
     * Get all lights that can be seen by the given Camera.
     *
     * It will automatically cull lights that are outside the world view of the Camera.
     *
     * If more lights are returned than supported by the renderer, the lights are then culled
     * based on the distance from the center of the camera. Only those closest are rendered.
     *
     * @method Phaser.GameObjects.LightsManager#getLights
     * @since 3.50.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to cull Lights for.
     *
     * @return {Phaser.GameObjects.Light[]} The culled Lights.
     */
    getLights: function (camera)
    {
        var lights = this.lights;
        var worldView = camera.worldView;

        var visibleLights = [];

        for (var i = 0; i < lights.length; i++)
        {
            var light = lights[i];

            if (light.willRender(camera) && CircleToRectangle(light, worldView))
            {
                visibleLights.push({
                    light: light,
                    distance: DistanceBetween(light.x, light.y, worldView.centerX, worldView.centerY)
                });
            }
        }

        if (visibleLights.length > this.maxLights)
        {
            //  We've got too many lights, so sort by distance from camera and cull those far away
            //  This isn't ideal because it doesn't factor in the radius of the lights, but it'll do for now
            //  and is significantly better than we had before!

            StableSort(visibleLights, this.sortByDistance);

            visibleLights = visibleLights.slice(0, this.maxLights);
        }

        this.visibleLights = visibleLights.length;

        return visibleLights;
    },

    /**
     * Sort function to sort lights by distance from the camera.
     * The sort is in reverse order, so that the furthest light is culled first.
     *
     * @method Phaser.GameObjects.LightsManager#sortByDistance
     * @since 4.0.0
     *
     * @param {number} a - A light entry object with a `distance` property representing its distance from the camera center.
     * @param {number} b - A light entry object with a `distance` property representing its distance from the camera center.
     * @return {boolean} True if `a` is further than `b`, otherwise false.
     */
    sortByDistance: function (a, b)
    {
        return (a.distance >= b.distance);
    },

    /**
     * Set the ambient light color.
     *
     * @method Phaser.GameObjects.LightsManager#setAmbientColor
     * @since 3.0.0
     *
     * @param {number} rgb - The integer RGB color of the ambient light.
     *
     * @return {this} This Lights Manager instance.
     */
    setAmbientColor: function (rgb)
    {
        var color = Utils.getFloatsFromUintRGB(rgb);

        this.ambientColor.set(color[0], color[1], color[2]);

        return this;
    },

    /**
     * Returns the maximum number of Lights allowed to appear at once.
     *
     * @method Phaser.GameObjects.LightsManager#getMaxVisibleLights
     * @since 3.0.0
     *
     * @return {number} The maximum number of Lights allowed to appear at once.
     */
    getMaxVisibleLights: function ()
    {
        return this.maxLights;
    },

    /**
     * Get the number of Lights managed by this Lights Manager.
     *
     * @method Phaser.GameObjects.LightsManager#getLightCount
     * @since 3.0.0
     *
     * @return {number} The number of Lights managed by this Lights Manager.
     */
    getLightCount: function ()
    {
        return this.lights.length;
    },

    /**
     * Creates a new {@link Phaser.GameObjects.Light} object, adds it to this Lights Manager, and returns it.
     * The Light will influence all Game Objects using the Light Filter that are within its radius,
     * using the texture's normal map data to compute shading. You can configure its position, radius,
     * color, intensity, and z-height (which affects the angle of the shading effect).
     *
     * @method Phaser.GameObjects.LightsManager#addLight
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal position of the Light.
     * @param {number} [y=0] - The vertical position of the Light.
     * @param {number} [radius=128] - The radius of the Light.
     * @param {number} [rgb=0xffffff] - The integer RGB color of the light.
     * @param {number} [intensity=1] - The intensity of the Light.
     * @param {number} [z] - The z position of the light. If omitted, it will be set to `radius * 0.1`.
     *
     * @return {Phaser.GameObjects.Light} The Light that was added.
     */
    addLight: function (x, y, radius, rgb, intensity, z)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (radius === undefined) { radius = 128; }
        if (rgb === undefined) { rgb = 0xffffff; }
        if (intensity === undefined) { intensity = 1; }
        if (z === undefined) { z = radius * 0.1; }

        var color = Utils.getFloatsFromUintRGB(rgb);

        var light = new Light(x, y, radius, color[0], color[1], color[2], intensity, z);

        this.lights.push(light);

        return light;
    },

    /**
     * Creates a new cone-limited {@link Phaser.GameObjects.Light} object, adds it to this Lights Manager,
     * and returns it.
     *
     * The cone angles are full cone widths in radians. Fragments inside `innerAngle` receive full light,
     * and fragments between `innerAngle` and `outerAngle` are softly attenuated.
     *
     * @method Phaser.GameObjects.LightsManager#addConeLight
     * @since 4.2.0
     *
     * @param {number} [x=0] - The horizontal position of the Light.
     * @param {number} [y=0] - The vertical position of the Light.
     * @param {number} [radius=128] - The radius of the Light.
     * @param {number} [rgb=0xffffff] - The integer RGB color of the light.
     * @param {number} [intensity=1] - The intensity of the Light.
     * @param {number} [rotation=0] - The direction of the cone, in radians.
     * @param {number} [innerAngle=Math.PI / 4] - The fully-lit cone width, in radians.
     * @param {number} [outerAngle=innerAngle] - The outer falloff cone width, in radians.
     * @param {number} [z] - The z position of the light. If omitted, it will be set to `radius * 0.1`.
     *
     * @return {Phaser.GameObjects.Light} The Light that was added.
     */
    addConeLight: function (x, y, radius, rgb, intensity, rotation, innerAngle, outerAngle, z)
    {
        if (rotation === undefined) { rotation = 0; }
        if (innerAngle === undefined) { innerAngle = Math.PI / 4; }

        return this.addLight(x, y, radius, rgb, intensity, z).setCone(rotation, innerAngle, outerAngle);
    },

    /**
     * Removes a {@link Phaser.GameObjects.Light} from this Lights Manager. The Light will no longer
     * influence the rendering of any Game Objects. The Light object itself is not destroyed; it is
     * simply removed from the manager's active list.
     *
     * @method Phaser.GameObjects.LightsManager#removeLight
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Light} light - The Light to remove.
     *
     * @return {this} This Lights Manager instance.
     */
    removeLight: function (light)
    {
        var index = this.lights.indexOf(light);

        if (index >= 0)
        {
            SpliceOne(this.lights, index);
        }

        return this;
    },

    /**
     * Shuts down the Lights Manager and clears all active Lights. This is called automatically
     * when a Scene shuts down. The Lights Manager can be re-enabled afterwards by calling
     * {@link Phaser.GameObjects.LightsManager#enable}.
     *
     * @method Phaser.GameObjects.LightsManager#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.lights.length = 0;
    },

    /**
     * Destroy the Lights Manager.
     *
     * Cleans up all references by calling {@link Phaser.GameObjects.LightsManager#shutdown}.
     *
     * @method Phaser.GameObjects.LightsManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();
    }

});

module.exports = LightsManager;
