/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Light = require('./Light');
var LightPipeline = require('../../renderer/webgl/pipelines/ForwardDiffuseLightPipeline');
var Utils = require('../../renderer/webgl/Utils');

/**
 * @callback LightForEach
 *
 * @param {Phaser.GameObjects.Light} light - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class LightsManager
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 */
var LightsManager = new Class({

    initialize:

    function LightsManager ()
    {
        /**
         * [description]
         *
         * @name Phaser.GameObjects.LightsManager#lightPool
         * @type {Phaser.GameObjects.Light[]}
         * @default []
         * @since 3.0.0
         */
        this.lightPool = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.LightsManager#lights
         * @type {Phaser.GameObjects.Light[]}
         * @default []
         * @since 3.0.0
         */
        this.lights = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.LightsManager#culledLights
         * @type {Phaser.GameObjects.Light[]}
         * @default []
         * @since 3.0.0
         */
        this.culledLights = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.LightsManager#ambientColor
         * @type {{ r: float, g: float, b: float }}
         * @since 3.0.0
         */
        this.ambientColor = { r: 0.1, g: 0.1, b: 0.1 };

        /**
         * [description]
         *
         * @name Phaser.GameObjects.LightsManager#active
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.active = false;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.LightsManager#enable
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.LightsManager} This Lights Manager object.
     */
    enable: function ()
    {
        this.active = true;

        return this;
    },

    /**
     * [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.LightsManager#cull
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     *
     * @return {Phaser.GameObjects.Light[]} [description]
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

        for (var index = 0; index < length && culledLights.length < LightPipeline.LIGHT_COUNT; ++index)
        {
            var light = lights[index];

            cameraMatrix.transformPoint(light.x, light.y, point);

            // We'll just use bounding spheres to test
            // if lights should be rendered
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
     * [description]
     *
     * @method Phaser.GameObjects.LightsManager#forEachLight
     * @since 3.0.0
     *
     * @param {LightForEach} callback - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.LightsManager#setAmbientColor
     * @since 3.0.0
     *
     * @param {number} rgb - [description]
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
     * @return {integer} [description]
     */
    getMaxVisibleLights: function ()
    {
        return 10;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.LightsManager#getLightCount
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    getLightCount: function ()
    {
        return this.lights.length;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.LightsManager#addLight
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} radius - [description]
     * @param {number} rgb - [description]
     * @param {number} intensity - [description]
     *
     * @return {Phaser.GameObjects.Light} [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.LightsManager#removeLight
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Light} light - [description]
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
     * [description]
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
     * [description]
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
