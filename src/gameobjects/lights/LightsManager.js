/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Light = require('./Light');
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
         * The pool of Lights.
         *
         * Used to recycle removed Lights for a more efficient use of memory.
         *
         * @name Phaser.GameObjects.LightsManager#lightPool
         * @type {Phaser.GameObjects.Light[]}
         * @default []
         * @since 3.0.0
         */
        this.lightPool = [];

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
         * Lights that have been culled from a Camera's viewport.
         *
         * Lights in this list will not be rendered.
         *
         * @name Phaser.GameObjects.LightsManager#culledLights
         * @type {Phaser.GameObjects.Light[]}
         * @default []
         * @since 3.0.0
         */
        this.culledLights = [];

        /**
         * The ambient color.
         *
         * @name Phaser.GameObjects.LightsManager#ambientColor
         * @type {{ r: number, g: number, b: number }}
         * @since 3.0.0
         */
        this.ambientColor = { r: 0.1, g: 0.1, b: 0.1 };

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
         * @type {integer}
         * @readonly
         * @since 3.15.0
         */
        this.maxLights = -1;
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
            this.maxLights = this.scene.sys.game.renderer.config.maxLights;
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
     * Cull any Lights that aren't visible to the given Camera.
     *
     * Culling Lights improves performance by ensuring that only Lights within a Camera's viewport are rendered.
     *
     * @method Phaser.GameObjects.LightsManager#cull
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to cull Lights for.
     *
     * @return {Phaser.GameObjects.Light[]} The culled Lights.
     */
    cull: function (camera)
    {
        var lights = this.lights;
        var culledLights = this.culledLights;
        var length = lights.length;
        var cameraCenterX = camera.x + camera.width / 2.0;
        var cameraCenterY = camera.y + camera.height / 2.0;
        var cameraRadius = (camera.width + camera.height) / 2.0;
        var point = { x: 0, y: 0 };
        var cameraMatrix = camera.matrix;
        var viewportHeight = this.systems.game.config.height;

        culledLights.length = 0;

        for (var index = 0; index < length && culledLights.length < this.maxLights; index++)
        {
            var light = lights[index];

            cameraMatrix.transformPoint(light.x, light.y, point);

            //  We'll just use bounding spheres to test if lights should be rendered
            var dx = cameraCenterX - (point.x - (camera.scrollX * light.scrollFactorX * camera.zoom));
            var dy = cameraCenterY - (viewportHeight - (point.y - (camera.scrollY * light.scrollFactorY) * camera.zoom));
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < light.radius + cameraRadius)
            {
                culledLights.push(lights[index]);
            }
        }

        return culledLights;
    },

    /**
     * Iterate over each Light with a callback.
     *
     * @method Phaser.GameObjects.LightsManager#forEachLight
     * @since 3.0.0
     *
     * @param {LightForEach} callback - The callback that is called with each Light.
     *
     * @return {Phaser.GameObjects.LightsManager} This Lights Manager object.
     */
    forEachLight: function (callback)
    {
        if (!callback)
        {
            return;
        }

        var lights = this.lights;
        var length = lights.length;

        for (var index = 0; index < length; ++index)
        {
            callback(lights[index]);
        }

        return this;
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

        this.ambientColor.r = color[0];
        this.ambientColor.g = color[1];
        this.ambientColor.b = color[2];

        return this;
    },

    /**
     * Returns the maximum number of Lights allowed to appear at once.
     *
     * @method Phaser.GameObjects.LightsManager#getMaxVisibleLights
     * @since 3.0.0
     *
     * @return {integer} The maximum number of Lights allowed to appear at once.
     */
    getMaxVisibleLights: function ()
    {
        return 10;
    },

    /**
     * Get the number of Lights managed by this Lights Manager.
     *
     * @method Phaser.GameObjects.LightsManager#getLightCount
     * @since 3.0.0
     *
     * @return {integer} The number of Lights managed by this Lights Manager.
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
        var color = null;
        var light = null;

        x = (x === undefined) ? 0.0 : x;
        y = (y === undefined) ? 0.0 : y;
        rgb = (rgb === undefined) ? 0xffffff : rgb;
        radius = (radius === undefined) ? 100.0 : radius;
        intensity = (intensity === undefined) ? 1.0 : intensity;

        color = Utils.getFloatsFromUintRGB(rgb);
        light = null;

        if (this.lightPool.length > 0)
        {
            light = this.lightPool.pop();
            light.set(x, y, radius, color[0], color[1], color[2], intensity);
        }
        else
        {
            light = new Light(x, y, radius, color[0], color[1], color[2], intensity);
        }

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
            this.lightPool.push(light);
            this.lights.splice(index, 1);
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
        while (this.lights.length > 0)
        {
            this.lightPool.push(this.lights.pop());
        }

        this.ambientColor = { r: 0.1, g: 0.1, b: 0.1 };
        this.culledLights.length = 0;
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
