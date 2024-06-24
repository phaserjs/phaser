/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../../math/Vector2');
var Class = require('../../../utils/Class');
var LightShaderSourceFS = require('../shaders/FlatLight-frag');
var ShaderSourceVS = require('../shaders/Flat-vert');
var BatchHandlerTriFlat = require('./BatchHandlerTriFlat');

/**
 * @classdesc
 * This RenderNode draws vertex tinted triangles with a Light Shader
 * in batches.
 *
 * The fragment shader used by this RenderNode will be compiled
 * with a maximum light count defined by the renderer configuration.
 * The string `%LIGHT_COUNT%` in the fragment shader source will be
 * replaced with this value.
 *
 * @class BatchHandlerTriFlatLight
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig} config - The configuration object for this RenderNode.
 */
var BatchHandlerTriFlatLight = new Class({
    Extends: BatchHandlerTriFlat,

    initialize: function BatchHandlerTriFlatLight (manager, config)
    {
        BatchHandlerTriFlat.call(this, manager, config);

        /**
        * Inverse rotation matrix for normal map rotations.
        *
        * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlatLight#inverseRotationMatrix
        * @type {Float32Array}
        * @private
        * @since 3.90.0
        */
        this.inverseRotationMatrix = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);

        /**
         * A persistent calculation vector used when processing the lights.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlatLight#_lightVector
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.90.0
         */
        this._lightVector = new Vector2();

        /**
         * The rotation of the normal map texture.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlatLight#_normalMapRotation
         * @type {number}
         * @private
         * @since 3.90.0
         */
        this._normalMapRotation = 0;
    },

    /**
     * The default configuration settings for BatchHandlerTriFlatLight.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlatLight#defaultConfig
     * @type {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig}
     * @since 3.90.0
     * @readonly
     */
    defaultConfig: {
        name: 'BatchHandlerTriFlatLight',
        verticesPerInstance: 3,
        indicesPerInstance: 3,
        vertexSource: ShaderSourceVS,
        fragmentSource: LightShaderSourceFS,
        vertexBufferLayout: {
            usage: 'DYNAMIC_DRAW',
            layout: [
                {
                    name: 'inPosition',
                    size: 2
                },
                {
                    name: 'inTint',
                    size: 4,
                    type: 'UNSIGNED_BYTE',
                    normalized: true
                }
            ]
        }
    },

    _copyAndCompleteConfig: function (manager, config, defaultConfig)
    {
        var newConfig = BatchHandlerTriFlat.prototype._copyAndCompleteConfig.call(this, manager, config, defaultConfig);

        newConfig.fragmentSource = newConfig.fragmentSource.replace(
            '%LIGHT_COUNT%',
            manager.renderer.config.maxLights
        );

        return newConfig;
    },

    /**
     * Set new dimensions for the renderer. This is called automatically when the renderer is resized.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlatLight#resize
     * @since 3.90.0
     * @param {number} width - The new width of the renderer.
     * @param {number} height - The new height of the renderer.
     */
    resize: function (width, height)
    {
        BatchHandlerTriFlat.prototype.resize.call(this, width, height);

        this.program.setUniform('uResolution', [ width, height ]);
    },

    /**
     * Called at the start of the `run` method.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlatLight#onRunBegin
     * @since 3.90.0
     * @param {Phaser.Types.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     */
    onRunBegin: function (drawingContext)
    {
        var camera = drawingContext.camera;
        var cameraMatrix = camera.matrix;
        var program = this.program;
        var scene = camera.scene;
        var lightManager = scene.sys.lights;
        var lights = lightManager.getLights(camera);
        var lightsCount = lights.length;
        var ambientColor = lightManager.ambientColor;
        var vec = this._lightVector;
        var height = this.manager.renderer.height;

        program.setUniform(
            'uCamera',
            [
                camera.x,
                camera.y,
                camera.rotation,
                camera.zoom
            ]
        );
        program.setUniform(
            'uAmbientLightColor',
            [
                ambientColor.r,
                ambientColor.g,
                ambientColor.b
            ]
        );
        program.setUniform(
            'uLightCount',
            lightsCount
        );

        for (var i = 0; i < lightsCount; i++)
        {
            var light = lights[i].light;
            var color = light.color;

            var lightName = 'uLights[' + i + '].';

            cameraMatrix.transformPoint(light.x, light.y, vec);

            program.setUniform(
                lightName + 'position',
                [
                    vec.x - (camera.scrollX * light.scrollFactorX * camera.zoom),
                    height - (vec.y - (camera.scrollY * light.scrollFactorY * camera.zoom))
                ]
            );
            program.setUniform(
                lightName + 'color',
                [
                    color.r,
                    color.g,
                    color.b
                ]
            );
            program.setUniform(
                lightName + 'intensity',
                light.intensity
            );
            program.setUniform(
                lightName + 'radius',
                light.radius
            );
        }
    }
});

module.exports = BatchHandlerTriFlatLight;
