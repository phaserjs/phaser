/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
 * Manages Lights for a Scene.
 *
 * Affects the rendering of Game Objects using the `Light2D` pipeline.
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
         * The number of lights that the LightPipeline processed in the _previous_ frame.
         *
         * @name Phaser.GameObjects.LightsManager#visibleLights
         * @type {number}
         * @readonly
         * @since 3.50.0
         */
        this.visibleLights = 0;
    },

    addPointLight: function (x, y, color, radius, intensity)
    {
        return this.systems.displayList.add(new PointLight(this.scene, x, y, color, radius, intensity));
    },

    /**
     * Enable the Lights Manager.
     *
     * @method Phaser.GameObjects.LightsManager#enable
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.LightsManager} This Lights Manager object.
     */
    enable: function ()
    {
        if (this.maxLights === -1)
        {
            this.maxLights = this.scene.sys.renderer.config.maxLights;
        }

        this.active = true;

        return this;
    },

    /**
     * Disable the Lights Manager.
     *
     * @method Phaser.GameObjects.LightsManager#disable
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.LightsManager} This Lights Manager object.
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
     * If more lights are returned than supported by the pipeline, the lights are then culled
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
     * @return {Phaser.GameObjects.LightsManager} This Lights Manager object.
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
     * Add a Light.
     *
     * @method Phaser.GameObjects.LightsManager#addLight
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal position of the Light.
     * @param {number} [y=0] - The vertical position of the Light.
     * @param {number} [radius=100] - The radius of the Light.
     * @param {number} [rgb=0xffffff] - The integer RGB color of the light.
     * @param {number} [intensity=1] - The intensity of the Light.
     *
     * @return {Phaser.GameObjects.Light} The Light that was added.
     */
    addLight: function (x, y, radius, rgb, intensity)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (radius === undefined) { radius = 128; }
        if (rgb === undefined) { rgb = 0xffffff; }
        if (intensity === undefined) { intensity = 1; }

        var color = Utils.getFloatsFromUintRGB(rgb);

        var light = new Light(x, y, radius, color[0], color[1], color[2], intensity);

        this.lights.push(light);

        return light;
    },

    /**
     * Remove a Light.
     *
     * @method Phaser.GameObjects.LightsManager#removeLight
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Light} light - The Light to remove.
     *
     * @return {Phaser.GameObjects.LightsManager} This Lights Manager object.
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
     * Shut down the Lights Manager.
     *
     * Recycles all active Lights into the Light pool, resets ambient light color and clears the lists of Lights and
     * culled Lights.
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
